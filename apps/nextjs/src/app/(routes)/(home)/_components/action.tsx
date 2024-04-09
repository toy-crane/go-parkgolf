"use server";

import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

export const getCourses = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const result = await supabase
    .from("golf_courses")
    .select(`*`)
    .eq("publish_status", "completed")
    .returns<GolfCourse[]>();
  if (result.error) throw result.error;
  return result.data;
};

export const getGolfCourseReviews = async (courseId?: string) => {
  const supabase = await createSupabaseServerClientReadOnly();
  if (!courseId) return [];
  const result = await supabase
    .from("golf_course_reviews")
    .select("*")
    .eq("golf_course_id", courseId);
  if (result.error) throw result.error;
  return result.data;
};
