import { useState } from "react";
import { cn } from "@/libs/tailwind";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

import { Icons } from "../icons";
import { Button } from "../ui/button";

const Marker = ({
  position,
  text,
  selected = false,
  onClick,
}: {
  position: { lat: number; lng: number };
  selected?: boolean;
  text?: string;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const zIndex = selected || isHovered ? 20 : 10;
  return (
    <>
      <CustomOverlayMap position={position} zIndex={zIndex}>
        <div
          className={cn("group relative flex flex-col items-center")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            variant="ghost"
            className="rounded-full p-0 hover:bg-transparent"
            onClick={onClick}
          >
            <Icons.pin
              className={cn(
                "h-9 w-9  transition-transform duration-150 group-hover:scale-125 group-hover:fill-[#22DC48]",
                selected ? "scale-125 fill-[#22DC48]" : "fill-[#16a34a]",
              )}
            />
          </Button>
          <span
            className={cn(
              "block select-none bg-slate-50 p-1 text-xs text-slate-700",
              "absolute left-[50%] top-[50%] mt-5 translate-x-[-50%]",
              "group-hover:font-extrabold",
              selected && "block text-sm font-bold",
            )}
          >
            {text}
          </span>
        </div>
      </CustomOverlayMap>
    </>
  );
};

export default Marker;
