"use client";

import { useState } from "react";
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
import { useAmplitude } from "@/libs/amplitude";
import type { Location } from "@/types";
import { AlarmClock, Clock, FlagTriangleRight, Phone } from "lucide-react";
import { Map } from "react-kakao-maps-sdk";
import type { Fetcher } from "swr";
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher: Fetcher<Location[], string> = (url) =>
  fetch(url).then((res) => res.json());

const DEFAULT_POSITION = {
  level: 7,
  center: { lat: 37.564214, lng: 127.001699 },
};

const Locations = () => {
  const { track } = useAmplitude();
  const { data: locations } = useSWR("/api/locations", fetcher);
  const [open, setOpen] = useState(false);
  // 지도의 위치
  const [position, setPosition] = useState<{
    level: number;
    center: { lat: number; lng: number };
  }>(DEFAULT_POSITION);

  // 선택한 파크골프장
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >();

  const address = selectedLocation?.address;

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
        {locations?.map((location) => (
          <Marker
            location={location}
            key={location.name}
            isMarked={selectedLocation?.name === location.name}
            onClick={() => {
              setSelectedLocation(location);
              setPosition((position) => ({
                ...position,
                center: {
                  lat: Number(location.address.y),
                  lng: Number(location.address.x),
                },
              }));
              setOpen((open) => !open);
              track("location clicked", { ...location });
            }}
          />
        ))}
      </Map>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={"bottom"} className="h-auto">
          <SheetHeader className="mb-2">
            <SheetTitle>{selectedLocation?.name}</SheetTitle>
            <SheetDescription>{address?.address_name}</SheetDescription>
          </SheetHeader>
          <Separator className="mb-2 mt-4" />
          <div className="grid w-full items-center">
            <div className="flex items-center gap-4">
              <FlagTriangleRight size={20} />
              <div className="text-base">{selectedLocation?.hole_count}홀</div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-4">
              <Phone size={20} />
              <div className="text-base">
                {selectedLocation?.contact.phone_number ? (
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 text-base text-blue-400"
                    onClick={() => {
                      track("phone number clicked", { ...selectedLocation });
                    }}
                  >
                    <a href={`tel:${selectedLocation?.contact.phone_number}`}>
                      {selectedLocation?.contact.phone_number}
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
                  {selectedLocation?.operation.opening_hours ??
                    "등록된 정보가 없습니다"}
                </div>
                {selectedLocation?.operation.regular_closed_days && (
                  <div>
                    {" "}
                    정기 휴무일 -{" "}
                    {selectedLocation?.operation.regular_closed_days}
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
                  {selectedLocation?.operation.registration_method ??
                    "등록된 정보가 없습니다"}
                </div>
                <div>
                  {selectedLocation?.operation.website ? (
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="p-0 text-base text-blue-400"
                    >
                      <a href={selectedLocation?.operation.website}>
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

export default Locations;
