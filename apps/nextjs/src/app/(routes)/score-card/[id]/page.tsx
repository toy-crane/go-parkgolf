import React from "react";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";

import { getGameCourses } from "./_fetcher";
import { ScoreTabs } from "./tabs";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) => {
  const { gameCourses, name, startedAt } = await getGameCourses({
    gameId: params.id,
  });

  return (
    <main>
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-1">
          <h3
            className={cn(
              "flex text-xl font-medium leading-none tracking-tight",
            )}
          >
            {name ? name : null}
          </h3>
        </div>
        <p className={cn("text-muted-foreground flex text-sm")}>
          {startedAt && format(new Date(startedAt), "yyyy-MM-dd")}
        </p>
      </div>
      <ScoreTabs gameCourses={gameCourses} selectedTab={searchParams.tab} />
    </main>
  );
};

export default Page;
