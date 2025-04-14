import Sidebar from "@/components/Sidebar";
import CreatePost from "@/components/CreatePost";
import { getCurrentUserId } from "@/actions/user.action";
import { redirect } from "next/navigation";

async function CreatePostPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="hidden lg:block lg:col-span-3">
        <Sidebar />
      </div>
      <div className="lg:col-span-6">
        <CreatePost />
      </div>
    </div>
  );
}
export default CreatePostPage;