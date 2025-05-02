"use client";

import { useEffect, useState } from "react";

interface StarFieldProps {
  count?: number; // Total number of stars
  clusters?: number; // How many spans to split into
}

export const StarField = ({ count = 800, clusters = 8 }: StarFieldProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const starsPerCluster = Math.floor(count / clusters);

  const clusterSpans = Array.from({ length: clusters }, (_, clusterIndex) => {
    const shadows = Array.from({ length: starsPerCluster }, () => {
      const x = Math.floor(Math.random() * window.innerWidth);
      const y = Math.floor(Math.random() * window.innerHeight);
      const brightness = Math.random() * 0.8 + 0.2;
      return `${x}px ${y}px rgba(255, 255, 255, ${brightness.toFixed(2)})`;
    });

    const delay = Math.random() * 5; // between 0–5s

    return (
      <span
        key={clusterIndex}
        className="absolute top-0 left-0 w-[1px] h-[1px] pointer-events-none animate-twinkle"
        style={{
          boxShadow: shadows.join(", "),
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return <>{clusterSpans}</>;
};
