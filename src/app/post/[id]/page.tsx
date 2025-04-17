import { notFound } from 'next/navigation';
import { getPostById } from '@/features/post/actions';
import { getCurrentUserId } from "@/actions/user.action";
import PostPageClient from './page-client';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) notFound();

  const currentUserId = await getCurrentUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        <PostPageClient post={post} currentUserId={currentUserId} />
      </div>
    </div>
  );
}
