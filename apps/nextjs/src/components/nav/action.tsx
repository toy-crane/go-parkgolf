"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "../ui/button";

const ActionNav = () => {
  const router = useRouter();
  return (
    <header className="content-grid z-header h-header fixed w-full border-b bg-white">
      <nav className="flex items-center justify-between">
        <Button onClick={() => router.back()} variant="ghost">
          <ChevronLeft />
        </Button>
      </nav>
    </header>
  );
};

export default ActionNav;
