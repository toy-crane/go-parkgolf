"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Marker from "@/components/map/marker";
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
  const router = useRouter();
  return (
    <Map
      center={position.center}
      isPanto={true}
      level={position.level}
      style={{ width: "100%", height: "100vh" }}
    >
      {courses?.map((course) => (
        <Marker
          course={course}
          key={course.name}
          isMarked={selectedCourse?.name === course.name}
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
  );
};

export default MainMap;
