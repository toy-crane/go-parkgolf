"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { DEFAULT_POSITION } from "@/config/map";
import { useAmplitude } from "@/libs/amplitude";
import { generateFormUrl } from "@/libs/google-form";
import { cn } from "@/libs/tailwind";
import type { Course, Position } from "@/types";
import {
  AlarmClock,
  Clock,
  FlagTriangleRight,
  Pencil,
  Phone,
  Share2,
} from "lucide-react";

import CourseSheet from "./course-sheet";
import Footer from "./footer";
import Header from "./header";
import MainMap from "./main-map";

const Main = ({
  courses,
  level,
  lat,
  lng,
  modalOpen,
  selectedCourse,
}: {
  courses: Course[];
  selectedCourse?: Course;
  level?: string;
  lat?: string;
  lng?: string;
  modalOpen: boolean;
}) => {
  // 지도의 위치
  const [position, setPosition] = useState<Position>({
    level: DEFAULT_POSITION.level,
    center: {
      lat: DEFAULT_POSITION.center.lat,
      lng: DEFAULT_POSITION.center.lng,
    },
  });

  const address = selectedCourse?.address[0];

  useEffect(() => {
    if (selectedCourse) {
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
  }, [address?.x, address?.y, selectedCourse]);

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

  return (
    <>
      <Header courses={courses} />
      <section>
        <MainMap
          courses={courses}
          selectedCourse={selectedCourse}
          position={position}
        />
      </section>
      <Footer />
      <CourseSheet selectedCourse={selectedCourse} open={modalOpen} />
    </>
  );
};

export default Main;
