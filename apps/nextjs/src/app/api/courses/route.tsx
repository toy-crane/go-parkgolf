import { error } from "console";
import { env } from "@/env.mjs";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { Tables } from "@/types/generated";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic"; // defaults to force-static

export type Course = Omit<
  Tables<"courses">,
  "created_at" | "golf_course_id" | "id"
> & {
  holes: Omit<Tables<"holes">, "created_at" | "course_id" | "id">[];
};

interface RequestBody {
  golf_course_id: string;
  courses: Course[];
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const params = (await request.json()) as RequestBody;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("insert_courses", {
    data: {
      golf_course_id: params.golf_course_id,
      courses: params.courses,
    },
  });
  if (error) return Response.json({ error, status: 500 });

  return Response.json({ params, status: 200 });
}
