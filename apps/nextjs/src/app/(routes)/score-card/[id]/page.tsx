import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/libs/supabase/server";

import type { Score } from "./columns";
import { DataTable } from "./data-table";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: number };
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: response, error } = await supabase
    .from("game")
    .select("*, participant(*), game_course(*)")
    .eq("id", params.id)
    .single();

  console.log(Number(searchParams.page));

  if (error) throw error;
  const { participant, game_course } = response;
  const current_game_course =
    game_course.find((game, idx) => idx === Number(searchParams.page) - 1) ??
    game_course[0];
  const hasNextPage = game_course.length > Number(searchParams.page);
  const hasPreviosPage = Number(searchParams.page) > 1;

  if (!current_game_course) throw new Error("game course not found");

  const hole_count = current_game_course.hole_count!;
  const game_course_name = current_game_course.name!;

  const columns = participant.map((p, index) => ({
    accessorKey: `player${index + 1}`,
    header: p.nickname ?? "이름 없음",
  }));

  const data = Array.from({ length: hole_count }, (_, rowIndex) => {
    let row = { hole: rowIndex + 1, id: rowIndex, par: 0 };
    participant.forEach((p, colIndex) => {
      row = { ...row, [`player${colIndex + 1}`]: 0 };
    });
    return row as Score;
  });

  return (
    <main>
      <DataTable
        columns={columns}
        data={data}
        gameCourseName={game_course_name}
        hasNextPage={hasNextPage}
        hasPreviosPage={hasPreviosPage}
      />
    </main>
  );
};

export default Page;
