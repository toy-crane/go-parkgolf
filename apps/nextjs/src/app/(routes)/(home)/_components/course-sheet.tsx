"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import { generateFormUrl } from "@/libs/google-form";
import { cn } from "@/libs/tailwind";
import type { Course, GolfCourse } from "@/types";
import type { Tables } from "@/types/generated";
import {
  AlarmClock,
  Clock,
  FlagTriangleRight,
  Pencil,
  Phone,
  Share2,
} from "lucide-react";

interface CourseSheetProps {
  selectedCourse?: GolfCourse;
  reviews: Tables<"golf_course_reviews">[];
  open: boolean;
}

const InfoNeeded = ({ href }: { href: string }) => {
  return (
    <div className="flex items-center">
      <div className="mr-2">정보를 알려주세요.</div>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Pencil size={16} />
      </a>
    </div>
  );
};

const CourseSheet = ({ selectedCourse, open, reviews }: CourseSheetProps) => {
  const router = useRouter();
  const { track } = useAmplitude();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const addressName = selectedCourse?.lot_number_address_name;
  const operation = selectedCourse?.operations;

  // TODO: 리뷰의 갯수가 많아지면 개선
  const totalAverage =
    reviews.reduce((acc, review) => {
      return (
        acc +
        (review.course_condition_rating +
          review.course_difficulty_rating +
          review.facilities_rating) /
          3
      );
    }, 0) / reviews.length;
  console.log(open, "open");

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        const params = new URLSearchParams(searchParams);
        params.set("modal", String(open));
        if (!open) {
          params.delete("courseId");
        }
        router.replace(`?${params.toString()}`);
      }}
    >
      <DrawerPortal>
        <DrawerContent className="mx-auto h-auto w-full px-4 pb-4 md:px-48">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              <div className="flex items-center gap-1 text-2xl">
                <Link
                  href={`/golf-courses/${selectedCourse?.slug}`}
                  onClick={() => track("detail page link clicked")}
                  prefetch
                >
                  {selectedCourse?.name}
                </Link>
                <div className="flex items-center">
                  <Button
                    variant={"ghost"}
                    className="h-7 w-7"
                    size="icon"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${window.location.href}`,
                      );
                      toast({
                        className: cn(
                          "top-0 right-0 flex fixed md:max-w-[256px] md:top-4 md:right-4",
                        ),
                        title: "주소가 복사되었습니다",
                        description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
                        duration: 1000,
                      });
                      track("sheet share button clicked");
                    }}
                  >
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>
            </DrawerTitle>
            <DrawerDescription className="flex flex-col items-start">
              <span className="text-left text-lg">{addressName}</span>
              {reviews.length > 0 ? (
                <button
                  className="flex cursor-pointer items-center"
                  onClick={() =>
                    router.push(
                      `/golf-courses/${selectedCourse?.slug}?tab=review`,
                      { prefetch: true },
                    )
                  }
                >
                  <Icons.starFilled className="mr-[2px] h-4 w-4" />
                  <span className="mr-2">{totalAverage}</span>
                  <span>리뷰 {reviews.length}</span>
                </button>
              ) : (
                <button
                  className="text-secondary-foreground flex items-center gap-1 font-semibold"
                  onClick={() =>
                    router.push(
                      `/golf-courses/${selectedCourse?.slug}/reviews/create`,
                      { prefetch: true },
                    )
                  }
                >
                  <span>리뷰 작성하기</span>
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid w-full items-center">
            <div className="flex items-center gap-4">
              <FlagTriangleRight size={20} />
              <div className="text-base">{selectedCourse?.hole_count}홀</div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-4">
              <Phone size={20} />
              <div className="text-base">
                {selectedCourse?.contacts?.[0]?.phone_number ? (
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 text-base text-blue-400"
                    onClick={() => {
                      track("phone number clicked", { ...selectedCourse });
                    }}
                  >
                    <a
                      href={`tel:${selectedCourse?.contacts[0]?.phone_number}`}
                    >
                      {selectedCourse?.contacts[0]?.phone_number}
                    </a>
                  </Button>
                ) : (
                  InfoNeeded({ href: generateFormUrl(selectedCourse?.name) })
                )}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-4">
              <Clock size={20} />
              <div className="text-base">
                <div className="flex">
                  <div className="mr-2 flex-shrink-0">영업 시간 -</div>
                  {selectedCourse?.operations?.opening_hours ??
                    InfoNeeded({ href: generateFormUrl(selectedCourse?.name) })}
                </div>
                {selectedCourse?.operations?.regular_closed_days && (
                  <div className="flex">
                    <div className="mr-2 flex-shrink-0">정기 휴무일 - </div>
                    {selectedCourse?.operations?.regular_closed_days}
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="mb-3 flex items-center gap-4">
              <AlarmClock size={20} className="shrink-0" />
              <div className="text-base">
                <div className="flex">
                  <div className="mr-2 flex-shrink-0">예약 방법 - </div>
                  {operation?.registration_method ??
                    InfoNeeded({ href: generateFormUrl(selectedCourse?.name) })}
                </div>
                <div>
                  {operation?.website ? (
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="p-0 text-base text-blue-400"
                      onClick={() => track("website detail clicked")}
                    >
                      <a
                        href={operation?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        상세 정보 홈페이지
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export default CourseSheet;
