"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Marker from "@/components/map/marker";
import type { Option } from "@/components/ui/auto-complete";
import { AutoComplete } from "@/components/ui/auto-complete";
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
import type { Course, Position } from "@/types";
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

const Main = ({
  courses,
  level,
  lat,
  lng,
  courseId,
  modalOpen,
}: {
  courses: Course[];
  level?: string;
  lat?: string;
  lng?: string;
  courseId?: number;
  modalOpen?: boolean;
}) => {
  const { track } = useAmplitude();
  const router = useRouter();
  const searchParams = useSearchParams()!;

  // 지도의 위치
  const [position, setPosition] = useState<Position>({
    level: DEFAULT_POSITION.level,
    center: {
      lat: DEFAULT_POSITION.center.lat,
      lng: DEFAULT_POSITION.center.lng,
    },
  });

  const OPTIONS = useMemo(
    () =>
      courses.map((course) => ({
        label: `${course.name} (${course.address[0]?.region_1depth_name} ${course.address[0]?.region_2depth_name})`,
        value: String(course.id),
      })),
    [courses],
  );

  const { toast } = useToast();
  const [value] = useState<Option>();

  const selectedcourse = useMemo(
    () => courses.find((course) => course.id === courseId),
    [courses, courseId],
  );
  const address = selectedcourse?.address[0];
  const operation = selectedcourse?.operation[0];

  useEffect(() => {
    if (selectedcourse) {
      const lat = address?.y!;
      const lng = address?.x!;
      setPosition((p) => ({
        ...p,
        center: {
          lat,
          lng,
        },
      }));
    }
  }, [address?.x, address?.y, selectedcourse]);

  useEffect(() => {
    setPosition((p) => ({
      ...p,
      level: level ? Number(level) : p.level,
      center: {
        lat: lat ? Number(lat) : p.center.lat,
        lng: lng ? Number(lng) : p.center.lng,
      },
    }));
  }, [lat, lng, level]);

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const currentParams = new URLSearchParams(searchParams);
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined) {
          // `undefined`를 체크하여 해당 값을 건너뜁니다.
          currentParams.set(key, value);
        }
      });

      return currentParams.toString();
    },
    [searchParams],
  );

  const handleSearchInput = (option: Option) => {
    router.replace(
      `?${createQueryString({
        modal: String(true),
        courseId: String(option.value),
      })}`,
    );
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-30 px-3 pt-3">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="flex items-start gap-2">
            <Link
              href={`?${new URLSearchParams({
                lat: String(DEFAULT_POSITION.center.lat),
                lng: String(DEFAULT_POSITION.center.lng),
                level: String(DEFAULT_POSITION.level),
              }).toString()}`}
              className="flex-shrink-0 self-center"
            >
              <Image
                src="/logo.png"
                width={36}
                height={36}
                alt="Logo"
                className="align-middle"
              />
            </Link>
            <AutoComplete
              options={OPTIONS}
              emptyMessage="해당하는 검색 결과가 없습니다."
              placeholder="주소나 이름을 입력해주세요."
              onValueChange={handleSearchInput}
              value={value}
              className="w-full self-center md:w-[480px]"
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="self-end md:self-center"
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
      </nav>
      <section>
        <Map
          center={position.center}
          isPanto={true}
          level={position.level}
          style={{ width: "100vw", height: "100vh" }}
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
                router.replace(
                  `?${new URLSearchParams({
                    courseId: String(course.id),
                    modal: String(true),
                  }).toString()}`,
                );
                track("course clicked", { ...course });
              }}
            />
          ))}
        </Map>
      </section>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-end px-3 pb-3">
        <h2>
          <Button className="font-bold" asChild size="sm">
            <a
              href="https://forms.gle/41DvTTg1Z3SrQpNQ8"
              target="_blank"
              rel="noopener noreferrer"
            >
              제작자에게 문의하기
            </a>
          </Button>
        </h2>
      </nav>
      <Sheet
        open={modalOpen}
        onOpenChange={(open) => {
          router.replace(
            `?${new URLSearchParams({ open: String(open) }).toString()}`,
          );
        }}
      >
        <SheetContent side={"bottom"} className="h-auto">
          <SheetHeader className="mb-2">
            <SheetTitle>
              <div className="flex items-center gap-3 text-2xl">
                <Link
                  href={`/golf-courses/${selectedcourse?.slug}`}
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
                {selectedcourse?.contact[0]?.phone_number ? (
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 text-base text-blue-400"
                    onClick={() => {
                      track("phone number clicked", { ...selectedcourse });
                    }}
                  >
                    <a href={`tel:${selectedcourse?.contact[0]?.phone_number}`}>
                      {selectedcourse?.contact[0]?.phone_number}
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
                  {selectedcourse?.operation[0]?.opening_hours ??
                    InfoNeeded({ href: generateFormUrl(selectedcourse?.name) })}
                </div>
                {selectedcourse?.operation[0]?.regular_closed_days && (
                  <div className="flex">
                    <div className="mr-2">정기 휴무일 - </div>
                    {selectedcourse?.operation[0]?.regular_closed_days}
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
                  {operation?.registration_method ??
                    InfoNeeded({ href: generateFormUrl(selectedcourse?.name) })}
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Main;
