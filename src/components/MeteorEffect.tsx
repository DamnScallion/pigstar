"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Meteors } from "./magicui/meteors";

export const MeteorEffect = () => {
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
      className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Meteors />
    </div>
  );
};
