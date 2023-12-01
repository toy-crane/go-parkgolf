import React from "react";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { DbResult, DbResultOk } from "@/types/supabase-helper";

import Funnel from "./funnel";

const Page = async () => {
  const supabase = await createSupabaseServerClient();

  const query = supabase.from("golf_course").select(`*`);
  const result: DbResult<typeof query> = await query;

  if (result.data) {
    const courses: DbResultOk<typeof query> = result.data;

    return (
      <main>
        <Funnel courses={courses} />
      </main>
    );
  }
};

export default Page;
