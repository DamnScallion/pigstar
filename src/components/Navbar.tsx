import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import CreatePostButton from "./CreatePostButton";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/60 dark:bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Logo + Title */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center: Plus button */}
          <CreatePostButton />

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
