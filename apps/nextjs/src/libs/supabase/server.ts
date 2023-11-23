import type { cookies } from "next/headers";
import { env } from "@/env.mjs";
import type { Database } from "@/types/generated";
import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set(name, value, options);
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set(name, "", options);
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
