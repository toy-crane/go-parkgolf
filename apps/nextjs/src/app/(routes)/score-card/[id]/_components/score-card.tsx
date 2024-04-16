"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Row } from "@tanstack/react-table";
import { generateStorage } from "@toss/storage";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { set } from "lodash";
import { Loader2 } from "lucide-react";

import type { GameCourse, Score } from "../type";
import ScoresInput from "./scores-input";

interface GamePlayer {
  id: string;
  nickname: string;
}

const ScoreTable = dynamic(() => import("../_components/score-table"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin" size={24} color={"#71717A"} />
    </div>
  ),
});

const safeLocalStorage = generateStorage();

const MergeScores = (scores: Score[], localScores: Score[]) => {
  const newScores = scores.map((s) => {
    const localScore = localScores.find((ls) => ls.id === s.id);
    return localScore ?? s;
  });
  return newScores;
};

const getScores = (
  playerOrder: string[],
  gamePlayers: GamePlayer[],
  score?: Score,
) => {
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
  const values = playerOrder.reduce<
    { nickname: string; score: string; id: string }[]
  >((acc, key) => {
    if (
      !excludeProperties.has(key) &&
      Object.prototype.hasOwnProperty.call(score, key)
    ) {
      acc.push({
        score: String(score[key]),
        id: key,
        nickname: gamePlayers.find((gp) => gp.id === key)?.nickname ?? "",
      });
    }
    return acc;
  }, []);

  return values;
};

const findInitialSelectScore = (
  scores: Score[],
  gameCourseId: string,
): Score | undefined => {
  // UUID 패턴에 해당하는 키만 검사
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return scores.find((score) => {
    if (score.gameCourseId !== gameCourseId) {
      return false;
    }
    for (const key in score) {
      if (uuidPattern.test(key)) {
        if (score[key] !== 0) {
          return false;
        }
      }
    }
    return true;
  });
};

export const ScoreCard = ({
  gameCourses,
  selectedTab,
  data,
  gameId,
  gamePlayers,
}: {
  gameId: string;
  data: Score[];
  gameCourses: GameCourse[];
  selectedTab: string;
  gamePlayers: { id: string; nickname: string }[];
}) => {
  useLockBodyScroll();
  const [handlerOpen, setHandlerOpen] = useState(false);
  const initialScores = MergeScores(
    data,
    JSON.parse(
      safeLocalStorage.get(`${gameId}-changed-scores`) ?? "[]",
    ) as Score[],
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const currentGameCourseId = gameCourses.find((gc) => gc.name === selectedTab)
    ?.id!;
  const initialScore = findInitialSelectScore(
    initialScores,
    currentGameCourseId,
  );

  const [scores, setScores] = useState<Score[]>(initialScores);
  const [selectedScore, setSelectedScore] = useState<Score | undefined>(
    initialScore,
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
    gamePlayers,
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
      <Drawer
        open={handlerOpen}
        onOpenChange={setHandlerOpen}
        onClose={() => setSelectedScore(undefined)}
      >
        <DrawerContent>
          <div className="content-grid my-2">
            {selectedScore && (
              <ScoresInput
                label={`${selectedScore.holeNumber}홀 스코어를 입력하세요`}
                defaultScores={selectedPlayerScores}
                inputLength={gamePlayers.length}
                onChange={(scores) => {
                  handleSubmit(scores);
                }}
                onSubmit={() => {
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
