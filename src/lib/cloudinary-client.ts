const isProduction = process.env.NODE_ENV === 'production';
const folder = isProduction ? 'pigstar' : 'pigstar_test';
const uploadPreset = isProduction ? 'pigstar' : 'pigstar_test';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch("https://api.cloudinary.com/v1_1/dl9o3j0in/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");

  return data.secure_url;
};
