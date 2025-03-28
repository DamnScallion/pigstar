"use client";
import React, { useRef, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

const MAX_IMAGES = 9;

const ImageUpload = ({ onChange, disabled = false }: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (fileList: FileList) => {
    const newFiles = Array.from(fileList);


    // Only take files up to the limit
    const remaining = MAX_IMAGES - files.length;
    const limitedFiles = newFiles.slice(0, remaining);

    limitedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviews((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    const updatedFiles = [...files, ...limitedFiles];
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleRemoveImage = (index: number) => {
    if (disabled) return;

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  const handleClickAdd = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {previews.map((src, index) => (
        <div key={index} className="relative rounded-lg overflow-hidden">
          <img
            src={src}
            alt={`preview-${index}`}
            className="w-full h-full object-cover rounded-lg"
            style={{ aspectRatio: "1 / 1" }}
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            disabled={disabled}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100 disabled:opacity-50"
          >
            <XIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ))}

      {files.length < MAX_IMAGES && (
        <>
          <div
            className={`relative flex items-center justify-center rounded-lg border border-dashed border-gray-300 ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/30 cursor-pointer"
            }`}
            style={{ aspectRatio: "1 / 1" }}
            onClick={handleClickAdd}
          >
            <PlusIcon className="w-6 h-6 text-gray-400" />
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={inputRef}
            onChange={(e) => e.target.files && handleFileChange(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
        </>
      )}
    </div>
  );
};

export default ImageUpload;
