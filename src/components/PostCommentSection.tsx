"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { LogInIcon, SendIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
}

interface PostCommentSectionProps {
  comments: Comment[];
  newComment: string;
  isCommenting: boolean;
  onCommentChange: (val: string) => void;
  onSubmit: () => void;
}

const PostCommentSection = ({
  comments,
  newComment,
  isCommenting,
  onCommentChange,
  onSubmit,
}: PostCommentSectionProps) => {
  const { user } = useUser();

  return (
    <div className="space-y-4 pt-4 border-t">
      {user ? (
        <div className="flex space-x-3">
          <Avatar className="size-8 flex-shrink-0">
            <AvatarImage src={user.imageUrl || "/avatar.png"} />
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={onSubmit}
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
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar className="size-8 flex-shrink-0">
              <AvatarImage src={comment.author.image ?? "/avatar.png"} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <span className="text-sm text-muted-foreground">@{comment.author.username}</span>
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
  );
};

export default PostCommentSection;
