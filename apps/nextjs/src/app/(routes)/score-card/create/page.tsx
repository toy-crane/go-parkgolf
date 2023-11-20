import React from "react";
import { cookies } from "next/headers";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import type { DbResult, DbResultOk } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import CreateForm from "./create-form";

const Page = async () => {
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient<Database>(
    {
      cookies: () => cookieStore,
    },
    { options: { global: { fetch: createFetch({ cache: "force-cache" }) } } },
  );

  const query = supabase.from("golf_course").select(`*`);
  const result: DbResult<typeof query> = await query;

  if (result.data) {
    const courses: DbResultOk<typeof query> = result.data;

    return (
      <main className="mt-12">
        <h1 className="mb-4 text-4xl font-medium">신규 게임 생성하기</h1>
        <CreateForm courses={courses} />
      </main>
    );
  }
};

export default Page;
