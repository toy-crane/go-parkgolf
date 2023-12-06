"use server";

import { unstable_noStore } from "next/cache";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export const getGolfCourses = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  unstable_noStore();
  const result = await supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`);
  if (result.error) throw result.error;
  return result.data;
};
