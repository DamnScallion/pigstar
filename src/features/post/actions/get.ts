"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils";

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