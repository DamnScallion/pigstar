"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <Link href="/" className="flex items-center space-x-2">
      {mounted && (
        <img
          src={logoSrc}
          alt="PigStar logo"
          width={32}
          height={32}
          className="rounded-sm"
        />
      )}
      <span className="hidden md:inline text-xl font-bold text-primary font-mono tracking-wider">
        PigStar
      </span>
    </Link>
  );
};

export default Logo;
