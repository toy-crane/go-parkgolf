import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateFormUrl } from "@/libs/google-form";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { Pencil } from "lucide-react";

const CourseDetailInfo = async ({
  golfCourseId,
  courseName,
}: {
  golfCourseId: string;
  courseName: string;
}) => {
  const supabase = await createSupabaseServerClientReadOnly();

  // Promise.all을 사용하여 두 비동기 요청을 병렬로 실행
  const [golfCouseResponse, response] = await Promise.all([
    supabase.from("golf_courses").select("*").eq("id", golfCourseId).single(),
    supabase
      .from("courses")
      .select("*, holes(*)")
      .order("hole_number", {
        foreignTable: "holes",
        ascending: true,
      })
      .eq("golf_course_id", golfCourseId),
  ]);

  if (response.error ?? golfCouseResponse.error) throw response.error;
  const courses = response.data;
  const golfCourse = golfCouseResponse.data;
  const totalDistance = courses.reduce(
    (acc: number, course) =>
      acc +
      course.holes.reduce(
        (acc: number, hole) => acc + (hole.distance ? hole.distance : 0),
        0,
      ),
    0,
  );
  if (courses.length === 0)
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <div className="text-center">
          <span className="text-xl font-bold">
            아직 등록된 코스 정보가 없습니다.
          </span>
          <br />
          <span className="inline-flex items-center text-sm">
            빠른 등록 요청하기
            <a
              href={generateFormUrl(courseName)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Pencil size={16} />
            </a>
          </span>
        </div>
      </div>
    );
  const defaultValue = courses[0]?.name!;
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center">
            <h3 className="mr-4 shrink-0 text-base font-semibold">규모</h3>
            <div className="text-muted-foreground text-base">
              {golfCourse.hole_count} 홀
            </div>
          </div>
          <div className="flex items-center">
            <h3 className="mr-4 shrink-0 text-base font-semibold">거리</h3>
            <div className="text-muted-foreground text-base">
              {totalDistance.toLocaleString()} M
            </div>
          </div>
          <div className="flex items-center">
            <h3 className="mr-4 shrink-0 text-base font-semibold">코스</h3>
            <div className="text-muted-foreground text-base">
              {courses.length}개 코스 ({" "}
              {courses.map((course) => course.name).join(", ")})
            </div>
          </div>
        </div>
        <Separator />
      </div>
      <div className="space-y-3">
        <h2 className="text-foreground text-xl font-bold">코스 상세</h2>
        <Tabs defaultValue={defaultValue} className="mb-28 space-y-4">
          <TabsList className="flex flex-nowrap justify-start overflow-x-scroll">
            {courses.map((course) => (
              <TabsTrigger
                value={course.name}
                key={course.id}
                className="flex-1"
              >
                {course.name} 코스
              </TabsTrigger>
            ))}
          </TabsList>
          {courses.map((course) => (
            <TabsContent
              value={course.name}
              className="min-h-[25vh] space-y-6"
              key={course.id}
            >
              <Table className="flex flex-col">
                <TableHeader className="flex">
                  <TableRow className="grid-cols-course-detail grid flex-1">
                    <TableHead className="flex w-[100px] items-center justify-center bg-zinc-100 font-semibold">
                      홀
                    </TableHead>
                    <TableHead className="flex items-center justify-center text-center font-semibold">
                      파
                    </TableHead>
                    <TableHead className="flex items-center justify-center text-center font-semibold">
                      거리
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="flex flex-col">
                  {course.holes.map((hole) => (
                    <TableRow
                      key={hole.id}
                      className="grid-cols-course-detail grid flex-1"
                    >
                      <TableCell className="flex w-[100px] items-center justify-center bg-zinc-100 text-center">
                        {hole.hole_number} 홀
                      </TableCell>
                      <TableCell className="flex items-center justify-center text-center">
                        {hole.par}
                      </TableCell>
                      <TableCell className="flex items-center justify-center text-center">
                        {hole.distance} M
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetailInfo;
