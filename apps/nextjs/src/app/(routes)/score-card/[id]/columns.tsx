"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

export interface Player {
  id: number;
  nickname: string;
  score: number;
}

export interface Score {
  id: number;
  hole: number;
  par: number;
  player1?: Player;
  player2?: Player;
  player3?: Player;
  player4?: Player;
}

export interface HeaderName {
  name: string;
  accessorKey: "player1" | "player2" | "player3" | "player4";
}

const columnHelper = createColumnHelper<Score>();

export type ScoreColumn = ColumnDef<Score>;

export const useGetColumns = (headerNames: HeaderName[]) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("hole", {
        cell: (info) => info.getValue(),
        header: "홀",
        footer: "합계",
      }),
      columnHelper.accessor("par", {
        cell: (info) => info.getValue(),
        header: "파",
        footer: (info) => {
          return (
            <div>
              {info.table
                .getFilteredRowModel()
                .rows.reduce(
                  (total, row) => total + Number(row.getValue("par")),
                  0,
                )}
            </div>
          );
        },
      }),
      ...headerNames.map((header) =>
        columnHelper.accessor(header.accessorKey, {
          cell: (info) => {
            const value = info.getValue()!;
            return <div>{value.score}</div>;
          },
          header: () => <div>{header.name}</div>,
          footer: (info) => {
            return (
              <div>
                {info.table
                  .getFilteredRowModel()
                  .rows.reduce(
                    (total, row) =>
                      total +
                      Number(row.getValue<Player>(header.accessorKey).score),
                    0,
                  )}
              </div>
            );
          },
        }),
      ),
    ],
    [headerNames],
  );
  return columns;
};
