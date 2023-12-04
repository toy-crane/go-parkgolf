import Link from "next/link";
import { redirect } from "next/navigation";
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

import { PageHeader, PageHeaderHeading } from "../_components/page-header";
import { getMyGames } from "./fetcher";

const Page = async () => {
  const { data } = await readUserSession();
  const games = await getMyGames();

  if (!data.session) {
    return redirect("/login");
  }

  return (
    <div>
      <PageHeader className="relative pb-4 md:pb-8">
        <PageHeaderHeading>나의 스코어 카드</PageHeaderHeading>
      </PageHeader>
      <div className="grid gap-4">
        {games?.map(
          ({ id: gameId, startedAt, golfCourse, gameCourse, gamePlayer }) => (
            <Card key={gameId} className="w-full">
              <CardHeader>
                <CardTitle>{golfCourse?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  {format(new Date(startedAt), "yyyy-MM-dd")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  {gamePlayer.map((p) => p.nickname).length}인 (
                  {gamePlayer.map((p) => p.nickname).join(", ")})
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="flex gap-2">
                  {gameCourse.map(({ id, name }) => (
                    <Button key={id} asChild variant="secondary">
                      <Link href={`/score-card/${gameId}?tab=${name}`}>
                        {name} 코스
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </div>
  );
};

export default Page;
