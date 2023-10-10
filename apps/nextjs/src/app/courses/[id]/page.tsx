import { promises as fs } from "fs";
import path from "path";
import { fetchCourse } from "@/libs/fetch";
import type { Course } from "@/types";

export async function generateStaticParams() {
  const jsonDirectory = path.join(process.cwd(), "resource");
  const fileContents = await fs.readFile(
    jsonDirectory + "/courses.json",
    "utf-8",
  );
  const courses = JSON.parse(fileContents) as Course[];
  return courses.map((course) => ({
    id: String(course.id),
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const course = await fetchCourse(params.id);
  return <div>My Post: {course?.name}</div>;
}
