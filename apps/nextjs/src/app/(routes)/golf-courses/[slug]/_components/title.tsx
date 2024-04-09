import { cn } from "@/libs/tailwind";
import type { GolfCourse } from "@/types";

import CTA from "../courses/_components/cta";
import PageView from "./page-view";
import ShareDrawer from "./share-drawer";

const Title = ({
  course,
  className,
}: {
  course: GolfCourse;
  className?: string;
}) => {
  return (
    <div className={cn(className, "flex items-center justify-between gap-1")}>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h1 className="text-foreground text-balance break-keep text-left text-3xl font-bold">
            {course.name}
          </h1>
          <ShareDrawer golfCourse={course} />
        </div>

        <PageView courseId={course.id} />
      </div>
      <div className="flex gap-2">
        <CTA courseId={course.id} />
      </div>
    </div>
  );
};

export default Title;
