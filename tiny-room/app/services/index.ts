import type { Project, GalleryImage, BlogPost, ApiResponse, PaginatedResponse } from '../types';

// 通用数据服务接口
export interface DataService<T> {
  getAll: (options?: QueryOptions) => Promise<T[]>;
  getById: (id: number) => Promise<T | undefined>;
  create: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  delete: (id: number) => Promise<void>;
  search: (query: string, options?: SearchOptions) => Promise<T[]>;
}

// 查询选项接口
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// 搜索选项接口
export interface SearchOptions {
  fields?: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

// 缓存选项接口
export interface CacheOptions {
  ttl?: number; // 缓存生存时间（毫秒）
  invalidateOn?: string[]; // 在哪些操作后使缓存失效
}

// 基础数据服务实现
export abstract class BaseDataService<T extends { id: number }> implements DataService<T> {
  protected cacheKey: string;
  protected cacheOptions: CacheOptions;

  constructor(cacheKey: string, cacheOptions: CacheOptions = {}) {
    this.cacheKey = cacheKey;
    this.cacheOptions = {
      ttl: 5 * 60 * 1000, // 默认5分钟缓存
      invalidateOn: ['create', 'update', 'delete'],
      ...cacheOptions,
    };
  }

  // 抽象方法，子类必须实现
  protected abstract fetchData(): Promise<T[]>;
  protected abstract saveData(data: T[]): Promise<void>;
  protected abstract generateId(): number;

  // 缓存管理
  protected getCachedData(): T[] | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < (this.cacheOptions.ttl || 0)) {
          return data;
        } else {
          this.clearCache();
        }
      }
    } catch (error) {
      console.warn('Failed to read cached data:', error);
      this.clearCache();
    }
    return null;
  }

  protected setCachedData(data: T[]): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  protected clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  // 公共方法实现
  async getAll(options: QueryOptions = {}): Promise<T[]> {
    let data = this.getCachedData();

    if (!data) {
      data = await this.fetchData();
      this.setCachedData(data);
    }

    return this.applyQueryOptions(data, options);
  }

  async getById(id: number): Promise<T | undefined> {
    const data = await this.getAll();
    return data.find(item => item.id === id);
  }

  async create(newData: Omit<T, 'id'>): Promise<T> {
    const data = await this.getAll();
    const newItem = {
      ...newData,
      id: this.generateId(),
    } as T;

    const updatedData = [...data, newItem];
    await this.saveData(updatedData);
    this.setCachedData(updatedData);

    return newItem;
  }

  async update(id: number, updates: Partial<T>): Promise<T> {
    const data = await this.getAll();
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const updatedItem = { ...data[index], ...updates } as T;
    const updatedData = [...data];
    updatedData[index] = updatedItem;

    await this.saveData(updatedData);
    this.setCachedData(updatedData);

    return updatedItem;
  }

  async delete(id: number): Promise<void> {
    const data = await this.getAll();
    const filteredData = data.filter(item => item.id !== id);

    if (filteredData.length === data.length) {
      throw new Error(`Item with id ${id} not found`);
    }

    await this.saveData(filteredData);
    this.setCachedData(filteredData);
  }

  async search(query: string, options: SearchOptions = {}): Promise<T[]> {
    const data = await this.getAll();
    const { fields, caseSensitive = false, exactMatch = false } = options;

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return data.filter(item => {
      const fieldsToSearch = fields || Object.keys(item);

      return fieldsToSearch.some(field => {
        const value = (item as any)[field];
        if (value == null) return false;

        const stringValue = caseSensitive ? String(value) : String(value).toLowerCase();

        if (exactMatch) {
          return stringValue === searchTerm;
        } else {
          return stringValue.includes(searchTerm);
        }
      });
    });
  }

  // 应用查询选项（排序、分页、过滤）
  protected applyQueryOptions(data: T[], options: QueryOptions): T[] {
    let result = [...data];

    // 应用过滤器
    if (options.filters) {
      result = result.filter(item => {
        return Object.entries(options.filters!).every(([key, value]) => {
          return (item as any)[key] === value;
        });
      });
    }

    // 应用排序
    if (options.sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[options.sortBy!];
        const bValue = (b as any)[options.sortBy!];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // 应用分页
    if (options.page && options.limit) {
      const startIndex = (options.page - 1) * options.limit;
      const endIndex = startIndex + options.limit;
      result = result.slice(startIndex, endIndex);
    }

    return result;
  }
}

// 错误类型定义
export class DataServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'DataServiceError';
  }
}

// 加载状态类型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// 数据操作结果类型
export interface DataOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 统一的数据响应格式
export function createApiResponse<T>(
  data?: T,
  success: boolean = true,
  message?: string,
  errors?: string[]
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    errors,
  };
}

// 创建分页响应
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

// 导出所有服务实例
export { projectService } from './projectService';
export { galleryService } from './galleryService';
export { blogService } from './blogService';

// 导出数据层Context和Hooks
export { DataProvider, useData, useProjects, useGallery, useBlog } from '../contexts/DataContext';

// 导出基础服务组件
export * from './BaseDataService';
