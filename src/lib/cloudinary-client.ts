export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pigstar");
  formData.append("folder", "pigstar");

  const res = await fetch("https://api.cloudinary.com/v1_1/dl9o3j0in/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");

  return data.secure_url;
};
