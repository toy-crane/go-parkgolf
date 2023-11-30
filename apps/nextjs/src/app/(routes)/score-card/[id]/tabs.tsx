"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScoreCard } from "./score-card";
import type { GameCourse } from "./type";

const getColumnNames = (gameCourses: GameCourse[]) => {
  const participants =
    gameCourses[0]?.score[0]?.player_score.map((p) => p.participant) || [];
  const columns = participants?.map((p) => ({
    accessorKey: String(p?.id),
    headerName: p?.nickname ?? "이름 없음",
  }));
  return columns;
};

const getFormattedData = (gameCourses: GameCourse[]) => {
  const data = gameCourses
    .map((gc) =>
      gc.score.map((score) => {
        const playerScore = score.player_score;
        const playerScoreMap = playerScore.reduce(
          (acc: Record<string, number>, curr) => {
            const participantId = String(curr.participant?.id);
            if (participantId) {
              acc[participantId] = curr.player_score;
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
      }),
    )
    .flat();
  return data;
};

export const ScoreTabs = ({
  gameCourses,
  selectedTab,
}: {
  gameCourses: GameCourse[];
  selectedTab?: string;
}) => {
  const [tab, setTab] = useState(selectedTab ?? gameCourses[0]?.name!);
  const searchParams = useSearchParams();
  const router = useRouter();
  const columns = getColumnNames(gameCourses);
  const data = getFormattedData(gameCourses);

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
