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
  const cells = {}

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
  for (const XY in block.cells) {
    const [X, Y] = getPosNumber(XY)

    if (X < 0 || X >= colNumber || Y < 0 || Y >= rowNumber) return false

    if (fixedCells[XY].exist) return false
  }
  return true
}

export const existFullRow = (fixedCells: Cells): boolean => {
  for (let Y = 0; Y < rowNumber; Y++) {
    let existCellNum = 0;
    for (let X = 0; X < colNumber; X++) {
      existCellNum = fixedCells[`${X},${Y}`].exist ? existCellNum + 1 : existCellNum;
    }
    if (existCellNum === colNumber) return true;
  }
  return false
}

export const getFullRowList = (cells: Cells) => {
  let fullRowList = [];
  for (let Y = 0; Y < rowNumber; Y++) {
    let fullRowFlg = true;
    for (let X = 0; X < colNumber; X++) {
      if (!cells[`${X},${Y}`].exist) fullRowFlg = false;
    }
    if (fullRowFlg) fullRowList.push(Y)
  }
  return fullRowList
}

export const shouldFixActiveBlock = (activeBlock: Block, fixedCells: Cells): boolean => {
  return Object.keys(activeBlock.cells).some((XY) => {

    const [X, Y] = getPosNumber(XY)

    // 一番下に落ちた時
    if (Y === rowNumber - 1) return true
    // 下にブロックがある時
    if (!activeBlock.cells.hasOwnProperty(`${X},${Y + 1}`) && fixedCells[`${X},${Y + 1}`].exist === true)
      return true;
  })
}

export const isGameOver = (fixedCells: Cells): boolean => {
  return Object.keys(fixedCells).some((XY) => {
    const [X, Y] = getPosNumber(XY)

    if (fixedCells[`${X},1`].exist === true) return true
  })
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