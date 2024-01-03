"use client";

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
import type { Table as TableType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import type { Cell, Score } from "./type";

const gridColumns = {
  "1": "grid-cols-score-card-1",
  "2": "grid-cols-score-card-2",
  "3": "grid-cols-score-card-3",
  "4": "grid-cols-score-card-4",
};

export function ScoreCard({
  gameCourseId,
  table,
  selectedCell,
  onSelectedCell,
  playerCount,
}: {
  gameCourseId: string;
  table: TableType<Score>;
  selectedCell?: Cell;
  playerCount: number;
  onSelectedCell: (cell: Cell) => void;
}) {
  const columnOrder = table.getAllColumns().map((col) => col.id);
  const sumOfCourseValues = table
    .getRowModel()
    .rows.filter((row) => row.original.gameCourseId === gameCourseId)
    .flatMap((row) => {
      const { id, gameCourseId, holeNumber, ...rest } = row.original;
      return rest;
    })
    .reduce((accumulator: Record<string, number>, currentRow) => {
      // 각 키에 대해 값을 누적합니다.
      const keys = Object.keys(currentRow) as (keyof typeof currentRow)[];
      keys.forEach((key) => {
        accumulator[key] = (accumulator[key] ?? 0) + Number(currentRow[key]);
      });
      return accumulator;
    }, {});

  return (
    <Table className="flex h-full flex-1 flex-col text-xs md:text-sm">
      <TableHeader className="flex-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className={cn(
              "align-center grid",
              gridColumns[String(playerCount) as keyof typeof gridColumns],
            )}
          >
            {headerGroup.headers.map((header) => {
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
          ? table
              .getRowModel()
              .rows.filter((row) => {
                return row.original.gameCourseId === gameCourseId;
              })
              .map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "grid flex-1",
                    gridColumns[
                      String(playerCount) as keyof typeof gridColumns
                    ],
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        if (cell.column.id === "holeNumber") return;
                        onSelectedCell({
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
        <TableRow
          className={cn(
            "align-center grid",
            gridColumns[String(playerCount) as keyof typeof gridColumns],
          )}
        >
          {columnOrder.map((key) => {
            const value = sumOfCourseValues[key];
            return (
              <TableCell
                key={key}
                className={cn(
                  "flex items-center justify-center break-keep border px-0 py-0 text-center",
                )}
              >
                {key === "holeNumber"
                  ? "코스 합계"
                  : Number(value) > 0 && key !== "par"
                  ? `+${value}`
                  : value}
              </TableCell>
            );
          })}
        </TableRow>
        {table.getFooterGroups().map((footerGroup) => (
          <TableRow
            key={footerGroup.id}
            className={cn(
              "align-center grid",
              gridColumns[String(playerCount) as keyof typeof gridColumns],
            )}
          >
            {footerGroup.headers.map((footer) => {
              return (
                <TableCell
                  key={footer.id}
                  className="flex items-center justify-center break-keep border px-0 py-0 text-center md:px-4"
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
  );
}
