import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/**
 * Extracts the Cloudinary public ID from a secure_url
 * Example:
 *   extractCloudinaryPublicId("https://res.cloudinary.com/dl9o3j0in/image/  upload/v1743148288/pigstar/Snow_0_j3cuix.jpg")
 * ✅ returns: "pigstar/Snow_0_j3cuix"
 * → folder/file
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const pathname = new URL(url).pathname; // e.g. /dl9o3j0in/image/upload/v123/folder/filename.jpg
    const parts = pathname.split("/");

    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return null;

    const publicIdParts = parts.slice(uploadIndex + 1); // includes version and path
    if (publicIdParts[0].startsWith("v")) {
      publicIdParts.shift(); // remove version like v123456
    }

    const lastPart = publicIdParts.pop();
    if (!lastPart) return null;

    const [filenameWithoutExt] = lastPart.split(".");
    publicIdParts.push(filenameWithoutExt);

    return publicIdParts.join("/");
  } catch {
    return null;
  }
}

