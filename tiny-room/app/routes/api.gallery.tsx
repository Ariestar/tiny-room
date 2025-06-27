import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import type { GalleryImage } from '../types';
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
  getGalleryImages,
  saveGalleryImages,
  generateId,
  findById,
  searchItems,
  sortItems,
  paginateItems,
  saveUploadedFile,
  deleteUploadedFile,
} from '../utils/filesystem';

// GET /api/gallery - List gallery images or get single image
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const clientId = request.headers.get('x-forwarded-for') || 'anonymous';

    // Rate limiting
    if (!checkRateLimit(`gallery-${clientId}`, 100, 60000)) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    // Check if this is a request for a single image (URL ends with a number)
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const imageId = parseInt(lastSegment, 10);

    if (!isNaN(imageId)) {
      // Get single image
      const images = await getGalleryImages();
      const image = findById(images, imageId);

      if (!image) {
        throw new ApiError('Gallery image not found', 404, 'IMAGE_NOT_FOUND');
      }

      const response = createSuccessResponse(image);
      logApiRequest(request, response);
      return response;
    }

    // Parse query parameters
    const { page, limit } = parsePaginationParams(url);
    const filters = parseFilters(url);

    // Additional gallery-specific filters
    const location = url.searchParams.get('location');
    const camera = url.searchParams.get('camera');
    const tag = url.searchParams.get('tag');
    const year = url.searchParams.get('year');

    // Get all gallery images
    let images = await getGalleryImages();
    const totalBeforeFiltering = images.length;

    // Apply filters
    if (filters.category) {
      images = images.filter(img => img.category === filters.category);
    }

    if (location) {
      images = images.filter(img => img.location?.toLowerCase().includes(location.toLowerCase()));
    }

    if (camera) {
      images = images.filter(img => img.camera?.toLowerCase().includes(camera.toLowerCase()));
    }

    if (tag) {
      images = images.filter(img =>
        img.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    if (year) {
      images = images.filter(img => img.captureDate.startsWith(year));
    }

    if (filters.search) {
      images = searchItems(images, filters.search, [
        'title',
        'description',
        'tags',
        'location',
        'camera',
      ]);
    }

    // Apply sorting
    if (filters.sort) {
      const sortField = filters.sort as keyof GalleryImage;
      images = sortItems(images, sortField, filters.order);
    } else {
      // Default sort by id descending (newest first)
      images = sortItems(images, 'id', 'desc');
    }

    // Apply pagination
    const total = images.length;
    const paginatedImages = paginateItems(images, page, limit);

    const response = createPaginatedResponse(paginatedImages, page, limit, total);

    // Add metadata
    const metadata = {
      totalImages: totalBeforeFiltering,
      filteredImages: total,
      filters: { ...filters, location, camera, tag, year },
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

// POST /api/gallery - Create new gallery image
// PUT /api/gallery/:id - Update existing gallery image
// DELETE /api/gallery/:id - Delete gallery image
export async function action({ request }: ActionFunctionArgs) {
  try {
    const url = new URL(request.url);
    const clientId = request.headers.get('x-forwarded-for') || 'anonymous';
    const method = request.method;

    // Rate limiting
    const rateLimit = method === 'DELETE' ? 20 : 50;
    if (!checkRateLimit(`gallery-${method}-${clientId}`, rateLimit, 60000)) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const images = await getGalleryImages();

    if (method === 'POST') {
      // Create new gallery image
      const formData = await request.formData();
      const imageData = Object.fromEntries(formData);

      // Handle file upload if present
      let imageUrl = imageData.imageUrl as string;
      let thumbnailUrl = imageData.thumbnailUrl as string;

      const imageFile = formData.get('imageFile') as File;
      if (imageFile && imageFile.size > 0) {
        // Upload new image file
        imageUrl = await saveUploadedFile(imageFile, 'gallery');
        thumbnailUrl = imageUrl; // In production, you'd generate a thumbnail
      }

      // Parse JSON fields
      let tags: string[] = [];
      if (imageData.tags && typeof imageData.tags === 'string') {
        tags = JSON.parse(imageData.tags);
      }

      // Parse settings object
      let settings: any = undefined;
      if (imageData.settings && typeof imageData.settings === 'string') {
        settings = JSON.parse(imageData.settings);
      }

      // Validation
      validateRequired(imageData, ['title', 'description', 'category']);

      if (!imageUrl) {
        throw new ApiError('Image URL or image file is required', 400, 'VALIDATION_ERROR');
      }

      validateTypes(imageData, {
        title: 'string',
        description: 'string',
        category: 'string',
      });

      // Create new gallery image
      const newImage: GalleryImage = {
        id: generateId(images),
        title: imageData.title as string,
        description: imageData.description as string,
        imageUrl: imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        category: imageData.category as string,
        tags: tags,
        captureDate: (imageData.captureDate as string) || new Date().toISOString().split('T')[0],
        location: (imageData.location as string) || undefined,
        camera: (imageData.camera as string) || undefined,
        settings: settings,
      };

      images.push(newImage);
      await saveGalleryImages(images);

      const response = createSuccessResponse(newImage, 'Gallery image created successfully', 201);
      logApiRequest(request, response);
      return response;
    } else if (method === 'PUT') {
      // Update existing gallery image
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      const id = parseInt(lastSegment, 10);

      if (isNaN(id)) {
        throw new ApiError('Invalid image ID', 400, 'INVALID_ID');
      }

      const existingImage = findById(images, id);
      if (!existingImage) {
        throw new ApiError('Gallery image not found', 404, 'IMAGE_NOT_FOUND');
      }

      const formData = await request.formData();
      const updateData = Object.fromEntries(formData);

      // Handle file upload if present
      const imageFile = formData.get('imageFile') as File;
      if (imageFile && imageFile.size > 0) {
        // Delete old image if it's a local upload
        if (existingImage.imageUrl.startsWith('/uploads/')) {
          await deleteUploadedFile(existingImage.imageUrl);
        }

        // Upload new image file
        updateData.imageUrl = await saveUploadedFile(imageFile, 'gallery');
        updateData.thumbnailUrl = updateData.imageUrl;
      }

      // Parse JSON fields if they exist
      if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = JSON.parse(updateData.tags);
      }

      if (updateData.settings && typeof updateData.settings === 'string') {
        updateData.settings = JSON.parse(updateData.settings);
      }

      // Update image
      const imageIndex = images.findIndex(img => img.id === id);
      const updatedImage = { ...existingImage, ...updateData, id };
      images[imageIndex] = updatedImage;

      await saveGalleryImages(images);

      const response = createSuccessResponse(updatedImage, 'Gallery image updated successfully');
      logApiRequest(request, response);
      return response;
    } else if (method === 'DELETE') {
      // Delete gallery image
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      const id = parseInt(lastSegment, 10);

      if (isNaN(id)) {
        throw new ApiError('Invalid image ID', 400, 'INVALID_ID');
      }

      const imageIndex = images.findIndex(img => img.id === id);
      if (imageIndex === -1) {
        throw new ApiError('Gallery image not found', 404, 'IMAGE_NOT_FOUND');
      }

      const deletedImage = images[imageIndex];

      // Delete associated files if they are local uploads
      if (deletedImage.imageUrl.startsWith('/uploads/')) {
        await deleteUploadedFile(deletedImage.imageUrl);
      }
      if (deletedImage.thumbnailUrl && deletedImage.thumbnailUrl.startsWith('/uploads/')) {
        await deleteUploadedFile(deletedImage.thumbnailUrl);
      }

      images.splice(imageIndex, 1);
      await saveGalleryImages(images);

      const response = createSuccessResponse(deletedImage, 'Gallery image deleted successfully');
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
