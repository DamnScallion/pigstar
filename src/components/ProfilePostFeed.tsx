"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/PostSkeleton";
import { logger } from "@/lib/utils";

type ProfilePostFeedProps = {
  initialPosts: any[];
  initialCursor: string | null;
  userId: string;
  currentUserId: string | null;
  type: "posts" | "likes";
};

export default function ProfilePostFeed({
  initialPosts,
  initialCursor,
  userId,
  currentUserId,
  type,
}: ProfilePostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(!!initialCursor);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${userId}/${type}?cursor=${cursor}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (e) {
      logger.error("Failed to load more", e);
    }
    setLoading(false);
  }, [cursor, hasMore, loading, type, userId]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });

    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore]);

  return (
    <div className="space-y-6">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}

      {loading &&
        [...Array(2)].map((_, i) => <PostSkeleton key={`skeleton-${i}`} />)}

      {hasMore && <div ref={loaderRef} className="h-4" />}
    </div>
  );
}
