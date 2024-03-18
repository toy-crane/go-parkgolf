"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        router.replace("/my-games");
      }}
    >
      <ArrowLeft size={24} />
    </Button>
  );
};
export default BackButton;
