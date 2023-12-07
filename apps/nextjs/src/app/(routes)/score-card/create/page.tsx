import React from "react";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

import Funnel from "./funnel";

const Page = async () => {
  const supabase = await createSupabaseServerClientReadOnly();

  const session = await readUserSession();

  if (!session) {
    return redirect("/login");
  }

  const query = supabase.from("golf_course").select(`*`);
  const result = await query;

  if (result.data) {
    const courses = result.data;

    return (
      <main>
        <Funnel courses={courses} />
      </main>
    );
  }
};

export default Page;
