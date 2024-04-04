"use server";

import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const GetReviews = async (golfCourseId: string) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_course_reviews")
    .select("*, profiles(*)")
    .eq("golf_course_id", golfCourseId);
  if (response.error) throw response.error;
  return response.data;
};
