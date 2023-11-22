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
        <PageHeader className="relative pb-4 md:pb-8">
          <PageHeaderHeading>신규 게임 생성하기</PageHeaderHeading>
          <PageHeaderDescription>
            스코어 기록을 쉽게 기록해보세요.
          </PageHeaderDescription>
        </PageHeader>
        <Separator className="mb-4 md:mb-8" />
        <CreateForm courses={courses} />
      </main>
    );
  }
};

export default Page;
