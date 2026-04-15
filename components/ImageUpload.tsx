import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import { uploadImageToImgBB } from '../services/imgbb';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages = 5 }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const availableSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = filesToUpload.map(file => uploadImageToImgBB(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Failed to upload images", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div 
            key={url + index} 
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-darkBorder group cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
              <GripVertical className="text-white" />
            </div>
            <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(index); }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-darkBorder flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative">
            {isUploading ? (
              <Loader2 size={24} className="text-primary animate-spin" />
            ) : (
              <>
                <Upload size={24} className="text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Upload</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {images.length} / {maxImages} images uploaded. Drag and drop to arrange.
      </p>
    </div>
  );
};
