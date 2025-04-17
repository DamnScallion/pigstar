"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/user.action";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils";

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) return;
    if (!content) throw new Error("Content is required");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    // Create comment and notification in a transaction
    const [comment] = await prisma.$transaction(async (tx) => {
      // Create comment first
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
        include: {
          author: {
            select: {
              name: true,
              id: true,
              username: true,
              image: true,
            },
          },
        },
      });

      // Create notification if commenting on someone else's post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath(`/`);
    return { success: true, comment };
  } catch (error) {
    logger.error("Failed to create comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}