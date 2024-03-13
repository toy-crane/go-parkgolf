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

export interface ScoreResult {
  courseName: string;
  [key: string]: number | string;
}

const defaultData: ScoreResult[] = [
  {
    courseName: "A",
    A: 45,
    B: 45,
    C: 45,
    D: 45,
  },
  {
    courseName: "B",
    A: 40,
    B: 40,
    C: 40,
    D: 40,
  },
];

const columnHelper = createColumnHelper<ScoreResult>();

export interface ColumnName {
  headerName: string;
  accessorKey: string;
}

const useGetColumns = (dynamicColumns: ColumnName[]) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("courseName", {
        cell: (info) => info.getValue(),
        header: "코스",
        footer: () => <div>최종 스코어</div>,
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

const ResultTable = () => {
  const table = useReactTable({
    data: defaultData,
    columns: useGetColumns([
      {
        accessorKey: "A",
        headerName: "A",
      },
      {
        accessorKey: "B",
        headerName: "B",
      },
      {
        accessorKey: "C",
        headerName: "C",
      },
      {
        accessorKey: "D",
        headerName: "D",
      },
    ]),
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
