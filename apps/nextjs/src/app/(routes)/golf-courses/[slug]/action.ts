"use server";

import {
  createSupabaseServerClient,
  createSupabaseServerClientReadOnly,
} from "@/libs/supabase/server";

export const GetReviews = async (golfCourseId: string) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_course_reviews")
    .select("*, profiles(*)")
    .eq("golf_course_id", golfCourseId);
  if (response.error) throw response.error;
  return response.data;
};

export const createGolfCourseQnA = async (data: {
  golfCourseId: string;
  text: string;
  parentId: string;
  level: number;
}) => {
  const { golfCourseId, text, parentId, level } = data;
  const supabase = await createSupabaseServerClient();
  const response = await supabase.from("golf_course_qnas").insert({
    golf_course_id: golfCourseId,
    parent_id: parentId,
    content: text,
    level: level + 1,
  });
  if (response.error) {
    throw response.error;
  }
};
