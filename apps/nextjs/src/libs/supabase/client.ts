import { env } from "@/env.mjs";
import { createBrowserClient } from "@supabase/ssr";

export default function createSupabaseBrowerClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
