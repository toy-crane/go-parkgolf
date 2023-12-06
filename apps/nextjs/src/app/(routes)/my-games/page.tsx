import Link from "next/link";
import { redirect } from "next/navigation";
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
import { readUserSession } from "@/libs/auth";
import { format } from "date-fns";

import { PageHeader, PageHeaderHeading } from "../../../components/page-header";
import DeleteAlert from "./delete-alert";
import { getMyGames } from "./fetcher";

const Page = async () => {
  const { data } = await readUserSession();
  const games = await getMyGames();

  if (!data.session) {
    return redirect("/login");
  }

  return (
    <section>
      <PageHeader className="relative pb-4 md:pb-8">
        <PageHeaderHeading>나의 스코어 카드</PageHeaderHeading>
      </PageHeader>
      <div className="grid grid-cols-1 gap-3">
        {games?.map(
          ({ id: gameId, startedAt, golfCourse, gameCourse, gamePlayer }) => (
            <Card key={gameId} className="w-full">
              <CardHeader>
                <CardTitle>
                  <Link href={`/score-card/${gameId}`}>{golfCourse?.name}</Link>
                </CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  {format(new Date(startedAt), "yyyy-MM-dd")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flew-wrap flex gap-1 self-start">
                    {gameCourse.map(({ id, name }) => (
                      <Badge key={id} variant="secondary">
                        <Link href={`/score-card/${gameId}?tab=${name}`}>
                          {name} 코스
                        </Link>
                      </Badge>
                    ))}
                  </div>
                  <div>
                    {gamePlayer.map((p) => p.nickname).length}인 (
                    {gamePlayer.map((p) => p.nickname).join(", ")})
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 self-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/score-card/${gameId}`}>수정하기</Link>
                  </Button>
                  <DeleteAlert gameId={gameId} />
                </div>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </section>
  );
};

export default Page;
