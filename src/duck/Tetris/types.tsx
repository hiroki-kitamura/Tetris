export interface Cell {
  exist: boolean,
  backgroundColor: string
}

export interface Cells {
  [index: string]: Cell
}

export interface Block {
  name: string,
  axisOfRotation: string,
  cells: Cells,
}
