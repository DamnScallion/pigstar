import { getPosts } from "@/actions/post.action";
import { getCurrentUserId } from "@/actions/user.action";
import Sidebar from "@/components/Sidebar";
import WhoToFollow from "@/components/WhoToFollow";
import PostFeed from "@/components/PostFeed";
import UnAuthenticatedCard from "@/components/UnAuthenticatedCard";

export default async function Home() {
  const { posts, nextCursor } = await getPosts();
  const currentUserId = await getCurrentUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="hidden lg:block lg:col-span-3">
        {currentUserId && <Sidebar />}
      </div>

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
