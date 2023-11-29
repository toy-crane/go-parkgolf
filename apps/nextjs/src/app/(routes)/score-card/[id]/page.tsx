import React from "react";

import { getGameCourses, getScores } from "./_fetcher";
import { DataTable } from "./data-table";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: number };
}) => {
  const gameCourses = await getGameCourses({ gameId: params.id });
  const currentPageNo = searchParams.page ? Number(searchParams.page) : 1;
  const currentGameCourse =
    gameCourses.find((_, idx) => idx === currentPageNo - 1) ?? gameCourses[0];
  const hasNextPage = gameCourses.length > currentPageNo;
  const hasPreviosPage = currentPageNo > 1;

  if (!currentGameCourse) throw new Error("game course not found");

  const scores = await getScores({ gameCourseId: currentGameCourse.id });
  const participants = scores[0]?.player_score.map((p) => p.participant) ?? [];

  const dynamicColumnNames = participants?.map((p) => ({
    accessorKey: String(p?.id!),
    headerName: p?.nickname ?? "이름 없음",
  }));

  const data = scores.map((score) => {
    const playerScore = score.player_score;
    const playerScoreMap = playerScore.reduce(
      (acc: Record<string, number>, curr) => {
        if (curr.participant?.id) {
          acc[String(curr.participant?.id)] = curr.player_score;
        }
        return acc;
      },
      {},
    );
    return {
      id: score.id,
      gameCourseId: score.game_course_id,
      holeNumber: score.hole_number,
      par: score.par,
      ...playerScoreMap,
    };
  });

  return (
    <main>
      <DataTable
        gameCourse={currentGameCourse}
        columns={dynamicColumnNames}
        data={data}
        hasNextPage={hasNextPage}
        hasPreviosPage={hasPreviosPage}
      />
    </main>
  );
};

export default Page;
