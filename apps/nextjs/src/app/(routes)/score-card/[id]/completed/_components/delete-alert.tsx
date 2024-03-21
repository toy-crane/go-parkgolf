"use client";

import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Trash2 } from "lucide-react";

import { deleteGame } from "../actions";

const DeleteAlert = ({ gameId }: { gameId: string }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await deleteGame(gameId);
      router.replace("/my-games");
      setOpen(false);
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size="smIcon">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            게임 기록 삭제
          </AlertDialogTitle>
          <AlertDialogDescription>
            이 게임을 정말 삭제하시겠어요?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <form onSubmit={onSubmit}>
            <Button
              className="flex w-full items-center gap-2"
              disabled={isPending}
              variant="destructive"
            >
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
