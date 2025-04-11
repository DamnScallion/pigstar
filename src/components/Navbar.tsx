import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import CreatePostButton from "./CreatePostButton";
import Logo from "./Logo";

const Navbar = async () => {
  const user = await currentUser();
  if (user) await syncUser();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Logo + Title */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center: Plus button */}
          {user && <CreatePostButton />}

          {/* Right: Navigation */}
          <div className="flex items-center gap-4">
            <DesktopNavbar />
            <MobileNavbar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
