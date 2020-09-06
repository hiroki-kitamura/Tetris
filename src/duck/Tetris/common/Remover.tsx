// types
import { Cells } from 'duck/Tetris/types'
// functions
import { getPosNumber } from 'duck/Tetris/common/PositionShifter'
import { blankCell, getBlankCells, getFullRowList } from 'duck/Tetris/common/Common'

export const removeRow = (targetRowList: Array<number>, cells: Cells): Cells => {
  const removedCells = getBlankCells();
  const maxYOfTargetRow = Math.max(...targetRowList)
  const targetNum = targetRowList.length

  for (let XY in cells) {
    const [X, Y] = getPosNumber(XY)

    if (Y === 0) continue;
    if (Y > maxYOfTargetRow) {
      removedCells[XY] = cells[XY]
      continue;
    }

    removedCells[XY] = cells[`${X},${Y - targetNum}`] ? cells[`${X},${Y - targetNum}`] : blankCell
  }
  return removedCells
}

export const removeFullRow = (cells: Cells): Cells => {
  const fullRowList = getFullRowList(cells)
  return removeRow(fullRowList, cells)
}
