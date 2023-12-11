import React from "react";
import { notFound } from "next/navigation";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

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
      <PageHeader className="relative pb-4 md:pb-8">
        <PageHeaderHeading>신규 게임 생성하기</PageHeaderHeading>
        <PageHeaderDescription>
          플레이어들의 이름을 입력해 주세요
        </PageHeaderDescription>
      </PageHeader>
      <PlayerForm gameId={gameId} />
    </div>
  );
};

export default Page;
