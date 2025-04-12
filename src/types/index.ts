import { getPostById } from "@/actions/post.action";

export type Post = Awaited<ReturnType<typeof getPostById>>;
