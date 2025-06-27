import React, { useCallback, useState, useRef } from 'react';
import type { FileUpload, ApiResponse } from '../types';

interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: FileUpload;
}

interface FileUploaderProps {
  onUploadComplete?: (files: FileUpload[]) => void;
  onUploadProgress?: (progress: FileUploadProgress[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  category?: 'image' | 'document' | 'video' | 'audio';
  uploadEndpoint?: string;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onUploadProgress,
  acceptedTypes = [
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  category = 'image',
  uploadEndpoint = '/api/upload',
  className = '',
}) => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // 检查文件大小
    if (file.size > maxFileSize) {
      return `文件大小超过限制 (${(maxFileSize / 1024 / 1024).toFixed(1)}MB)`;
    }

    // 检查文件类型
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `不支持的文件类型。支持的类型: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File, progressIndex: number): Promise<FileUpload | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev =>
              prev.map((item, index) =>
                index === progressIndex ? { ...item, progress, status: 'uploading' } : item
              )
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response: ApiResponse<FileUpload> = JSON.parse(xhr.responseText);
              if (response.success && response.data) {
                setUploadProgress(prev =>
                  prev.map((item, index) =>
                    index === progressIndex
                      ? { ...item, progress: 100, status: 'completed', result: response.data }
                      : item
                  )
                );
                resolve(response.data);
              } else {
                throw new Error(response.message || '上传失败');
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`上传失败: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('网络错误'));
        });

        xhr.open('POST', uploadEndpoint);

        // 添加认证头
        const token = localStorage.getItem('authToken');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (error) {
      setUploadProgress(prev =>
        prev.map((item, index) =>
          index === progressIndex
            ? {
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : '上传失败',
              }
            : item
        )
      );
      return null;
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // 检查文件数量限制
    if (fileArray.length > maxFiles) {
      alert(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    // 验证所有文件
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    fileArray.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`文件 ${index + 1} (${file.name}): ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      alert('文件验证失败:\n' + validationErrors.join('\n'));
      return;
    }

    // 初始化上传进度
    const initialProgress: FileUploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploadProgress(initialProgress);
    onUploadProgress?.(initialProgress);

    // 并行上传所有文件
    try {
      const uploadPromises = validFiles.map((file, index) => uploadFile(file, index));
      const results = await Promise.allSettled(uploadPromises);

      const successfulUploads: FileUpload[] = [];
      const finalProgress = initialProgress.map((item, index) => {
        const result = results[index];
        if (result.status === 'fulfilled' && result.value) {
          successfulUploads.push(result.value);
          return { ...item, status: 'completed' as const, result: result.value };
        } else {
          const error = result.status === 'rejected' ? result.reason.message : '上传失败';
          return { ...item, status: 'error' as const, error };
        }
      });

      setUploadProgress(finalProgress);
      onUploadProgress?.(finalProgress);

      if (successfulUploads.length > 0) {
        onUploadComplete?.(successfulUploads);
      }
    } catch (error) {
      console.error('批量上传失败:', error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // 清空input值，允许重复选择同一文件
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: FileUploadProgress['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'uploading':
        return '📤';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📄';
    }
  };

  // 获取文件类型的用户友好描述
  const getAcceptedTypesDescription = () => {
    const typeMap: Record<string, string> = {
      'image/*': '图片',
      'application/pdf': 'PDF',
      'application/msword': 'Word文档',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
      'text/*': '文本文件',
      'video/*': '视频',
      'audio/*': '音频',
    };

    const descriptions = acceptedTypes.map(type => {
      if (typeMap[type]) return typeMap[type];
      if (type.startsWith('.')) return type.toUpperCase();
      if (type.includes('*')) return type.split('/')[0] + '文件';
      return type;
    });

    return [...new Set(descriptions)].join(', ');
  };

  return (
    <div className={`file-uploader ${className}`}>
      {/* 拖拽上传区域 */}
      <div
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-icon">📤</div>
        <div className="upload-text">
          <h3>拖拽文件到此处或点击选择</h3>
          <p>
            支持类型: {getAcceptedTypesDescription()}
            <br />
            最大文件大小: {formatFileSize(maxFileSize)}
            <br />
            最多上传: {maxFiles} 个文件
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="file-input-hidden"
        />
      </div>

      {/* 上传进度列表 */}
      {uploadProgress.length > 0 && (
        <div className="upload-progress-list">
          <h4>上传进度</h4>
          {uploadProgress.map((item, index) => (
            <div key={index} className={`progress-item ${item.status}`}>
              <div className="file-info">
                <span className="status-icon">{getStatusIcon(item.status)}</span>
                <div className="file-details">
                  <div className="filename">{item.file.name}</div>
                  <div className="file-size">{formatFileSize(item.file.size)}</div>
                </div>
              </div>

              <div className="progress-section">
                {item.status === 'uploading' && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.progress}%` }} />
                    <span className="progress-text">{item.progress}%</span>
                  </div>
                )}

                {item.status === 'completed' && <div className="success-message">上传成功</div>}

                {item.status === 'error' && <div className="error-message">{item.error}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
