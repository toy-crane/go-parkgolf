import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/libs/supabase/server";
import type { Tables } from "@/types/supabase-helper";

import type { Player, Score } from "./columns";
import { DataTable } from "./data-table";

type participant = Tables<"participant">;

function createPlayer(scoreId: number, player: participant): Player {
  return {
    participantId: player.id,
    nickname: player.nickname ? player.nickname : "이름 없음",
    playerScore: 0,
    scoreId,
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
    .select("*, participant(*), game_course(*)")
    .eq("id", params.id)
    .single();

  const currentPageNo = searchParams.page ? Number(searchParams.page) : 1;

  if (error) throw error;
  const { participant: participants, game_course } = response;
  const currentGameCourse =
    game_course.find((_, idx) => idx === currentPageNo - 1) ?? game_course[0];
  const hasNextPage = game_course.length > currentPageNo;
  const hasPreviosPage = currentPageNo > 1;

  if (!currentGameCourse) throw new Error("game course not found");

  const { data: scores, error: scoreError } = await supabase
    .from("score")
    .select("*, player_score(*, participant(*))")
    .eq("game_course_id", currentGameCourse.id);

  if (scoreError) throw error;

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
  // TODO: partcipant 이미 생성해서 넘어와야 함
  const data: Score[] = scores.map((score) => {
    const playerScore = score.player_score;
    return {
      ...score,
      hole: score.hole_number,
      player1: playerScore[0]?.participant
        ? createPlayer(score.id, playerScore[0].participant)
        : undefined,
      player2: playerScore[1]?.participant
        ? createPlayer(score.id, playerScore[1].participant)
        : undefined,
      player3: playerScore[2]?.participant
        ? createPlayer(score.id, playerScore[2].participant)
        : undefined,
      player4: playerScore[3]?.participant
        ? createPlayer(score.id, playerScore[3].participant)
        : undefined,
    };
  });

  return (
    <main>
      <DataTable
        gameCourse={currentGameCourse}
        columns={columns}
        data={data}
        hasNextPage={hasNextPage}
        hasPreviosPage={hasPreviosPage}
      />
    </main>
  );
};

export default Page;
