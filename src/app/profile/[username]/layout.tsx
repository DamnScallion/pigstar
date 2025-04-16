import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import { getCurrentUserId } from "@/actions/user.action";
import ProfilePage from './page';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

async function ProfileLayout({ params }: { params: { username: string } }) {
  const profileUser = await getProfileByUsername(params.username);

  if (!profileUser) notFound();

  const [postsData, likedPostsData, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(profileUser.id),
    getUserLikedPosts(profileUser.id),
    isFollowing(profileUser.id),
  ]);
  const currentUserId = await getCurrentUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        <ProfilePage
          user={profileUser}
          posts={postsData}
          likedPosts={likedPostsData}
          isFollowing={isCurrentUserFollowing}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
export default ProfileLayout;