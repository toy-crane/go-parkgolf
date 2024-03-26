"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Row } from "@tanstack/react-table";
import { generateStorage } from "@toss/storage";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import type { GameCourse, Score } from "../type";
import { ScoreTable } from "./score-table";
import ScoresInput from "./scores-input";

const safeLocalStorage = generateStorage();

const MergeScores = (scores: Score[], localScores: Score[]) => {
  const newScores = scores.map((s) => {
    const localScore = localScores.find((ls) => ls.id === s.id);
    return localScore ?? s;
  });
  return newScores;
};

const getScores = (playerOrder: string[], score?: Score) => {
  if (!score) {
    return [];
  }

  // 제외하고자 하는 속성 목록
  const excludeProperties = new Set([
    "id",
    "gameCourseId",
    "holeNumber",
    "par",
  ]);

  // 순서대로 속성 값을 배열에 저장
  const values = playerOrder.reduce<string[]>((acc, key) => {
    if (
      !excludeProperties.has(key) &&
      Object.prototype.hasOwnProperty.call(score, key)
    ) {
      acc.push(String(score[key]));
    }
    return acc;
  }, []);

  return values;
};

export const ScoreCard = ({
  gameCourses,
  selectedTab,
  isMyGame,
  data,
  gameId,
  gamePlayers,
}: {
  gameId: string;
  data: Score[];
  gameCourses: GameCourse[];
  selectedTab?: string;
  isMyGame: boolean;
  gamePlayers: { id: string; nickname: string }[];
}) => {
  useLockBodyScroll();
  const [handlerOpen, setHandlerOpen] = useState(true);
  const initialScores = MergeScores(
    data,
    JSON.parse(
      safeLocalStorage.get(`${gameId}-changed-scores`) ?? "[]",
    ) as Score[],
  );

  const [scores, setScores] = useState<Score[]>(initialScores);
  const [selectedScore, setSelectedScore] = useState<Score | undefined>(
    isMyGame ? scores[0] : undefined,
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (selectedScore) {
      setHandlerOpen(true);
    }
  }, [selectedScore]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    const courseId = gameCourses.find((gc) => gc.name === value)?.id;
    const score = scores.find((s) => s.gameCourseId === courseId);
    if (score !== undefined) {
      setSelectedScore(score);
    }
    router.replace(`?${params.toString()}`);
  };

  const handleSubmit = (inputScores: string[]) => {
    if (selectedScore === undefined) return;
    // gamePlayers의 각 요소에 대해 inputScores의 값을 매핑하여 객체를 생성합니다.
    const scoreMapping = gamePlayers.reduce<Record<string, number>>(
      (acc, player, index) => {
        // inputScores 배열의 길이를 넘지 않는 인덱스에 대해서만 값을 매핑합니다.
        if (index < inputScores.length) {
          acc[player.id] = Number(inputScores[index]!);
        }
        return acc;
      },
      {},
    );
    const updateScores = {
      ...selectedScore,
      ...scoreMapping,
    };
    setScores((origin) =>
      origin.map((s) => (s.id === updateScores.id ? updateScores : s)),
    );
    const localScores = JSON.parse(
      safeLocalStorage.get(`${gameId}-changed-scores`) ?? "[]",
    ) as Score[];
    const newLocalScores = [
      ...localScores.filter((s) => s.id !== updateScores.id),
      updateScores,
    ];
    safeLocalStorage.set(
      `${gameId}-changed-scores`,
      JSON.stringify(newLocalScores),
    );
  };

  const handleSelectedRow = (row?: Row<Score>) => {
    setSelectedScore(row?.original);
  };

  const selectedPlayerScores = getScores(
    gamePlayers.map((gp) => gp.id),
    selectedScore,
  );

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
              onSelectedRow={handleSelectedRow}
              selectedScore={selectedScore}
              scores={scores}
              gameCourseId={gc.id}
              gamePlayers={gamePlayers}
            />
          </TabsContent>
        ))}
      </Tabs>
      <Drawer open={handlerOpen} onOpenChange={setHandlerOpen}>
        <DrawerContent>
          {/* <div className="content-grid my-4">
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
          </div> */}
          <div className="content-grid my-2">
            {selectedScore && (
              <ScoresInput
                label={`${selectedScore.holeNumber} 홀`}
                defaultScores={selectedPlayerScores}
                inputLength={gamePlayers.length}
                onSubmit={(inputScores) => {
                  handleSubmit(inputScores);
                  setHandlerOpen(false);
                }}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
