import { getPosts } from "@/actions/post.action";
import { getCurrentUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import Sidebar from '@/components/Sidebar';

import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const currentUserId = await getCurrentUserId();

  console.log({ posts });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="hidden lg:block lg:col-span-3">
        <Sidebar />
      </div>
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}

        <div className="space-y-6">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>

      </div>

      <div className="hidden lg:block lg:col-span-3 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}