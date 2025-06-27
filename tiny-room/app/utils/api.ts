import type { ApiResponse, PaginatedResponse } from '../types';

// API Response utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiResponse<T>(
  data?: T,
  message?: string,
  success: boolean = true
): ApiResponse<T> & { timestamp: string } {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function createErrorResponse(error: ApiError | Error, statusCode?: number): Response {
  const status = error instanceof ApiError ? error.statusCode : statusCode || 500;
  const response = createApiResponse(undefined, error.message, false);

  if (error instanceof ApiError && error.details) {
    (response as any).details = error.details;
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  return new Response(JSON.stringify(createApiResponse(data, message)), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Request validation utilities
export function validateRequired(obj: any, fields: string[]): void {
  const missing = fields.filter(field => !obj[field]);
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400, 'VALIDATION_ERROR', {
      missingFields: missing,
    });
  }
}

export function validateTypes(obj: any, schema: Record<string, string>): void {
  const errors: string[] = [];

  Object.entries(schema).forEach(([field, expectedType]) => {
    if (obj[field] !== undefined) {
      const actualType = typeof obj[field];
      if (actualType !== expectedType) {
        errors.push(`${field} must be ${expectedType}, got ${actualType}`);
      }
    }
  });

  if (errors.length > 0) {
    throw new ApiError('Type validation failed', 400, 'TYPE_ERROR', { errors });
  }
}

export function validateArray(value: any, fieldName: string): void {
  if (!Array.isArray(value)) {
    throw new ApiError(`${fieldName} must be an array`, 400, 'VALIDATION_ERROR');
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Pagination utilities
export function parsePaginationParams(url: URL): { page: number; limit: number } {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10)));
  return { page, limit };
}

export function parseFilters(url: URL): Record<string, any> {
  const filters: Record<string, any> = {};

  // Common filter parameters
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');
  const sort = url.searchParams.get('sort');
  const order = url.searchParams.get('order');
  const featured = url.searchParams.get('featured');

  if (category) filters.category = category;
  if (status) filters.status = status;
  if (search) filters.search = search;
  if (sort) filters.sort = sort;
  if (order) filters.order = order === 'desc' ? 'desc' : 'asc';
  if (featured) filters.featured = featured === 'true';

  return filters;
}

// Rate limiting utilities (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetTime < now) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// File upload utilities
export function validateImageFile(file: File): void {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new ApiError(
      'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.',
      400,
      'INVALID_FILE_TYPE'
    );
  }

  if (file.size > maxSize) {
    throw new ApiError('File too large. Maximum size is 5MB.', 400, 'FILE_TOO_LARGE');
  }
}

// Logging utility
export function logApiRequest(request: Request, response?: Response, error?: Error): void {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const status = response?.status || (error ? 500 : 200);

  console.log(`[${timestamp}] ${method} ${url} - ${status}${error ? ` (${error.message})` : ''}`);
}
