import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { haversineDistance } from "@/libs/map";
import type { GolfCourse } from "@/types";

import { GetCourses } from "../action";

const NearCourseInfo = async ({ course }: { course: GolfCourse }) => {
  const courses = await GetCourses();
  const allCoursesExcludeMe = courses.filter((c) => c.slug !== course.slug);

  const nearCourses = allCoursesExcludeMe.filter((c) => {
    const courseLat = c.lat ?? 0;
    const courseLng = c.lng ?? 0;
    return (
      haversineDistance(
        course.lat ?? 0,
        course.lng ?? 0,
        courseLat,
        courseLng,
      ) <= 20
    );
  });

  return (
    <section className="space-y-6">
      {nearCourses.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-bold">
              가까운 파크 골프장
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              {nearCourses.map((course) => (
                <Card key={course.id} className="w-full hover:bg-neutral-50">
                  <Link href={`/golf-courses/${course.slug}`}>
                    <CardContent className="space-y-2 px-2 py-3">
                      <div>
                        <div className="text-lg font-bold">{course.name}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.hole_count}홀 <span> · </span>{" "}
                        {course.lot_number_address_name}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NearCourseInfo;
