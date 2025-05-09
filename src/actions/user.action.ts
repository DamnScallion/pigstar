"use server";

import { prisma } from "@/lib/prisma";
import { auth, User } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils";

export async function syncUser(user: User) {
  const userId = user.id;

  if (!userId || !user) return;

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (existingUser) {
    const hasChanges =
      existingUser.username !== (user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]) ||
      existingUser.email !== user.emailAddresses[0].emailAddress ||
      existingUser.image !== user.imageUrl;

    if (hasChanges) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
          email: user.emailAddresses[0].emailAddress,
          image: user.imageUrl,
        },
      });
    }
    return existingUser;
  }

  const dbUser = await prisma.user.create({
    data: {
      clerkId: userId,
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      image: user.imageUrl,
    },
  });

  return dbUser; 
}

export async function getUserByClerkId(clerkId: string) {
	return prisma.user.findUnique({
		where: {
			clerkId,
		},
		include: {
			_count: {
				select: {
					followers: true,
					following: true,
					posts: true,
				},
			},
		},
	});
}

export async function getCurrentUserId() {
	const { userId: clerkId } = await auth();
	if (!clerkId) return null;

	const user = await getUserByClerkId(clerkId);

	if (!user) throw new Error("User not found");

	return user.id;
}

export async function getCurrentUser() {
	const { userId: clerkId } = await auth();
	if (!clerkId) return null;

	const user = await getUserByClerkId(clerkId);

	if (!user) throw new Error("User not found");

	return user;
}

export async function getRandomUsers() {
	try {
		const userId = await getCurrentUserId();

		if (!userId) return [];

		// get 3 random users exclude ourselves & users that we already follow
		const randomUsers = await prisma.user.findMany({
			where: {
				AND: [
					{ NOT: { id: userId } },
					{
						NOT: {
							followers: {
								some: {
									followerId: userId,
								},
							},
						},
					},
				],
			},
			select: {
				id: true,
				name: true,
				username: true,
				image: true,
				_count: {
					select: {
						followers: true,
					},
				},
			},
			take: 3,
		});

		return randomUsers;
	} catch (error) {
		logger.error("Error fetching random users", error);
		return [];
	}
}

export async function toggleFollow(targetUserId: string) {
	try {
		const userId = await getCurrentUserId();

		if (!userId) return;

		if (userId === targetUserId) throw new Error("You cannot follow yourself");

		const existingFollow = await prisma.follows.findUnique({
			where: {
				followerId_followingId: {
					followerId: userId,
					followingId: targetUserId,
				},
			},
		});

		if (existingFollow) {
			// unfollow
			await prisma.follows.delete({
				where: {
					followerId_followingId: {
						followerId: userId,
						followingId: targetUserId,
					},
				},
			});
		} else {
			// follow
			await prisma.$transaction([
				prisma.follows.create({
					data: {
						followerId: userId,
						followingId: targetUserId,
					},
				}),

				prisma.notification.create({
					data: {
						type: "FOLLOW",
						userId: targetUserId, // user being followed
						creatorId: userId, // user following
					},
				}),
			]);
		}

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		logger.error("Error in toggleFollow", error);
		return { success: false, error: "Error toggling follow" };
	}
}
