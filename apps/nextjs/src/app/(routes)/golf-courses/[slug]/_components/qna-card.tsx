"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import type { QnA } from "../types";

const QnACard = ({ qna }: { qna: QnA }) => {
  return (
    <Card key={qna.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 pt-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={`${qna.profiles?.avatar_url}`} alt="Image" />
            <AvatarFallback>{qna.profiles?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">
              {qna.profiles?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex-1 text-xs font-normal">
            {formatDistanceToNow(new Date(qna.created_at), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4 pt-2">
        <p className="text-bg-background text-sm">{qna.content}</p>
      </CardContent>
    </Card>
  );
};

export default QnACard;
