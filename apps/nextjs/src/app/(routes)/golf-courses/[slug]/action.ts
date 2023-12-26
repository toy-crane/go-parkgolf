"use server;";

import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

export const GetCourses = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*,contacts(*), operations(*)")
    .returns<GolfCourse[]>();
  if (response.error) throw response.error;
  return response.data;
};

export const GetReviews = async (golfCourseId: string) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_course_reviews")
    .select("*, profiles(*)")
    .eq("golf_course_id", golfCourseId);
  if (response.error) throw response.error;
  return response.data;
};
