"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Nav = () => {
  const router = useRouter();

  return (
    <header className="content-grid h-header z-header fixed top-0 w-full border-b bg-white">
      <nav className="md:content full flex w-full flex-1 items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
      </nav>
    </header>
  );
};

export default Nav;
