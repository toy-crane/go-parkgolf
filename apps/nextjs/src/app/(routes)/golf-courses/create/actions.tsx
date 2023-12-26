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
    reference,
    registration_method,
    regular_close_days,
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

  const { data: golfCourse, error: golfCourseError } = await supabase
    .from("golf_courses")
    .insert({
      slug: name.replace(/ /g, "-").toLowerCase(),
      name: name,
      hole_count: hole_count,
      road_address_name: road_address_name,
      lot_number_address_name: address_name,
      lng: kakao_address.x as number,
      lat: kakao_address.y as number,
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

  const operationParams = {
    regular_close_days,
    opening_hours,
    website,
    registration_method,
    reference,
    golf_course_id: golfCourse.id,
  };

  const { error: operationError } = await supabase.from("operations").insert({
    ...operationParams,
  });

  if (operationError) {
    throw Error(operationError.message);
  }

  if (phone_number) {
    const { error: contactError } = await supabase.from("contacts").insert({
      phone_number,
      golf_course_id: golfCourse.id,
    });

    if (contactError) {
      throw Error(contactError.message);
    }
  }

  return { success: true, golfCourseSlug: golfCourse.slug };
}
