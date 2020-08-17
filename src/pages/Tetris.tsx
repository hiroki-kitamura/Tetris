import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { TetrisView } from 'views/TetrisView';
import { BlockCreator } from 'functions/BlockCreator'
const path = require('path');
const src = path.resolve(__dirname, 'src');
const deepMerge = require('deepmerge')

interface Cell {
  exist: boolean,
  backgroundColor: string
}
interface Cells {
  [index: string]: {
    [index: string]: Cell
  },
}
interface Block {
  name: string,
  axisOfRotation: {
    x: number,
    y: number
  }
  cells: Cells,
}

const colNumber: number = 10;
const rowNumber: number = 20;
const blankCell: Cell = {
  exist: false,
  backgroundColor: 'black'
}

const getBlankCells = (): Cells => {
  let cells = {}

  for (let x = 0; x < colNumber; x++) {
    cells[x] = {}

    for (let y = 0; y < rowNumber; y++) {
      cells[x][y] = blankCell
    }
  }

  return cells
}
const mergeCells = (baseCells: Cells, overwriteCells): Cells => {
  return deepMerge(baseCells, overwriteCells)
}
const shiftBlockPos = (targetBlock: Block, addX: number, addY: number): Block => {
  const shiftedBlock = {
    name: targetBlock.name,
    axisOfRotation: {
      x: null,
      y: null
    },
    cells: {}
  }
  for (let posXStr in targetBlock.cells) {
    for (let posYStr in targetBlock.cells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)

      if (!shiftedBlock.cells.hasOwnProperty(posX + addX)) {
        shiftedBlock.cells[posX + addX] = {}
      }
      if (!shiftedBlock.cells[posX + addX].hasOwnProperty(posY + addY)) {
        shiftedBlock.cells[posX + addX][posY + addY] = {}
      }
      shiftedBlock.cells[posX + addX][posY + addY] = targetBlock.cells[posX][posY]
    }
  }
  shiftedBlock.axisOfRotation.x = targetBlock.axisOfRotation.x + addX
  shiftedBlock.axisOfRotation.y = targetBlock.axisOfRotation.y + addY
  return shiftedBlock
}

const shiftBlockIfStickout = (targetBlock: Block): Block => {
  let shiftedBlock = {
    name: targetBlock.name,
    axisOfRotation: targetBlock.axisOfRotation,
    cells: {},
  }
  const overlapPos = {
    x: 0,
    y: 0
  }
  for (let posXStr in targetBlock.cells) {
    for (let posYStr in targetBlock.cells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)
      if (posX >= colNumber) {
        if (Math.abs(overlapPos.x) < Math.abs(colNumber - posX - 1)) overlapPos.x = colNumber - posX - 1
      }
      if (posX < 0) {
        if (Math.abs(overlapPos.x) < Math.abs(posX)) overlapPos.x = - posX
      }
      if (posY >= rowNumber) {
        if (Math.abs(overlapPos.y) < Math.abs(colNumber - posY - 1)) overlapPos.y = rowNumber - posY - 1
      }
      if (posY < 0) {
        if (Math.abs(overlapPos.y) < Math.abs(posY)) overlapPos.y = - posY
      }
    }
    shiftedBlock = shiftBlockPos(targetBlock, overlapPos.x, overlapPos.y)
  }
  return shiftedBlock
}

const shiftBlockIfOverlaping = (fixedCells: Cells, targetBlock: Block, preTargetBlock: Block): Block => {
  let noOverlapingBlock = {
    name: targetBlock.name,
    axisOfRotation: targetBlock.axisOfRotation,
    cells: {},
  }
  const overlapPos = {
    x: 0,
    y: 0
  }
  let pierceFlg = false;
  for (let posXStr in targetBlock.cells) {
    if (pierceFlg) overlapPos.x = overlapPos.x * 2;

    for (let posYStr in targetBlock.cells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)

      if (fixedCells[posX][posY].exist) {
        if (preTargetBlock.axisOfRotation.x - posX > 0) {
          overlapPos.x = overlapPos.x ? overlapPos.x : 1;
          pierceFlg = true
        } else {
          overlapPos.x = overlapPos.x ? overlapPos.x : -1;
          pierceFlg = true
        }

        if (posX === preTargetBlock.axisOfRotation.x) {
          if (Math.abs(posY) > Math.abs(overlapPos.y)) {
            if (posY > targetBlock.axisOfRotation.y) {
              overlapPos.y = targetBlock.axisOfRotation.y - posY
            } else {
              overlapPos.y = posY - targetBlock.axisOfRotation.y
            }
          }
        }
      }
    }
  }
  noOverlapingBlock = shiftBlockPos(targetBlock, overlapPos.x, overlapPos.y)

  return noOverlapingBlock
}

const spinActiveBlock = (fixedCells: Cells, spinBlock: Block): Block => {
  if (spinBlock.name === 'square') return spinBlock;

  let spinedBlockOrigin: Block = {
    ...spinBlock,
    axisOfRotation: {
      x: 0,
      y: 0
    },
    cells: {}
  }

  let spinBlockOrigin = shiftBlockPos(spinBlock, -spinBlock.axisOfRotation.x, -spinBlock.axisOfRotation.y);

  for (let posXStr in spinBlockOrigin.cells) {
    for (let posYStr in spinBlockOrigin.cells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)

      if (!spinedBlockOrigin.cells.hasOwnProperty(-posY)) {
        spinedBlockOrigin.cells[-posY] = {}
      }
      if (!spinedBlockOrigin.cells[-posY].hasOwnProperty(posX)) {
        spinedBlockOrigin.cells[-posY][posX] = spinBlockOrigin.cells[posX][posY]
      }
    }
  }

  let spinedBlock = shiftBlockPos(spinedBlockOrigin, spinBlock.axisOfRotation.x, spinBlock.axisOfRotation.y);

  spinedBlock = shiftBlockIfStickout(spinedBlock)
  spinedBlock = shiftBlockIfOverlaping(fixedCells, spinedBlock, spinBlock)

  if (!canExistBlock(fixedCells, spinedBlock)) return spinBlock

  return spinedBlock
}

const shouldFixActiveBlock = (activeBlock: Block, fixedCells: Cells): boolean => {
  for (let posXStr in activeBlock.cells) {
    for (let posYStr in activeBlock.cells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)
      // 一番下に落ちた時
      if (posY === rowNumber - 1) return true
      // 下にブロックがある時
      if (!activeBlock.cells[posX].hasOwnProperty(posY + 1) && fixedCells[posX][posY + 1].exist === true)
        return true;
    }
  }
  return false
}

const removeColIfFulledCol = (fixedCells: Cells): Cells => {
  const removeColList = extractColShouldRemove(fixedCells)

  let newFixedCells = fixedCells;
  removeColList.forEach((removePosY) => {
    newFixedCells = removeCol(removePosY, newFixedCells)
  })
  return newFixedCells
}

const extractColShouldRemove = (fixedCells: Cells): Array<number> => {
  const removeColList = []
  for (let posYStr in fixedCells[0]) {
    const posY: number = Number(posYStr)
    let removeFlg = true;
    for (let posXStr in fixedCells) {
      const posX: number = Number(posXStr)
      if (!fixedCells[posX][posY].exist) removeFlg = false;
    }
    if (removeFlg) removeColList.push(posY)
  }
  return removeColList;
}

const removeCol = (removePosY: number, fixedCells: Cells): Cells => {
  const removedCells = getBlankCells();
  for (let posXStr in fixedCells) {
    for (let posYStr in fixedCells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)
      if (posY === 0) continue;

      if (posY > removePosY) removedCells[posX][posY] = fixedCells[posX][posY]

      removedCells[posX][posY] = fixedCells[posX][posY - 1]
    }
  }
  return removedCells
}

const canExistBlock = (fixedCells: Cells, block: Block): boolean => {
  for (let posXStr in block.cells) {
    for (let posYStr in block.cells[posXStr]) {
      const posX: number = Number(posXStr)
      const posY: number = Number(posYStr)

      if (posX < 0 || posX >= colNumber || posY < 0 || posY >= rowNumber) return false

      if (fixedCells[posX][posY].exist) return false
    }
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
  for (let posXStr in fixedCells) {
    const posX: number = Number(posXStr)
    if (fixedCells[posX][1].exist === true) return true
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
