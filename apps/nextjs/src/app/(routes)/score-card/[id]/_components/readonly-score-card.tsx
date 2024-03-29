"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { GameCourse, Score } from "../type";

const ScoreTable = dynamic(() => import("../_components/score-table"), {
  ssr: false,
});

export const ReadOnlyScoreCard = ({
  gameCourses,
  selectedTab,
  isMyGame,
  data,
  gamePlayers,
}: {
  data: Score[];
  gameCourses: GameCourse[];
  selectedTab?: string;
  isMyGame: boolean;
  gamePlayers: { id: string; nickname: string }[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={handleTabChange}
        className="flex flex-col"
      >
        <TabsList className="h-7">
          {gameCourses.map((gc) => (
            <TabsTrigger
              value={gc.name}
              key={gc.id}
              className="flex-1 py-0.5 text-xs"
            >
              {gc.name} 코스
            </TabsTrigger>
          ))}
        </TabsList>
        {gameCourses.map((gc) => (
          <TabsContent value={gc.name} key={gc.id} className="flex-1">
            <ScoreTable
              scores={data}
              gameCourseId={gc.id}
              gamePlayers={gamePlayers}
              readonly={true}
            />
          </TabsContent>
        ))}
      </Tabs>
      {!isMyGame && (
        <div>
          <Button asChild className="mt-4 w-full">
            <Link href="/">다른 파크골프장 둘러보기</Link>
          </Button>
        </div>
      )}
    </>
  );
};
