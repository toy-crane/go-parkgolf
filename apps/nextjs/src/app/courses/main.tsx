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
  Pencil,
  Phone,
  Share2,
} from "lucide-react";
import { Map } from "react-kakao-maps-sdk";

const DEFAULT_POSITION = {
  level: 7,
  center: { lat: 37.5161996814031, lng: 127.075939572603 },
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
        <Button
          className="px-4 text-xl font-extrabold"
          size="lg"
          onClick={() => {
            track("logo clicked");
            setPosition(DEFAULT_POSITION);
          }}
        >
          <FlagTriangleRight className="mr-1" size={20} />
          GO PARKGOLF
        </Button>
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
              <div className="flex items-center gap-2">
                <Link href={`/courses/${selectedcourse?.id}`}>
                  {selectedcourse?.name}
                </Link>
                <div>
                  <Button
                    variant={"ghost"}
                    size="icon"
                    asChild
                    className="h-6 w-6"
                  >
                    <a
                      href={generateFormUrl(selectedcourse?.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Pencil size={16} />
                    </a>
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="h-6 w-6"
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
                    }}
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription>{address?.address_name}</SheetDescription>
          </SheetHeader>
          <Separator className="mb-2 mt-4" />
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
                  {selectedcourse?.operation.opening_hours ??
                    "등록된 정보가 없습니다"}
                </div>
                {selectedcourse?.operation.regular_closed_days && (
                  <div>
                    {" "}
                    정기 휴무일 -{" "}
                    {selectedcourse?.operation.regular_closed_days}
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-4">
              <AlarmClock size={20} />
              <div className="text-base">
                <div>
                  예약 방법 -{" "}
                  {selectedcourse?.operation.registration_method ??
                    "등록된 정보가 없습니다"}
                </div>
                <div>
                  {selectedcourse?.operation.website ? (
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="p-0 text-base text-blue-400"
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
