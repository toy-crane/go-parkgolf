"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import { generateFormUrl } from "@/libs/google-form";
import type { Course } from "@/types";
import { ArrowLeft, Pencil, Share2 } from "lucide-react";
import { StaticMap } from "react-kakao-maps-sdk";

interface CardProps {
  title: string;
  content: string | React.ReactNode;
}

const Label = ({ title, content }: CardProps) => {
  return (
    <div className="flex items-center">
      <h3 className="mr-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-lg">{content}</p>
    </div>
  );
};

const InfoNeeded = ({ href }: { href: string }) => {
  return (
    <div className="flex items-center">
      <div className="mr-2">정보를 입력해 주세요</div>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Pencil size={16} />
      </a>
    </div>
  );
};

const CourseDetail = ({ course }: { course: Course }) => {
  const { track } = useAmplitude();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="my-4 flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft size={24} />
          </Button>
        </div>
        <div>
          <Button
            variant={"ghost"}
            size="icon"
            asChild
            onClick={() => track("modify button clicked")}
          >
            <a
              href={generateFormUrl(course.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pencil size={24} />
            </a>
          </Button>
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
              track("share button clicked");
            }}
          >
            <Share2 size={24} />
          </Button>
        </div>
      </div>
      <StaticMap // 지도를 표시할 Container
        className="mb-12"
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
          height: "280px",
        }}
        level={6} // 지도의 확대 레벨
      />
      <div className="mb-20 flex w-full flex-col">
        <h1 className="text-foreground mb-4 text-4xl font-bold">
          {course.name}
        </h1>
        <div className="flex flex-col gap-1">
          <Label title="위치" content={course.address.address_name} />
          <Label title="규모" content={`${course?.hole_count} 홀`} />
        </div>
        <Separator className="my-5" />
        <h2 className="text-foreground mb-2 text-xl font-bold">운영 시간</h2>
        <div className="flex flex-col gap-1">
          <Label
            title="영업시간"
            content={
              course?.operation.opening_hours ??
              InfoNeeded({
                href: generateFormUrl(course.name),
              })
            }
          />
          <Label
            title="정기 휴무일"
            content={
              course?.operation.regular_closed_days ??
              InfoNeeded({
                href: generateFormUrl(course.name),
              })
            }
          />
        </div>
        <Separator className="my-5" />
        <h2 className="text-foreground mb-2 text-xl font-bold">연락처</h2>
        <div className="flex flex-col gap-1">
          <Label
            title="담당자 전화번호"
            content={
              course?.contact.phone_number ? (
                <a
                  href={`tel:${course?.contact.phone_number}`}
                  className="text-blue-400"
                >
                  {course?.contact.phone_number}
                </a>
              ) : (
                InfoNeeded({
                  href: generateFormUrl(course.name),
                })
              )
            }
          />
        </div>
        <Separator className="my-5" />
        <h2 className="text-foreground mb-2 text-xl font-bold">이용 방법</h2>
        <div className="flex flex-col gap-1">
          <Label
            title="예약 방법"
            content={
              course?.operation.registration_method ??
              InfoNeeded({
                href: generateFormUrl(course.name),
              })
            }
          />
          <Label
            title="홈페이지"
            content={
              course?.operation.website ? (
                <a href={course?.operation.website} className="text-blue-400">
                  상세 페이지 바로가기
                </a>
              ) : (
                InfoNeeded({
                  href: generateFormUrl(course.name),
                })
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
