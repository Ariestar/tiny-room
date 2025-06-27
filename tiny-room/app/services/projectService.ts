import type { Project } from '../types';
import { BaseDataService, DataServiceError } from './BaseDataService';
import projectsData from '../assets/data/projects';

export class ProjectService extends BaseDataService<Project> {
  private static instance: ProjectService;

  constructor() {
    super('projects_cache', {
      ttl: 10 * 60 * 1000, // 10分钟缓存，项目数据变化较少
      invalidateOn: ['create', 'update', 'delete'],
    });
  }

  // 单例模式
  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  // 实现抽象方法
  protected async fetchData(): Promise<Project[]> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      // 在真实应用中，这里会调用API
      // const response = await fetch('/api/projects');
      // return response.json();

      return [...projectsData]; // 返回副本以避免直接修改原数据
    } catch (error) {
      throw new DataServiceError('Failed to fetch projects', 'FETCH_ERROR', 500);
    }
  }

  protected async saveData(data: Project[]): Promise<void> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      // 在真实应用中，这里会调用API保存数据
      // await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      console.log('Projects saved:', data.length, 'items');
    } catch (error) {
      throw new DataServiceError('Failed to save projects', 'SAVE_ERROR', 500);
    }
  }

  protected generateId(): number {
    // 在真实应用中，ID应该由后端生成
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // 项目特有的方法
  async getFeaturedProjects(): Promise<Project[]> {
    const allProjects = await this.getAll();
    return allProjects.filter(project => project.featured);
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return this.getAll({
      filters: { category },
      sortBy: 'startDate',
      sortOrder: 'desc',
    });
  }

  async getProjectsByStatus(status: Project['status']): Promise<Project[]> {
    return this.getAll({
      filters: { status },
      sortBy: 'lastModified',
      sortOrder: 'desc',
    });
  }

  async searchProjectsByTechStack(techStack: string): Promise<Project[]> {
    const allProjects = await this.getAll();
    return allProjects.filter(project =>
      project.techStack.some(tech => tech.toLowerCase().includes(techStack.toLowerCase()))
    );
  }

  async getProjectsByTags(tags: string[]): Promise<Project[]> {
    const allProjects = await this.getAll();
    return allProjects.filter(project =>
      tags.some(tag =>
        project.tags.some(projectTag => projectTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }

  async getProjectStatistics(): Promise<{
    total: number;
    byStatus: Record<Project['status'], number>;
    byCategory: Record<string, number>;
    featuredCount: number;
  }> {
    const allProjects = await this.getAll();

    const byStatus = allProjects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      {} as Record<Project['status'], number>
    );

    const byCategory = allProjects.reduce(
      (acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: allProjects.length,
      byStatus,
      byCategory,
      featuredCount: allProjects.filter(p => p.featured).length,
    };
  }

  // 批量操作
  async bulkUpdateStatus(projectIds: number[], status: Project['status']): Promise<Project[]> {
    const updatedProjects: Project[] = [];

    for (const id of projectIds) {
      try {
        const updated = await this.update(id, { status });
        updatedProjects.push(updated);
      } catch (error) {
        console.warn(`Failed to update project ${id}:`, error);
      }
    }

    return updatedProjects;
  }

  async toggleFeatured(projectId: number): Promise<Project> {
    const project = await this.getById(projectId);
    if (!project) {
      throw new DataServiceError(`Project with id ${projectId} not found`, 'NOT_FOUND', 404);
    }

    return this.update(projectId, { featured: !project.featured });
  }

  /**
   * 初始化默认项目数据
   */
  public async initializeDefaultData(): Promise<void> {
    try {
      // 检查是否已有数据
      const existingData = await this.getAll();
      if (existingData.length === 0) {
        // 如果没有数据，添加默认项目
        for (const project of projectsData) {
          await this.create(project);
        }
        console.log('Default project data initialized');
      }
    } catch (error) {
      console.error('Failed to initialize default project data:', error);
    }
  }
}

// 导出单例实例
export const projectService = ProjectService.getInstance();
