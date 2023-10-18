"use client";

import { useState } from "react";
import Link from "next/link";
import Marker from "@/components/map/marker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useAmplitude } from "@/libs/amplitude";
import { generateFormUrl } from "@/libs/google-form";
import { cn } from "@/libs/tailwind";
import type { Course } from "@/types";
import {
  AlarmClock,
  Clock,
  FlagTriangleRight,
  LocateFixed,
  Pencil,
  Phone,
  Share2,
} from "lucide-react";
import { Map } from "react-kakao-maps-sdk";

const DEFAULT_POSITION = {
  level: 7,
  center: { lat: 37.5161996814031, lng: 127.075939572603 },
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

const Main = ({ courses }: { courses: Course[] }) => {
  const { track } = useAmplitude();
  const [open, setOpen] = useState(false);
  // 지도의 위치
  const [position, setPosition] = useState<{
    level: number;
    center: { lat: number; lng: number };
  }>(DEFAULT_POSITION);
  const { toast } = useToast();

  // 선택한 파크골프장
  const [selectedcourse, setSelectedcourse] = useState<Course | undefined>();

  const address = selectedcourse?.address;

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-30 p-3">
        <div className="flex justify-between">
          <Button
            className="px-3 text-xl font-extrabold"
            size="lg"
            onClick={() => {
              track("logo clicked");
              setPosition(DEFAULT_POSITION);
            }}
          >
            <FlagTriangleRight className="mr-1" size={20} />
            GO PARKGOLF
          </Button>
          <div className="flex flex-col gap-2">
            <Button className="font-bold" asChild size="sm">
              <a
                href="https://forms.gle/KJynLwmB1UoJt2qXA"
                target="_blank"
                rel="noopener noreferrer"
              >
                제작자에게 문의하기
              </a>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="self-end"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setPosition((p) => ({
                      ...p,
                      center: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      },
                    }));
                  },
                  () => alert("위치 정보를 가져오는데 실패했습니다."),
                  {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000,
                  },
                );
                track("current position clicked");
              }}
            >
              <LocateFixed size={24} />
            </Button>
          </div>
        </div>
      </nav>
      <Map
        center={position.center}
        isPanto={true}
        level={7}
        style={{ width: "100%", height: "100vh" }}
        onCenterChanged={(map) =>
          setPosition({
            level: map.getLevel(),
            center: {
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            },
          })
        }
      >
        {courses?.map((course) => (
          <Marker
            course={course}
            key={course.name}
            isMarked={selectedcourse?.name === course.name}
            onClick={() => {
              setSelectedcourse(course);
              setPosition((position) => ({
                ...position,
                center: {
                  lat: Number(course.address.y),
                  lng: Number(course.address.x),
                },
              }));
              setOpen((open) => !open);
              track("course clicked", { ...course });
            }}
          />
        ))}
      </Map>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={"bottom"} className="h-auto">
          <SheetHeader className="mb-2">
            <SheetTitle>
              <div className="flex items-center gap-3 text-2xl">
                <Link
                  href={`/courses/${selectedcourse?.id}`}
                  onClick={() => track("detail page link clicked")}
                >
                  {selectedcourse?.name}
                </Link>
                <div className="flex items-center">
                  <Button
                    variant={"ghost"}
                    size="icon"
                    asChild
                    className="h-7 w-7"
                    onClick={() => {
                      track("sheet modify button clicked");
                    }}
                  >
                    <a
                      href={generateFormUrl(selectedcourse?.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Pencil size={20} />
                    </a>
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="h-7 w-7"
                    size="icon"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${window.location.href}courses/${selectedcourse?.id}`,
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
            </SheetTitle>
            <SheetDescription className="text-lg">
              {address?.address_name}
            </SheetDescription>
          </SheetHeader>
          <Separator className="mb-4 mt-6" />
          <div className="grid w-full items-center">
            <div className="flex items-center gap-4">
              <FlagTriangleRight size={20} />
              <div className="text-base">{selectedcourse?.hole_count}홀</div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-4">
              <Phone size={20} />
              <div className="text-base">
                {selectedcourse?.contact.phone_number ? (
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 text-base text-blue-400"
                    onClick={() => {
                      track("phone number clicked", { ...selectedcourse });
                    }}
                  >
                    <a href={`tel:${selectedcourse?.contact.phone_number}`}>
                      {selectedcourse?.contact.phone_number}
                    </a>
                  </Button>
                ) : (
                  InfoNeeded({ href: generateFormUrl(selectedcourse?.name) })
                )}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-4">
              <Clock size={20} />
              <div className="text-base">
                <div className="flex">
                  <div className="mr-2">영업 시간 -</div>
                  {selectedcourse?.operation.opening_hours ??
                    InfoNeeded({ href: generateFormUrl(selectedcourse?.name) })}
                </div>
                {selectedcourse?.operation.regular_closed_days && (
                  <div className="flex">
                    <div className="mr-2">정기 휴무일 - </div>
                    {selectedcourse?.operation.regular_closed_days}
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="mb-3 flex items-center gap-4">
              <AlarmClock size={20} />
              <div className="text-base">
                <div className="flex">
                  <div className="mr-2">예약 방법 - </div>
                  {selectedcourse?.operation.registration_method ??
                    InfoNeeded({ href: generateFormUrl(selectedcourse?.name) })}
                </div>
                <div>
                  {selectedcourse?.operation.website ? (
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="p-0 text-base text-blue-400"
                      onClick={() => track("website detail clicked")}
                    >
                      <a href={selectedcourse?.operation.website}>
                        상세 정보 홈페이지
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Main;
