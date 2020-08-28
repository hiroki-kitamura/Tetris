import { Cells, Cell, Block } from 'duck/Tetris/types'

export const getAddedPos = (XY: string, addX: number, addY: number): string => {
  let splitPos = XY.split(',')
  let X = Number(splitPos[0])
  let Y = Number(splitPos[1])

  return `${X + addX},${Y + addY}`
}

export const getPosNumber = (XY: string): Array<number> => {
  let splitPosList = XY.split(',')
  let X = Number(splitPosList[0])
  let Y = Number(splitPosList[1])

  return [X, Y]
}

export const shiftBlockPos = (targetBlock: Block, addX: number, addY: number): Block => {
  const shiftedBlock = {
    ...targetBlock,
    cells: {}
  }

  for (let XY in targetBlock.cells) {
    const addedXY = getAddedPos(XY, addX, addY)
    shiftedBlock.cells[addedXY] = targetBlock.cells[XY]
  }
  shiftedBlock.axisOfRotation = getAddedPos(targetBlock.axisOfRotation, addX, addY)

  return shiftedBlock
}