"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { Tables } from "@/types/generated";
import snakecaseKeys from "snakecase-keys";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export const createGolfCourseReview = async (
  course: Tables<"golf_course">,
  data: Inputs,
) => {
  const supabase = await createSupabaseServerClient();
  const input = snakecaseKeys(data, { deep: true });
  const response = await supabase.from("golf_course_reviews").upsert(
    {
      golf_course_id: course.id,
      ...input,
    },
    { onConflict: "golf_course_id, user_id" },
  );
  if (response.error) throw response.error;
  revalidatePath("/golf-courses/[slug]", "page");
};
