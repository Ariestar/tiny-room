import type { ApiResponse, PaginatedResponse, Project, GalleryImage, BlogPost } from '../types';

// API Configuration
const API_BASE_URL = '/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// API Client Error Class
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// Generic API Client Class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Create AbortController for timeout
  private createTimeoutSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller.signal;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const signal = this.createTimeoutSignal();

    try {
      const response = await fetch(url, {
        ...options,
        signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiClientError(
          data.message || 'Request failed',
          response.status,
          data.code,
          data.details
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408, 'TIMEOUT');
      }

      throw new ApiClientError('Network error occurred', 0, 'NETWORK_ERROR', error);
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  // POST request with JSON
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // POST request with FormData (for file uploads)
  async postForm<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // PUT request with JSON
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request with FormData
  async putForm<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Projects API
export const projectsApi = {
  // List projects with filtering and pagination
  list: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: Project['status'];
    featured?: boolean;
    search?: string;
    sort?: keyof Project;
    order?: 'asc' | 'desc';
  }) => apiClient.get<PaginatedResponse<Project>>('/projects', params),

  // Get single project by ID
  getById: (id: number) => apiClient.get<Project>(`/projects/${id}`),

  // Create new project (JSON)
  create: (project: Omit<Project, 'id'>) => apiClient.post<Project>('/projects', project),

  // Create new project (FormData - for file uploads)
  createForm: (formData: FormData) => apiClient.postForm<Project>('/projects', formData),

  // Update project (JSON)
  update: (id: number, project: Partial<Project>) =>
    apiClient.put<Project>(`/projects/${id}`, project),

  // Update project (FormData - for file uploads)
  updateForm: (id: number, formData: FormData) =>
    apiClient.putForm<Project>(`/projects/${id}`, formData),

  // Delete project
  delete: (id: number) => apiClient.delete<Project>(`/projects/${id}`),

  // Search projects
  search: (
    query: string,
    filters?: {
      category?: string;
      status?: Project['status'];
      featured?: boolean;
    }
  ) => apiClient.get<Project[]>('/projects', { search: query, ...filters }),
};

// Gallery API
export const galleryApi = {
  // List gallery images with filtering and pagination
  list: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    camera?: string;
    tag?: string;
    year?: string;
    search?: string;
    sort?: keyof GalleryImage;
    order?: 'asc' | 'desc';
  }) => apiClient.get<PaginatedResponse<GalleryImage>>('/gallery', params),

  // Get single gallery image by ID
  getById: (id: number) => apiClient.get<GalleryImage>(`/gallery/${id}`),

  // Create new gallery image (JSON)
  create: (image: Omit<GalleryImage, 'id'>) => apiClient.post<GalleryImage>('/gallery', image),

  // Create new gallery image (FormData - for file uploads)
  createForm: (formData: FormData) => apiClient.postForm<GalleryImage>('/gallery', formData),

  // Update gallery image (JSON)
  update: (id: number, image: Partial<GalleryImage>) =>
    apiClient.put<GalleryImage>(`/gallery/${id}`, image),

  // Update gallery image (FormData - for file uploads)
  updateForm: (id: number, formData: FormData) =>
    apiClient.putForm<GalleryImage>(`/gallery/${id}`, formData),

  // Delete gallery image
  delete: (id: number) => apiClient.delete<GalleryImage>(`/gallery/${id}`),

  // Search gallery images
  search: (
    query: string,
    filters?: {
      category?: string;
      location?: string;
      camera?: string;
      tag?: string;
    }
  ) => apiClient.get<GalleryImage[]>('/gallery', { search: query, ...filters }),
};

// Blog API
export const blogApi = {
  // List blog posts with filtering and pagination
  list: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: BlogPost['status'];
    author?: string;
    tag?: string;
    year?: string;
    featured?: boolean;
    search?: string;
    sort?: keyof BlogPost;
    order?: 'asc' | 'desc';
  }) => apiClient.get<PaginatedResponse<BlogPost>>('/blog', params),

  // Get single blog post by ID
  getById: (id: number) => apiClient.get<BlogPost>(`/blog/${id}`),

  // Get blog post by slug
  getBySlug: (slug: string) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/blog', { search: slug }).then(response => {
      const posts = response.data?.data || [];
      const post = posts.find((p: BlogPost) => p.slug === slug);
      if (!post) {
        throw new ApiClientError('Blog post not found', 404, 'POST_NOT_FOUND');
      }
      return { ...response, data: post } as ApiResponse<BlogPost>;
    }),

  // Create new blog post (JSON)
  create: (post: Omit<BlogPost, 'id'>) => apiClient.post<BlogPost>('/blog', post),

  // Create new blog post (FormData - for file uploads)
  createForm: (formData: FormData) => apiClient.postForm<BlogPost>('/blog', formData),

  // Update blog post (JSON)
  update: (id: number, post: Partial<BlogPost>) => apiClient.put<BlogPost>(`/blog/${id}`, post),

  // Update blog post (FormData - for file uploads)
  updateForm: (id: number, formData: FormData) =>
    apiClient.putForm<BlogPost>(`/blog/${id}`, formData),

  // Delete blog post
  delete: (id: number) => apiClient.delete<BlogPost>(`/blog/${id}`),

  // Search blog posts
  search: (
    query: string,
    filters?: {
      category?: string;
      status?: BlogPost['status'];
      author?: string;
      tag?: string;
      featured?: boolean;
    }
  ) => apiClient.get<BlogPost[]>('/blog', { search: query, ...filters }),
};

// Export the main client for custom requests
export { apiClient };

// Helper function to handle API errors consistently
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
