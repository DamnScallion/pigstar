import { getPostById } from "@/features/post/actions";

export type Post = Awaited<ReturnType<typeof getPostById>>;
