"use server";

import { env } from "@/env.mjs";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import type { z } from "zod";

import type { formSchema } from "./schema";

type Inputs = z.infer<typeof formSchema>;

export async function createGolfCourse(inputs: Inputs) {
  const {
    address,
    name,
    hole_count,
    registration_method,
    regular_closed_days,
    website,
    opening_hours,
    phone_number,
  } = inputs;
  const supabase = await createSupabaseServerClient();

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    address,
  )}`;

  const kakaoResponse = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: env.NEXT_PUBLIC_KAKAO_API_KEY,
    },
  });
  const json = await kakaoResponse.json();
  const { documents } = json;
  const kakao_address = documents[0].address;
  const address_name = kakao_address
    ? (kakao_address.address_name as string)
    : "";
  const kakao_road_address = documents[0].road_address || undefined;
  const road_address_name = kakao_road_address
    ? ` ${kakao_road_address.address_name}`
    : "";

  const { x, y } = kakao_address as { x: number; y: number };

  const { data: golfCourse, error: golfCourseError } = await supabase
    .from("golf_courses")
    .insert({
      slug: name.replace(/ /g, "-").toLowerCase(),
      name: name,
      hole_count: hole_count,
      road_address_name: road_address_name,
      lot_number_address_name: address_name,
      lng: x,
      lat: y,
      phone_number,
      location: `POINT(${x} ${y})`,
      regular_closed_days,
      opening_hours,
      website,
      registration_method,
    })
    .select()
    .single();

  if (golfCourseError) {
    throw new Error(golfCourseError.message);
  }

  const { error: addressError } = await supabase
    .from("lot_number_addresses")
    .insert({
      ...kakao_address,
      golf_course_id: golfCourse.id,
    });
  if (addressError) {
    throw new Error(addressError.message);
  }

  if (kakao_road_address) {
    const { error: roadAddressError } = await supabase
      .from("road_addresses")
      .insert({
        ...kakao_road_address,
        golf_course_id: golfCourse.id,
      });
    if (roadAddressError) {
      throw new Error(roadAddressError.message);
    }
  }

  return { success: true, golfCourseSlug: golfCourse.slug };
}
