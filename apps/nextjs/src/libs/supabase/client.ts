import { env } from "@/env.mjs";
import type { Database } from "@/types/generated";
import { createBrowserClient } from "@supabase/ssr";

export default function createSupabaseBrowerClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
