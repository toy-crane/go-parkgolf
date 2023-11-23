import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/libs/supabase/server";

const Page = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("game")
    .select("*, participant(*), game_course(*)")
    .eq("id", params.id)
    .single();

  if (error) throw error;
  const { participant, game_course, ...game } = data;

  return (
    <main>
      <div>{game.course_id}</div>
      <div>{game.start_date}</div>
      <div>
        {participant.map((p) => (
          <div key={p.id}>{p.nickname}</div>
        ))}
      </div>
      <div>
        {game_course.map((c) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </div>
    </main>
  );
};

export default Page;
