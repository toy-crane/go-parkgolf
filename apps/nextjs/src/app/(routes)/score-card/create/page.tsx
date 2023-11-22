import React from "react";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import type { DbResult, DbResultOk } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "../../_components/page-header";
import CreateForm from "./create-form";
import Funnel from "./funnel";

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
      <main>
        <Funnel courses={courses} />
        {/* <CreateForm courses={courses} /> */}
      </main>
    );
  }
};

export default Page;
