"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StarField } from "./StarField";

export const SkyBackground = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    setVisible(resolved === "dark");
  }, [theme, systemTheme]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"
        } bg-gradient-to-b from-[#080e21] to-[#1b2735]`}
    >
      <StarField count={999} clusters={9} />
    </div>
  );
};
