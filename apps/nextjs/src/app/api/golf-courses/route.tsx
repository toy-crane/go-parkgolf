import type { Database } from "@/types/generated";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // defaults to force-static

interface RequestBody {
  course_name: string;
  address: string;
  hole_count: number;
  opening_hours?: string;
  regular_closed_days?: string;
  website?: string;
  registration_method?: string;
  reference?: string;
  phone_number?: string;
}

export async function POST(request: Request) {
  const {
    course_name,
    address,
    hole_count,
    opening_hours,
    regular_closed_days,
    website,
    registration_method,
    reference,
    phone_number,
  } = (await request.json()) as RequestBody;
  const slug = course_name.replace(/ /g, "-").toLowerCase();

  if (course_name === null || address === null || hole_count === null) {
    return Response.json({ error: "필수 필드가 없습니다." });
  }

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    address,
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `KakaoAK 6f447bc34a2d339805e6816490bf2a66`,
    },
  });
  const json = await response.json();
  const { documents } = json;
  const kakao_address = documents[0].address;
  const address_name = kakao_address ? kakao_address.address_name : "";
  const kakao_road_address = documents[0].road_address || undefined;
  const road_address_name = kakao_road_address
    ? ` ${kakao_road_address.address_name}`
    : "";
  const searchable_address =
    `${address_name}${road_address_name} ${course_name}`.trim();

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const golfCourseParams = {
    name: course_name,
    searchable_address,
    hole_count: hole_count,
    slug,
  };

  const { data: golfCourse, error: golfCourseError } = await supabase
    .from("golf_course")
    .upsert(golfCourseParams)
    .select()
    .single();

  if (golfCourseError) {
    return Response.json({ error: golfCourseError });
  }

  const { data: addressResponse, error: addressError } = await supabase
    .from("address")
    .upsert({
      ...kakao_address,
      golf_course_id: golfCourse.id,
    })
    .select();
  if (addressError) {
    return Response.json({ error: addressError });
  }

  if (kakao_road_address) {
    const { data: roadAddressResponse, error: roadAddressError } =
      await supabase
        .from("road_address")
        .upsert({
          ...kakao_road_address,
          golf_course_id: golfCourse.id,
        })
        .select();
    if (roadAddressError) {
      return Response.json({ error: roadAddressError });
    }
  }

  const operationParams = {
    regular_closed_days,
    opening_hours,
    website,
    registration_method,
    reference,
    golf_course_id: golfCourse.id,
  };

  const { data: operationData, error: operationError } = await supabase
    .from("operation")
    .upsert({
      ...operationParams,
    })
    .select();

  if (operationError) {
    return Response.json({ error: operationError });
  }

  const contactParams = {
    phone_number,
    golf_course_id: golfCourse.id,
  };

  const { data: contactData, error: contactError } = await supabase
    .from("contact")
    .upsert({
      ...contactParams,
    })
    .select();

  if (contactError) {
    return Response.json({ golfCourse, operationData, contactData });
  }

  return Response.json({ course_name });
}
