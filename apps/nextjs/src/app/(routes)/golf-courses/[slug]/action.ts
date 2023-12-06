"use server;";

import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const GetCourseSlugs = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase.from("golf_course").select(`slug`);
  if (response.error) throw response.error;
  return response.data;
};

export const GetCourse = async (slug: string) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`)
    .eq("slug", slug)
    .single();
  if (response.error) throw response.error;
  return response.data;
};
