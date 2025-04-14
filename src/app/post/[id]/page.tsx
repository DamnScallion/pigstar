import { notFound } from 'next/navigation';
import { getPostById } from '@/actions/post.action';
import { getCurrentUserId } from "@/actions/user.action";
import PostPageClient from './PostPageClient';
import Sidebar from '@/components/Sidebar';
import { redirect } from "next/navigation";

async function PostPageServer({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) notFound();

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) redirect("/");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="hidden lg:block lg:col-span-3">
        <Sidebar />
      </div>
      <div className="lg:col-span-6">
        <PostPageClient post={post} currentUserId={currentUserId} />
      </div>
    </div>
  );
}

export default PostPageServer;
