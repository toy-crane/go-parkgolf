"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { Loader2, Minus, Plus } from "lucide-react";
import { z } from "zod";

import { saveScore } from "./actions";
import { useGetColumns } from "./columns";
import type { ColumnName } from "./columns";
import { createSchema } from "./schema";
import { ScoreCard } from "./score-card";
import type { Cell, GameCourse, Score } from "./type";

const getColumnNames = (gameCourses: GameCourse[]): ColumnName[] => {
  const players =
    gameCourses[0]?.game_scores[0]?.game_player_scores.map(
      (p) => p.game_players,
    ) ?? [];
  const columns = players?.map((p) => ({
    accessorKey: p?.id ?? "unknown",
    headerName: p?.nickname ?? "이름 없음",
  }));
  return columns;
};

const getFormattedData = (gameCourses: GameCourse[]): Score[] => {
  const data = gameCourses
    .map((gc) =>
      gc.game_scores.map((score) => {
        const playerScore = score.game_player_scores;
        const playerScoreMap = playerScore.reduce(
          (acc: Record<string, number>, curr) => {
            const participantId = String(curr.game_players?.id);
            if (participantId) {
              acc[participantId] = curr.score ?? 0;
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
  playerCount,
  isMyGame,
}: {
  gameCourses: GameCourse[];
  selectedTab?: string;
  playerCount: number;
  isMyGame: boolean;
}) => {
  useLockBodyScroll();

  const [isPending, startTransition] = useTransition();
  // 변경된 Row만 기록
  const [changedScoresGroup, setChangedScoresGroup] = useState<Score[]>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>(undefined);

  const lastTabName = gameCourses[gameCourses.length - 1]?.name!;

  const [tab, setTab] = useState(selectedTab ?? gameCourses[0]?.name!);
  const searchParams = useSearchParams();
  const router = useRouter();
  const columns = getColumnNames(gameCourses);

  // 변경된 row와 기존 데이터를 합친다.
  const scoreCard = useMemo(
    () =>
      getFormattedData(gameCourses).map((score) => {
        const changedScore = changedScoresGroup.find((s) => s.id === score.id);
        if (changedScore) {
          return changedScore;
        }
        return score;
      }),
    [changedScoresGroup, gameCourses],
  );

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    router.replace(`?${params.toString()}`);
    setTab(value);
  };

  // 탭이 변경되면, 선택된 셀을 초기화한다.
  useEffect(() => {
    setSelectedCell(undefined);
  }, [tab]);

  const table = useReactTable({
    data: scoreCard,
    columns: useGetColumns(columns),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSave = () => {
    const scoreSchema = z.array(
      createSchema({
        id: z.string(),
        gameCourseId: z.string(),
        holeNumber: z.number(),
        par: z.number(),
        ...columns.reduce((acc: Record<string, z.ZodType<any>>, h) => {
          acc[h.accessorKey] = z.number();
          return acc;
        }, {}),
      }),
    );
    const result = scoreSchema.safeParse(changedScoresGroup);
    if (result.success === false) {
      return;
    }
    if (result.success) {
      startTransition(async () => {
        await saveScore(result.data as Score[]);
      });
      if (lastTabName === tab) {
        router.push(`/my-games`);
      }
    }
  };

  const handleScore = (
    row: string,
    colName: string,
    type: "increase" | "decrease",
  ) => {
    const increment = type === "increase" ? 1 : -1;
    const currentScores = scoreCard.find((_, index) => index === Number(row));
    if (!currentScores) return;
    const currentScore = currentScores[colName] as number;
    const updatedScores = {
      ...currentScores,
      [colName]: currentScore + increment,
    };
    setChangedScoresGroup((origin) => {
      const updated = origin.map((s) =>
        s.id === updatedScores.id ? updatedScores : s,
      );
      if (!updated.find((s) => s === updatedScores)) {
        updated.push(updatedScores);
      }
      return updated;
    });
  };

  const handleSelectedCell = (cell: Cell) => {
    setSelectedCell(cell);
  };

  return (
    <>
      <Tabs
        defaultValue={tab}
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
            <ScoreCard
              gameCourseId={gc.id}
              table={table}
              onSelectedCell={handleSelectedCell}
              selectedCell={selectedCell}
              playerCount={playerCount}
            />
          </TabsContent>
        ))}
      </Tabs>
      <div>
        {isMyGame ? (
          <div className="flex justify-evenly gap-2 pt-2">
            <Button
              className="flex-auto"
              size="sm"
              disabled={isPending || !selectedCell}
              onClick={() => {
                if (selectedCell) {
                  handleScore(
                    selectedCell.row,
                    selectedCell.colName,
                    "increase",
                  );
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              className="flex-auto"
              size="sm"
              disabled={isPending || !selectedCell}
              onClick={() => {
                if (selectedCell) {
                  handleScore(
                    selectedCell.row,
                    selectedCell.colName,
                    "decrease",
                  );
                }
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            {lastTabName === tab && (
              <Button
                onClick={handleSave}
                variant="outline"
                disabled={isPending}
                size="sm"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" size={24} />
                ) : (
                  "완료"
                )}
              </Button>
            )}
          </div>
        ) : (
          <Button asChild className="mt-4 w-full">
            <Link href="/">다른 파크골프장 둘러보기</Link>
          </Button>
        )}
      </div>
    </>
  );
};
