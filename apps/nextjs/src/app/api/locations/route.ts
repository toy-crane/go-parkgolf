import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "resource");
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + "/locations.json",
    "utf-8",
  );

  const jsonData = JSON.parse(fileContents);

  return NextResponse.json(jsonData);
}
