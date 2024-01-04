"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import type { Game } from "./type";

type Status = "in_progress" | "completed" | "deleted" | "draft";

const STATUS_LABEL: {
  [key in Status]: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
} = {
  in_progress: {
    text: "진행중",
    variant: "default",
  },
  completed: {
    text: "게임 종료",
    variant: "secondary",
  },
  deleted: {
    text: "취소",
    variant: "destructive",
  },
  draft: {
    text: "임시저장",
    variant: "outline",
  },
};

const GameCard = ({
  game: { id, golfCourses, gameCourses, gamePlayers, startedAt, status },
}: {
  game: Game;
}) => {
  const gameCourseNames = gameCourses
    ?.map((gameCourse) => gameCourse.name)
    .join(" ");
  const gamePlayerNames = gamePlayers
    .map((gamePlayer) => gamePlayer.nickname)
    .join(" | ");
  return (
    <Card
      key={id}
      className="w-full"
      onClick={() => {
        redirect(`/score-card/${id}`);
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-2 px-2">
        <CardTitle className="flex items-center justify-between text-xs">
          {format(new Date(startedAt), "yyyy-MM-dd (eee) HH:mm", {
            locale: ko,
          })}
        </CardTitle>
        <Link
          href={`/score-card/${id}`}
          className="inline-flex h-6 items-center rounded-md px-2 text-xs font-medium text-neutral-600"
        >
          상세보기
          <ChevronRight className="ml-0.5 h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="px-2 py-4 pt-2">
        <Badge
          variant={STATUS_LABEL[status].variant}
          className="rounded-sm px-1 py-0 text-xs font-medium"
        >
          {STATUS_LABEL[status].text}
        </Badge>
        <h2 className="text-md mb-1 font-medium">{golfCourses?.name}</h2>
        <div className="text-xs text-gray-500">
          {gameCourseNames} 코스<span> · </span>
          {golfCourses?.holeCount}홀
        </div>
        <div className="text-xs text-gray-500">{gamePlayerNames}</div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
