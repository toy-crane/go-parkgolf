"use server";

import { createSupabaseServerClient } from "../supabase/server";

export async function readUserSession() {
  const supabsae = await createSupabaseServerClient();
  return await supabsae.auth.getSession();
}
