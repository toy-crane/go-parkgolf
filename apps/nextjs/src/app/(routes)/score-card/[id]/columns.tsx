"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

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
      {
        accessorKey: "player1",
        header: headerNames.find((h) => h.accessorKey === "player1")?.header,
        cell: (info) => {
          const value = info.getValue() as string;
          return <div>{value}</div>;
        },
        footer: (info) => {
          return (
            <div>
              {info.table
                .getFilteredRowModel()
                .rows.reduce(
                  (total, row) => total + Number(row.getValue("player1")),
                  0,
                )}
            </div>
          );
        },
      },
      {
        accessorKey: "player2",
        header: headerNames.find((h) => h.accessorKey === "player2")?.header,
        cell: (info) => {
          const value = info.getValue() as string;
          return <div>{value}</div>;
        },
        footer: (info) => {
          return (
            <div>
              {info.table
                .getFilteredRowModel()
                .rows.reduce(
                  (total, row) => total + Number(row.getValue("player2")),
                  0,
                )}
            </div>
          );
        },
      },
      {
        accessorKey: "player3",
        header: headerNames.find((h) => h.accessorKey === "player3")?.header,
        cell: (info) => {
          const value = info.getValue() as string;
          return <div>{value}</div>;
        },
        footer: (info) => {
          return (
            <div>
              {info.table
                .getFilteredRowModel()
                .rows.reduce(
                  (total, row) => total + Number(row.getValue("player3")),
                  0,
                )}
            </div>
          );
        },
      },
      {
        accessorKey: "player4",
        header: headerNames.find((h) => h.accessorKey === "player4")?.header,
        cell: (info) => {
          const value = info.getValue() as string;
          return <div>{value}</div>;
        },
        footer: (info) => {
          return (
            <div>
              {info.table
                .getFilteredRowModel()
                .rows.reduce(
                  (total, row) => total + Number(row.getValue("player4")),
                  0,
                )}
            </div>
          );
        },
      },
    ],
    [],
  );
  return columns;
};
