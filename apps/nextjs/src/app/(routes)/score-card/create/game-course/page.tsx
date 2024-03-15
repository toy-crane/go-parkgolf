import React from "react";
import { notFound } from "next/navigation";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { createSupabaseServerClient } from "@/libs/supabase/server";

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
      <PageHeader className="relative pb-4 md:pb-8">
        <PageHeaderHeading>신규 게임 생성하기</PageHeaderHeading>
        <PageHeaderDescription>코스를 설정해 주세요</PageHeaderDescription>
      </PageHeader>
      <PlayerForm gameId={gameId} courses={courses} courseName={courseName} />
    </div>
  );
};

export default Page;
