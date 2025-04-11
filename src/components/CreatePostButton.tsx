"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreatePostButton = () => {
  const pathname = usePathname();

  // Hide button if path includes '/createpost'
  if (pathname.includes("/createpost")) return null;

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <Link href="/createpost">
        <Button size="icon">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default CreatePostButton;
