"use client";

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
