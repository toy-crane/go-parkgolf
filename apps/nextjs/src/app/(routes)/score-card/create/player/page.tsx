import React from "react";
import { notFound } from "next/navigation";

import FormHeader from "../_components/form-header";
import PlayerForm from "./form";

const Page = ({
  searchParams,
}: {
  searchParams: {
    gameId: string;
  };
}) => {
  const gameId = searchParams?.gameId;
  if (!gameId) {
    notFound();
  }

  return (
    <div>
      <FormHeader
        title="신규 게임 생성하기"
        description="플레이어들의 이름을 입력해 주세요"
      />
      <PlayerForm gameId={gameId} />
    </div>
  );
};

export default Page;
