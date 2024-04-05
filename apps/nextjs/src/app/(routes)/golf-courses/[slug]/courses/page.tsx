import { Separator } from "@/components/ui/separator";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

import { getCourse } from "../fetcher";
import CourseTable from "./_components/course-table";

const Page = async ({ params }: { params: { slug: string } }) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const golfCourse = await getCourse(params.slug);
  const courseResponse = await supabase
    .from("courses")
    .select("*, holes(*)")
    .order("name")
    .order("hole_number", {
      foreignTable: "holes",
      ascending: true,
    })
    .eq("golf_course_id", golfCourse.id);

  if (courseResponse.error) throw courseResponse.error;
  const courses = courseResponse.data;

  const totalDistance = courses.reduce(
    (acc: number, course) =>
      acc +
      course.holes.reduce(
        (acc: number, hole) => acc + (hole.distance ? hole.distance : 0),
        0,
      ),
    0,
  );
  const hasCourses = courses.length > 0;
  return (
    <div className="min-h-[25vh] space-y-6">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center">
            <h3 className="mr-4 shrink-0 text-base font-semibold">규모</h3>
            <div className="text-muted-foreground text-base">
              {golfCourse.hole_count} 홀
            </div>
          </div>
          {hasCourses && (
            <>
              <div className="flex items-center">
                <h3 className="mr-4 shrink-0 text-base font-semibold">거리</h3>
                <div className="text-muted-foreground text-base">
                  {totalDistance.toLocaleString()} M
                </div>
              </div>
              <div className="flex items-center">
                <h3 className="mr-4 shrink-0 text-base font-semibold">코스</h3>
                <div className="text-muted-foreground text-base">
                  {courses.length}개 코스 (
                  {courses.map((course) => course.name).join(", ")})
                </div>
              </div>
            </>
          )}
        </div>
        <Separator />
      </div>
      <CourseTable courses={courses} golfCourse={golfCourse} />
    </div>
  );
};

export default Page;
