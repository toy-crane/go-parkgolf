"use client";

import { useMemo } from "react";
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface Score {
  id: number;
  hole: number;
  player1: number;
  player2: number;
  player3: number;
  player4: number;
}

export type ScoreColumn = ColumnDef<Score>;

export const useGetColumns = (
  headerNames: {
    accessorKey: string;
    header: string;
  }[],
) => {
  const columns = useMemo<ColumnDef<Score>[]>(
    () => [
      {
        accessorKey: "hole",
        header: "홀",
        cell: (info) => {
          const value = info.getValue() as string;
          return <div>{value}</div>;
        },
        footer: "합계",
      },
      ...headerNames.map((header) => ({
        accessorKey: header.accessorKey,
        header: header.header,
        cell: (info: CellContext<Score, unknown>) => {
          const value = info.getValue() as string;
          return <div>{value}</div>;
        },
        footer: (info: HeaderContext<Score, unknown>) => {
          return (
            <div>
              {info.table
                .getFilteredRowModel()
                .rows.reduce(
                  (total, row) =>
                    total + Number(row.getValue(header.accessorKey)),
                  0,
                )}
            </div>
          );
        },
      })),
    ],
    [headerNames],
  );
  return columns;
};
