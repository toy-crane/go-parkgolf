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

export function ScoreCard({
  gameCourseId,
  table,
  selectedCell,
  onSelectedCell,
}: {
  gameCourseId: number;
  table: TableType<Score>;
  selectedCell?: Cell;
  onSelectedCell: (cell: Cell) => void;
}) {
  return (
    <Table className="flex flex-1 flex-col text-xs md:text-sm">
      <TableHeader className="flex-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="align-center grid-cols-score-card grid"
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
                  className="grid-cols-score-card grid flex-1"
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
  );
}
