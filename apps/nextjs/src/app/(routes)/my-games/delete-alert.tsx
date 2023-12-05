"use client";

import { useTransition } from "react";
import type { ChangeEvent } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { deleteGame } from "./action";

const DeleteAlert = ({ gameId }: { gameId: string }) => {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await deleteGame(gameId);
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm">삭제하기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            게임 기록 제거
          </AlertDialogTitle>
          <AlertDialogDescription>
            게임을 삭제하면 되돌릴 수 없습니다. 그래도 삭제 하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <form onSubmit={onSubmit}>
            <Button className="flex items-center gap-2" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" size={24} />
              ) : (
                "삭제"
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
