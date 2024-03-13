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
        footer: () => <div>스코어</div>,
      }),
      ...dynamicColumns.map((column) =>
        columnHelper.accessor(column.accessorKey, {
          cell: (info) => {
            const value = info.getValue() as number;
            return <div>{value > 0 ? `+${value}` : value}</div>;
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
            return <div>{value > 0 ? `+${value}` : value}</div>;
          },
        }),
      ),
    ],
    [dynamicColumns],
  );
  return columns;
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
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
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
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {table.getFooterGroups().map((footerGroup) => (
          <TableRow key={footerGroup.id}>
            {footerGroup.headers.map((footer) => {
              return (
                <TableCell key={footer.id}>
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
