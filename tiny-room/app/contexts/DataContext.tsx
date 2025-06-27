import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Project, GalleryImage, BlogPost } from '~/types';
import type { LoadingState, DataOperationResult } from '~/services';
import { projectService } from '~/services/projectService';
import { galleryService } from '~/services/galleryService';
import { blogService } from '~/services/blogService';

// Context 接口定义
interface DataContextValue {
  // 项目数据
  projects: {
    data: Project[];
    loading: LoadingState;
    actions: {
      getAll: () => Promise<void>;
      getById: (id: number) => Promise<Project | undefined>;
      create: (data: Omit<Project, 'id'>) => Promise<DataOperationResult<Project>>;
      update: (id: number, data: Partial<Project>) => Promise<DataOperationResult<Project>>;
      delete: (id: number) => Promise<DataOperationResult<void>>;
      getFeatured: () => Promise<Project[]>;
      getByCategory: (category: string) => Promise<Project[]>;
      search: (query: string) => Promise<Project[]>;
    };
  };

  // 图库数据
  gallery: {
    data: GalleryImage[];
    loading: LoadingState;
    actions: {
      getAll: () => Promise<void>;
      getById: (id: number) => Promise<GalleryImage | undefined>;
      create: (data: Omit<GalleryImage, 'id'>) => Promise<DataOperationResult<GalleryImage>>;
      update: (
        id: number,
        data: Partial<GalleryImage>
      ) => Promise<DataOperationResult<GalleryImage>>;
      delete: (id: number) => Promise<DataOperationResult<void>>;
      getByCategory: (category: string) => Promise<GalleryImage[]>;
      getByTags: (tags: string[]) => Promise<GalleryImage[]>;
      getRandom: (count?: number) => Promise<GalleryImage[]>;
    };
  };

  // 博客数据
  blog: {
    data: BlogPost[];
    loading: LoadingState;
    actions: {
      getAll: () => Promise<void>;
      getById: (id: number) => Promise<BlogPost | undefined>;
      create: (data: Omit<BlogPost, 'id'>) => Promise<DataOperationResult<BlogPost>>;
      update: (id: number, data: Partial<BlogPost>) => Promise<DataOperationResult<BlogPost>>;
      delete: (id: number) => Promise<DataOperationResult<void>>;
      getPublished: () => Promise<BlogPost[]>;
      getDrafts: () => Promise<BlogPost[]>;
      getBySlug: (slug: string) => Promise<BlogPost | undefined>;
      publish: (id: number) => Promise<DataOperationResult<BlogPost>>;
    };
  };

  // 全局操作
  globalActions: {
    refreshAll: () => Promise<void>;
    clearCache: () => void;
  };
}

// 创建Context
const DataContext = createContext<DataContextValue | undefined>(undefined);

// 初始加载状态
const createInitialLoadingState = (): LoadingState => ({
  isLoading: false,
  error: null,
  lastUpdated: null,
});

// Provider组件
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 项目状态
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<LoadingState>(createInitialLoadingState());

  // 图库状态
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState<LoadingState>(createInitialLoadingState());

  // 博客状态
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState<LoadingState>(createInitialLoadingState());

  // 通用错误处理函数
  const handleError = (
    error: any,
    setLoading: React.Dispatch<React.SetStateAction<LoadingState>>
  ) => {
    console.error('Data operation error:', error);
    setLoading(prev => ({
      ...prev,
      isLoading: false,
      error: error.message || 'An error occurred',
    }));
  };

  // 通用成功处理函数
  const handleSuccess = <T,>(
    data: T,
    setLoading: React.Dispatch<React.SetStateAction<LoadingState>>
  ): DataOperationResult<T> => {
    setLoading(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      lastUpdated: new Date(),
    }));
    return { success: true, data };
  };

  // 项目操作
  const projectActions = {
    getAll: async () => {
      setProjectsLoading(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await projectService.getAll();
        setProjects(data);
        handleSuccess(data, setProjectsLoading);
      } catch (error) {
        handleError(error, setProjectsLoading);
      }
    },

    getById: async (id: number) => {
      try {
        return await projectService.getById(id);
      } catch (error) {
        console.error('Failed to get project:', error);
        return undefined;
      }
    },

    create: async (data: Omit<Project, 'id'>) => {
      try {
        const newProject = await projectService.create(data);
        setProjects(prev => [...prev, newProject]);
        return handleSuccess(newProject, setProjectsLoading);
      } catch (error) {
        handleError(error, setProjectsLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create project',
        };
      }
    },

    update: async (id: number, data: Partial<Project>) => {
      try {
        const updatedProject = await projectService.update(id, data);
        setProjects(prev => prev.map(p => (p.id === id ? updatedProject : p)));
        return handleSuccess(updatedProject, setProjectsLoading);
      } catch (error) {
        handleError(error, setProjectsLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update project',
        };
      }
    },

    delete: async (id: number) => {
      try {
        await projectService.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        return handleSuccess(undefined, setProjectsLoading);
      } catch (error) {
        handleError(error, setProjectsLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete project',
        };
      }
    },

    getFeatured: async () => {
      try {
        return await projectService.getFeaturedProjects();
      } catch (error) {
        console.error('Failed to get featured projects:', error);
        return [];
      }
    },

    getByCategory: async (category: string) => {
      try {
        return await projectService.getProjectsByCategory(category);
      } catch (error) {
        console.error('Failed to get projects by category:', error);
        return [];
      }
    },

    search: async (query: string) => {
      try {
        return await projectService.search(query);
      } catch (error) {
        console.error('Failed to search projects:', error);
        return [];
      }
    },
  };

  // 图库操作
  const galleryActions = {
    getAll: async () => {
      setGalleryLoading(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await galleryService.getAll();
        setGallery(data);
        handleSuccess(data, setGalleryLoading);
      } catch (error) {
        handleError(error, setGalleryLoading);
      }
    },

    getById: async (id: number) => {
      try {
        return await galleryService.getById(id);
      } catch (error) {
        console.error('Failed to get gallery image:', error);
        return undefined;
      }
    },

    create: async (data: Omit<GalleryImage, 'id'>) => {
      try {
        const newImage = await galleryService.create(data);
        setGallery(prev => [...prev, newImage]);
        return handleSuccess(newImage, setGalleryLoading);
      } catch (error) {
        handleError(error, setGalleryLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create gallery image',
        };
      }
    },

    update: async (id: number, data: Partial<GalleryImage>) => {
      try {
        const updatedImage = await galleryService.update(id, data);
        setGallery(prev => prev.map(img => (img.id === id ? updatedImage : img)));
        return handleSuccess(updatedImage, setGalleryLoading);
      } catch (error) {
        handleError(error, setGalleryLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update gallery image',
        };
      }
    },

    delete: async (id: number) => {
      try {
        await galleryService.delete(id);
        setGallery(prev => prev.filter(img => img.id !== id));
        return handleSuccess(undefined, setGalleryLoading);
      } catch (error) {
        handleError(error, setGalleryLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete gallery image',
        };
      }
    },

    getByCategory: async (category: string) => {
      try {
        return await galleryService.getImagesByCategory(category);
      } catch (error) {
        console.error('Failed to get images by category:', error);
        return [];
      }
    },

    getByTags: async (tags: string[]) => {
      try {
        return await galleryService.getImagesByTags(tags);
      } catch (error) {
        console.error('Failed to get images by tags:', error);
        return [];
      }
    },

    getRandom: async (count?: number) => {
      try {
        return await galleryService.getRandomImages(count);
      } catch (error) {
        console.error('Failed to get random images:', error);
        return [];
      }
    },
  };

  // 博客操作
  const blogActions = {
    getAll: async () => {
      setBlogLoading(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await blogService.getAll();
        setBlog(data);
        handleSuccess(data, setBlogLoading);
      } catch (error) {
        handleError(error, setBlogLoading);
      }
    },

    getById: async (id: number) => {
      try {
        return await blogService.getById(id);
      } catch (error) {
        console.error('Failed to get blog post:', error);
        return undefined;
      }
    },

    create: async (data: Omit<BlogPost, 'id'>) => {
      try {
        const newPost = await blogService.create(data);
        setBlog(prev => [...prev, newPost]);
        return handleSuccess(newPost, setBlogLoading);
      } catch (error) {
        handleError(error, setBlogLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create blog post',
        };
      }
    },

    update: async (id: number, data: Partial<BlogPost>) => {
      try {
        const updatedPost = await blogService.update(id, data);
        setBlog(prev => prev.map(post => (post.id === id ? updatedPost : post)));
        return handleSuccess(updatedPost, setBlogLoading);
      } catch (error) {
        handleError(error, setBlogLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update blog post',
        };
      }
    },

    delete: async (id: number) => {
      try {
        await blogService.delete(id);
        setBlog(prev => prev.filter(post => post.id !== id));
        return handleSuccess(undefined, setBlogLoading);
      } catch (error) {
        handleError(error, setBlogLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete blog post',
        };
      }
    },

    getPublished: async () => {
      try {
        return await blogService.getPublishedPosts();
      } catch (error) {
        console.error('Failed to get published posts:', error);
        return [];
      }
    },

    getDrafts: async () => {
      try {
        return await blogService.getDraftPosts();
      } catch (error) {
        console.error('Failed to get draft posts:', error);
        return [];
      }
    },

    getBySlug: async (slug: string) => {
      try {
        return await blogService.getPostBySlug(slug);
      } catch (error) {
        console.error('Failed to get post by slug:', error);
        return undefined;
      }
    },

    publish: async (id: number) => {
      try {
        const publishedPost = await blogService.publishPost(id);
        setBlog(prev => prev.map(post => (post.id === id ? publishedPost : post)));
        return handleSuccess(publishedPost, setBlogLoading);
      } catch (error) {
        handleError(error, setBlogLoading);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to publish post',
        };
      }
    },
  };

  // 全局操作
  const globalActions = {
    refreshAll: async () => {
      await Promise.all([projectActions.getAll(), galleryActions.getAll(), blogActions.getAll()]);
    },

    clearCache: () => {
      // 清除本地状态缓存，实际的服务缓存在各自的实例中管理
      console.log('Clearing local data cache...');
      // 注意：实际的服务缓存是受保护的，由各服务内部管理
    },
  };

  // 初始化数据加载
  useEffect(() => {
    const initializeData = async () => {
      // 初始化默认数据
      await projectService.initializeDefaultData();
      await galleryService.initializeDefaultData();

      // 然后加载所有数据
      await globalActions.refreshAll();
    };

    initializeData();
  }, []);

  // Context 值
  const contextValue: DataContextValue = {
    projects: {
      data: projects,
      loading: projectsLoading,
      actions: projectActions,
    },
    gallery: {
      data: gallery,
      loading: galleryLoading,
      actions: galleryActions,
    },
    blog: {
      data: blog,
      loading: blogLoading,
      actions: blogActions,
    },
    globalActions,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// 自定义Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// 专用Hooks
export const useProjects = () => {
  const { projects } = useData();
  return projects;
};

export const useGallery = () => {
  const { gallery } = useData();
  return gallery;
};

export const useBlog = () => {
  const { blog } = useData();
  return blog;
};
