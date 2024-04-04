"use client";

import { useMemo } from "react";
import { Icons } from "@/components/icons";
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
  const columns = useMemo(() => {
    return [
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

            // 각 컬럼별 총합 계산
            const totalSums = dynamicColumns.reduce(
              (acc, dynamicColumn) => {
                const sum = info.table
                  .getFilteredRowModel()
                  .rows.reduce((total, row) => {
                    const rowValue = row.getValue(dynamicColumn.accessorKey); // 타입 단언 추가
                    return total + ((rowValue as number) ?? 0); // undefined를 처리하는 로직 추가
                  }, 0);
                acc[dynamicColumn.accessorKey] = sum;
                return acc;
              },
              {} as Record<string, number>,
            );

            // 총합을 기준으로 순위 결정
            const sortedSums = Object.values(totalSums).sort((a, b) => a - b);
            const rank = sortedSums.indexOf(totalSums[column.accessorKey]!) + 1;

            return (
              <div className="flex">
                <span className="relative">
                  {value}
                  {rank === 1 && (
                    <Icons.crown className="absolute right-[18px] top-[-9px] h-5 w-5" />
                  )}
                </span>
              </div>
            );
          },
        }),
      ),
    ];
  }, [dynamicColumns]);
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
                    "flex h-8 items-center justify-center px-0 md:h-12",
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
                  "flex h-8 items-center justify-center px-0  md:h-12",
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
          <TableRow
            key={footerGroup.id}
            className={cn(
              rowClassName,
              "min-h-[64px] items-center font-semibold",
            )}
          >
            {footerGroup.headers.map((footer) => {
              return (
                <TableCell
                  key={footer.id}
                  className={cn(
                    "flex h-8 items-center justify-center px-0 md:h-12",
                  )}
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
