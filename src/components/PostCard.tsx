"use client";

import { createComment, getPosts, toggleLike } from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts["posts"][number];

function PostCard({ post, currentUserId }: { post: Post; currentUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    Array.isArray(post.likes) && post.likes.some((like) => like.userId === currentUserId)
  );

  const [optimisticLikes, setOptimisticLikes] = useState(post._count?.likes ?? 0);

  const [showComments, setShowComments] = useState(false);
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


  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* POST AUTHOR AVATAR */}
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            {/* POST HEADER */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                {/* First line: name, username, delete button */}
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
                </div>

                {/* Second line: post createdAt */}
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </span>
              </div>
            </div>
          </div>

          {/* POST IMAGE */}
          {post.images && post.images.length > 0 && (
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
                <Link key={index} href={`/post/${post.id}`} legacyBehavior>
                  <div
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
                </Link>
              ))}
            </div>
          )}

          {/* POST TEXT CONTENT */}
          {post.content && (
            <Link href={`/post/${post.id}`} legacyBehavior>
              <p className="mt-2 text-sm text-foreground break-words whitespace-pre-line cursor-pointer">
                {isExpanded ? post.content : truncatedContent}
                {post.content.length > 100 && (
                  <span className="text-blue-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleContent() }}>
                    {isExpanded ? ' hide' : ' read more'}
                  </span>
                )}
              </p>
            </Link>
          )}

          {/* LIKE & COMMENT BUTTONS */}
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

          {/* COMMENTS SECTION */}
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
    </Card >
  );
}

export default PostCard;