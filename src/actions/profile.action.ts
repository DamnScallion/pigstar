"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "./user.action";
import { logger } from "@/lib/utils";

export async function getProfileByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    logger.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}


export async function getUserPosts(userId: string, cursor?: string, limit = 10) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, username: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const hasMore = posts.length > limit;
    const trimmed = hasMore ? posts.slice(0, -1) : posts;

    return { posts: trimmed, nextCursor: hasMore ? trimmed[trimmed.length - 1].id : null };
  } catch (error) {
    logger.error("Error fetching user posts:", error);
    throw new Error("Failed to fetch user posts");
  }
}

export async function getUserLikedPosts(userId: string, cursor?: string, limit = 10) {
  try {
    const liked = await prisma.post.findMany({
      where: { likes: { some: { userId } } },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, username: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const hasMore = liked.length > limit;
    const trimmed = hasMore ? liked.slice(0, -1) : liked;

    return { posts: trimmed, nextCursor: hasMore ? trimmed[trimmed.length - 1].id : null };
  } catch (error) {
    logger.error("Error fetching liked posts:", error);
    throw new Error("Failed to fetch liked posts");
  }
}


export async function updateProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        bio,
        location,
        website,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    logger.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    logger.error("Error checking follow status:", error);
    return false;
  }
}