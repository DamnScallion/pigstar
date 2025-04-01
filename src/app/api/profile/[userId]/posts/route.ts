import { getUserPosts } from "@/actions/profile.action";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;

  const { posts, nextCursor } = await getUserPosts(params.userId, cursor);
  return NextResponse.json({ posts, nextCursor });
}
