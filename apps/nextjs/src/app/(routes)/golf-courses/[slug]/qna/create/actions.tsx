"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export const createGolfCourseQnA = async (courseId: string, data: Inputs) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase.from("golf_course_qnas").insert({
    golf_course_id: courseId,
    content: data.text,
  });
  if (response.error) throw response.error;
  revalidatePath("/golf-courses/[slug]", "page");
};
