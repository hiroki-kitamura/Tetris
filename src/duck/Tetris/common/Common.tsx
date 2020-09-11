// node_modules
const deepMerge = require('deepmerge')
// config
import { MAX_COL_NUMBER, MAX_ROW_NUMBER } from 'duck/Tetris/config'
// types
import { Cells, Cell, Block } from 'duck/Tetris/types'
// functions
import { getPosNumber } from 'duck/Tetris/common/PositionShifter'

export const blankCell: Cell = {
  exist: false,
  backgroundColor: 'black'
}

export const getBlankCells = (): Cells => {
  const cells = {}

  for (let x = 0; x < MAX_COL_NUMBER; x++) {
    for (let y = 0; y < MAX_ROW_NUMBER; y++) {
      cells[`${x},${y}`] = blankCell
    }
  }

  return cells
}

export const mergeCells = (baseCells: Cells, overwriteCells): Cells => {
  return deepMerge(baseCells, overwriteCells)
}

export const canExistBlock = (fixedCells: Cells, block: Block): boolean => {
  for (const XY in block.cells) {
    const [X, Y] = getPosNumber(XY)

    if (X < 0 || X >= MAX_COL_NUMBER || Y < 0 || Y >= MAX_ROW_NUMBER) return false

    if (fixedCells[XY].exist) return false
  }
  return true
}

export const existFullRow = (fixedCells: Cells): boolean => {
  for (let Y = 0; Y < MAX_ROW_NUMBER; Y++) {
    const Row = [];
    for (let X = 0; X < MAX_COL_NUMBER; X++) {
      Row.push(fixedCells[`${X},${Y}`])
    }
    if (!Row.find(cell => cell.exist === false)) return true
  }
  return false
}

export const getFullRowList = (cells: Cells) => {
  let fullRowList = [];
  for (let Y = 0; Y < MAX_ROW_NUMBER; Y++) {
    const Row = [];
    for (let X = 0; X < MAX_COL_NUMBER; X++) {
      Row.push(cells[`${X},${Y}`])
    }
    if (!Row.find(cell => cell.exist === false)) fullRowList.push(Y);
  }
  return fullRowList
}

export const isFixActiveBlock = (activeBlock: Block, fixedCells: Cells): boolean =>
  Object.keys(activeBlock.cells).some((XY) => {
    const [X, Y] = getPosNumber(XY)

    // 一番下に落ちた時
    if (Y === MAX_ROW_NUMBER - 1) return true
    // 下にブロックがある時
    return !activeBlock.cells.hasOwnProperty(`${X},${Y + 1}`) && fixedCells[`${X},${Y + 1}`].exist
  })

export const isGameOver = (fixedCells: Cells): boolean =>
  Object.keys(fixedCells).some((XY) => {
    const [X] = getPosNumber(XY)

    return fixedCells[`${X},1`].exist
  })


export const scoreCalculater = (removeRowNum: number) => {
  switch (removeRowNum) {
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