"use client";

import { useState } from "react";
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

import { useGetColumns } from "./columns";
import type { Score } from "./columns";

export function DataTable({
  columns: headerNames,
  data,
}: {
  columns: { accessorKey: string; header: string }[];
  data: Score[];
}) {
  const [scoreCard, setScoreCard] = useState(data);
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    colName: string;
  } | null>(null);

  const table = useReactTable({
    data: scoreCard,
    columns: useGetColumns(headerNames),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleScore = (
    row: string,
    colName: string,
    type: "increase" | "decrease",
  ) => {
    setScoreCard((old) =>
      old.map((currentRow, index) => {
        if (index === Number(row)) {
          const key = colName as keyof Score; // colName이 Score의 키임을 보장
          return {
            ...currentRow,
            [key]:
              type === "increase" ? currentRow[key] + 1 : currentRow[key] - 1,
          };
        }
        return currentRow;
      }),
    );
  };

  return (
    <div className="flex h-[100vh] flex-col py-4">
      <div className="flex flex-1 flex-col rounded-md border">
        <Table className="flex flex-1 flex-col">
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
                      className="flex items-center justify-center border text-center"
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
                          if (cell.column.id === "hole") return;
                          setSelectedCell({
                            row: cell.row.id,
                            colName: cell.column.id,
                          });
                        }}
                        className={cn(
                          selectedCell?.row === cell.row.id &&
                            selectedCell?.colName === cell.column.id &&
                            "bg-blue-500",
                          cell.column.id !== "hole" && "cursor-pointer",
                          "flex items-center justify-center border p-0",
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
                      className="flex items-center justify-center border text-center"
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
      </div>
    </div>
  );
}
