"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/user.action";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils";
import cloudinary, { extractCloudinaryPublicId } from "@/lib/cloudinary";

export async function deletePost(postId: string) {
  try {
    const userId = await getCurrentUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, images: true }, // include images!
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");

    // 1. Delete associated images from Cloudinary
    for (const imageUrl of post.images) {
      const publicId = extractCloudinaryPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 2. Delete post from DB
    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}