"use client";

import Link from "next/link";
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

const MAJOR_REGIONS = [
  {
    name: "전국",
    level: 12,
    lat: "36.567969210790785",
    lng: "127.2127070214483",
  },
  { name: "서울", level: 10, lat: "37.540705", lng: "126.956764" },
  { name: "인천", level: 9, lat: "37.469221", lng: "126.573234" },
  { name: "광주", level: 8, lat: "35.126033", lng: "126.831302" },
  { name: "대구", level: 9, lat: "35.798838", lng: "128.583052" },
  { name: "울산", level: 9, lat: "35.519301", lng: "129.239078" },
  { name: "대전", level: 9, lat: "36.321655", lng: "127.378953" },
  { name: "부산", level: 9, lat: "35.198362", lng: "129.053922" },
  { name: "경기", level: 11, lat: "37.567167", lng: "127.190292" },
  { name: "강원", level: 11, lat: "37.555837", lng: "128.209315" },
  { name: "충남", level: 11, lat: "36.557229", lng: "126.779757" },
  { name: "충북", level: 11, lat: "36.628503", lng: "127.929344" },
  { name: "경북", level: 11, lat: "36.248647", lng: "128.664734" },
  { name: "경남", level: 11, lat: "35.259787", lng: "128.664734" },
  { name: "전북", level: 11, lat: "35.716705", lng: "127.144185" },
  { name: "전남", level: 11, lat: "34.819400", lng: "126.893113" },
  { name: "제주", level: 11, lat: "33.364805", lng: "126.542671" },
];

const Label = ({ title, content }: CardProps) => {
  return (
    <div className="flex items-center">
      <h3 className="mr-4 text-base font-semibold">{title}</h3>
      <div className="text-muted-foreground text-base">{content}</div>
    </div>
  );
};

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

const CourseDetail = ({
  course,
  nearCourses,
}: {
  course: Course;
  nearCourses: Course[];
}) => {
  const { track } = useAmplitude();
  const router = useRouter();
  const { toast } = useToast();

  const address = course.address[0];
  const operation = course.operation[0];
  const contact = course.contact[0];

  return (
    <div>
      <nav className="mb-4 flex items-center justify-between pt-3">
        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
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
      </nav>
      <section>
        <StaticMap // 지도를 표시할 Container
          className="mb-12"
          marker={[
            {
              position: {
                lat: Number(address?.y),
                lng: Number(address?.x),
              },
              text: course.name,
            },
          ]}
          center={{
            // 지도의 중심좌표
            lat: Number(address?.y),
            lng: Number(address?.x),
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "280px",
          }}
          level={6} // 지도의 확대 레벨
        />
      </section>
      <section className="mb-20 flex w-full flex-col">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          {course.name}
        </h1>
        <div className="flex flex-col gap-1">
          <Label title="위치" content={address?.address_name} />
          <Label title="규모" content={`${course?.hole_count} 홀`} />
        </div>
        <Separator className="my-5" />
        <h2 className="text-foreground mb-2 text-xl font-bold">운영 시간</h2>
        <div className="flex flex-col gap-1">
          <Label
            title="영업시간"
            content={
              operation?.opening_hours ??
              InfoNeeded({
                href: generateFormUrl(course.name),
              })
            }
          />
          <Label
            title="정기 휴무일"
            content={
              operation?.regular_closed_days ??
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
              contact?.phone_number ? (
                <a
                  href={`tel:${contact?.phone_number}`}
                  className="text-blue-400"
                >
                  {contact?.phone_number}
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
              operation?.registration_method ??
              InfoNeeded({
                href: generateFormUrl(course.name),
              })
            }
          />
          <Label
            title="홈페이지"
            content={
              operation?.website ? (
                <a href={operation?.website} className="text-blue-400">
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
        {nearCourses.length > 0 && (
          <>
            <Separator className="mb-14 mt-5" />
            <h2 className="text-foreground mb-6 text-xl font-bold">
              주변 파크 골프장 둘러보기
            </h2>
            <div className="grid grid-cols-2 gap-y-3 md:grid-cols-3">
              {nearCourses.map((course) => (
                <Link
                  href={`/golf-courses/${course.slug}`}
                  key={course.name}
                  onClick={() => track("near link clicked")}
                >
                  {course.name}
                </Link>
              ))}
            </div>
          </>
        )}
        <Separator className="my-14" />
        <h2 className="text-foreground mb-6 text-xl font-bold">
          전국의 다른 파크골프장 살펴보기
        </h2>
        <div className="grid grid-cols-2 gap-y-3 md:grid-cols-3">
          {MAJOR_REGIONS.map((region) => (
            <Link
              href={`/?${new URLSearchParams({
                level: String(region.level),
                lng: region.lng,
                lat: region.lat,
              }).toString()}`}
              key={region.name}
              onClick={() => track("region link clicked")}
            >
              {region.name === "전국" ? region.name : `${region.name}`} 파크
              골프장
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
