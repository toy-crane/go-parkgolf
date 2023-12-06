"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import { generateFormUrl } from "@/libs/google-form";
import type { Course } from "@/types";
import { ArrowLeft, Pencil, Share2 } from "lucide-react";

const Nav = ({ course }: { course: Course }) => {
  const router = useRouter();
  const { track } = useAmplitude();
  const { toast } = useToast();

  return (
    <header className="content-grid full h-header flex items-center border-b bg-white">
      <nav className="flex flex-1 items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <Button
            variant={"ghost"}
            size="icon"
            asChild
            onClick={() => track("modify button clicked")}
          >
            <a
              href={generateFormUrl(course.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pencil size={24} />
            </a>
          </Button>
          <Button
            variant={"ghost"}
            size="icon"
            onClick={async () => {
              await navigator.clipboard.writeText(`${window.location.href}`);
              toast({
                title: "주소가 복사되었습니다",
                description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
                duration: 1000,
              });
              track("share button clicked");
            }}
          >
            <Share2 size={24} />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
