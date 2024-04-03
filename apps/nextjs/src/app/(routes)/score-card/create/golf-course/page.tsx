import React from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

import FormHeader from "../_components/form-header";
import CourseForm from "./form";

const Page = async ({
  searchParams: { golfCourseId },
}: {
  searchParams: {
    golfCourseId?: string;
  };
}) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const query = supabase
    .from("golf_courses")
    .select(`*, lot_number_addresses(*)`)
    .returns<GolfCourse[]>();
  const result = await query;

  if (!result.data) {
    notFound();
  }

  return (
    <>
      <FormHeader title="게임 시작하기" description="골프장을 선택해 주세요" />
      <CourseForm courses={result.data} golfCourseId={golfCourseId} />
    </>
  );
};

export default Page;
