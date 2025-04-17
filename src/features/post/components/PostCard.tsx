"use client";

import { createComment, toggleLike } from "@/features/post/actions";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";

import PostHeader from './PostHeader';
import PostImageGrid from './PostImageGrid';
import PostInteractions from './PostInteractions';
import PostCommentSection from './PostCommentSection';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
}

const PostCard = ({ post, currentUserId }: PostCardProps) => {
  if (!post) return null;
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === currentUserId));
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
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

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <PostHeader
            author={post.author}
            createdAt={post.createdAt}
            currentUserId={currentUserId}
            isDeleting={false}
            onDelete={async () => { }}
            showLinkButton
            postId={post.id}
          />

          {/* IMAGE GRID WITH DIALOG */}
          {post.images && post.images.length > 0 && (
            <PostImageGrid images={post.images} />
          )}

          {/* POST TEXT CONTENT */}
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

          {/* LIKE & COMMENT BUTTONS */}
          <PostInteractions
            hasLiked={hasLiked}
            isLiking={isLiking}
            likeCount={optimisticLikes}
            commentCount={comments.length}
            showComments={showComments}
            onLike={handleLike}
            onToggleComments={() => setShowComments((prev) => !prev)}
          />

          {/* COMMENTS SECTION */}
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
    </Card >
  );
}

export default PostCard;