"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/generated";
import { ArrowLeft } from "lucide-react";

const Nav = ({ course }: { course: Tables<"golf_course"> }) => {
  const router = useRouter();

  return (
    <header className="content-grid full h-header flex items-center border-b bg-white">
      <nav className="flex flex-1 items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <span className="text-lg font-semibold">{course.name}</span>
      </nav>
    </header>
  );
};

export default Nav;
