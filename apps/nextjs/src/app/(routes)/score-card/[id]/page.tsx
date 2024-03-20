import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";

import Header from "./_components/header";
import { ScoreCard } from "./_components/score-card";
import { getGameCourses } from "./fetcher";

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("games")
    .select(`*, golf_courses(*), game_courses(*), game_players(*)`)
    .eq("id", params.id)
    .single();
  if (response.error) {
    return {};
  }
  const data = response.data;
  const golfCourseName = data.golf_courses?.name;
  const startedAt = data.started_at;
  const courseNames = data.game_courses
    .map((course) => `${course.name} 코스`)
    .join(", ");
  const playerNames = data.game_players
    .map((player) => player.nickname)
    .join(", ");
  // // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];
  const title = `${format(
    new Date(startedAt),
    "yyyy-MM-dd",
  )} ${golfCourseName} 경기 스코어`;
  const description = `코스 - ${courseNames} \n 참가자 - ${playerNames}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [...previousImages],
    },
    twitter: {
      title,
      description,
      images: [...previousImages],
    },
    alternates: {
      canonical: `/score-card/${params.id}`,
    },
  };
}

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) => {
  const session = await readUserSession();
  const { gameCourses, startedAt, userId } = await getGameCourses({
    gameId: params.id,
  });
  const isMyGame = session?.user?.id === userId;

  return (
    <>
      <Header gameId={params.id} />
      <div
        className={cn("text-muted-foreground flex justify-end pb-1 text-xs")}
      >
        {startedAt && format(new Date(startedAt), "yyyy-MM-dd")}
      </div>
      <ScoreCard
        gameId={params.id}
        gameCourses={gameCourses}
        selectedTab={searchParams.tab ?? gameCourses[0]?.name}
        isMyGame={isMyGame}
      />
    </>
  );
};

export default Page;
