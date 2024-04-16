import { env } from "@/env.mjs";
import { createSupabaseServerClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic"; // defaults to force-static

const ZIGSAW_API_ENDPOINT = "https://api.jigsawstack.com/v1/web/scrape";
const getScrapeUrl = (page: number) =>
  `http://www.kpga7330.com/info/club.php?bmode=list&page=20&page=${page}`;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const supabase = await createSupabaseServerClient();

  const pageRequests = Array.from({ length: 20 }, (_, i) => i + 1).map((page) =>
    fetch(ZIGSAW_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ZIGSAW_API_KEY,
      },
      body: JSON.stringify({
        url: getScrapeUrl(page),
        elements: [{ selector: ".tablevline tr:not(:first-child)" }],
      }),
    })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject("Scrape failed for page: " + page),
      )
      .then((result) =>
        result.data[0].results.map((r: any) => ({
          name: r.text.split("\n")[1].trim(),
          address: r.text.split("\n")[2].trim(),
          hole_count: Number(r.text.split("\n")[4].trim()),
        })),
      )
      .catch((error) => console.error(error)),
  );

  const results = await Promise.allSettled(pageRequests);
  const allCourses = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  ) as { name: string; address: string; hole_count: number }[];

  const result = await supabase
    .from("scraped_golf_courses")
    .upsert(allCourses, {
      onConflict: "name, address, hole_count",
      ignoreDuplicates: true,
    });

  if (result.error) {
    return Response.json({ status: 500, error: result.error });
  }

  return Response.json({ status: 200, result, allCourses });
}
