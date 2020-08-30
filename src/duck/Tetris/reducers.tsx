import { Cells, Cell, Block, TetrisState } from 'duck/Tetris/types'
import { BlockCreator } from 'functions/BlockCreator'
import { getAddedPos, getPosNumber, shiftBlockPos } from 'functions/PositionShifter'
const path = require('path');
const src = path.resolve(__dirname, 'src');
const deepMerge = require('deepmerge')

const colNumber: number = 10;
const rowNumber: number = 20;
const blankCell: Cell = {
  exist: false,
  backgroundColor: 'black'
}

const getBlankCells = (): Cells => {
  let cells = {}

  for (let x = 0; x < colNumber; x++) {
    for (let y = 0; y < rowNumber; y++) {
      cells[`${x},${y}`] = blankCell
    }
  }

  return cells
}

const mergeCells = (baseCells: Cells, overwriteCells): Cells => {
  return deepMerge(baseCells, overwriteCells)
}

const shiftBlockIfStickout = (targetBlock: Block): Block => {
  let shiftedBlock = {
    ...targetBlock,
    cells: {},
  }

  let overlapX = 0;
  let overlapY = 0;
  for (let XY in targetBlock.cells) {
    let [X, Y] = getPosNumber(XY)
    if (X >= colNumber) {
      if (Math.abs(overlapX) < Math.abs(colNumber - X - 1)) overlapX = colNumber - X - 1
    }
    if (X < 0) {
      if (Math.abs(overlapX) < Math.abs(X)) overlapX = - X
    }
    if (Y >= rowNumber) {
      if (Math.abs(overlapY) < Math.abs(colNumber - Y - 1)) overlapY = rowNumber - Y - 1
    }
    if (Y < 0) {
      if (Math.abs(overlapY) < Math.abs(Y)) overlapY = - Y
    }
  }
  shiftedBlock = shiftBlockPos(targetBlock, overlapX, overlapY)
  return shiftedBlock
}

const shiftBlockIfOverlaping = (fixedCells: Cells, targetBlock: Block, preTargetBlock: Block): Block => {

  let noOverlapingBlock = {
    ...targetBlock,
    cells: {},
  }
  let shiftX = 0;
  let shiftY = 0;
  let i = 0;

  for (let XY in targetBlock.cells) {

    let [X, Y] = getPosNumber(XY)
    let [axisOfRotationX, axisOfRotationY] = getPosNumber(targetBlock.axisOfRotation)
    let [preAxisOfRotationX, preAxisOfRotationY] = getPosNumber(preTargetBlock.axisOfRotation)

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
  noOverlapingBlock = shiftBlockPos(targetBlock, shiftX, shiftY)

  return noOverlapingBlock
}

const spinActiveBlock = (fixedCells: Cells, spinBlock: Block): Block => {
  if (spinBlock.name === 'square') return spinBlock;


  let spinedBlockOrigin: Block = {
    ...spinBlock,
    axisOfRotation: '0,0',
    cells: {}
  }

  let [axisOfRotationX, axisOfRotationY] = getPosNumber(spinBlock.axisOfRotation)
  let spinBlockOrigin = shiftBlockPos(spinBlock, -axisOfRotationX, -axisOfRotationY);

  for (let XY in spinBlockOrigin.cells) {
    let [X, Y] = getPosNumber(XY)
    let spinedX = -Y
    let spinedY = X

    if (!spinedBlockOrigin.cells.hasOwnProperty(`${spinedX},${spinedY}`)) {
      spinedBlockOrigin.cells[`${spinedX},${spinedY}`] = spinBlockOrigin.cells[XY]
    }
  }

  let spinedBlock = shiftBlockPos(spinedBlockOrigin, axisOfRotationX, axisOfRotationY);
  spinedBlock = shiftBlockIfStickout(spinedBlock)
  spinedBlock = shiftBlockIfOverlaping(fixedCells, spinedBlock, spinBlock)

  if (!canExistBlock(fixedCells, spinedBlock)) return spinBlock
  return spinedBlock
}



const removeColIfFulledCol = (fixedCells: Cells): Cells => {
  const removeColList = extractColShouldRemove(fixedCells)

  let newFixedCells = fixedCells;
  removeColList.forEach((removeY) => {
    newFixedCells = removeCol(removeY, newFixedCells)
  })
  return newFixedCells
}

const extractColShouldRemove = (fixedCells: Cells): Array<number> => {
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

const canExistBlock = (fixedCells: Cells, block: Block): boolean => {
  for (let XY in block.cells) {
    let [X, Y] = getPosNumber(XY)

    if (X < 0 || X >= colNumber || Y < 0 || Y >= rowNumber) return false

    if (fixedCells[XY].exist) return false
  }
  return true
}

const scoreCalculater = (removeColNumber: number) => {
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

const initialTetrisState: TetrisState = {
  viewCells: getBlankCells(),
  fixedCells: getBlankCells(),
  activeBlock: null,
  nextBlock: BlockCreator(),
  dropSpeed: 1000,
  score: 0,
  isPlay: false,
  isGameOver: false,
  audio: {
    src: `${src}/assets/korobushka.wav`,
    isMute: true,
    isPlay: false,
  }
}

export const tetris = (tetrisState = initialTetrisState, action) => {
  switch (action.type) {
    case 'putActiveBlock':

      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, tetrisState.nextBlock.cells),
        activeBlock: tetrisState.nextBlock,
        nextBlock: BlockCreator(),
        isPlay: true,
        audio: {
          ...tetrisState.audio,
          isPlay: true
        }
      }
    case 'shiftActiveBlockLeft':
      let leftShiftedBlock = shiftBlockPos(tetrisState.activeBlock, -1, 0)
      leftShiftedBlock = shiftBlockIfStickout(leftShiftedBlock)
      leftShiftedBlock = shiftBlockIfOverlaping(tetrisState.fixedCells, leftShiftedBlock, tetrisState.activeBlock)

      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, leftShiftedBlock.cells),
        activeBlock: leftShiftedBlock
      }
    case 'shiftActiveBlockRight':
      let rightShiftedBlock = shiftBlockPos(tetrisState.activeBlock, 1, 0)
      rightShiftedBlock = shiftBlockIfStickout(rightShiftedBlock)
      rightShiftedBlock = shiftBlockIfOverlaping(tetrisState.fixedCells, rightShiftedBlock, tetrisState.activeBlock)

      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, rightShiftedBlock.cells),
        activeBlock: rightShiftedBlock
      }
    case 'dropActiveBlock':
      let dropedActiveBlock = shiftBlockPos(tetrisState.activeBlock, 0, 1)
      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, dropedActiveBlock.cells),
        fixedCells: tetrisState.fixedCells,
        activeBlock: dropedActiveBlock,
      }
    case 'fixActiveBlock':
      let mergedCells = mergeCells(tetrisState.fixedCells, tetrisState.activeBlock.cells)
      let newFixedCells = removeColIfFulledCol(mergedCells)

      let removeColList = extractColShouldRemove(mergedCells)
      let newScore = scoreCalculater(removeColList.length) + tetrisState.score

      let newActiveBlock = tetrisState.nextBlock;
      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, tetrisState.activeBlock.cells),
        fixedCells: newFixedCells,
        activeBlock: newActiveBlock,
        nextBlock: BlockCreator(),
        score: newScore
      }
    case 'gameOver':
      return {
        ...tetrisState,
        activeBlock: null,
        isGameOver: true,
        isPlay: false,
        audio: {
          isPlay: false
        }
      }
    case 'spinActiveBlock':
      const spinedBlock = spinActiveBlock(tetrisState.fixedCells, tetrisState.activeBlock);

      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, spinedBlock.cells),
        activeBlock: spinedBlock
      }
    case 'resetGame':
      return {
        ...tetrisState,
        viewCells: getBlankCells(),
        fixedCells: getBlankCells(),
        activeBlock: null,
        nextBlock: BlockCreator(),
        score: 0,
        isPlay: false,
        isGameOver: false,
        dropSpeed: 1000,
        audio: {
          ...tetrisState.audio,
          isPlay: false
        }
      }
    case 'acceleDropSpeed':
      return {
        ...tetrisState,
        dropSpeed: tetrisState.dropSpeed * 0.95
      }
    case 'audioPlay':
      return {
        ...tetrisState,
        audio: {
          ...tetrisState.audio,
          isPlay: true
        }
      }
    case 'audioStop':
      return {
        ...tetrisState,
        audio: {
          ...tetrisState.audio,
          isPlay: false
        }
      }
    case 'toggleAudioMute':
      return {
        ...tetrisState,
        audio: {
          ...tetrisState.audio,
          isMute: !tetrisState.audio.isMute
        }
      }
    default: return tetrisState
  }
}
