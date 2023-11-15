"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Marker from "@/app/(routes)/home/marker";
import { useAmplitude } from "@/libs/amplitude";
import type { Course, Position } from "@/types";
import { Map } from "react-kakao-maps-sdk";

interface Props {
  courses: Course[];
  selectedCourse?: Course;
  position: Position;
}

const MainMap = ({ courses, selectedCourse, position }: Props) => {
  const { track } = useAmplitude();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handlePosition = (map: kakao.maps.Map) => {
    const lng = map.getCenter().getLng();
    const lat = map.getCenter().getLat();
    const params = new URLSearchParams(searchParams);
    params.set("lng", String(lng));
    params.set("lat", String(lat));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleZoom = (map: kakao.maps.Map) => {
    const level = map.getLevel();
    const params = new URLSearchParams(searchParams);
    params.set("level", String(level));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Map
      center={position.center}
      isPanto={true}
      level={position.level}
      style={{ width: "100%", height: "100vh" }}
      onDragEnd={handlePosition}
      onZoomChanged={handleZoom}
    >
      {courses?.map((course) => (
        <Marker
          course={course}
          key={course.name}
          isMarked={selectedCourse?.name === course.name}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("courseId", String(course.id));
            params.set("modal", String(true));
            router.replace(`?${params.toString()}`);
            track("course clicked", { ...course });
          }}
        />
      ))}
    </Map>
  );
};

export default MainMap;
