"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { uploadImageToCloudinary } from "@/lib/cloudinary-client";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleSubmit = async () => {
    if (!content.trim() && selectedFiles.length === 0) return;

    setIsPosting(true);
    setUploadProgress(5);

    try {
      let imageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        const total = selectedFiles.length;
        let completed = 0;

        const uploadPromises = selectedFiles.map(async (file) => {
          const url = await uploadImageToCloudinary(file);
          completed += 1;
          setUploadProgress((completed / total) * 100);
          return url;
        });

        imageUrls = (await Promise.all(uploadPromises)).filter(Boolean);
      }

      const result = await createPost(content, imageUrls);
      if (result?.success) {
        setContent("");
        setSelectedFiles([]);
        setShowImageUpload(false);
        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              id="create-post"
              aria-label="Create new post content"
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {showImageUpload && (
            <div>
              <ImageUpload onChange={setSelectedFiles} disabled={isPosting} />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && selectedFiles.length === 0) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>

          {isPosting && uploadProgress > 0 && (
            <Progress value={uploadProgress} className="h-2 mt-2" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
