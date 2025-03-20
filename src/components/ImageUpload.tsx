"use client";
import { useState } from "react";
import { XIcon, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
}

const ImageUpload = ({ onChange, value }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { url } = await response.json();
      setPreview(url); // Set preview after upload
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Selected"
            className="max-h-60 w-auto rounded-lg object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            onClick={handleRemoveImage}
          >
            <XIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleUpload(e.target.files[0])
            }
            className="hidden"
            id="upload-input"
          />
          <label
            htmlFor="upload-input"
            className="block w-full h-full cursor-pointer"
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                <span>Click to Upload</span>
              </div>
            )}
          </label>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
