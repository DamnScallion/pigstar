import { notFound } from 'next/navigation';
import { getPostById } from '@/actions/post.action';
import { getCurrentUserId } from "@/actions/user.action";
import PostPage from './page';

async function PostLayout({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) notFound();

  const currentUserId = await getCurrentUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        <PostPage post={post} currentUserId={currentUserId} />
      </div>
    </div>
  );
}

export default PostLayout;
