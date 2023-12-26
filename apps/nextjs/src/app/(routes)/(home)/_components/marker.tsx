import { cn } from "@/libs/tailwind";
import type { GolfCourse } from "@/types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

import CourseFillIcon from "../../../../../public/icons/course-fill.svg";
import { Button } from "../../../../components/ui/button";

const Marker = ({
  course,
  onClick,
  isMarked,
}: {
  course: GolfCourse;
  isMarked: boolean;
  onClick: () => void;
}) => {
  return (
    <>
      <CustomOverlayMap
        position={{ lat: Number(course.lat), lng: Number(course.lng) }}
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
