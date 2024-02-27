import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

const CourseDetailInfo = async ({ golfCourseId }: { golfCourseId: string }) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("courses")
    .select("*, holes(*)")
    .eq("golf_course_id", golfCourseId);
  if (response.error) throw response.error;
  const courses = response.data;
  if (courses.length === 0) return "아직 등록된 코스 정보가 없습니다.";
  const defaultValue = courses[0]?.name!;
  return (
    <div>
      <Tabs defaultValue={defaultValue} className="mb-28 space-y-4">
        <TabsList className="flex">
          {courses.map((course) => (
            <TabsTrigger value={course.name} className="flex-1" key={course.id}>
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
  );
};

export default CourseDetailInfo;
