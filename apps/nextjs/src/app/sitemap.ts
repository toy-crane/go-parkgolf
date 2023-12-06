import type { MetadataRoute } from "next";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

const addPathToBaseURL = (path: string) => `https://www.goparkgolf.app${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServerClientReadOnly();
  const query = supabase.from("golf_course").select(`slug`);
  const result = await query;
  if (result.error) {
    throw Error("golf course fetch에 실패하였습니다.");
  }
  const allCourses = result.data;

  const courses = allCourses.map((course) => ({
    url: addPathToBaseURL(`/golf-courses/${encodeURIComponent(course.slug)}`),
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: "daily" as const,
  }));

  return [
    {
      url: addPathToBaseURL("/"),
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },
    ...courses,
  ];
}
