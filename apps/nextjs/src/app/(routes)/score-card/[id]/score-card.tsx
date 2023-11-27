"use client";

import React, { useState } from "react";

type Columns = {
  name: string;
}[];

const ScoreCardHeader = ({ columns }: { columns: Columns }) => (
  <div className="grid grid-cols-[50px_repeat(4,minmax(0,1fr))]">
    <div className="text-center">홀</div>
    {columns.map((c) => (
      <div key={c.name} className="text-center">
        {c.name}
      </div>
    ))}
  </div>
);

const ScoreCardContent = ({
  columns,
  holeCount,
  handleCellClick,
  selectedCell,
}: {
  columns: Columns;
  holeCount: number;
  handleCellClick: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
}) =>
  holeCount &&
  Array.from({ length: holeCount }, (_, rowIndex) => (
    <div
      key={rowIndex}
      className="grid grid-cols-[50px_repeat(4,minmax(0,1fr))]"
    >
      <div className="text-center">{rowIndex + 1}</div>
      {columns.map((c, colIndex) => (
        <div
          key={colIndex}
          className="text-center"
          onClick={() => handleCellClick(rowIndex + 1, colIndex)}
        >
          {selectedCell?.row === rowIndex + 1 && selectedCell?.col === colIndex
            ? "selected"
            : "-"}
        </div>
      ))}
    </div>
  ));

const ScoreCard = ({
  columns,
  holeCount,
}: {
  columns: {
    name: string;
  }[];
  holeCount: number;
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  return (
    <div>
      <ScoreCardHeader columns={columns} />
      <ScoreCardContent
        columns={columns}
        holeCount={holeCount}
        handleCellClick={handleCellClick}
        selectedCell={selectedCell}
      />
    </div>
  );
};

export default ScoreCard;
