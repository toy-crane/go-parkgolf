import { cn } from "@/libs/tailwind";
import type { Course } from "@/types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

import CourseFillIcon from "../../../../../public/icons/course-fill.svg";
import { Button } from "../../../../components/ui/button";

const Marker = ({
  course,
  onClick,
  isMarked,
}: {
  course: Course;
  isMarked: boolean;
  onClick: () => void;
}) => {
  const { address } = course;

  return (
    <>
      <CustomOverlayMap
        position={{ lat: Number(address[0]?.y), lng: Number(address[0]?.x) }}
        zIndex={10}
      >
        <Button
          variant="ghost"
          className="relative rounded-full p-0 hover:bg-transparent"
          onClick={onClick}
        >
          <CourseFillIcon
            className={cn(isMarked ? "h-12 w-12 brightness-125" : "h-8 w-8")}
          />
        </Button>
      </CustomOverlayMap>
    </>
  );
};

export default Marker;
