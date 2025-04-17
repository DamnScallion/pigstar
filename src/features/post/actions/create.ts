"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/user.action";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils";

export async function createPost(content: string, imageUrls: string[]) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const created = await prisma.post.create({
      data: {
        content,
        images: { set: imageUrls },
        authorId: userId,
      },
    });

    // ❗️Refetch full post with includes
    const post = await prisma.post.findUnique({
      where: { id: created.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    logger.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}