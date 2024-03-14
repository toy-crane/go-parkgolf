import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import type { ScoreResult } from "../type";
import Feedback from "./_components/feedback";
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
  const session = await readUserSession();
  const user = session?.user;
  const supabase = await createSupabaseServerClientReadOnly();
  const [golfCouseResponse, response] = await Promise.all([
    supabase
      .from("games")
      .select("golf_courses(name, slug, id), started_at")
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
  const golfCourse = gameResult.golf_courses as {
    name: string;
    slug: string;
    id: string;
  };
  let hasReview = false;
  if (user) {
    const ReviewResponse = await supabase
      .from("golf_course_reviews")
      .select("*")
      .eq("golf_course_id", golfCourse.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (ReviewResponse.error) throw ReviewResponse.error;
    hasReview = ReviewResponse.data ? true : false;
  }

  const gameStartedAt = gameResult.started_at;

  return (
    <>
      <div className="flex flex-col items-center pb-8">
        <div className="mb-4 mt-4 space-y-1 text-center md:mb-9 md:mt-6 md:space-y-3">
          <div>
            <h1 className="text-muted-foreground text-xl font-semibold md:text-2xl">
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
        <div className="flex w-full flex-col md:w-[600px]">
          <ResultTable result={result} columnNames={columnNames} />
          <Button
            size="sm"
            variant="ghost"
            className="mb-3 flex self-end hover:bg-white"
            asChild
          >
            <Link href={`/score-card/${params.id}`}>
              전체 기록보기 <ChevronRight className="ml-2" />
            </Link>
          </Button>
        </div>
        {!hasReview && (
          <div>
            <Separator className=" mb-6 w-full md:w-[600px]" />
            <Feedback
              label={`${golfCourse?.name} 어떠셨나요?`}
              golfCourseSlug={golfCourse?.slug}
            />
          </div>
        )}
        <div className="bottom-cta content-grid bg-gradient-to-t from-white from-80% to-transparent">
          <div className="content pt-5">
            <Button className="w-full" asChild>
              <Link href="/my-games">나의 스코어 카드로 이동</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
