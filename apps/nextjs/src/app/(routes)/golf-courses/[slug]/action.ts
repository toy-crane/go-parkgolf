"use server;";

import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const GetCourses = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`);
  if (response.error) throw response.error;
  return response.data;
};
