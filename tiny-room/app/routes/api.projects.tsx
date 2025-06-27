import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import type { Project } from '../types';
import {
  ApiError,
  createSuccessResponse,
  createErrorResponse,
  parsePaginationParams,
  parseFilters,
  validateRequired,
  validateTypes,
  checkRateLimit,
  logApiRequest,
} from '../utils/api';
import {
  getProjects,
  saveProjects,
  generateId,
  findById,
  searchItems,
  sortItems,
  paginateItems,
} from '../utils/filesystem';
import { createPaginatedResponse } from '../utils/api';

// GET /api/projects - List projects or get single project
export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const clientId = request.headers.get('x-forwarded-for') || 'anonymous';

    // Rate limiting
    if (!checkRateLimit(`projects-${clientId}`, 100, 60000)) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    // Check if this is a request for a single project using splat params
    const splatPath = params['*'] || '';
    const projectId = parseInt(splatPath, 10);

    if (splatPath && !isNaN(projectId)) {
      // Get single project
      const projects = await getProjects();
      const project = findById(projects, projectId);

      if (!project) {
        throw new ApiError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      const response = createSuccessResponse(project);
      logApiRequest(request, response);
      return response;
    }

    // Parse query parameters
    const { page, limit } = parsePaginationParams(url);
    const filters = parseFilters(url);

    // Get all projects
    let projects = await getProjects();
    const totalBeforeFiltering = projects.length;

    // Apply filters
    if (filters.category) {
      projects = projects.filter(p => p.category === filters.category);
    }

    if (filters.status) {
      projects = projects.filter(p => p.status === filters.status);
    }

    if (filters.featured !== undefined) {
      projects = projects.filter(p => p.featured === filters.featured);
    }

    if (filters.search) {
      projects = searchItems(projects, filters.search, [
        'title',
        'description',
        'techStack',
        'tags',
      ]);
    }

    // Apply sorting
    if (filters.sort) {
      const sortField = filters.sort as keyof Project;
      projects = sortItems(projects, sortField, filters.order);
    } else {
      // Default sort by id descending (newest first)
      projects = sortItems(projects, 'id', 'desc');
    }

    // Apply pagination
    const total = projects.length;
    const paginatedProjects = paginateItems(projects, page, limit);

    const response = createPaginatedResponse(paginatedProjects, page, limit, total);

    // Add metadata
    const metadata = {
      totalProjects: totalBeforeFiltering,
      filteredProjects: total,
      filters: filters,
    };

    const finalResponse = createSuccessResponse({ ...response, metadata });
    logApiRequest(request, finalResponse);

    return finalResponse;
  } catch (error) {
    const errorResponse = createErrorResponse(error as Error);
    logApiRequest(request, errorResponse, error as Error);
    return errorResponse;
  }
}

// POST /api/projects - Create new project
// PUT /api/projects/:id - Update existing project
// DELETE /api/projects/:id - Delete project
export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const url = new URL(request.url);
    const clientId = request.headers.get('x-forwarded-for') || 'anonymous';
    const method = request.method;

    // Rate limiting
    const rateLimit = method === 'DELETE' ? 20 : 50;
    if (!checkRateLimit(`projects-${method}-${clientId}`, rateLimit, 60000)) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const projects = await getProjects();

    if (method === 'POST') {
      // Create new project
      const contentType = request.headers.get('content-type') || '';
      let projectData: any;

      if (contentType.includes('application/json')) {
        // Handle JSON requests
        projectData = await request.json();
      } else {
        // Handle FormData requests
        const formData = await request.formData();
        projectData = Object.fromEntries(formData);
      }

      // Parse JSON fields and handle both formats
      let techStack: string[] = [];
      let tags: string[] = [];
      let featured = false;

      if (projectData.techStack) {
        if (Array.isArray(projectData.techStack)) {
          techStack = projectData.techStack;
        } else if (typeof projectData.techStack === 'string') {
          techStack = JSON.parse(projectData.techStack);
        }
      }

      if (projectData.tags) {
        if (Array.isArray(projectData.tags)) {
          tags = projectData.tags;
        } else if (typeof projectData.tags === 'string') {
          tags = JSON.parse(projectData.tags);
        }
      }

      // Convert boolean fields
      if (typeof projectData.featured === 'string') {
        featured = projectData.featured === 'true';
      } else if (typeof projectData.featured === 'boolean') {
        featured = projectData.featured;
      }

      // Validation
      validateRequired(projectData, [
        'title',
        'description',
        'imageUrl',
        'category',
        'status',
        'role',
      ]);

      validateTypes(projectData, {
        title: 'string',
        description: 'string',
        imageUrl: 'string',
        category: 'string',
        status: 'string',
        role: 'string',
        featured: 'boolean',
      });

      // Create new project
      const newProject: Project = {
        id: generateId(projects),
        title: projectData.title as string,
        description: projectData.description as string,
        imageUrl: projectData.imageUrl as string,
        demoUrl: (projectData.demoUrl as string) || undefined,
        githubUrl: (projectData.githubUrl as string) || undefined,
        techStack: techStack,
        category: projectData.category as string,
        featured: featured,
        status: projectData.status as Project['status'],
        startDate: (projectData.startDate as string) || new Date().toISOString().split('T')[0],
        endDate: (projectData.endDate as string) || undefined,
        role: projectData.role as string,
        tags: tags,
        client: (projectData.client as string) || undefined,
        duration: (projectData.duration as string) || undefined,
        details: (projectData.details as string) || undefined,
      };

      projects.push(newProject);
      await saveProjects(projects);

      const response = createSuccessResponse(newProject, 'Project created successfully', 201);
      logApiRequest(request, response);
      return response;
    } else if (method === 'PUT') {
      // Update existing project
      const splatPath = params['*'] || '';
      const id = parseInt(splatPath, 10);

      if (!splatPath || isNaN(id)) {
        throw new ApiError('Valid project ID is required', 400, 'INVALID_ID');
      }

      const existingProject = findById(projects, id);
      if (!existingProject) {
        throw new ApiError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      const contentType = request.headers.get('content-type') || '';
      let updateData: any;

      if (contentType.includes('application/json')) {
        // Handle JSON requests
        updateData = await request.json();
      } else {
        // Handle FormData requests
        const formData = await request.formData();
        updateData = Object.fromEntries(formData);
      }

      // Parse JSON fields and handle both formats
      if (updateData.techStack && typeof updateData.techStack === 'string') {
        updateData.techStack = JSON.parse(updateData.techStack);
      }
      if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = JSON.parse(updateData.tags);
      }

      // Convert boolean fields
      let updateFeatured: boolean | undefined;
      if (updateData.featured !== undefined) {
        if (typeof updateData.featured === 'string') {
          updateFeatured = updateData.featured === 'true';
        } else if (typeof updateData.featured === 'boolean') {
          updateFeatured = updateData.featured;
        }
      }

      // Update project
      const projectIndex = projects.findIndex(p => p.id === id);
      const updatedProject = {
        ...existingProject,
        ...updateData,
        id,
        ...(updateFeatured !== undefined && { featured: updateFeatured }),
      };
      projects[projectIndex] = updatedProject;

      await saveProjects(projects);

      const response = createSuccessResponse(
        projects[projectIndex],
        'Project updated successfully'
      );
      logApiRequest(request, response);
      return response;
    } else if (method === 'DELETE') {
      // Delete project
      const splatPath = params['*'] || '';
      const id = parseInt(splatPath, 10);

      if (!splatPath || isNaN(id)) {
        throw new ApiError('Valid project ID is required', 400, 'INVALID_ID');
      }

      const projectIndex = projects.findIndex(p => p.id === id);
      if (projectIndex === -1) {
        throw new ApiError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      const deletedProject = projects.splice(projectIndex, 1)[0];
      await saveProjects(projects);

      const response = createSuccessResponse(deletedProject, 'Project deleted successfully');
      logApiRequest(request, response);
      return response;
    }

    throw new ApiError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  } catch (error) {
    const errorResponse = createErrorResponse(error as Error);
    logApiRequest(request, errorResponse, error as Error);
    return errorResponse;
  }
}
