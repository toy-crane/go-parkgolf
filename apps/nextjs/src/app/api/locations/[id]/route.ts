import { promises as fs } from "fs";
import path from "path";
import type { NextApiRequest } from "next";
import type { Location } from "@/types";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } },
) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "resource");
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + "/locations.json",
    "utf-8",
  );

  const locations = JSON.parse(fileContents) as Location[];
  const location = locations.find(
    (location) => location.id === Number(params.id),
  );

  if (location) {
    return Response.json({ location });
  } else {
    return new Response("Not Found", { status: 404 });
  }
}
