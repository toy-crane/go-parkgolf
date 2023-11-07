import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import type { Database } from "@/types/generated";
import type { DbResult, DbResultOk } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const addPathToBaseURL = (path: string) => `https://www.goparkgolf.app${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const query = supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`);
  const result: DbResult<typeof query> = await query;
  if (result.error) {
    throw Error("golf course fetch에 실패하였습니다.");
  }
  const allCourses: DbResultOk<typeof query> = result.data;

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
