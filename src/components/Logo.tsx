"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

const Logo = () => {
  const { theme } = useTheme();

  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src={logoSrc}
        alt="PigStar logo"
        width={32}
        height={32}
        priority
        className="rounded-sm"
      />
      <span className="hidden md:inline text-xl font-bold text-primary font-mono tracking-wider">
        PigStar
      </span>
    </Link>
  );
};

export default Logo;
