"use client";

import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import { redirect } from "next/navigation";
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

import { deleteSelf } from "./action";

const DeleteAlert = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await deleteSelf();
      setOpen(false);
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-muted block w-full justify-start px-2 text-left hover:underline"
        >
          회원 탈퇴
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            정말 파크골프가자를 떠나실건가요?
          </AlertDialogTitle>
          <AlertDialogDescription>
            탈퇴 후, 모든 정보는 지체없이 파기되며, 복구가 불가능합니다.
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
