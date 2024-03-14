import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { kv } from "@vercel/kv";

import CourseCard from "../course-card";

export const revalidate = 60;

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
  const popularCourses = await getPopularCourses(5);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*")
    .in(
      "id",
      popularCourses.map((st) => st.id),
    )
    .limit(5);
  if (response.error) {
    console.error(response.error);
  }
  const courses = response.data;
  return (
    <div className="mb-6 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-1">
      {popularCourses.map((course) => {
        const currentCourse = courses?.find((c) => c.id === course.id);
        if (!currentCourse) return null;
        return <CourseCard course={currentCourse} key={currentCourse.id} />;
      })}
    </div>
  );
};

export default Page;
