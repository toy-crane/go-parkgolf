import dynamic from "next/dynamic";
import { headers } from "next/headers";
import KakaoMap from "@/components/map/kakao-map";
import HomeNav from "@/components/nav/home";
import { DEFAULT_POSITION } from "@/config/map";
import { isApp } from "@/libs/user-agent";

import { getCourses } from "./_components/action";

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

const Home = async ({
  searchParams,
}: {
  searchParams: {
    courseId?: string;
    level?: string;
    lat?: string;
    lng?: string;
    modal?: string;
  };
}) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;
  const selectedCourseId = searchParams?.courseId
    ? String(searchParams.courseId)
    : undefined;
  const level = Number(searchParams?.level) || DEFAULT_POSITION.level;
  const lat = Number(searchParams?.lat) || undefined;
  const lng = Number(searchParams?.lng) || undefined;

  const courses = await getCourses();

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId,
  );

  const position = {
    level: level,
    center: {
      lat: lat ?? DEFAULT_POSITION.center.lat,
      lng: lng ?? DEFAULT_POSITION.center.lng,
    },
  };

  const selectOptions = courses.map((course) => ({
    title: `${course.name} (${
      course.lot_number_address_name.split(" ").splice(0, 2).join(" ") ?? ""
    })`,
    href: `/golf-courses/${course.slug}`,
  }));

  const markers = courses.map((c) => ({
    position: {
      lat: Number(c.lat),
      lng: Number(c.lng),
    },
    text: c.name,
    to: `/golf-courses/${c.slug}`,
    selected: c.slug === selectedCourse?.slug,
  }));

  return (
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <HomeNav selectOptions={selectOptions} />
      {/* homeNav 만큼 Padding 확보 */}
      <section>
        <KakaoMap
          markers={markers}
          center={position.center}
          showCurrentPosition={true}
          size={{ width: "100%", height: "100vh" }}
          level={9}
        />
      </section>
    </>
  );
};

export default Home;
