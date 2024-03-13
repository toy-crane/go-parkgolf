import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import type { ScoreResult } from "../type";
import ResultTable from "./_components/result-table";

interface GameSummary {
  game_player_id: string;
  player_name: string;
  game_course: string;
  total_score: number;
}

function convertData(data: GameSummary[]): ScoreResult[] {
  return data.reduce(
    (acc: ScoreResult[], { player_name, game_course, total_score }) => {
      const course = acc.find((c) => c.courseName === game_course);
      if (course) {
        course[player_name] =
          ((course[player_name] as number) || 0) + total_score;
      } else {
        acc.push({ courseName: game_course, [player_name]: total_score });
      }
      return acc;
    },
    [],
  );
}

const Page = async ({ params }: { params: { id: string } }) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const [golfCouseResponse, response] = await Promise.all([
    supabase
      .from("games")
      .select("golf_courses(name), started_at")
      .eq("id", params.id)
      .single(),
    supabase.rpc("get_game_summary", {
      input_game_id: params.id,
    }),
  ]);

  if (response.error ?? golfCouseResponse.error) throw response.error;
  if (response.data.length === 0) throw Error("게임 정보가 정확하지 않습니다.");
  const result = convertData(response.data);
  const columnNames = Object.keys(result[0]!)
    .filter((key) => key !== "courseName")
    .map((key) => ({
      headerName: key,
      accessorKey: key,
    }));
  const gameResult = golfCouseResponse.data;
  const golfCourse = gameResult.golf_courses;
  const gameStartedAt = gameResult.started_at;

  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <div className="mt-6 space-y-3 text-center">
          <div>
            <h1 className="text-muted-foreground text-2xl font-semibold">
              {golfCourse?.name}
            </h1>
            <h2 className="text-muted-foreground text-xs">
              {format(new Date(gameStartedAt), "yyyy-MM-dd (eee) HH:mm", {
                locale: ko,
              })}
            </h2>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            게임을 완료했어요!
          </h1>
        </div>
        <div className="w-full md:w-[512px]">
          <ResultTable result={result} columnNames={columnNames} />
        </div>
      </div>
    </>
  );
};

export default Page;
