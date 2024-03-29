"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import type { Score } from "./type";

export interface ColumnName {
  headerName: string;
  accessorKey: string;
}

const columnHelper = createColumnHelper<Score>();

export type ScoreColumn = ColumnDef<Score>;

export const useGetColumns = (
  dynamicColumns: ColumnName[],
  readonly?: boolean,
) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("holeNumber", {
        cell: (info) => info.getValue(),
        header: "홀",
        footer: () => <div className="text-xs leading-4">전체 합계</div>,
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
      ...dynamicColumns.map((column) =>
        columnHelper.accessor(column.accessorKey, {
          cell: (info) => {
            const value = info.getValue() as number;
            return (
              <div>
                {value === 0 ? (
                  readonly ? (
                    value
                  ) : (
                    <span className="text-muted-foreground text-xs font-thin">
                      입력
                    </span>
                  )
                ) : (
                  value
                )}
              </div>
            );
          },
          header: () => <div>{column.headerName}</div>,
          footer: (info) => {
            const value = info.table
              .getFilteredRowModel()
              .rows.reduce(
                (total, row) =>
                  total + Number(row.getValue(column.accessorKey)),
                0,
              );
            return <div>{value > 0 ? `${value}` : value}</div>;
          },
        }),
      ),
    ],
    [dynamicColumns],
  );
  return columns;
};
