// node_modules
const deepMerge = require('deepmerge')
// types
import { Cells, Cell, Block } from 'duck/Tetris/types'
// functions
import { getPosNumber } from 'duck/Tetris/common/PositionShifter'

export const colNumber: number = 10;
export const rowNumber: number = 20;

export const blankCell: Cell = {
  exist: false,
  backgroundColor: 'black'
}

export const getBlankCells = (): Cells => {
  let cells = {}

  for (let x = 0; x < colNumber; x++) {
    for (let y = 0; y < rowNumber; y++) {
      cells[`${x},${y}`] = blankCell
    }
  }

  return cells
}

export const mergeCells = (baseCells: Cells, overwriteCells): Cells => {
  return deepMerge(baseCells, overwriteCells)
}

export const canExistBlock = (fixedCells: Cells, block: Block): boolean => {
  for (let XY in block.cells) {
    let [X, Y] = getPosNumber(XY)

    if (X < 0 || X >= colNumber || Y < 0 || Y >= rowNumber) return false

    if (fixedCells[XY].exist) return false
  }
  return true
}

export const scoreCalculater = (removeColNumber: number) => {
  switch (removeColNumber) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 3
    case 3:
      return 10
    case 4:
      return 20
  }
}