"use client";

import { Button } from "./ui/button";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";

interface PostInteractionsProps {
  hasLiked: boolean;
  isLiking: boolean;
  likeCount: number;
  commentCount: number;
  showComments: boolean;
  onLike: () => void;
  onToggleComments: () => void;
}

const PostInteractions = ({
  hasLiked,
  isLiking,
  likeCount,
  commentCount,
  showComments,
  onLike,
  onToggleComments,
}: PostInteractionsProps) => {
  const { user } = useUser();

  return (
    <div className="flex items-center pt-2 space-x-4">
      {user ? (
        <Button
          variant="ghost"
          size="sm"
          disabled={isLiking}
          onClick={onLike}
          className={`text-muted-foreground gap-2 ${hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
        >
          <HeartIcon className={`size-5 ${hasLiked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
            <HeartIcon className="size-5" />
            <span>{likeCount}</span>
          </Button>
        </SignInButton>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground gap-2 hover:text-blue-500"
        onClick={onToggleComments}
      >
        <MessageCircleIcon
          className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`}
        />
        <span>{commentCount}</span>
      </Button>
    </div>
  );
};

export default PostInteractions;
