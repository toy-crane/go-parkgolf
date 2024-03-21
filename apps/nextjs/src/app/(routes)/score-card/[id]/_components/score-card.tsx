"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateStorage } from "@toss/storage";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import type { Cell, GameCourse, Score } from "../type";
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

const safeLocalStorage = generateStorage();

const MergeScores = (scores: Score[], localScores: Score[]) => {
  const newScores = scores.map((s) => {
    const localScore = localScores.find((ls) => ls.id === s.id);
    return localScore ?? s;
  });
  return newScores;
};

export const ScoreCard = ({
  gameCourses,
  selectedTab,
  isMyGame,
  data,
  gameId,
}: {
  gameId: string;
  data: Score[];
  gameCourses: GameCourse[];
  selectedTab?: string;
  isMyGame: boolean;
}) => {
  useLockBodyScroll();
  const [handlerOpen, setHandlerOpen] = useState(true);
  const columns = getColumnNames(gameCourses);
  const initialScores = MergeScores(
    data,
    JSON.parse(
      safeLocalStorage.get(`${gameId}-changed-scores`) ?? "[]",
    ) as Score[],
  );
  const [scores, setScores] = useState<Score[]>(initialScores);
  const defaultSelectedCell = isMyGame
    ? { row: "0", colName: columns[0]?.accessorKey! }
    : undefined;
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>(
    defaultSelectedCell,
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    router.replace(`?${params.toString()}`);
  };

  const handleClick = (row: string, colName: string, score: number) => {
    const currentScores = scores.find((_, index) => index === Number(row));
    if (!currentScores) return;
    const updatedScores = {
      ...currentScores,
      [colName]: score,
    };
    setScores((origin) =>
      origin.map((s) => (s.id === updatedScores.id ? updatedScores : s)),
    );
    const localScores = JSON.parse(
      safeLocalStorage.get(`${gameId}-changed-scores`) ?? "[]",
    ) as Score[];
    const newLocalScores = [
      ...localScores.filter((s) => s.id !== updatedScores.id),
      updatedScores,
    ];
    safeLocalStorage.set(
      `${gameId}-changed-scores`,
      JSON.stringify(newLocalScores),
    );
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
              scores={scores}
              gameCourseId={gc.id}
              columns={columns}
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
