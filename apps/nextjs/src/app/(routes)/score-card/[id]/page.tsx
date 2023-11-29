import React from "react";
import { cn } from "@/libs/tailwind";

import { getGameCourses } from "./_fetcher";
import { ScoreTabs } from "./tabs";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) => {
  const gameCourses = await getGameCourses({ gameId: params.id });

  return (
    <main>
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-1">
          <h3
            className={cn(
              "flex text-xl font-medium leading-none tracking-tight",
            )}
          >
            충주 파크 골프장
          </h3>
        </div>
        <p className={cn("text-muted-foreground flex text-sm")}>
          2021년 10월 10일
        </p>
      </div>
      <ScoreTabs gameCourses={gameCourses} selectedTab={searchParams.tab} />
    </main>
  );
};

export default Page;
