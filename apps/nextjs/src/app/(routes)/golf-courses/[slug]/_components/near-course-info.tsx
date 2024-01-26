import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { haversineDistance } from "@/libs/map";
import type { GolfCourse } from "@/types";

import { GetCourses } from "../action";

const MAJOR_REGIONS = [
  {
    name: "전국",
    level: 12,
    lat: "36.567969210790785",
    lng: "127.2127070214483",
  },
  { name: "서울", level: 10, lat: "37.540705", lng: "126.956764" },
  { name: "인천", level: 9, lat: "37.469221", lng: "126.573234" },
  { name: "광주", level: 8, lat: "35.126033", lng: "126.831302" },
  { name: "대구", level: 9, lat: "35.798838", lng: "128.583052" },
  { name: "울산", level: 9, lat: "35.519301", lng: "129.239078" },
  { name: "대전", level: 9, lat: "36.321655", lng: "127.378953" },
  { name: "부산", level: 9, lat: "35.198362", lng: "129.053922" },
  { name: "경기", level: 11, lat: "37.567167", lng: "127.190292" },
  { name: "강원", level: 11, lat: "37.555837", lng: "128.209315" },
  { name: "충남", level: 11, lat: "36.557229", lng: "126.779757" },
  { name: "충북", level: 11, lat: "36.628503", lng: "127.929344" },
  { name: "경북", level: 11, lat: "36.248647", lng: "128.664734" },
  { name: "경남", level: 11, lat: "35.259787", lng: "128.664734" },
  { name: "전북", level: 11, lat: "35.716705", lng: "127.144185" },
  { name: "전남", level: 11, lat: "34.819400", lng: "126.893113" },
  { name: "제주", level: 11, lat: "33.364805", lng: "126.542671" },
];

const NearCourseInfo = async ({ course }: { course: GolfCourse }) => {
  const courses = await GetCourses();
  const allCoursesExcludeMe = courses.filter((c) => c.slug !== course.slug);

  const nearCourses = allCoursesExcludeMe.filter((c) => {
    const courseLat = c.lat ?? 0;
    const courseLng = c.lng ?? 0;
    return (
      haversineDistance(
        course.lat ?? 0,
        course.lng ?? 0,
        courseLat,
        courseLng,
      ) <= 20
    );
  });

  return (
    <section className="space-y-6">
      {nearCourses.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-bold">
              주변 파크 골프장 둘러보기
            </h2>
            <div className="grid grid-cols-2 gap-y-3 md:grid-cols-3">
              {nearCourses.map((course) => (
                <Link href={`/golf-courses/${course.slug}`} key={course.name}>
                  {course.name}
                </Link>
              ))}
            </div>
          </div>
          <Separator />
        </div>
      )}
      <div className="space-y-3">
        <h2 className="text-foreground text-xl font-bold">
          전국의 다른 파크골프장 살펴보기
        </h2>
        <div className="mb-16 grid grid-cols-2 gap-y-3 md:grid-cols-3">
          {MAJOR_REGIONS.map((region) => (
            <Link
              href={`/?${new URLSearchParams({
                level: String(region.level),
                lng: region.lng,
                lat: region.lat,
              }).toString()}`}
              key={region.name}
            >
              {region.name === "전국" ? region.name : `${region.name}`} 파크
              골프장
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearCourseInfo;
