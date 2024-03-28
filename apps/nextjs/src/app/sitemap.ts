import type { MetadataRoute } from "next";
import { districts, regions } from "@/constants/address";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

const addPathToBaseURL = (path: string) => `https://www.goparkgolf.app${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServerClientReadOnly();
  const courseResponse = await supabase.from("golf_courses").select(`slug`);
  if (courseResponse.error) {
    throw Error("golf course fetch에 실패하였습니다.");
  }

  const allCourses = courseResponse.data;

  const regionsUrls = regions.map((region) => ({
    url: addPathToBaseURL(`/gc/${encodeURIComponent(region)}`),
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const districtsUrls = districts.map((district) => ({
    url: addPathToBaseURL(
      `/gc/${encodeURIComponent(district.region)}/${encodeURIComponent(
        district.district,
      )}`,
    ),
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

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
    {
      url: addPathToBaseURL("/trending/hot"),
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },
    {
      url: addPathToBaseURL("/trending/largest"),
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },
    {
      url: addPathToBaseURL("/score-card"),
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "monthly",
    },
    ...courses,
    ...regionsUrls,
    ...districtsUrls,
  ];
}
