import { cn } from "@/libs/tailwind";
import type { GolfCourse } from "@/types";

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
    <div
      className={cn(
        className,
        "mb-2 flex items-center justify-between gap-1 md:mb-4",
      )}
    >
      <div>
        <h1 className="text-foreground text-balance break-keep text-left text-3xl font-bold">
          {course.name}
        </h1>
        <PageView courseId={course.id} />
      </div>
      <ShareDrawer golfCourse={course} />
    </div>
  );
};

export default Title;
