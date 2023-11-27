import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/libs/supabase/server";

import type { column, Score } from "./columns";
import { DataTable } from "./data-table";
import ScoreCard from "./score-card";

const Page = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: response, error } = await supabase
    .from("game")
    .select("*, participant(*), game_course(*)")
    .eq("id", params.id)
    .single();

  if (error) throw error;
  const { participant, game_course, ...game } = response;
  const hole_count = game_course[0]?.hole_count!;
  const columns: column[] = participant.map((p, index) => ({
    accessorKey: `player${index + 1}`,
    header: p.nickname ?? undefined,
  }));

  const data = Array.from({ length: hole_count }, (_, rowIndex) => {
    let row = { id: rowIndex + 1 };
    participant.forEach((p, colIndex) => {
      row = { ...row, [`player${colIndex + 1}`]: 0 };
    });
    return row as Score;
  });

  return (
    <main>
      <DataTable columns={columns} data={data} />
    </main>
  );
};

export default Page;
