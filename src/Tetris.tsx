import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { TetrisView } from './TetrisView';
import { BlockCreator } from './BlockCreator'
const deepMerge = require('deepmerge')

interface Cell {
  exist: Boolean,
  backgroundColor: String
}

interface CellPosY {
  exist: Boolean,
  backgroundColor: String
}

interface CellPosX {
  0: CellPosY,
  1: CellPosY,
  2: CellPosY,
  3: CellPosY,
  4: CellPosY,
  5: CellPosY,
  6: CellPosY,
  7: CellPosY,
  8: CellPosY,
  9: CellPosY,
  10: CellPosY,
  11: CellPosY,
  12: CellPosY,
  13: CellPosY,
  14: CellPosY,
  15: CellPosY,
  16: CellPosY,
  17: CellPosY,
  18: CellPosY,
  19: CellPosY,
}

interface Cells {
  0: CellPosX,
  1: CellPosX,
  2: CellPosX,
  3: CellPosX,
  4: CellPosX,
  5: CellPosX,
  6: CellPosX,
  7: CellPosX,
  8: CellPosX,
  9: CellPosX,
}
const blankCell: Cell = {
  exist: false,
  backgroundColor: 'gray'
}

interface MovedBlock {
  axisOfRotation: {
    x: number,
    y: number
  }
  cells: Object,
}

const Tetris = () => {
  const colNumber: number = 10;
  const rowNumber: number = 20;
  const getBlankCells = () => {
    let preCells;
    preCells = {}

    for (let x = 0; x < colNumber; x++) {
      preCells[x] = {}
    }
    for (let x = 0; x < colNumber; x++) {
      for (let y = 0; y < rowNumber; y++) {
        preCells[x][y] = blankCell
      }
    }

    const cells: Cells = preCells
    return cells
  }

  const [tetrisState, setTetrisState] = useState({
    viewCells: getBlankCells(),
    fixedCells: getBlankCells(),
    activeBlock: null
  })

  const putActiveBlock = (): void => {
    const newBlock = BlockCreator();

    setTetrisState({
      ...tetrisState,
      activeBlock: newBlock
    })
  }

  const spinActiveBlock = () => {
    if (tetrisState.activeBlock.name === 'square') return;

    let spinCellsOrigin = {};
    for (let posXStr in tetrisState.activeBlock.cells) {
      for (let posYStr in tetrisState.activeBlock.cells[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)

        if (!spinCellsOrigin.hasOwnProperty(posX - tetrisState.activeBlock.axisOfRotation.x)) {
          spinCellsOrigin[posX - tetrisState.activeBlock.axisOfRotation.x] = {}
        }
        if (!spinCellsOrigin[posX - tetrisState.activeBlock.axisOfRotation.x].hasOwnProperty(posY - tetrisState.activeBlock.axisOfRotation.y)) {
          spinCellsOrigin[posX - tetrisState.activeBlock.axisOfRotation.x][posY - tetrisState.activeBlock.axisOfRotation.y] = tetrisState.activeBlock.cells[posX][posY]
        }
      }
    }

    let spinedCellsOrigin = {}
    for (let posXStr in spinCellsOrigin) {
      for (let posYStr in spinCellsOrigin[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)

        if (!spinedCellsOrigin.hasOwnProperty(-posY)) {
          spinedCellsOrigin[-posY] = {}
        }
        if (!spinedCellsOrigin[-posY].hasOwnProperty(posX)) {
          spinedCellsOrigin[-posY][posX] = {}
        }
        spinedCellsOrigin[-posY][posX] = spinCellsOrigin[posX][posY]
      }
    }

    let spinedCells = {}
    for (let posXStr in spinedCellsOrigin) {
      for (let posYStr in spinedCellsOrigin[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)

        if (!spinedCells.hasOwnProperty(posX + tetrisState.activeBlock.axisOfRotation.x)) {
          spinedCells[posX + tetrisState.activeBlock.axisOfRotation.x] = {}
        }
        if (!spinedCells[posX + tetrisState.activeBlock.axisOfRotation.x].hasOwnProperty(posY + tetrisState.activeBlock.axisOfRotation.y)) {
          spinedCells[posX + tetrisState.activeBlock.axisOfRotation.x][posY + tetrisState.activeBlock.axisOfRotation.y] = {}
        }
        spinedCells[posX + tetrisState.activeBlock.axisOfRotation.x][posY + tetrisState.activeBlock.axisOfRotation.y] = spinedCellsOrigin[posX][posY]
      }
    }

    setTetrisState({
      ...tetrisState,
      viewCells: deepMerge(tetrisState.fixedCells, tetrisState.activeBlock.cells),
      activeBlock: {
        ...tetrisState.activeBlock,
        cells: spinedCells
      }
    })
  }

  const moveActiveBlockIfCanMove = (direction: 'left' | 'right' | 'bottom'): void => {
    let moveX: number = 0;
    let moveY: number = 0;
    // 移動可能かバリデーション
    switch (direction) {
      case 'left':
        moveX = -1
        if (!canMoveActiveBlockToX(moveX)) return
        break;
      case 'right':
        moveX = 1;
        if (!canMoveActiveBlockToX(moveX)) return
        break;
      case 'bottom':
        moveY = 1;
        if (shouldFixActiveBlock()) {
          fixActiveBlock()
          return;
        }
        break
    }
    // 移動
    const movedBlock: MovedBlock = {
      axisOfRotation: {
        x: tetrisState.activeBlock.axisOfRotation.x + moveX,
        y: tetrisState.activeBlock.axisOfRotation.y + moveY
      },
      cells: {}
    };

    for (let posXStr in tetrisState.activeBlock.cells) {
      for (let posYStr in tetrisState.activeBlock.cells[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)

        if (!movedBlock.cells.hasOwnProperty(posX + moveX)) {
          movedBlock.cells[posX + moveX] = {};
        }
        if (!movedBlock.cells[posX + moveX].hasOwnProperty(posY + moveY)) {
          movedBlock.cells[posX + moveX][posY + moveY] = {};
        }
        movedBlock.cells[posX + moveX][posY + moveY] = tetrisState.activeBlock.cells[posX][posY];
      }
    }

    setTetrisState({
      ...tetrisState,
      viewCells: deepMerge(tetrisState.fixedCells, tetrisState.activeBlock.cells),
      activeBlock: {
        ...tetrisState.activeBlock,
        ...movedBlock
      }
    })
  }

  const canMoveActiveBlockToX = (direction: number): Boolean => {
    for (let posXStr in tetrisState.activeBlock.cells) {
      for (let posYStr in tetrisState.activeBlock.cells[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)

        // ブロックが端にあるパターン
        if (posX + direction < 0 || posX + direction >= colNumber) {
          return false;
        }

        // すでにブロックがあるパターン
        if (tetrisState.fixedCells[posX + direction][posY].exist) {
          if (tetrisState.activeBlock.cells.hasOwnProperty(posX + direction) && !tetrisState.activeBlock.cells[posX + direction].hasOwnProperty(posY)) {
            return false;
          }
        }
      }
    }
    return true
  }

  const shouldFixActiveBlock = (): Boolean => {
    for (let posXStr in tetrisState.activeBlock.cells) {
      for (let posYStr in tetrisState.activeBlock.cells[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)
        // 一番下に落ちた時
        if (posY === rowNumber - 1) return true
        // 下にブロックがある時
        if (tetrisState.fixedCells[posX][posY + 1].exist === true && !tetrisState.activeBlock.cells[posX].hasOwnProperty(posY + 1))
          return true;
      }
    }
    return false
  }

  const fixActiveBlock = (): void => {
    let newFixedCells = deepMerge(tetrisState.fixedCells, tetrisState.activeBlock.cells)

    for (let posXStr in tetrisState.activeBlock.cells) {
      Object.keys(tetrisState.activeBlock.cells[posXStr]).forEach((posYStr) => {
        const posY: number = Number(posYStr)
        if (judgeLineShouldRemove(posY, newFixedCells)) {
          newFixedCells = removeLine(posY, newFixedCells)
        }
      })
    }

    setTetrisState({
      viewCells: deepMerge(newFixedCells, tetrisState.activeBlock.cells),
      fixedCells: newFixedCells,
      activeBlock: BlockCreator()
    })
  }

  const removeLine = (removePosY: number, judgedCells): Cells => {
    console.log('remove')
    const removedCells = getBlankCells();
    for (let posXStr in judgedCells) {
      for (let posYStr in judgedCells[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)

        if (posY === 0) {
          continue;
        }

        if (posY > removePosY) {
          removedCells[posX][posY] = judgedCells[posX][posY]
        };

        removedCells[posX][posY] = judgedCells[posX][posY - 1]
      }
    }
    return deepMerge(judgedCells, removedCells)
  }

  const judgeLineShouldRemove = (posY, judgedCells): Boolean => {
    for (let posXStr in judgedCells) {
      const posX: number = Number(posXStr)

      if (!judgedCells[posX][posY].exist) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (!tetrisState.activeBlock) return

    var timeoutId = setTimeout(() => {
      moveActiveBlockIfCanMove('bottom');
    }, 300)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [tetrisState])

  return (
    <TetrisView
      cells={tetrisState.viewCells}
      clickEvent={{
        moveLeft: () => { moveActiveBlockIfCanMove('left') },
        moveRight: () => { moveActiveBlockIfCanMove('right') },
        moveBottom: () => { moveActiveBlockIfCanMove('bottom') },
        startGame: putActiveBlock,
        spin: spinActiveBlock
      }}
    />
  )
}

export { Tetris }