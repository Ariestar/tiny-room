import type { GalleryImage } from '../types';
import { BaseDataService, DataServiceError } from './BaseDataService';
import galleryData from '../assets/data/gallery';

export class GalleryService extends BaseDataService<GalleryImage> {
  private static instance: GalleryService;

  constructor() {
    super('gallery_cache', {
      ttl: 15 * 60 * 1000, // 15分钟缓存，图片数据可能更新频繁
      invalidateOn: ['create', 'update', 'delete'],
    });
  }

  // 单例模式
  static getInstance(): GalleryService {
    if (!GalleryService.instance) {
      GalleryService.instance = new GalleryService();
    }
    return GalleryService.instance;
  }

  // 实现抽象方法
  protected async fetchData(): Promise<GalleryImage[]> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 400));

      // 在真实应用中，这里会调用API
      // const response = await fetch('/api/gallery');
      // return response.json();

      return [...galleryData]; // 返回副本以避免直接修改原数据
    } catch (error) {
      throw new DataServiceError('Failed to fetch gallery images', 'FETCH_ERROR', 500);
    }
  }

  protected async saveData(data: GalleryImage[]): Promise<void> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 250));

      // 在真实应用中，这里会调用API保存数据
      // await fetch('/api/gallery', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      console.log('Gallery images saved:', data.length, 'items');
    } catch (error) {
      throw new DataServiceError('Failed to save gallery images', 'SAVE_ERROR', 500);
    }
  }

  protected generateId(): number {
    // 在真实应用中，ID应该由后端生成
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // 图库特有的方法
  async getImagesByCategory(category: string): Promise<GalleryImage[]> {
    return this.getAll({
      filters: { category },
      sortBy: 'captureDate',
      sortOrder: 'desc',
    });
  }

  async getImagesByTags(tags: string[]): Promise<GalleryImage[]> {
    const allImages = await this.getAll();
    return allImages.filter(image =>
      tags.some(tag =>
        image.tags.some(imageTag => imageTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }

  async getImagesByLocation(location: string): Promise<GalleryImage[]> {
    const allImages = await this.getAll();
    return allImages.filter(image =>
      image.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  async getImagesByCamera(camera: string): Promise<GalleryImage[]> {
    const allImages = await this.getAll();
    return allImages.filter(image => image.camera?.toLowerCase().includes(camera.toLowerCase()));
  }

  async getImagesByDateRange(startDate: string, endDate: string): Promise<GalleryImage[]> {
    const allImages = await this.getAll();
    return allImages.filter(image => {
      const captureDate = new Date(image.captureDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return captureDate >= start && captureDate <= end;
    });
  }

  async getRandomImages(count: number = 6): Promise<GalleryImage[]> {
    const allImages = await this.getAll();
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async getGalleryStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byLocation: Record<string, number>;
    byCamera: Record<string, number>;
    byYear: Record<string, number>;
  }> {
    const allImages = await this.getAll();

    const byCategory = allImages.reduce(
      (acc, image) => {
        acc[image.category] = (acc[image.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byLocation = allImages.reduce(
      (acc, image) => {
        if (image.location) {
          acc[image.location] = (acc[image.location] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const byCamera = allImages.reduce(
      (acc, image) => {
        if (image.camera) {
          acc[image.camera] = (acc[image.camera] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const byYear = allImages.reduce(
      (acc, image) => {
        const year = new Date(image.captureDate).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: allImages.length,
      byCategory,
      byLocation,
      byCamera,
      byYear,
    };
  }

  // 批量操作
  async bulkUpdateCategory(imageIds: number[], category: string): Promise<GalleryImage[]> {
    const updatedImages: GalleryImage[] = [];

    for (const id of imageIds) {
      try {
        const updated = await this.update(id, { category });
        updatedImages.push(updated);
      } catch (error) {
        console.warn(`Failed to update image ${id}:`, error);
      }
    }

    return updatedImages;
  }

  async bulkAddTags(imageIds: number[], newTags: string[]): Promise<GalleryImage[]> {
    const updatedImages: GalleryImage[] = [];

    for (const id of imageIds) {
      try {
        const image = await this.getById(id);
        if (image) {
          const uniqueTags = [...new Set([...image.tags, ...newTags])];
          const updated = await this.update(id, { tags: uniqueTags });
          updatedImages.push(updated);
        }
      } catch (error) {
        console.warn(`Failed to update tags for image ${id}:`, error);
      }
    }

    return updatedImages;
  }

  // 图片上传处理
  async uploadImage(
    imageData: Omit<GalleryImage, 'id' | 'thumbnailUrl'>,
    file: File
  ): Promise<GalleryImage> {
    try {
      // 在真实应用中，这里会处理文件上传
      // const uploadResult = await uploadToCloudStorage(file);

      // 模拟文件处理和缩略图生成
      const thumbnailUrl = imageData.imageUrl.replace('800x600', '300x200');

      const newImage = await this.create({
        ...imageData,
        thumbnailUrl,
      });

      return newImage;
    } catch (error) {
      throw new DataServiceError('Failed to upload image', 'UPLOAD_ERROR', 500);
    }
  }

  /**
   * 初始化默认图库数据
   */
  public async initializeDefaultData(): Promise<void> {
    try {
      // 检查是否已有数据
      const existingData = await this.getAll();
      if (existingData.length === 0) {
        // 如果没有数据，添加默认图库
        for (const image of galleryData) {
          await this.create(image);
        }
        console.log('Default gallery data initialized');
      }
    } catch (error) {
      console.error('Failed to initialize default gallery data:', error);
    }
  }
}

// 导出单例实例
export const galleryService = GalleryService.getInstance();
