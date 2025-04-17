import { getPosts } from "@/features/post/actions";
import { getCurrentUserId } from "@/actions/user.action";
import WhoToFollow from "@/components/WhoToFollow";
import PostFeed from "@/components/PostFeed";
import UnAuthenticatedCard from "@/components/UnAuthenticatedCard";

export default async function Home() {
  const { posts, nextCursor } = await getPosts();
  const currentUserId = await getCurrentUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        {currentUserId ? (
          <PostFeed initialPosts={posts} initialCursor={nextCursor} currentUserId={currentUserId} />
        ) : (
          <UnAuthenticatedCard />
        )}
      </div>

      <div className="hidden lg:block lg:col-span-3 sticky top-20">
        {currentUserId && <WhoToFollow />}
      </div>
    </div>
  );
}
