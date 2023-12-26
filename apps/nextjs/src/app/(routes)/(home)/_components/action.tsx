"use server";

import { unstable_noStore } from "next/cache";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

export const getCourses = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  unstable_noStore();
  const result = await supabase
    .from("golf_courses")
    .select(`*, contacts(*), operations(*), lot_number_addresses(*)`)
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
