"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Loader2, Minus, Plus } from "lucide-react";
import { z } from "zod";

import { useGetColumns } from "./columns";
import type { ColumnName } from "./columns";
import { createSchema } from "./schema";
import { ScoreCard } from "./score-card";
import type { Cell, GameCourse, Score } from "./type";

const getColumnNames = (gameCourses: GameCourse[]): ColumnName[] => {
  const participants =
    gameCourses[0]?.score[0]?.player_score.map((p) => p.participant) || [];
  const columns = participants?.map((p) => ({
    accessorKey: String(p?.id),
    headerName: p?.nickname ?? "이름 없음",
  }));
  return columns;
};

const getFormattedData = (gameCourses: GameCourse[]): Score[] => {
  const data = gameCourses
    .map((gc) =>
      gc.score.map((score) => {
        const playerScore = score.player_score;
        const playerScoreMap = playerScore.reduce(
          (acc: Record<string, number>, curr) => {
            const participantId = String(curr.participant?.id);
            if (participantId) {
              acc[participantId] = curr.player_score;
            }
            return acc;
          },
          {},
        );
        return {
          id: score.id,
          gameCourseId: score.game_course_id,
          holeNumber: score.hole_number,
          par: score.par,
          ...playerScoreMap,
        };
      }),
    )
    .flat();
  return data;
};

export const ScoreTabs = ({
  gameCourses,
  selectedTab,
}: {
  gameCourses: GameCourse[];
  selectedTab?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [scoreCard, setScoreCard] = useState(getFormattedData(gameCourses));
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>(undefined);

  const [tab, setTab] = useState(selectedTab ?? gameCourses[0]?.name!);
  const searchParams = useSearchParams();
  const router = useRouter();
  const columns = getColumnNames(gameCourses);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", String(value));
    router.push(`?${params.toString()}`);
    setTab(value);
  };

  const scoreSchema = z.array(
    createSchema({
      id: z.number(),
      gameCourseId: z.number(),
      holeNumber: z.number(),
      par: z.number(),
      ...columns.reduce((acc: Record<string, z.ZodType<any>>, h) => {
        acc[h.accessorKey] = z.number();
        return acc;
      }, {}),
    }),
  );

  const table = useReactTable({
    data: scoreCard,
    columns: useGetColumns(columns),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSave = () => {
    const result = scoreSchema.safeParse(scoreCard);
    if (result.success) {
      startTransition(async () => {
        console.log("Calling action (client-side)", result.data);
        const response = await saveScore(result.data as Score[]);
        console.log("Finish calling action (client-side)", response);
      });
    }
  };

  const handleScore = (
    row: string,
    colName: string,
    type: "increase" | "decrease",
  ) => {
    setScoreCard((old) =>
      old.map((currentRow, index) => {
        if (index === Number(row)) {
          const key = colName as keyof Score;
          const currentScore = currentRow[key] ?? 0;
          const increment = type === "increase" ? 1 : -1;
          return {
            ...currentRow,
            [colName]: currentScore + increment,
          };
        }
        return currentRow;
      }),
    );
  };

  const handleSelectedCell = (cell: Cell) => {
    setSelectedCell(cell);
  };

  return (
    <div>
      <Tabs defaultValue={tab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          {gameCourses.map((gc) => (
            <TabsTrigger value={gc.name} key={gc.id} className="flex-1">
              {gc.name} 코스
            </TabsTrigger>
          ))}
        </TabsList>
        {gameCourses.map((gc) => (
          <TabsContent value={gc.name} key={gc.id}>
            <Table>
              <ScoreCard
                gameCourseId={gc.id}
                table={table}
                onSelectedCell={handleSelectedCell}
                selectedCell={selectedCell}
              />
            </Table>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-evenly gap-2 pt-4">
        <Button
          className="flex-auto"
          disabled={isPending}
          onClick={() => {
            if (selectedCell) {
              handleScore(selectedCell.row, selectedCell.colName, "increase");
            }
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          className="flex-auto"
          disabled={isPending}
          onClick={() => {
            if (selectedCell) {
              handleScore(selectedCell.row, selectedCell.colName, "decrease");
            }
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button onClick={handleSave} variant="outline" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" size={24} />
          ) : (
            "저장"
          )}
        </Button>
      </div>
    </div>
  );
};
