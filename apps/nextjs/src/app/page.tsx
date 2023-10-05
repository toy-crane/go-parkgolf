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
import type { Location } from "@/types";
import { Clock, FlagTriangleRight, Phone } from "lucide-react";
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
          <Separator className="my-4" />
          <div className="grid w-full items-center gap-4">
            <div className="flex items-center gap-2">
              <FlagTriangleRight size={16} />
              <div className="text-sm">{selectedLocation?.hole_count} 홀</div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <div className="text-sm">
                {selectedLocation?.contact.phone_number ??
                  "등록된 연락처가 없습니다"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <div className="text-sm">매일 09:00 ~ 15:00</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Locations;
