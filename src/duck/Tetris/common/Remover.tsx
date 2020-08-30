// types
import { Cells } from 'duck/Tetris/types'
// functions
import { getPosNumber } from 'duck/Tetris/common/PositionShifter'
import { colNumber, rowNumber, getBlankCells } from 'duck/Tetris/common/Common'

export const removeColIfFulledCol = (fixedCells: Cells): Cells => {
  const removeColList = extractColShouldRemove(fixedCells)

  let newFixedCells = fixedCells;
  removeColList.forEach((removeY) => {
    newFixedCells = removeCol(removeY, newFixedCells)
  })
  return newFixedCells
}

export const extractColShouldRemove = (fixedCells: Cells): Array<number> => {
  const removeColList = []

  for (let Y = 0; Y < rowNumber; Y++) {
    let removeFlg = true;
    for (let X = 0; X < colNumber; X++) {
      if (!fixedCells[`${X},${Y}`].exist) removeFlg = false;
    }
    if (removeFlg) removeColList.push(Y)
  }
  return removeColList;
}

const removeCol = (removeY: number, fixedCells: Cells): Cells => {
  const removedCells = getBlankCells();
  for (let XY in fixedCells) {
    let [X, Y] = getPosNumber(XY)
    if (Y === 0) continue;

    if (Y > removeY) removedCells[XY] = fixedCells[XY]

    removedCells[XY] = fixedCells[`${X},${Y - 1}`]
  }
  return removedCells
}