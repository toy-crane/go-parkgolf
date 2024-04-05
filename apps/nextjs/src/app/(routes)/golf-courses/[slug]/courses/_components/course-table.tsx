import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { readUserSession } from "@/libs/auth";
import { generateFormUrl } from "@/libs/google-form";
import { GolfCourse } from "@/types";
import { Pencil } from "lucide-react";

type Course = {
  created_at: string;
  description: string | null;
  golf_course_id: string;
  id: string;
  name: string;
  holes: {
    course_id: string;
    created_at: string;
    distance: number | null;
    hole_number: number;
    id: string;
    par: number;
  }[];
};

const EmptyCourse = ({ courseName }: { courseName: string }) => {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="text-lg font-bold">
          아직 등록된 코스 정보가 없습니다.
        </div>
        <Button variant="outline" asChild>
          <a
            href={generateFormUrl(courseName)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            빠른 등록 요청하기 <Pencil size={16} className="ml-2" />
          </a>
        </Button>
      </div>
    </div>
  );
};

async function CourseTable({
  courses,
  golfCourse,
}: {
  courses: Course[];
  golfCourse: GolfCourse;
}) {
  const session = await readUserSession();
  const pathname = headers().get("x-pathname") ?? "";
  const hasCourses = courses.length > 0;
  const defaultValue = courses[0]?.name!;
  return (
    <div className="space-y-3">
      <h2 className="text-foreground text-xl font-bold">코스 상세</h2>
      {hasCourses ? (
        <div className="relative">
          <Tabs defaultValue={defaultValue} className="mb-28 space-y-3">
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
                className="min-h-[25vh]"
                key={course.id}
              >
                <Table className="flex flex-col">
                  <TableHeader className="flex">
                    <TableRow className="grid-cols-course-detail grid flex-1">
                      <TableHead className="bg-muted flex h-8 w-[100px] items-center justify-center font-semibold">
                        홀
                      </TableHead>
                      <TableHead className="flex h-8 items-center justify-center text-center font-semibold">
                        파
                      </TableHead>
                      <TableHead className="flex h-8 items-center justify-center text-center font-semibold">
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
                        <TableCell className="bg-muted flex h-10 w-[100px] items-center justify-center text-center">
                          {hole.hole_number} 홀
                        </TableCell>
                        <TableCell className="flex h-6 items-center justify-center text-center">
                          {hole.par}
                        </TableCell>
                        <TableCell className="flex h-6 items-center justify-center text-center">
                          {hole.distance} M
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
          {!session && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Card className="w-[256px]">
                <CardContent className="text-secondary-foreground p-2 pt-4 text-center text-xs">
                  전체 코스는 <br /> 로그인 후 확인 가능합니다
                </CardContent>
                <CardFooter className="flex items-center justify-center p-2 pb-4">
                  <Button size="xs" variant="outline" asChild>
                    <Link
                      href={`/login?${new URLSearchParams({
                        next: pathname,
                      }).toString()}`}
                    >
                      로그인
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <EmptyCourse courseName={golfCourse.name} />
      )}
    </div>
  );
}

export default CourseTable;
