"use server";

import { createSupabaseServerClientReadOnly } from "../supabase/server";

export async function readUserSession() {
  const supabase = await createSupabaseServerClientReadOnly();
  return await supabase.auth.getSession();
}
