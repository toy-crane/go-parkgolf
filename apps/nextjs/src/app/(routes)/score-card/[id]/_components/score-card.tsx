"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLocalStorage from "@/libs/hooks/local-storage";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { z } from "zod";

import { saveScore } from "../actions";
import { createSchema } from "../schema";
import type { Cell, GameCourse, Score } from "../type";
import { useGetColumns } from "../use-columns";
import type { ColumnName } from "../use-columns";
import { ScoreTable } from "./score-table";

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

export const ScoreCard = ({
  gameCourses,
  selectedTab,
  isMyGame,
  gameId,
}: {
  gameId: string;
  gameCourses: GameCourse[];
  selectedTab?: string;
  isMyGame: boolean;
}) => {
  useLockBodyScroll();
  const [handlerOpen, setHandlerOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [changedScoresGroup, setChangedScoresGroup] = useLocalStorage<Score[]>(
    `${gameId}-changed-scores`,
    [],
  );
  const columns = getColumnNames(gameCourses);
  const defaultSelectedCell = isMyGame
    ? { row: "0", colName: columns[0]?.accessorKey! }
    : undefined;
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>(
    defaultSelectedCell,
  );

  const lastTabName = gameCourses[gameCourses.length - 1]?.name;

  const searchParams = useSearchParams();
  const router = useRouter();

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
  };

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
        await saveScore(gameId, result.data as Score[]);
      });
      setChangedScoresGroup([]);
      router.replace(`/score-card/${gameId}/completed`);
    }
  };

  const handleClick = (row: string, colName: string, score: number) => {
    const currentScores = scoreCard.find((_, index) => index === Number(row));
    if (!currentScores) return;
    const updatedScores = {
      ...currentScores,
      [colName]: score,
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
    setHandlerOpen(true);
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
              onSelectedCell={handleSelectedCell}
              selectedCell={selectedCell}
              columns={table.getAllColumns()}
              rows={table
                .getRowModel()
                .rows.filter((row) => row.original.gameCourseId === gc.id)}
              headers={table.getHeaderGroups()}
              footers={table.getFooterGroups()}
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
      {isMyGame && (
        <Drawer open={handlerOpen} onOpenChange={setHandlerOpen}>
          <DrawerContent>
            <div className="content-grid my-4">
              <div className="mb-3 text-center text-lg font-semibold">
                {selectedCell?.colName === "par" ? "홀의 정규 타수" : "타수"}를
                입력해 주세요
              </div>
              {selectedCell?.colName === "par" ? (
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[3, 4, 5].map((score, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        if (selectedCell) {
                          handleClick(
                            selectedCell.row,
                            selectedCell.colName,
                            score,
                          );
                        }
                        setHandlerOpen(false);
                      }}
                    >
                      {score} 타
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="mb-2 grid grid-cols-3 gap-2">
                  {[...Array(9).keys()].map((score, index) => (
                    <Button
                      key={index}
                      variant={"secondary"}
                      onClick={() => {
                        if (selectedCell) {
                          handleClick(
                            selectedCell.row,
                            selectedCell.colName,
                            score + 1,
                          );
                        }
                        setHandlerOpen(false);
                      }}
                    >
                      {score + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
