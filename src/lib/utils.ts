import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Given a Cloudinary image URL, returns a blurred placeholder version.
 * Applies e_blur and q_1 to reduce file size and add heavy blur.
 */
export function getBlurredCloudinaryUrl(imageUrl: string): string {
  if (!imageUrl.includes("/upload/")) return imageUrl;
  return imageUrl.replace("/upload/", "/upload/e_blur:1000,q_1/");
}

/**
 * Given a Cloudinary image URL, adds smart delivery transforms for format and quality.
 */
export function getOptimizedCloudinaryUrl(imageUrl: string): string {
  if (!imageUrl.includes("/upload/")) return imageUrl;
  return imageUrl.replace("/upload/", "/upload/f_auto,q_auto/");
}
