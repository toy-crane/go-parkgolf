import { notFound } from "next/navigation";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { Course } from "@/types";

import { GetCourseSlugs } from "./action";
import CourseDetail from "./course-detail";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // 지구의 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dlng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlng / 2) *
      Math.sin(dlng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function generateStaticParams() {
  return await GetCourseSlugs();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const supabase = await createSupabaseServerClientReadOnly();
  const query = supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`);
  const result = await query;
  if (result.error) {
    notFound();
  }
  const courses = result.data;
  const currentCourse = courses.filter(
    (course) => course.slug === slug,
  )[0] as Course;
  const allCoursesExcludeMe = courses.filter((course) => course.slug !== slug);

  const nearCourses = allCoursesExcludeMe.filter((course) => {
    const courseLat = course.address[0]?.y ?? 0;
    const courseLng = course.address[0]?.x ?? 0;
    return (
      haversineDistance(
        currentCourse.address[0]?.y ?? 0,
        currentCourse.address[0]?.x ?? 0,
        courseLat,
        courseLng,
      ) <= 20
    );
  });

  return <CourseDetail course={currentCourse} nearCourses={nearCourses} />;
}
