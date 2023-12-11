import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Plus } from "lucide-react";

import { PageHeader, PageHeaderHeading } from "../../../components/page-header";
import DeleteAlert from "./delete-alert";
import { getMyGames } from "./fetcher";

const Page = async () => {
  const games = await getMyGames();
  const hasGames = games && games?.length > 0;

  return (
    <section>
      <PageHeader className="relative flex flex-row items-center justify-between pb-4 md:pb-8">
        <PageHeaderHeading>나의 스코어 카드</PageHeaderHeading>
        <Button size="sm" asChild>
          {hasGames && (
            <Link href="score-card/create/golf-course">
              <Plus className="h-5 w-5" size={24} />
              게임 추가하기
            </Link>
          )}
        </Button>
      </PageHeader>
      <div className="grid grid-cols-1 gap-3">
        {hasGames ? (
          <>
            {games?.map(
              ({
                id: gameId,
                startedAt,
                golfCourse,
                gameCourses,
                gamePlayers,
              }) => (
                <Card key={gameId} className="w-full">
                  <CardHeader>
                    <CardTitle>
                      <Link href={`/score-card/${gameId}`}>
                        {golfCourse?.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      {format(new Date(startedAt), "yyyy-MM-dd")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1 gap-y-1 self-start">
                        {gameCourses.map(({ id, name }) => (
                          <Badge key={id} variant="secondary">
                            <Link href={`/score-card/${gameId}?tab=${name}`}>
                              {name} 코스
                            </Link>
                          </Badge>
                        ))}
                      </div>
                      <div>
                        {gamePlayers.map((p) => p.nickname).length}인 (
                        {gamePlayers.map((p) => p.nickname).join(", ")})
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex gap-2 self-end">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/score-card/${gameId}`}>기록보기</Link>
                      </Button>
                      <DeleteAlert gameId={gameId} />
                    </div>
                  </CardFooter>
                </Card>
              ),
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-36 md:pt-48">
            <div className="text-lg font-bold md:text-xl">
              게임 기록을 위해 신규 게임을 추가해주세요
            </div>
            <Button size="lg" asChild>
              <Link href="score-card/create">
                <Plus className="mr-2 h-5 w-5" size={24} />
                신규 게임 추가하기
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
