import { promises as fs } from "fs";
import path from "path";
import type { Course } from "@/types";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // 지구의 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dlng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlng / 2) *
      Math.sin(dlng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

async function fetchCourseBySlug(slug: string) {
  const courses = await fetchCourses();
  const course = courses.find((course) => course.slug === slug);
  return course;
}

async function fetchNearCourse(id: number, radius: number) {
  const courses = await fetchCourses();
  const selectedCourse = courses.find((course) => course.id === id);
  const allCoursesExcludeMe = courses.filter((course) => course.id !== id);

  if (!selectedCourse) {
    return [];
  }

  const nearbyCourses = allCoursesExcludeMe.filter((course) => {
    const courseLat = parseFloat(course.address.y);
    const courseLng = parseFloat(course.address.x);
    return (
      haversineDistance(
        parseFloat(selectedCourse.address.y),
        parseFloat(selectedCourse.address.x),
        courseLat,
        courseLng,
      ) <= radius
    );
  });

  return nearbyCourses;
}

export { fetchCourses, fetchCourse, fetchCourseBySlug, fetchNearCourse };
