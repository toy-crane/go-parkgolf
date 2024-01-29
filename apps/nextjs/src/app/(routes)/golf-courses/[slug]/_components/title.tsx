"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import { cn } from "@/libs/tailwind";
import type { GolfCourse } from "@/types";
import { Share2 } from "lucide-react";

const Title = ({
  course,
  className,
}: {
  course: GolfCourse;
  className?: string;
}) => {
  const { toast } = useToast();
  const { track } = useAmplitude();
  return (
    <div
      className={cn(className, "mb-4 flex items-center justify-between gap-1")}
    >
      <h1 className="text-foreground text-balance break-keep text-left text-3xl font-bold">
        {course.name}
      </h1>
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
  );
};

export default Title;
