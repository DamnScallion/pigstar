"use client";

import { useState } from 'react';
import { createComment, deletePost, toggleLike, getPostById } from "@/actions/post.action";
import toast from "react-hot-toast";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import ImageGrid from "@/components/ImageGrid";
import PostHeader from "@/components/PostHeader";
import PostInteractions from "@/components/PostInteractions";
import PostCommentSection from "@/components/PostCommentSection";

type Post = Awaited<ReturnType<typeof getPostById>>;

interface PostPageClientProps {
  post: Post;
  currentUserId: string | null;
}

const PostPageClient = ({ post, currentUserId }: PostPageClientProps) => {
  const router = useRouter();
  if (!post) return null;
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === currentUserId));
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState(post.comments);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };
  const truncatedContent = post.content ? (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content) : '';

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === currentUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success && result.comment) {
        toast.success("Comment posted successfully");
        setNewComment("");
        setComments((prev) => [result.comment, ...prev]);
        setShowComments(true);
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <PostHeader
              author={post.author}
              createdAt={post.createdAt}
              currentUserId={currentUserId}
              isDeleting={isDeleting}
              onDelete={handleDeletePost}
            />

            {/* IMAGE GRID WITH DIALOG */}
            {post.images && post.images.length > 0 && (
              <ImageGrid images={post.images} />
            )}

            {post.content && (
              <p className="mt-2 text-sm text-foreground break-words whitespace-pre-line">
                {isExpanded ? post.content : truncatedContent}
                {post.content.length > 100 && (
                  <span className="text-blue-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleContent() }}>
                    {isExpanded ? ' hide' : ' read more'}
                  </span>
                )}
              </p>
            )}

            <PostInteractions
              hasLiked={hasLiked}
              isLiking={isLiking}
              likeCount={optimisticLikes}
              commentCount={comments.length}
              showComments={showComments}
              onLike={handleLike}
              onToggleComments={() => setShowComments((prev) => !prev)}
            />

            {showComments && (
              <PostCommentSection
                comments={comments}
                newComment={newComment}
                isCommenting={isCommenting}
                onCommentChange={setNewComment}
                onSubmit={handleAddComment}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostPageClient;
