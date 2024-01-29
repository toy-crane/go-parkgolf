"use client";

import * as React from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/libs/hooks/media-query";
import type { Tables } from "@/types/generated";
import { Share, Share2 } from "lucide-react";

interface Props {
  golfCourse: Tables<"golf_courses">;
}

const ShareButtons = ({ golfCourse }: Props) => {
  const { toast } = useToast();
  return (
    <div className="mb-4 flex flex-col gap-2">
      <Button
        variant="ghost"
        onClick={async () => {
          await navigator.clipboard.writeText(`${window.location.href}`);
          toast({
            title: "주소가 복사되었습니다",
            description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
            duration: 1000,
          });
        }}
      >
        경로 복사하기
      </Button>
      <Button asChild variant="ghost">
        <Link
          href={`tmap://route?goalname=${
            golfCourse.lot_number_address_name ?? golfCourse.road_address_name
          }&rGoX=${golfCourse.lng}&rGoY=${golfCourse.lat}`}
        >
          <Icons.TMap className="mr-1.5 h-6 w-6" />
          TMAP으로 경로 전송
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link
          href={`nmap://navigation?dname=${
            golfCourse.lot_number_address_name ?? golfCourse.road_address_name
          }&dlng=${golfCourse.lng}&dlat=${golfCourse.lat}&appname=${
            siteConfig.url
          }`}
        >
          <Icons.Naver className="mr-1.5 h-6 w-6" />
          Naver Map으로 경로 전송
        </Link>
      </Button>
    </div>
  );
};

export function ShareDrawer({ golfCourse }: Props) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            공유하기
            <Share2 className="ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>공유하기</DialogTitle>
            <ShareButtons golfCourse={golfCourse} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left"></DrawerHeader>
        <ShareButtons golfCourse={golfCourse} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ShareDrawer;
