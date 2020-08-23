import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { TetrisView } from 'views/TetrisView';
import { Cells, Cell, Block } from 'interface/common'
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
  let overlapX = 0;
  let overlapY = 0;
  let pierceFlg = false;

  for (let XY in targetBlock.cells) {
    if (pierceFlg) overlapX = overlapX * 2;

    let [X, Y] = getPosNumber(XY)
    let [axisOfRotationX, axisOfRotationY] = getPosNumber(targetBlock.axisOfRotation)
    let [preAxisOfRotationX, preAxisOfRotationY] = getPosNumber(preTargetBlock.axisOfRotation)

    if (fixedCells[XY].exist) {
      if (preAxisOfRotationX - X > 0) {
        overlapX = overlapX ? overlapX : 1;
        pierceFlg = true
      } else {
        overlapX = overlapX ? overlapX : -1;
        pierceFlg = true
      }

      if (X === axisOfRotationX) {
        if (Math.abs(Y) > Math.abs(overlapY)) {
          if (Y > preAxisOfRotationY) {
            overlapY = axisOfRotationY - Y
          } else {
            overlapY = Y - axisOfRotationY
          }
        }
      }
    }
  }
  noOverlapingBlock = shiftBlockPos(targetBlock, overlapX, overlapY)

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

const shouldFixActiveBlock = (activeBlock: Block, fixedCells: Cells): boolean => {
  for (let XY in activeBlock.cells) {

    let [X, Y] = getPosNumber(XY)

    // 一番下に落ちた時
    if (Y === rowNumber - 1) return true
    // 下にブロックがある時
    if (!activeBlock.cells.hasOwnProperty(`${X},${Y + 1}`) && fixedCells[`${X},${Y + 1}`].exist === true)
      return true;
  }
  return false
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

const audio = new Audio(`${src}/assets/korobushka.wav`)

const isGameOver = (fixedCells: Cells): boolean => {
  for (let XY in fixedCells) {
    let [X, Y] = getPosNumber(XY)

    if (fixedCells[`${X},1`].exist === true) return true
  }
}

const reducer = (tetrisState, action) => {
  switch (action.type) {
    case 'putActiveBlock':

      return {
        ...tetrisState,
        viewCells: mergeCells(tetrisState.fixedCells, tetrisState.nextBlock.cells),
        activeBlock: tetrisState.nextBlock,
        nextBlock: BlockCreator(),
        isPlay: true
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
    case 'dropOrFixOrGameOver':
      let action
      let dropedActiveBlock = shiftBlockPos(tetrisState.activeBlock, 0, 1)
      if (isGameOver(tetrisState.fixedCells)) {
        action = 'gameOver'
      } else if (shouldFixActiveBlock(dropedActiveBlock, tetrisState.fixedCells)) {
        action = 'fix'
      } else {
        action = 'drop'
      }

      switch (action) {
        case 'gameOver':
          return {
            ...tetrisState,
            activeBlock: null,
            isGameOver: true,
            isPlay: false,
          }
        case 'fix':
          let newFixedCells = null;
          let newActiveBlock = null;
          let newNextBlock;
          let newScore = null
          let mergedCells = mergeCells(tetrisState.fixedCells, dropedActiveBlock.cells)
          let removeColList = extractColShouldRemove(mergedCells)

          newScore = scoreCalculater(removeColList.length) + tetrisState.score
          newFixedCells = removeColIfFulledCol(mergedCells)
          newActiveBlock = tetrisState.nextBlock;
          newNextBlock = BlockCreator();
          return {
            ...tetrisState,
            viewCells: mergeCells(tetrisState.fixedCells, dropedActiveBlock.cells),
            fixedCells: newFixedCells,
            activeBlock: newActiveBlock,
            nextBlock: newNextBlock,
            score: newScore
          }
        case 'drop':
          return {
            ...tetrisState,
            viewCells: mergeCells(tetrisState.fixedCells, dropedActiveBlock.cells),
            fixedCells: tetrisState.fixedCells,
            activeBlock: dropedActiveBlock,
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
        dropSpeed: 1000
      }
    case 'acceleDropSpeed':
      return {
        ...tetrisState,
        dropSpeed: tetrisState.dropSpeed * 0.95
      }
    case 'toggleAudioPlay':
      if (tetrisState.isPlay === true) {
        audio.play()
        audio.loop = true;
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
      return {
        ...tetrisState
      }
    case 'toggleAudioMute':
      return {
        ...tetrisState,
        isMute: !tetrisState.isMute
      }
    default: return tetrisState
  }
}
export const Tetris = () => {
  const [tetrisState, dispatch] = useReducer(reducer, {
    viewCells: getBlankCells(),
    fixedCells: getBlankCells(),
    activeBlock: null,
    nextBlock: BlockCreator(),
    dropSpeed: 1000,
    score: 0,
    isMute: true,
    isPlay: false,
    isGameOver: false
  })

  useEffect(() => {
    if (!tetrisState.activeBlock) return

    var timeoutId = setTimeout(() => {
      dispatch({ type: 'dropOrFixOrGameOver' })
    }, tetrisState.dropSpeed)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [tetrisState.activeBlock])

  useEffect(() => {
    dispatch({ type: 'toggleAudioPlay' })
  }, [tetrisState.isPlay])

  useEffect(() => {
    setInterval(() => {
      dispatch({ type: 'acceleDropSpeed' })
    }, 3000);
  }, [])

  audio.muted = tetrisState.isMute
  return (
    <TetrisView
      viewCells={tetrisState.viewCells}
      score={tetrisState.score}
      nextBlock={{
        name: tetrisState.nextBlock.name,
        cells: tetrisState.nextBlock.cells
      }}
      isGameOver={tetrisState.isGameOver}
      isPlay={tetrisState.isPlay}
      isMute={tetrisState.isMute}
      clickEvent={{
        moveLeft: () => { dispatch({ type: 'shiftActiveBlockLeft' }) },
        moveRight: () => { dispatch({ type: 'shiftActiveBlockRight' }) },
        moveBottom: () => { dispatch({ type: 'dropOrFixOrGameOver' }) },
        startGame: () => { dispatch({ type: 'putActiveBlock' }) },
        resetGame: () => { dispatch({ type: 'resetGame' }) },
        toggleAudioMute: () => { dispatch({ type: 'toggleAudioMute' }) },
        spin: () => { dispatch({ type: 'spinActiveBlock' }) },
      }}
    />
  )
}
