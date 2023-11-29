"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/libs/tailwind";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { z } from "zod";

import { saveScore } from "./_actions";
import { useGetColumns } from "./columns";
import type { ColumnName } from "./columns";
import type { Score } from "./type";

function createSchema(fields: Record<string, z.ZodType<any>>) {
  return z.object(fields);
}

export function ScoreCard({
  columns: headerNames,
  data,
  gameCourseId,
}: {
  columns: ColumnName[];
  data: Score[];
  gameCourseId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [scoreCard, setScoreCard] = useState(data);
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    colName: string;
  } | null>(null);

  useEffect(() => {
    setScoreCard(data);
  }, [data]);

  const table = useReactTable({
    data: scoreCard,
    columns: useGetColumns(headerNames),
    getCoreRowModel: getCoreRowModel(),
  });

  const participantSchema = headerNames.reduce(
    (acc: Record<string, z.ZodType<any>>, h) => {
      acc[h.accessorKey] = z.number();
      return acc;
    },
    {},
  );

  const scoreSchema = z.array(
    createSchema({
      id: z.number(),
      gameCourseId: z.number(),
      holeNumber: z.number(),
      par: z.number(),
      ...participantSchema,
    }),
  );

  const handleSave = () => {
    const result = scoreSchema.safeParse(scoreCard);
    if (result.success) {
      startTransition(async () => {
        await saveScore(gameCourseId, result.data as Score[]);
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
          const currentScore = currentRow[key];
          return {
            ...currentRow,
            [colName]:
              currentScore !== undefined
                ? type === "increase"
                  ? currentScore + 1
                  : currentScore - 1
                : 0,
          };
        }
        return currentRow;
      }),
    );
  };

  return (
    <div className="flex h-[85vh] flex-col py-1">
      <div className="flex flex-1 flex-col rounded-md border">
        <Table className="flex flex-1 flex-col text-xs md:text-sm">
          <TableHeader className="flex-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="align-center grid-cols-score-card grid"
              >
                {headerGroup.headers.map((header) => {
                  console.log(header.column);
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "flex items-center justify-center border px-0 text-center md:px-4",
                        header.column.id === "holeNumber" && "bg-lime-200",
                        header.column.id === "par" && "bg-lime-400",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex flex-1 flex-col">
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="grid-cols-score-card grid flex-1"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          if (cell.column.id === "holeNumber") return;
                          setSelectedCell({
                            row: cell.row.id,
                            colName: cell.column.id,
                          });
                        }}
                        className={cn(
                          "flex cursor-pointer items-center justify-center border p-0",
                          cell.column.id === "holeNumber" &&
                            "cursor-default bg-lime-200",
                          cell.column.id === "par" && "bg-lime-400",
                          selectedCell?.row === cell.row.id &&
                            selectedCell?.colName === cell.column.id &&
                            "bg-green-500",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow
                key={footerGroup.id}
                className="align-center grid-cols-score-card grid"
              >
                {footerGroup.headers.map((footer) => {
                  return (
                    <TableCell
                      key={footer.id}
                      className="flex items-center justify-center border px-0 text-center md:px-4"
                    >
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext(),
                          )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
      <div className="flex justify-evenly gap-2 pt-4">
        <Button
          className="flex-auto"
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
          onClick={() => {
            if (selectedCell) {
              handleScore(selectedCell.row, selectedCell.colName, "decrease");
            }
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button onClick={handleSave} variant="outline" disabled={isPending}>
          저장
        </Button>
      </div>
    </div>
  );
}
