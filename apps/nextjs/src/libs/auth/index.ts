"use server";

import { createSupabaseServerClientReadOnly } from "../supabase/server";

export async function readUserSession() {
  const supabase = createSupabaseServerClientReadOnly();
  return await supabase.auth.getSession();
}
