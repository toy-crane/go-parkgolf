import type { MetadataRoute } from "next";
import { fetchCourses } from "@/libs/fetch";

const addPathToBaseURL = (path: string) => `https://www.goparkgolf.app${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allCourses = await fetchCourses();

  const courses = allCourses.map((course) => ({
    url: addPathToBaseURL(`/courses/${course.id}`),
    lastModified: new Date(),
    priority: 0.5,
    changeFrequency: "weekly",
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
