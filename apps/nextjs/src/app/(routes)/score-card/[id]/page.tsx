import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/libs/tailwind";

import { getGameCourses, getScores } from "./_fetcher";
import { ScoreCard } from "./score-card";
import { ScoreTabs } from "./tabs";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: number };
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
      <ScoreTabs gameCourses={gameCourses} />
      {/* <Tabs
        defaultValue={gameCourses[0]?.name}
        onValueChange={(value) => console.log(value)}
      >
        <TabsList className="w-full">
          {gameCourses.map((gc) => (
            <TabsTrigger value={gc.name} key={gc.id} className="flex-1">
              {gc.name} 코스
            </TabsTrigger>
          ))}
        </TabsList>
        {gameCourses.map((gc) => (
          <TabsContent value={gc.name} key={gc.id}>
            <ScoreCard
              gameCourse={gc}
              columns={dynamicColumnNames}
              data={data}
            />
          </TabsContent>
        ))}
      </Tabs> */}
    </main>
  );
};

export default Page;
