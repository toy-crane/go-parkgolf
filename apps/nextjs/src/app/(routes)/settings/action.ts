"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { Identify, identify } from "@amplitude/analytics-node";

export const deleteSelf = async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.rpc("delete_user");
  await supabase.auth.signOut();
  identify(new Identify(), {
    user_id: undefined,
  });
  revalidatePath("/");
  redirect("/");
};
