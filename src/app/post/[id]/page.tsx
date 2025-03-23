import { notFound } from 'next/navigation';
import { getPostById } from '@/actions/post.action';
import { getCurrentUserId } from "@/actions/user.action";
import PostPageClient from './PostPageClient';

async function PostPageServer({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) notFound();

  const currentUserId = await getCurrentUserId();

  return <PostPageClient post={post} currentUserId={currentUserId} />;
}

export default PostPageServer;
