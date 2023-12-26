"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { DEFAULT_POSITION } from "@/config/map";
import type { Course } from "@/types";

import CurrentPositionButton from "./current-position-button";

interface HeaderProps {
  courses: Course[];
}

const Header = ({ courses }: HeaderProps) => {
  const courses_options = useMemo(
    () =>
      courses.map((course) => ({
        title: `${course.name} (${course.address[0]?.region_1depth_name} ${course.address[0]?.region_2depth_name})`,
        href: `/?${new URLSearchParams({
          courseId: String(course.id),
          modal: String(true),
          level: String(9),
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
              width={40}
              height={40}
              alt="Logo"
              className="align-middle"
            />
          </Link>
          <CommandMenu options={courses_options} />
        </div>
        <CurrentPositionButton />
      </nav>
    </header>
  );
};

export default Header;
