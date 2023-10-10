"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAmplitude } from "@/libs/amplitude";
import type { Course } from "@/types";
import {
  AlarmClock,
  ArrowLeft,
  Clock,
  FlagTriangleRight,
  Phone,
} from "lucide-react";

const CourseDetail = ({ course }: { course: Course }) => {
  const { track } = useAmplitude();
  const router = useRouter();

  return (
    <>
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
      <div className="grid w-full items-center">
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
    </>
  );
};

export default CourseDetail;
