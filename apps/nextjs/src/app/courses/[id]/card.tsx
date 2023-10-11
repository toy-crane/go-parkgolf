"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import type { Course } from "@/types";
import {
  AlarmClock,
  ArrowLeft,
  Clock,
  FlagTriangleRight,
  Phone,
  Share2,
} from "lucide-react";
import { StaticMap } from "react-kakao-maps-sdk";

const CourseDetail = ({ course }: { course: Course }) => {
  const { track } = useAmplitude();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="my-4 flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-col gap-4">
            <h2 className="text-foreground text-lg font-semibold">
              {course.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {course.address.address_name}
            </p>
          </div>
        </div>
        <Button
          variant={"ghost"}
          size="icon"
          onClick={async () => {
            await navigator.clipboard.writeText(
              `${window.location.href}courses/${course?.id}`,
            );
            toast({
              title: "주소가 복사되었습니다",
              description: "원하는 곳에 붙여넣기(Ctrl+V)해주세요.",
              duration: 1000,
            });
          }}
        >
          <Share2 size={24} />
        </Button>
      </div>
      <StaticMap // 지도를 표시할 Container
        className="mb-6"
        marker={[
          {
            position: {
              lat: Number(course.address.y),
              lng: Number(course.address.x),
            },
            text: course.name,
          },
        ]}
        center={{
          // 지도의 중심좌표
          lat: Number(course.address.y),
          lng: Number(course.address.x),
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "450px",
        }}
        level={6} // 지도의 확대 레벨
      />
      <div className="mb-20 grid w-full items-center">
        <div className="flex items-center gap-4">
          <FlagTriangleRight size={20} />
          <div className="text-base">{course?.hole_count}홀</div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-4">
          <Phone size={20} />
          <div className="text-base">
            {course?.contact.phone_number ? (
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 text-base text-blue-400"
                onClick={() => {
                  track("phone number clicked", { ...course });
                }}
              >
                <a href={`tel:${course?.contact.phone_number}`}>
                  {course?.contact.phone_number}
                </a>
              </Button>
            ) : (
              "등록된 연락처가 없습니다"
            )}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-4">
          <Clock size={20} />
          <div className="text-base">
            <div>
              영업 시간 -{" "}
              {course?.operation.opening_hours ?? "등록된 정보가 없습니다"}
            </div>
            {course?.operation.regular_closed_days && (
              <div> 정기 휴무일 - {course?.operation.regular_closed_days}</div>
            )}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-4">
          <AlarmClock size={20} />
          <div className="text-base">
            <div>
              예약 방법 -{" "}
              {course?.operation.registration_method ??
                "등록된 정보가 없습니다"}
            </div>
            <div>
              {course?.operation.website ? (
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="p-0 text-base text-blue-400"
                >
                  <a href={course?.operation.website}>상세 정보 홈페이지</a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
