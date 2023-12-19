"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const THRESHOLD_LENGTH = 100;

const ReviewContent = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverflown = text.length > THRESHOLD_LENGTH;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col gap-1">
      <p
        className={`line-clamp-2 break-words text-sm ${
          isExpanded ? "line-clamp-none" : ""
        }`}
        ref={textRef}
      >
        {text}
      </p>
      <div className="flex justify-end">
        {isOverflown && (
          <Button size="sm" variant="ghost" onClick={toggleExpanded}>
            {isExpanded ? (
              <>
                <span>접기</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>더보기</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReviewContent;
