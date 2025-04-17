import CreatePostPageClient from "./page-client";

export default function CreatePostPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        <CreatePostPageClient />
      </div>
    </div>
  );
}