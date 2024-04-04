import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

const getCourse = async (slug: string) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*, operations(*), contacts(*), lot_number_addresses(*)")
    .eq("publish_status", "completed")
    .eq("slug", decodeURIComponent(slug))
    .returns<GolfCourse[]>()
    .single();
  if (response.error) throw response.error;
  return response.data;
};

export { getCourse };
