import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";

import BackButton from "./back-button";
import DeleteAlert from "./delete-alert";
import { getGameCourses } from "./fetcher";
import ShareButton from "./share-button";
import { ScoreTabs } from "./tabs";

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
  const { gameCourses, name, startedAt, playerCount, userId } =
    await getGameCourses({
      gameId: params.id,
    });
  const isMyGame = session?.user?.id === userId;

  return (
    <>
      <div className="flex items-center gap-1 pt-2">
        <BackButton />
        <div className="flex-auto">
          <h3
            className={cn(
              "flex break-keep text-lg font-semibold leading-5 tracking-tight",
            )}
          >
            {name ? name : null}
          </h3>
        </div>
        <div>
          {isMyGame && <DeleteAlert gameId={params.id} />}
          <ShareButton />
        </div>
      </div>
      <ScoreTabs
        gameId={params.id}
        gameCourses={gameCourses}
        selectedTab={searchParams.tab ?? gameCourses[0]?.name!}
        playerCount={playerCount}
        isMyGame={isMyGame}
        startedAt={startedAt}
      />
    </>
  );
};

export default Page;
