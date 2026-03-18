import { supabase } from '@/integrations/supabase/client';
import imageCompression from 'browser-image-compression';

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  fileName: string;
}

// Convert image to WebP with high quality
const convertToWebP = async (file: File): Promise<File> => {
  try {
    const options = {
      maxSizeMB: 50, // Allow up to 50MB after compression
      maxWidthOrHeight: 2000, // High resolution for quality
      useWebWorker: true,
      fileType: 'image/webp', // Convert to WebP
      initialQuality: 0.95, // 95% quality - almost lossless
    };

    const compressedFile = await imageCompression(file, options);
    
    console.log('WebP conversion:', {
      original: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      compressed: `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      savings: `${((1 - compressedFile.size / file.size) * 100).toFixed(1)}% smaller`
    });

    return compressedFile;
  } catch (error) {
    console.error('WebP conversion error:', error);
    throw new Error('Failed to convert image to WebP');
  }
};

export const uploadService = {
  // Upload with WebP conversion and progress tracking
  async uploadImage(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> {
    try {
      console.log('Processing image:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      // Convert to WebP with high quality
      const webpFile = await convertToWebP(file);
      
      // Upload WebP file
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
      
      // Create upload with proper options for large files
      const uploadOptions: any = {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '3600'
      };

      // Add progress tracking if callback provided
      if (onProgress) {
        uploadOptions.onProgress = (event: any) => {
          if (event.loaded && event.total) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage,
              fileName: file.name
            });
          }
        };
      }

      const { data, error } = await supabase.storage
        .from('public')
        .upload(fileName, webpFile, uploadOptions);

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(fileName);

      console.log('Upload successful:', file.name, '→ WebP:', webpFile.name, 'URL:', publicUrl);

      return {
        url: publicUrl,
        name: file.name, // Keep original name for display
        size: webpFile.size,
        type: 'image/webp'
      };
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      throw new Error(errorMessage);
    }
  },

  // Upload multiple images with WebP conversion and progress tracking
  async uploadMultipleImages(
    files: File[], 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile[]> {
    const uploadedFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Report progress for this file
        if (onProgress) {
          onProgress({
            loaded: 0,
            total: file.size,
            percentage: 0,
            fileName: file.name
          });
        }
        
        const uploadedFile = await this.uploadImage(file, onProgress);
        uploadedFiles.push(uploadedFile);
        
        // Report completion for this file
        if (onProgress) {
          onProgress({
            loaded: uploadedFile.size,
            total: uploadedFile.size,
            percentage: 100,
            fileName: file.name
          });
        }
      } catch (error) {
        console.error('Failed to upload:', file.name, error);
        throw error;
      }
    }
    
    return uploadedFiles;
  },

  // Delete image
  async deleteImage(url: string): Promise<void> {
    if (url.includes('supabase')) {
      try {
        const path = url.split('/public/')[1];
        if (path) {
          await supabase.storage.from('public').remove([path]);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  }
};
