"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  gameCourseName,
  hasNextPage,
  hasPreviosPage,
}: {
  columns: { accessorKey: string; header: string }[];
  data: Score[];
  gameCourseName: string;
  hasNextPage?: boolean;
  hasPreviosPage?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="flex items-center justify-between pb-3 pt-2">
        <div className="flex flex-col gap-1">
          <h3
            className={cn(
              "flex text-xl font-medium leading-none tracking-tight",
            )}
          >
            충주 파크 골프장
          </h3>
          <h3
            className={cn(
              "flex text-2xl font-semibold leading-none tracking-tight",
            )}
          >
            {gameCourseName} 코스
          </h3>
        </div>

        <p className={cn("text-muted-foreground flex text-sm")}>
          2021년 10월 10일
        </p>
      </div>

      <div className="flex flex-1 flex-col rounded-md border">
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
                      className="flex items-center justify-center border px-0 text-center md:px-4"
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
                            "bg-green-500",
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
        {hasPreviosPage && (
          <Button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set(
                "page",
                ((Number(params.get("page")) || 0) - 1).toString(),
              );
              router.replace(`?${params.toString()}`);
            }}
            variant={"ghost"}
            className="px-1 md:px-4"
          >
            이전
          </Button>
        )}
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
        {hasNextPage ? (
          <Button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set(
                "page",
                ((Number(params.get("page")) || 0) + 1).toString(),
              );
              router.replace(`?${params.toString()}`);
            }}
            variant={"ghost"}
            className="px-1 md:px-4"
          >
            다음
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className="px-1 md:px-4"
            onClick={() => {
              console.log("저장");
            }}
          >
            저장
          </Button>
        )}
      </div>
    </div>
  );
}
