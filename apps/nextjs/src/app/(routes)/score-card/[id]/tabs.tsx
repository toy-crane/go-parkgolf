"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScoreCard } from "./score-card";
import type { GameCourse } from "./type";

export const ScoreTabs = ({
  gameCourses,
  selectedTab,
}: {
  gameCourses: GameCourse[];
  selectedTab?: string;
}) => {
  const [tab, setTab] = React.useState(selectedTab ?? gameCourses[0]?.name!);
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    router.push(`?${params.toString()}`);
    setTab(value);
  };

  return (
    <Tabs defaultValue={tab} onValueChange={handleTabChange}>
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
