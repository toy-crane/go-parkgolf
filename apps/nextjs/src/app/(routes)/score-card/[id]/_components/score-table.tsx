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
import type { Row } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { Cell, ColumnName, Score } from "../type";
import { useGetColumns } from "../use-columns";

interface GamePlayer {
  id: string;
  nickname: string;
}

const getColumnNames = (players: GamePlayer[]): ColumnName[] => {
  const columns = players?.map((p) => ({
    accessorKey: p?.id ?? "unknown",
    headerName: p?.nickname ?? "이름 없음",
  }));
  return columns;
};

const ScoreCardRow = ({
  columnCount,
  children,
}: {
  columnCount: number;
  children: React.ReactNode;
}) => {
  return (
    <TableRow
      className={cn(
        "grid flex-1",
        gridColumns[String(columnCount) as keyof typeof gridColumns],
      )}
    >
      {children}
    </TableRow>
  );
};

const ScoreCardHead = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TableHead
      className={cn(
        "flex h-auto items-center justify-center border px-0 py-2 text-center font-semibold text-black md:px-4",
        className,
      )}
    >
      {children}
    </TableHead>
  );
};

const ScoreCardCell = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <TableCell
      className={cn(
        "flex cursor-pointer items-center justify-center border p-0",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </TableCell>
  );
};

const gridColumns = {
  "1": "grid-cols-score-card-1",
  "2": "grid-cols-score-card-2",
  "3": "grid-cols-score-card-3",
  "4": "grid-cols-score-card-4",
};

export function ScoreTable({
  scores,
  gameCourseId,
  gamePlayers,
  onSelectedRow,
  selectedScore,
}: {
  gameCourseId: string;
  gamePlayers: GamePlayer[];
  scores: Score[];
  selectedScore?: Score;
  onSelectedRow?: (row?: Row<Score>) => void;
}) {
  const table = useReactTable({
    data: scores,
    columns: useGetColumns(getColumnNames(gamePlayers)),
    getCoreRowModel: getCoreRowModel(),
  });
  const rows = table
    .getRowModel()
    .rows.filter((row) => row.original.gameCourseId === gameCourseId);

  const columnOrder = table.getAllColumns().map((col) => col.id);
  const playerCount = gamePlayers.length;
  const sumOfCourseValues = rows
    .flatMap((row) => {
      const {
        id: _,
        gameCourseId: __,
        holeNumber: ___,
        ...rest
      } = row.original;
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

  const selectedRow = rows.find((row) => row.original.id === selectedScore?.id);

  return (
    <Table className="flex h-full flex-1 flex-col text-xs md:text-sm">
      <TableHeader className="flex-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <ScoreCardRow key={headerGroup.id} columnCount={playerCount}>
            {headerGroup.headers.map((header) => {
              return (
                <ScoreCardHead
                  key={header.id}
                  className={cn(
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
                </ScoreCardHead>
              );
            })}
          </ScoreCardRow>
        ))}
      </TableHeader>
      <TableBody className="flex flex-1 flex-col text-base">
        {rows?.length
          ? rows.map((row) => (
              <ScoreCardRow key={row.id} columnCount={playerCount}>
                {row.getVisibleCells().map((cell) => (
                  <ScoreCardCell
                    key={cell.id}
                    onClick={() => {
                      if (cell.column.id === "holeNumber") return;
                      if (cell.column.id === "par") {
                        onSelectedRow?.(undefined);
                      }
                      if (cell.column.id !== "par" && onSelectedRow) {
                        onSelectedRow(row);
                      }
                    }}
                    className={cn(
                      cell.column.id === "holeNumber" &&
                        "cursor-default bg-lime-200",
                      cell.column.id === "par" && "bg-lime-400",
                      selectedRow?.id === cell.row.id &&
                        !["holeNumber", "par"].includes(cell.column.id) &&
                        "bg-green-500",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </ScoreCardCell>
                ))}
              </ScoreCardRow>
            ))
          : null}
      </TableBody>
      <TableFooter className="text-base">
        <ScoreCardRow columnCount={playerCount}>
          {columnOrder.map((key) => {
            const value = sumOfCourseValues[key];
            return (
              <ScoreCardCell
                key={key}
                className={cn(
                  "break-keep text-center",
                  key === "holeNumber" && "text-xs leading-4",
                )}
              >
                {key === "holeNumber"
                  ? "코스 합계"
                  : Number(value) > 0 && key !== "par"
                  ? `${value}`
                  : value}
              </ScoreCardCell>
            );
          })}
        </ScoreCardRow>
        {table.getFooterGroups().map((footerGroup) => (
          <ScoreCardRow key={footerGroup.id} columnCount={playerCount}>
            {footerGroup.headers.map((footer) => {
              return (
                <ScoreCardCell
                  key={footer.id}
                  className="break-keep text-center"
                >
                  {footer.isPlaceholder
                    ? null
                    : flexRender(
                        footer.column.columnDef.footer,
                        footer.getContext(),
                      )}
                </ScoreCardCell>
              );
            })}
          </ScoreCardRow>
        ))}
      </TableFooter>
    </Table>
  );
}
