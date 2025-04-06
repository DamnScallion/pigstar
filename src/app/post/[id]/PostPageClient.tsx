"use client";

import { useState } from 'react';
import { createComment, deletePost, toggleLike, getPostById } from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Card, CardContent } from "../../../components/ui/card";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { DeleteAlertDialog } from "../../../components/DeleteAlertDialog";
import { Button } from "../../../components/ui/button";
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon, ArrowLeftIcon } from "lucide-react";
import { Textarea } from "../../../components/ui/textarea";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";
import 'swiper/swiper-bundle.css';

type Post = Awaited<ReturnType<typeof getPostById>>;

interface PostPageClientProps {
  post: Post;
  currentUserId: string | null;
}

const PostPageClient = ({ post, currentUserId }: PostPageClientProps) => {
  const router = useRouter();
  if (!post) return null;
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === currentUserId));
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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
        // Add the new comment to the top of the comments list
        post.comments.unshift(result.comment);
        setShowComments(true); // Ensure comments are visible
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
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeftIcon className="size-5" />
          Back
        </Button>
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar className="size-8 sm:w-10 sm:h-10">
                  <AvatarImage src={post.author.image ?? "/avatar.png"} />
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 truncate">
                      <Link
                        href={`/profile/${post.author.username}`}
                        className="font-semibold truncate"
                      >
                        {post.author.name}
                      </Link>
                      <Link
                        href={`/profile/${post.author.username}`}
                        className="text-sm text-muted-foreground truncate"
                      >
                        @{post.author.username}
                      </Link>
                    </div>
                    {currentUserId === post.author.id && (
                      <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost} />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </span>
                </div>
              </div>
            </div>

            {/* IMAGE GRID WITH DIALOG */}
            {post.images && post.images.length > 0 && (
              <>
                <div
                  className={`grid gap-4 ${post.images.length === 1
                    ? 'grid-cols-1'
                    : post.images.length === 2
                      ? 'grid-cols-2'
                      : post.images.length === 3
                        ? 'grid-cols-3 grid-rows-2'
                        : post.images.length === 4
                          ? 'grid-cols-2'
                          : post.images.length === 5
                            ? 'grid-cols-4 grid-rows-2'
                            : post.images.length === 6
                              ? 'grid-cols-3 grid-rows-3'
                              : 'grid-cols-3'
                    }`}
                >
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`rounded-lg overflow-hidden cursor-pointer ${(post.images.length === 3 && index === 0) ||
                        (post.images.length === 5 && index === 0) ||
                        (post.images.length === 6 && index === 0)
                        ? 'row-span-2 col-span-2'
                        : ''
                        }`}
                    >
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: '1 / 1' }}
                      />
                    </div>
                  ))}
                </div>

                <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
                  <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
                    <DialogHeader className='flex justify-between items-center mb-4'>
                      <DialogTitle className="text-secondary">View Image</DialogTitle>
                    </DialogHeader>
                    {selectedImageIndex !== null && (
                      <Swiper
                        spaceBetween={10}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        initialSlide={selectedImageIndex}
                        className="w-full h-full justify-center items-center"
                      >
                        {post.images.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <img
                              src={img}
                              alt={`Post image ${idx + 1}`}
                              className="w-full h-auto max-h-[80vh] object-contain"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}

            {post.content && (
              <p className="mt-2 text-sm text-foreground break-words whitespace-pre-line">
                {post.content}
              </p>
            )}

            <div className="flex items-center pt-2 space-x-4">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground gap-2 ${hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                    }`}
                  onClick={handleLike}
                >
                  {hasLiked ? (
                    <HeartIcon className="size-5 fill-current" />
                  ) : (
                    <HeartIcon className="size-5" />
                  )}
                  <span>{optimisticLikes}</span>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                    <HeartIcon className="size-5" />
                    <span>{optimisticLikes}</span>
                  </Button>
                </SignInButton>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground gap-2 hover:text-blue-500"
                onClick={() => setShowComments((prev) => !prev)}
              >
                <MessageCircleIcon
                  className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`}
                />
                <span>{post.comments.length}</span>
              </Button>
            </div>

            {showComments && (
              <div className="space-y-4 pt-4 border-t">
                {user ? (
                  <div className="flex space-x-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        id="newComment"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          className="flex items-center gap-2"
                          disabled={!newComment.trim() || isCommenting}
                        >
                          {isCommenting ? (
                            "Posting..."
                          ) : (
                            <>
                              <SendIcon className="size-4" />
                              Comment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="gap-2">
                        <LogInIcon className="size-4" />
                        Sign in to comment
                      </Button>
                    </SignInButton>
                  </div>
                )}
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="size-8 flex-shrink-0">
                        <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-sm">{comment.author.name}</span>
                          <span className="text-sm text-muted-foreground">
                            @{comment.author.username}
                          </span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-sm break-all">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostPageClient;
