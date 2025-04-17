"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/user.action";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils";

export async function toggleLike(postId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
            prisma.notification.create({
              data: {
                type: "LIKE",
                userId: post.authorId, // recipient (post author)
                creatorId: userId, // person who liked
                postId,
              },
            }),
          ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    logger.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}