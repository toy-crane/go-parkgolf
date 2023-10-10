import { promises as fs } from "fs";
import path from "path";
import type { NextApiRequest } from "next";
import type { Course } from "@/types";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } },
) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "resource");
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + "/courses.json",
    "utf-8",
  );

  const courses = JSON.parse(fileContents) as Course[];
  const course = courses.find((course) => course.id === Number(params.id));

  if (course) {
    return Response.json({ course });
  } else {
    return new Response("Not Found", { status: 404 });
  }
}
