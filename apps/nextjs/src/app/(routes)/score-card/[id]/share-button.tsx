"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/libs/tailwind";
import { Share2 } from "lucide-react";

const ShareButton = () => {
  const { toast } = useToast();
  return (
    <Button
      variant={"ghost"}
      className="h-9 w-9"
      size="icon"
      onClick={async () => {
        await navigator.clipboard.writeText(`${window.location.href}`);
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[256px] md:top-4 md:right-4",
          ),
          title: "주소가 복사되었습니다",
          description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
          duration: 1000,
        });
      }}
    >
      <Share2 />
    </Button>
  );
};

export default ShareButton;
