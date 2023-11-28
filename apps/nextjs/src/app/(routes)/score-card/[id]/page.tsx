import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/libs/supabase/server";
import type { Tables } from "@/types/supabase-helper";

import type { Player, Score } from "./columns";
import { DataTable } from "./data-table";

type participant = Tables<"participant">;

function createPlayer(player: participant): Player {
  return {
    id: player.id,
    nickname: player.nickname ? player.nickname : "이름 없음",
    score: 0,
  };
}

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: number };
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: response, error } = await supabase
    .from("game")
    .select("*, participant(*), game_course(*, score(*))")
    .eq("id", params.id)
    .single();

  const currentPageNo = searchParams.page ? Number(searchParams.page) : 1;

  if (error) throw error;
  const { participant: participants, game_course, id } = response;
  const current_game_course =
    game_course.find((_, idx) => idx === currentPageNo - 1) ?? game_course[0];
  const hasNextPage = game_course.length > currentPageNo;
  const hasPreviosPage = currentPageNo > 1;

  if (!current_game_course) throw new Error("game course not found");

  const game_course_name = current_game_course.name!;

  const columns = participants.map((p, index) => {
    const accessorKey = `player${index + 1}` as
      | "player1"
      | "player2"
      | "player3"
      | "player4";
    return {
      accessorKey,
      name: p.nickname ?? "이름 없음",
    };
  });

  const data: Score[] = current_game_course.score.map((score) => ({
    ...score,
    hole: score.hole_number,
    player1: participants[0] ? createPlayer(participants[0]) : undefined,
    player2: participants[1] ? createPlayer(participants[1]) : undefined,
    player3: participants[2] ? createPlayer(participants[2]) : undefined,
    player4: participants[3] ? createPlayer(participants[3]) : undefined,
  }));

  return (
    <main>
      <DataTable
        gameId={id}
        columns={columns}
        data={data}
        gameCourseName={game_course_name}
        hasNextPage={hasNextPage}
        hasPreviosPage={hasPreviosPage}
      />
    </main>
  );
};

export default Page;
