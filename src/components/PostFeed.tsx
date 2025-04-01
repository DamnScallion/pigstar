"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";

type PostFeedProps = {
  initialPosts: any[];
  initialCursor: string | null;
  currentUserId: string | null;
};

export default function PostFeed({ initialPosts, initialCursor, currentUserId }: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(Boolean(initialCursor));
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts?cursor=${cursor}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (e) {
      console.error("Failed to load more posts:", e);
    }
    setLoading(false);
  }, [cursor, hasMore, loading]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore]);

  // ✅ Listen for new-post events from CreatePost
  useEffect(() => {
    const handleNewPost = (e: any) => {
      const newPost = e.detail;
      setPosts((prev) => [newPost, ...prev]);
    };

    window.addEventListener("new-post", handleNewPost);
    return () => window.removeEventListener("new-post", handleNewPost);
  }, []);

  return (
    <div className="space-y-6">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}

      {hasMore && (
        <>
          {loading && [...Array(2)].map((_, i) => (
            <PostSkeleton key={`skeleton-${i}`} />
          ))}
          <div ref={loaderRef} className="h-4" />
        </>
      )}
    </div>
  );
}
