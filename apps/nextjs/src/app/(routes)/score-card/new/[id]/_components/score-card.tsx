import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import _ from "lodash";

import type { GameCourse } from "../type";

const gridColumns = {
  "1": "grid-cols-score-card-1",
  "2": "grid-cols-score-card-2",
  "3": "grid-cols-score-card-3",
  "4": "grid-cols-score-card-4",
};

const ScoreCardCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TableCell
      className={cn(
        "flex cursor-pointer items-center justify-center border p-0",
        className,
      )}
    >
      {children}
    </TableCell>
  );
};

const ScoreCardRow = ({
  columnCount,
  children,
}: {
  columnCount: number;
  children: React.ReactNode;
}) => {
  return (
    <TableRow
      className={cn(
        "grid flex-1",
        gridColumns[String(columnCount) as keyof typeof gridColumns],
      )}
    >
      {children}
    </TableRow>
  );
};

const ScoreCardHeader = ({
  players,
}: {
  players: { nickname: string; id: string }[];
}) => {
  return (
    <TableHeader className="flex-0">
      <ScoreCardRow columnCount={players.length}>
        <ScoreCardHead label="홀" className="bg-lime-200" />
        <ScoreCardHead label="파" className="bg-lime-400" />
        {players.map((player) => (
          <ScoreCardHead key={player.id} label={player.nickname} />
        ))}
      </ScoreCardRow>
    </TableHeader>
  );
};

const ScoreCardHead = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return (
    <TableHead
      className={cn(
        "flex h-auto items-center justify-center border px-0 py-2 text-center font-semibold text-black md:px-4",
        className,
      )}
    >
      {label}
    </TableHead>
  );
};

const calculateParByCourse = (gameCourses: GameCourse[]) => {
  return gameCourses.reduce(
    (acc, course) => {
      // 각 코스에 대한 총 par 값을 초기화
      acc[course.name] =
        course.game_scores?.reduce((totalPar, gameScore) => {
          // 각 게임 스코어의 par 값을 합산
          return totalPar + gameScore.par;
        }, 0) ?? 0; // game_scores가 undefined인 경우를 위해 기본값으로 0을 설정
      return acc;
    },
    {} as Record<string, number>,
  );
};

const calculateUserScoresByCourse = (gameCourses: GameCourse[]) =>
  gameCourses.reduce(
    (acc, course) => {
      const playerScores = course.game_scores?.reduce(
        (accScores, gameScore) => {
          gameScore.game_player_scores.forEach(({ game_player_id, score }) => {
            accScores[game_player_id] =
              (accScores[game_player_id] ?? 0) + score;
          });
          return accScores;
        },
        {} as Record<string, number>,
      );
      if (playerScores) {
        acc[course.name] = playerScores;
      }
      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

const calculateTotalUserScore = (gameCourses: GameCourse[]) => {
  return gameCourses.reduce(
    (accCourses, course) => {
      course.game_scores?.forEach((gameScore) => {
        gameScore.game_player_scores.forEach(({ game_player_id, score }) => {
          if (!accCourses[game_player_id]) {
            accCourses[game_player_id] = 0;
          }
          accCourses[game_player_id] += score;
        });
      });
      return accCourses;
    },
    {} as Record<string, number>,
  );
};

const ScoreCard = async ({ gameId }: { gameId: string }) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .select(
      "started_at, game_courses(*, game_scores(*, game_player_scores(*))), game_players(id, nickname)",
    )
    .eq("id", gameId)
    .single();
  if (response.error) throw response.error;
  const {
    started_at,
    game_courses: gameCourses,
    game_players: players,
  } = response.data;
  const userScoreByCourse = calculateUserScoresByCourse(gameCourses);
  const totalUserScore = calculateTotalUserScore(gameCourses);
  const parByCourse = calculateParByCourse(gameCourses);
  const totalPar = _.sum(Object.values(parByCourse));

  return (
    <>
      <div
        className={cn("text-muted-foreground flex justify-end pb-1 text-xs")}
      >
        {started_at && format(new Date(started_at), "yyyy-MM-dd")}
      </div>
      <Tabs defaultValue={gameCourses[0]?.name} className="flex flex-col">
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
        {gameCourses.map((currentCourse) => (
          <TabsContent
            value={currentCourse.name}
            key={currentCourse.id}
            className="flex-1"
          >
            <Table className="flex h-full flex-1 flex-col text-xs md:text-sm">
              <ScoreCardHeader players={players} />
              <TableBody className="flex flex-1 flex-col text-base">
                {gameCourses
                  .filter((gc) => gc.name === currentCourse.name)
                  .map(({ game_scores: holes }) =>
                    holes.map(
                      ({
                        hole_number,
                        id,
                        par,
                        game_player_scores: scores,
                      }) => (
                        <ScoreCardRow columnCount={players.length} key={id}>
                          <ScoreCardCell className="cursor-default bg-lime-200">
                            {hole_number}
                          </ScoreCardCell>
                          <ScoreCardCell className="cursor-pointer bg-lime-400">
                            {par}
                          </ScoreCardCell>
                          {scores.map(({ id, score }) => (
                            <ScoreCardCell key={id} className="cursor-pointer">
                              {score}
                            </ScoreCardCell>
                          ))}
                        </ScoreCardRow>
                      ),
                    ),
                  )}
                <ScoreCardRow columnCount={players.length}>
                  <ScoreCardCell className="flex cursor-default items-center justify-center break-keep border px-0 py-0 text-center text-xs leading-4 md:px-4">
                    코스 합계
                  </ScoreCardCell>
                  <ScoreCardCell>
                    {parByCourse[currentCourse.name]}
                  </ScoreCardCell>
                  {players.map((player) => (
                    <ScoreCardCell key={player.id}>
                      {userScoreByCourse[currentCourse.name]?.[player.id]}
                    </ScoreCardCell>
                  ))}
                </ScoreCardRow>
                <ScoreCardRow columnCount={players.length}>
                  <ScoreCardCell className="flex cursor-default items-center justify-center break-keep border px-0 py-0 text-center text-xs leading-4 md:px-4">
                    전체 합계
                  </ScoreCardCell>
                  <ScoreCardCell>{totalPar}</ScoreCardCell>
                  {players.map((player) => (
                    <ScoreCardCell key={player.id}>
                      {totalUserScore[player.id]}
                    </ScoreCardCell>
                  ))}
                </ScoreCardRow>
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default ScoreCard;
