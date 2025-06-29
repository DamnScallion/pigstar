"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "./user.action";
import { revalidatePath } from "next/cache";
import cloudinary, { extractCloudinaryPublicId } from "@/lib/cloudinary";
import { logger } from "@/lib/utils";

export async function createPost(content: string, imageUrls: string[], mood?: string | null) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const created = await prisma.post.create({
      data: {
        content,
        images: { set: imageUrls },
        authorId: userId,
        mood: mood || null, // Add mood to the post
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


export async function getPosts(cursor?: string, limit: number = 10) {
  try {
    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: {
        createdAt: "desc",
      },
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

    const hasMore = posts.length > limit;
    const trimmedPosts = hasMore ? posts.slice(0, -1) : posts;

    return {
      posts: trimmedPosts,
      nextCursor: hasMore ? trimmedPosts[trimmedPosts.length - 1].id : null,
    };
  } catch (error) {
    logger.error("Error in getPosts", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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

    if (!post) throw new Error("Post not found");

    return post;
  } catch (error) {
    logger.error("Failed to fetch post by ID:", error);
    return null;
  }
}

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
