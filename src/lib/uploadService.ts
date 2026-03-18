import { supabase } from '@/integrations/supabase/client';

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

export const uploadService = {
  // Upload without compression - original quality with progress tracking
  async uploadImage(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> {
    try {
      console.log('Processing image:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      // Upload original file without compression
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.name.split('.').pop() || 'jpg'}`;
      
      // Create upload with proper options for large files
      const uploadOptions: any = {
        contentType: file.type,
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
        .upload(fileName, file, uploadOptions);

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(fileName);

      console.log('Upload successful:', file.name, 'URL:', publicUrl);

      return {
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      throw new Error(errorMessage);
    }
  },

  // Upload multiple images with progress tracking
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
        
        const uploadedFile = await this.uploadImage(file);
        uploadedFiles.push(uploadedFile);
        
        // Report completion for this file
        if (onProgress) {
          onProgress({
            loaded: file.size,
            total: file.size,
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
