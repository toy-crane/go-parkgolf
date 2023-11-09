"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { DEFAULT_POSITION } from "@/config/map";
import { useAmplitude } from "@/libs/amplitude";
import type { Course } from "@/types";
import { LocateFixed } from "lucide-react";

interface HeaderProps {
  courses: Course[];
}

const Header = ({ courses }: HeaderProps) => {
  const { track } = useAmplitude();
  const router = useRouter();

  const courses_options = useMemo(
    () =>
      courses.map((course) => ({
        title: `${course.name} (${course.address[0]?.region_1depth_name} ${course.address[0]?.region_2depth_name})`,
        href: `/?${new URLSearchParams({
          courseId: String(course.id),
          modal: String(true),
        }).toString()}`,
      })),
    [courses],
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-30 px-3 pt-3">
      <nav className="flex justify-between gap-2">
        <div className="flex flex-grow gap-2 md:flex-grow-0">
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
              width={32}
              height={32}
              alt="Logo"
              className="align-middle"
            />
          </Link>
          <CommandMenu options={courses_options} />
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="flex-shrink-0 "
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                router.replace(
                  `/?${new URLSearchParams({
                    lat: String(position.coords.latitude),
                    lng: String(position.coords.longitude),
                  }).toString()}`,
                );
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
      </nav>
    </header>
  );
};

export default Header;
