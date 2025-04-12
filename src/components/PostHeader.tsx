"use client";

import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { formatDistanceToNow } from "date-fns";

interface PostHeaderProps {
  author: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  currentUserId: string | null;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
}


const PostHeader = ({
  author,
  createdAt,
  currentUserId,
  isDeleting,
  onDelete,
}: PostHeaderProps) => {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <Link href={`/profile/${author.username}`}>
        <Avatar className="size-8 sm:w-10 sm:h-10">
          <AvatarImage src={author.image ?? "/avatar.png"} />
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 truncate">
              <Link href={`/profile/${author.username}`} className="font-semibold truncate">
                {author.name}
              </Link>
              <Link
                href={`/profile/${author.username}`}
                className="text-sm text-muted-foreground truncate"
              >
                @{author.username}
              </Link>
            </div>
            {currentUserId === author.id && (
              <DeleteAlertDialog isDeleting={isDeleting} onDelete={onDelete} />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt))} ago
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
