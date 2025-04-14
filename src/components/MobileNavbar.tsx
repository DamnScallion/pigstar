"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  StarIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      {user && <UserButton />}

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-3 justify-start w-full px-4 py-2"
            >
              <StarIcon className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <SunIcon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild onClick={() => setShowMobileMenu(false)}>
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild onClick={() => setShowMobileMenu(false)}>
                  <Link href="/notifications">
                    <BellIcon className="w-4 h-4" />
                    Notifications
                  </Link>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild onClick={() => setShowMobileMenu(false)}>
                  <Link
                    href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
                      }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button variant="ghost" className="flex items-center gap-3 justify-start w-full" onClick={() => setShowMobileMenu(false)}>
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" className="w-full" onClick={() => setShowMobileMenu(false)}>
                  Login
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
