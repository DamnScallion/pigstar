"use client";
import React, { useState } from "react";
import { XIcon, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
}

const ImageUpload = ({ onChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string[]>([]);

  const handleFileChange = (files: FileList) => {
    const fileArray = Array.from(files);
    onChange(fileArray);
    fileArray.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          setPreview((prev) => [...prev, fileReader.result as string]);
        }
      };
      fileReader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    onChange(preview.filter((_, i) => i !== index).map((url) => new File([url], "image")));
  };

  return (
    <div className="relative text-center">
      {preview.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {preview.map((src, index) => (
            <div key={index} className="grid-span-1 relative inline-block">
              <img
                src={src}
                alt="Selected"
                className="w-full h-full rounded-lg object-cover"
                style={{ aspectRatio: '1 / 1' }}
              />
              <button
                type="button"
                className="absolute cursor-pointer top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                onClick={() => handleRemoveImage(index)}
              >
                <XIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFileChange(e.target.files)}
            className="hidden"
            id="upload-input"
          />
          <label
            htmlFor="upload-input"
            className="block w-full h-full cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
              <span>Click to Upload</span>
            </div>
          </label>
        </>
      )}
    </div>
  );
};

export default ImageUpload;