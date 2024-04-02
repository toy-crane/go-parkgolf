import React from "react";
import { notFound } from "next/navigation";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

import FormHeader from "../_components/form-header";
import PlayerForm from "./form";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    gameId: string;
  };
}) => {
  const gameId = searchParams?.gameId;
  const session = await readUserSession();

  if (!session?.user) throw new Error("user is not defined");

  const supabase = await createSupabaseServerClientReadOnly();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id)
    .limit(1)
    .maybeSingle();

  if (!gameId) {
    notFound();
  }

  const myName = profile?.username;

  return (
    <div>
      <FormHeader
        title="신규 게임 생성하기"
        description="선수들의 이름을 입력해 주세요"
      />
      <PlayerForm gameId={gameId} myName={myName} />
    </div>
  );
};

export default Page;
