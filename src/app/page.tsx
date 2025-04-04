import { getPosts } from "@/actions/post.action";
import { getCurrentUserId } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Sidebar from "@/components/Sidebar";
import WhoToFollow from "@/components/WhoToFollow";
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import UnAuthenticatedCard from "@/components/UnAuthenticatedCard";

export default async function Home() {
  const user = await currentUser();
  const { posts, nextCursor } = await getPosts();
  const currentUserId = await getCurrentUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="hidden lg:block lg:col-span-3">
        {user && <Sidebar />}
      </div>

      <div className="lg:col-span-6">
        {user ? (
          <>
            <CreatePost />
            <PostFeed initialPosts={posts} initialCursor={nextCursor} currentUserId={currentUserId} />
          </>
        ) : (
          <UnAuthenticatedCard />
        )}
      </div>

      <div className="hidden lg:block lg:col-span-3 sticky top-20">
        {user && <WhoToFollow />}
      </div>
    </div>
  );
}
