import { NextResponse } from "next/server";
import { getPosts } from "@/features/post/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;

  const { posts, nextCursor } = await getPosts(cursor);
  return NextResponse.json({ posts, nextCursor });
}
