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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Person {
  A: number;
  B: number;
  C: number;
  D: number;
}

const defaultData: Person[] = [
  {
    A: 45,
    B: 45,
    C: 45,
    D: 45,
  },
  {
    A: 40,
    B: 40,
    C: 40,
    D: 40,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("A", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("B", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("C", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("D", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

const ResultTable = () => {
  const table = useReactTable({
    data: defaultData,
    columns: columns,
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
      <TableFooter className="text-base"></TableFooter>
    </Table>
  );
};

export default ResultTable;
