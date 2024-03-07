import { env } from "@/env.mjs";
import { createSupabaseServerClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const golfCourseResponse = await supabase.from("golf_courses").select("slug");
  if (golfCourseResponse.error) {
    return Response.json({ error: golfCourseResponse.error, status: 500 });
  }
  const golfCourseSlugs = golfCourseResponse.data;
  const allUrls = golfCourseSlugs.map(
    (course) => `https://www.goparkgolf.app/golf-courses/${course.slug}`,
  );

  const response = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      host: "www.goparkgolf.app",
      key: env.INDEX_NOW_KEY,
      keyLocation:
        "https://www.goparkgolf.app/1ad4735de25f4f7ea09286e01606667d.txt",
      urlList: [
        ...allUrls,
        "https://www.goparkgolf.app",
        "https://www.goparkgolf.app/trending",
      ],
    }),
  });

  if (!response.ok) {
    return Response.json({ error: "IndexNow failed", status: 500 });
  }

  return Response.json({ status: 200, allUrls });
}
