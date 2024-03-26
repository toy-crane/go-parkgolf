"use client";

import { useMemo } from "react";
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
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ColumnName, ScoreResult } from "../../type";

const columnHelper = createColumnHelper<ScoreResult>();

const useGetColumns = (dynamicColumns: ColumnName[]) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("courseName", {
        cell: (info) => info.getValue(),
        header: "코스",
        footer: () => <div>결과</div>,
      }),
      ...dynamicColumns.map((column) =>
        columnHelper.accessor(column.accessorKey, {
          cell: (info) => {
            const value = info.getValue() as number;
            return <div>{value}</div>;
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
            return <div>{value}</div>;
          },
        }),
      ),
    ],
    [dynamicColumns],
  );
  return columns;
};

const gridColumns = {
  "1": "grid-cols-score-result-1",
  "2": "grid-cols-score-result-2",
  "3": "grid-cols-score-result-3",
  "4": "grid-cols-score-result-4",
};

const ResultTable = ({
  result,
  columnNames,
}: {
  result: ScoreResult[];
  columnNames: ColumnName[];
}) => {
  const table = useReactTable({
    data: result,
    columns: useGetColumns(columnNames),
    getCoreRowModel: getCoreRowModel(),
  });

  const gridClass =
    gridColumns[String(columnNames.length) as keyof typeof gridColumns];
  const rowClassName = cn("grid align-center", gridClass);

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className={rowClassName}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "flex items-center justify-center px-0",
                    header.column.id === "courseName" &&
                      "bg-lime-400 text-white",
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className={rowClassName}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={cn(
                  "flex items-center justify-center px-0",
                  cell.column.id === "courseName" && "bg-lime-400 text-white",
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {table.getFooterGroups().map((footerGroup) => (
          <TableRow key={footerGroup.id} className={rowClassName}>
            {footerGroup.headers.map((footer) => {
              return (
                <TableCell
                  key={footer.id}
                  className={cn("flex items-center justify-center px-0")}
                >
                  {flexRender(
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
};

export default ResultTable;
