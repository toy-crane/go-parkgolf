"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/libs/tailwind";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";

import type { Score } from "./columns";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    clickCell: (colName: string, row: string) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Score>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onClick = () => {
      table.options.meta?.clickCell(id, String(index));
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <div onClick={onClick} className="flex-auto text-center">
        {value as string}
      </div>
      // <input
      //   value={value as string}
      //   onChange={(e) => setValue(e.target.value)}
      // />
    );
  },
};

export function DataTable({
  columns,
  data,
}: {
  columns: ColumnDef<Score>[];
  data: Score[];
}) {
  const [scoreCard, setScoreCard] = useState(data);
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    colName: string;
  } | null>(null);

  const table = useReactTable({
    data: scoreCard,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleScore = (
    row: string,
    colName: string,
    type: "increase" | "decrease",
  ) => {
    setScoreCard((old) =>
      old.map((currentRow, index) => {
        if (index === Number(row)) {
          const key = colName as keyof Score; // colName이 Score의 키임을 보장
          return {
            ...currentRow,
            [key]:
              type === "increase" ? currentRow[key] + 1 : currentRow[key] - 1,
          };
        }
        return currentRow;
      }),
    );
  };

  return (
    <div className="flex h-[100vh] flex-col py-4">
      <div className="flex flex-1 flex-col rounded-md border">
        <Table className="flex flex-1 flex-col">
          <TableHeader className="flex-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="align-center grid grid-cols-4"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="flex items-center justify-center text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex flex-1 flex-col">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="grid flex-1 grid-cols-4">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        setSelectedCell({
                          row: cell.row.id,
                          colName: cell.column.id,
                        });
                      }}
                      data-state={"selected"}
                      className={cn(
                        selectedCell?.row === cell.row.id &&
                          selectedCell?.colName === cell.column.id &&
                          "bg-blue-500",
                        "flex cursor-pointer items-center justify-center p-0",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-evenly gap-2 pt-4">
        <Button
          className="flex-auto"
          onClick={() => {
            if (selectedCell) {
              handleScore(selectedCell.row, selectedCell.colName, "increase");
            }
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          className="flex-auto"
          onClick={() => {
            if (selectedCell) {
              handleScore(selectedCell.row, selectedCell.colName, "decrease");
            }
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
