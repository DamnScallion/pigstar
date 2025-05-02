"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Meteors } from "./magicui/meteors";

export const MeteorEffect = () => {
  const { theme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resolvedTheme =
    theme === "system" ? systemTheme : theme;

  if (!isClient || resolvedTheme !== "dark") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-0 animate-fade-in"
    >
      <Meteors />
    </div>
  );
};

