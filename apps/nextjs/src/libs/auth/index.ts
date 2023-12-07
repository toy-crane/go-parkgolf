"use server";

import { createSupabaseServerClientReadOnly } from "../supabase/server";

export async function readUserSession() {
  const supabase = await createSupabaseServerClientReadOnly();
  const { data } = await supabase.auth.getSession();

  return data.session;
}
