import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import type { BlogPost } from '../types';
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
  createPaginatedResponse,
} from '../utils/api';
import {
  getBlogPosts,
  saveBlogPosts,
  generateId,
  findById,
  searchItems,
  sortItems,
  paginateItems,
} from '../utils/filesystem';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// GET /api/blog - List blog posts or get single post
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const clientId = request.headers.get('x-forwarded-for') || 'anonymous';

    // Rate limiting
    if (!checkRateLimit(`blog-${clientId}`, 100, 60000)) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    // Check if this is a request for a single post (URL ends with a number)
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const postId = parseInt(lastSegment, 10);

    if (!isNaN(postId)) {
      // Get single post
      const posts = await getBlogPosts();
      const post = findById(posts, postId);

      if (!post) {
        throw new ApiError('Blog post not found', 404, 'POST_NOT_FOUND');
      }

      const response = createSuccessResponse(post);
      logApiRequest(request, response);
      return response;
    }

    // Parse query parameters
    const { page, limit } = parsePaginationParams(url);
    const filters = parseFilters(url);

    // Additional blog-specific filters
    const status = url.searchParams.get('status') as BlogPost['status'] | null;
    const author = url.searchParams.get('author');
    const tag = url.searchParams.get('tag');
    const year = url.searchParams.get('year');
    const featured = url.searchParams.get('featured') === 'true';

    // Get all blog posts
    let posts = await getBlogPosts();
    const totalBeforeFiltering = posts.length;

    // Apply filters
    if (filters.category) {
      posts = posts.filter(post => post.category === filters.category);
    }

    if (status) {
      posts = posts.filter(post => post.status === status);
    }

    if (author) {
      posts = posts.filter(post => post.author.toLowerCase().includes(author.toLowerCase()));
    }

    if (tag) {
      posts = posts.filter(post =>
        post.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    if (year) {
      posts = posts.filter(post => post.publishDate?.startsWith(year));
    }

    if (featured) {
      posts = posts.filter(post => post.featured);
    }

    if (filters.search) {
      posts = searchItems(posts, filters.search, ['title', 'excerpt', 'content', 'tags', 'author']);
    }

    // Apply sorting
    if (filters.sort) {
      const sortField = filters.sort as keyof BlogPost;
      posts = sortItems(posts, sortField, filters.order);
    } else {
      // Default sort by publishDate descending (newest first)
      posts = sortItems(posts, 'publishDate', 'desc');
    }

    // Apply pagination
    const total = posts.length;
    const paginatedPosts = paginateItems(posts, page, limit);

    const response = createPaginatedResponse(paginatedPosts, page, limit, total);

    // Add metadata
    const metadata = {
      totalPosts: totalBeforeFiltering,
      filteredPosts: total,
      filters: { ...filters, status, author, tag, year, featured },
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

// POST /api/blog - Create new blog post
// PUT /api/blog/:id - Update existing blog post
// DELETE /api/blog/:id - Delete blog post
export async function action({ request }: ActionFunctionArgs) {
  try {
    const url = new URL(request.url);
    const clientId = request.headers.get('x-forwarded-for') || 'anonymous';
    const method = request.method;

    // Rate limiting
    const rateLimit = method === 'DELETE' ? 20 : 50;
    if (!checkRateLimit(`blog-${method}-${clientId}`, rateLimit, 60000)) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const posts = await getBlogPosts();

    if (method === 'POST') {
      // Create new blog post
      const formData = await request.formData();
      const postData = Object.fromEntries(formData);

      // Parse JSON fields
      let tags: string[] = [];
      if (postData.tags && typeof postData.tags === 'string') {
        tags = JSON.parse(postData.tags);
      }

      // Convert boolean fields
      let featured = false;
      if (typeof postData.featured === 'string') {
        featured = postData.featured === 'true';
      }

      // Validation
      validateRequired(postData, ['title', 'content', 'author', 'category']);

      validateTypes(postData, {
        title: 'string',
        content: 'string',
        author: 'string',
        category: 'string',
      });

      const title = postData.title as string;
      const content = postData.content as string;

      // Generate slug and reading time
      const slug = generateSlug(title);
      const readingTime = calculateReadingTime(content);

      // Create new blog post
      const newPost: BlogPost = {
        id: generateId(posts),
        title: title,
        slug: slug,
        excerpt: (postData.excerpt as string) || content.substring(0, 200) + '...',
        content: content,
        author: postData.author as string,
        publishDate: (postData.publishDate as string) || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        category: postData.category as string,
        tags: tags,
        status: (postData.status as BlogPost['status']) || 'draft',
        readingTime: readingTime,
        featuredImage: (postData.featuredImage as string) || undefined,
        seo: {
          metaTitle: (postData.metaTitle as string) || title,
          metaDescription:
            (postData.metaDescription as string) ||
            (postData.excerpt as string) ||
            content.substring(0, 160) + '...',
          keywords: tags,
        },
      };

      posts.push(newPost);
      await saveBlogPosts(posts);

      const response = createSuccessResponse(newPost, 'Blog post created successfully', 201);
      logApiRequest(request, response);
      return response;
    } else if (method === 'PUT') {
      // Update existing blog post
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      const id = parseInt(lastSegment, 10);

      if (isNaN(id)) {
        throw new ApiError('Invalid post ID', 400, 'INVALID_ID');
      }

      const existingPost = findById(posts, id);
      if (!existingPost) {
        throw new ApiError('Blog post not found', 404, 'POST_NOT_FOUND');
      }

      const formData = await request.formData();
      const updateData = Object.fromEntries(formData);

      // Parse JSON fields if they exist
      if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = JSON.parse(updateData.tags);
      }

      // Convert boolean fields
      let updateFeatured: boolean | undefined;
      if (updateData.featured !== undefined && typeof updateData.featured === 'string') {
        updateFeatured = updateData.featured === 'true';
      }

      // Update slug if title changed
      if (updateData.title && updateData.title !== existingPost.title) {
        updateData.slug = generateSlug(updateData.title as string);
      }

      // Update reading time if content changed
      let newReadingTime: number | undefined;
      if (updateData.content && updateData.content !== existingPost.content) {
        newReadingTime = calculateReadingTime(updateData.content as string);
      }

      // Always update the lastModified
      const lastModified = new Date().toISOString();

      // Update post
      const postIndex = posts.findIndex(post => post.id === id);
      const updatedPost = {
        ...existingPost,
        ...updateData,
        id,
        lastModified,
        ...(newReadingTime !== undefined && { readingTime: newReadingTime }),
      };
      posts[postIndex] = updatedPost;

      await saveBlogPosts(posts);

      const response = createSuccessResponse(updatedPost, 'Blog post updated successfully');
      logApiRequest(request, response);
      return response;
    } else if (method === 'DELETE') {
      // Delete blog post
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      const id = parseInt(lastSegment, 10);

      if (isNaN(id)) {
        throw new ApiError('Invalid post ID', 400, 'INVALID_ID');
      }

      const postIndex = posts.findIndex(post => post.id === id);
      if (postIndex === -1) {
        throw new ApiError('Blog post not found', 404, 'POST_NOT_FOUND');
      }

      const deletedPost = posts[postIndex];
      posts.splice(postIndex, 1);
      await saveBlogPosts(posts);

      const response = createSuccessResponse(deletedPost, 'Blog post deleted successfully');
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
