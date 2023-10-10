import { promises as fs } from "fs";
import path from "path";
import type { Course } from "@/types";

async function fetchCourses() {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "resource");
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + "/courses.json",
    "utf-8",
  );
  const jsonData = JSON.parse(fileContents) as Course[];
  return jsonData;
}

async function fetchCourse(id: string) {
  const courses = await fetchCourses();
  const course = courses.find((course) => course.id === Number(id));
  return course;
}

export { fetchCourses, fetchCourse };
