import * as fs from 'fs/promises';
import * as path from 'path';
import { ApiError } from './api';

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const BLOG_FILE = path.join(DATA_DIR, 'blog.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure data directories exist
export async function ensureDataDirectories(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directories:', error);
  }
}

// Generic file operations
export async function readJsonFile<T>(filePath: string, defaultValue: T[] = []): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return defaultValue as T[];
    }
    throw new ApiError(`Failed to read file: ${filePath}`, 500, 'FILE_READ_ERROR');
  }
}

export async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new ApiError(`Failed to write file: ${filePath}`, 500, 'FILE_WRITE_ERROR');
  }
}

// Backup functionality
export async function createBackup(filePath: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup.${timestamp}`;
    await fs.copyFile(filePath, backupPath);

    // Keep only last 10 backups
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);
    const files = await fs.readdir(dir);
    const backups = files
      .filter(f => f.startsWith(`${filename}.backup.`))
      .sort()
      .reverse();

    if (backups.length > 10) {
      for (const backup of backups.slice(10)) {
        await fs.unlink(path.join(dir, backup));
      }
    }
  } catch (error) {
    console.error('Backup creation failed:', error);
  }
}

// Specific data operations
export async function getProjects(): Promise<any[]> {
  await ensureDataDirectories();
  return readJsonFile(PROJECTS_FILE);
}

export async function saveProjects(projects: any[]): Promise<void> {
  await ensureDataDirectories();
  await createBackup(PROJECTS_FILE);
  return writeJsonFile(PROJECTS_FILE, projects);
}

export async function getGalleryImages(): Promise<any[]> {
  await ensureDataDirectories();
  return readJsonFile(GALLERY_FILE);
}

export async function saveGalleryImages(images: any[]): Promise<void> {
  await ensureDataDirectories();
  await createBackup(GALLERY_FILE);
  return writeJsonFile(GALLERY_FILE, images);
}

export async function getBlogPosts(): Promise<any[]> {
  await ensureDataDirectories();
  return readJsonFile(BLOG_FILE);
}

export async function saveBlogPosts(posts: any[]): Promise<void> {
  await ensureDataDirectories();
  await createBackup(BLOG_FILE);
  return writeJsonFile(BLOG_FILE, posts);
}

// File upload handling
export async function saveUploadedFile(
  file: File,
  category: 'projects' | 'gallery' | 'blog' = 'gallery'
): Promise<string> {
  await ensureDataDirectories();

  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const filename = `${category}-${timestamp}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    throw new ApiError('Failed to save uploaded file', 500, 'FILE_UPLOAD_ERROR');
  }
}

export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url.startsWith('/uploads/')) {
    return; // Not a local upload
  }

  const filename = path.basename(url);
  const filepath = path.join(UPLOADS_DIR, filename);

  try {
    await fs.unlink(filepath);
  } catch (error) {
    // File might not exist, log but don't throw
    console.warn(`Failed to delete file: ${filepath}`, error);
  }
}

// Database-like operations
export function generateId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

export function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

export function findByField<T>(items: T[], field: keyof T, value: any): T[] {
  return items.filter(item => item[field] === value);
}

export function searchItems<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
  const lowercaseSearch = searchTerm.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      if (Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v.toLowerCase().includes(lowercaseSearch));
      }
      return false;
    })
  );
}

export function sortItems<T>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  return items.slice(startIndex, startIndex + limit);
}
