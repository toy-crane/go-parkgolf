"use client";

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
import { format } from "date-fns";

import DeleteAlert from "./delete-alert";
import type { Game } from "./type";

const GameCard = ({
  game: { id, golfCourse, gameCourses, gamePlayers, startedAt },
}: {
  game: Game;
}) => {
  return (
    <Card
      key={id}
      className="w-full"
      onClick={() => {
        redirect(`/score-card/${id}`);
      }}
    >
      <CardHeader>
        <CardTitle>
          <Link href={`/score-card/${id}`}>{golfCourse?.name}</Link>
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
                <Link href={`/score-card/${id}?tab=${name}`}>{name} 코스</Link>
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
            <Link href={`/score-card/${id}`}>기록보기</Link>
          </Button>
          <DeleteAlert gameId={id} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
