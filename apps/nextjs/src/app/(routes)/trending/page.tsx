import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { kv } from "@vercel/kv";
import { TrendingUp } from "lucide-react";

import CourseCard from "./course-card";

export const revalidate = 600;

function transformToObjects(
  arr: (string | number)[],
): { id: string; count: number }[] {
  const result: { id: string; count: number }[] = [];

  for (let i = 0; i < arr.length; i += 2) {
    result.push({
      id: arr[i] as string,
      count: arr[i + 1] as number,
    });
  }

  return result;
}

async function getPopularCourses(limit: number) {
  try {
    const popularCourses: string[] = await kv.zrange(
      `page:course-detail:views`,
      0,
      limit - 1,
      { rev: true, withScores: true },
    );
    const transformedCourses = transformToObjects(popularCourses);
    return transformedCourses;
  } catch (error) {
    console.error("Error fetching popular stations:", error);
    return [];
  }
}

const Page = async () => {
  const popularCourses = await getPopularCourses(10);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*")
    .in(
      "id",
      popularCourses.map((st) => st.id),
    )
    .limit(10);
  if (response.error) {
    console.error(response.error);
  }
  const courses = response.data;
  return (
    <div className="pb-14">
      <PageHeader className="relative flex flex-row items-center pb-4 md:pb-6">
        <PageHeaderHeading>파크골프 트렌드</PageHeaderHeading>
        <TrendingUp className="ml-1 h-10 w-10" />
      </PageHeader>
      <section className="space-y-4">
        <h2 className="mb-6 text-2xl font-semibold underline decoration-[#22DC48] decoration-4 underline-offset-8 md:text-3xl">
          검색량 많은 파크골프장
        </h2>
        <div className="mb-6 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-1">
          {popularCourses.map((course) => {
            const currentCourse = courses?.find((c) => c.id === course.id);
            if (!currentCourse) return null;
            return (
              <CourseCard
                course={currentCourse}
                key={currentCourse.id}
                pageview={
                  popularCourses.find((c) => c.id === currentCourse.id)
                    ?.count ?? 0
                }
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Page;
