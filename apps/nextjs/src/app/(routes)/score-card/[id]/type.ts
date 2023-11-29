export interface Score {
  id: number;
  gameCourseId: number;
  holeNumber: number;
  par: number;
  [key: string]: number;
}
