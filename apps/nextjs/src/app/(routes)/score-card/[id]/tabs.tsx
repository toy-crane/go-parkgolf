"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

import { ScoreCard } from "./score-card";
import type { GameCourse } from "./type";

function createSchema(fields: Record<string, z.ZodType<any>>) {
  return z.object(fields);
}

export const ScoreTabs = ({ gameCourses }: { gameCourses: GameCourse[] }) => {
  const [tab, setTab] = React.useState(gameCourses[0]?.name!);
  const scores = gameCourses.find((gc) => gc.name === tab)?.score ?? [];

  const participants = scores[0]?.player_score.map((p) => p.participant) ?? [];

  const columns = participants?.map((p) => ({
    accessorKey: String(p?.id),
    headerName: p?.nickname ?? "이름 없음",
  }));

  const data = scores?.map((score) => {
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
    <Tabs defaultValue={tab} onValueChange={(value) => setTab(value)}>
      <TabsList className="w-full">
        {gameCourses.map((gc) => (
          <TabsTrigger value={gc.name} key={gc.id} className="flex-1">
            {gc.name} 코스
          </TabsTrigger>
        ))}
      </TabsList>
      {gameCourses.map((gc) => (
        <TabsContent value={gc.name} key={gc.id}>
          <ScoreCard columns={columns} data={data} gameCourseId={gc.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
