import CreatePostPage from "./page";

function CreatePostLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        <CreatePostPage />
      </div>
    </div>
  );
}
export default CreatePostLayout;