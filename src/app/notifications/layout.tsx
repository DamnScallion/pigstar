import NotificationsPage from "./page";

function NotificationsLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      <div className="lg:col-span-6">
        <NotificationsPage />
      </div>
    </div>
  );
}
export default NotificationsLayout;