// types
import { Cells, Block } from 'duck/Tetris/types'
// config
import { MAX_COL_NUMBER, MAX_ROW_NUMBER } from 'duck/Tetris/config'
// functions 
import { getAddedPos, getPosNumber } from 'duck/Tetris/common/PositionShifter'
import { canExistBlock } from 'duck/Tetris/common/Common'

export const shiftBlockPos = (targetBlock: Block, addX: number, addY: number): Block => {
  const shiftedBlock = {
    ...targetBlock,
    cells: {}
  }

  for (const XY in targetBlock.cells) {
    const addedXY = getAddedPos(XY, addX, addY)
    shiftedBlock.cells[addedXY] = targetBlock.cells[XY]
  }
  shiftedBlock.axisOfRotation = getAddedPos(targetBlock.axisOfRotation, addX, addY)

  return shiftedBlock
}

export const shiftBlockIfStickout = (targetBlock: Block): Block => {
  let overlapX = 0;
  let overlapY = 0;

  for (const XY in targetBlock.cells) {
    let [X, Y] = getPosNumber(XY)
    if (X >= MAX_COL_NUMBER) {
      if (Math.abs(overlapX) < Math.abs(MAX_COL_NUMBER - X - 1)) overlapX = MAX_COL_NUMBER - X - 1
    }
    if (X < 0) {
      if (Math.abs(overlapX) < Math.abs(X)) overlapX = - X
    }
    if (Y >= MAX_ROW_NUMBER) {
      if (Math.abs(overlapY) < Math.abs(MAX_COL_NUMBER - Y - 1)) overlapY = MAX_ROW_NUMBER - Y - 1
    }
    if (Y < 0) {
      if (Math.abs(overlapY) < Math.abs(Y)) overlapY = - Y
    }
  }

  return shiftBlockPos(targetBlock, overlapX, overlapY)
}

export const shiftBlockIfOverlaping = (fixedCells: Cells, targetBlock: Block, preTargetBlock: Block): Block => {

  let shiftX = 0;
  let shiftY = 0;
  let i = 0;

  for (const XY in targetBlock.cells) {
    const [X, Y] = getPosNumber(XY)
    const [axisOfRotationX, axisOfRotationY] = getPosNumber(targetBlock.axisOfRotation)
    const [preAxisOfRotationX, preAxisOfRotationY] = getPosNumber(preTargetBlock.axisOfRotation)

    if (fixedCells[XY].exist) {
      if (preAxisOfRotationX > X) {
        shiftX = 1
      } else {
        shiftX = -1
      }
      if (targetBlock.name === 'straight' && i !== 1 && i !== 2) shiftX *= 2;

      if (X === preAxisOfRotationX) {
        if (Math.abs(Y) > Math.abs(shiftY)) {
          if (Y > preAxisOfRotationY) {
            shiftY = axisOfRotationY - Y
          } else {
            shiftY = Y - axisOfRotationY
          }
        }
      }
    }
    i++;
  }

  return shiftBlockPos(targetBlock, shiftX, shiftY)
}

export const spinActiveBlock = (fixedCells: Cells, spinBlock: Block): Block => {
  if (spinBlock.name === 'square') return spinBlock;

  const spinedBlockOrigin: Block = {
    ...spinBlock,
    axisOfRotation: '0,0',
    cells: {}
  }

  const [axisOfRotationX, axisOfRotationY] = getPosNumber(spinBlock.axisOfRotation)
  const spinBlockOrigin = shiftBlockPos(spinBlock, -axisOfRotationX, -axisOfRotationY);

  for (const XY in spinBlockOrigin.cells) {
    const [X, Y] = getPosNumber(XY)
    const spinedX = -Y
    const spinedY = X

    spinedBlockOrigin.cells[`${spinedX},${spinedY}`] = spinBlockOrigin.cells[XY]
  }

  let spinedBlock = shiftBlockPos(spinedBlockOrigin, axisOfRotationX, axisOfRotationY);
  spinedBlock = shiftBlockIfStickout(spinedBlock)
  spinedBlock = shiftBlockIfOverlaping(fixedCells, spinedBlock, spinBlock)

  if (!canExistBlock(fixedCells, spinedBlock)) return spinBlock
  return spinedBlock
}