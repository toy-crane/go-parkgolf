import React from "react";
import { notFound } from "next/navigation";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { createSupabaseServerClient } from "@/libs/supabase/server";

import FormHeader from "../_components/form-header";
import PlayerForm from "./form";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    gameId: string;
  };
}) => {
  const gameId = searchParams?.gameId;

  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .select(`golf_courses(name, courses(*, holes(*)))`)
    .eq("id", gameId)
    .single();

  if (response.error) {
    throw response.error;
  }

  const courses = response.data?.golf_courses?.courses;
  const courseName = response.data?.golf_courses?.name!;

  if (!gameId) {
    notFound();
  }

  return (
    <div>
      <FormHeader
        title="신규 게임 생성하기"
        description="코스를 설정해 주세요"
      />
      <PlayerForm gameId={gameId} courses={courses} courseName={courseName} />
    </div>
  );
};

export default Page;
