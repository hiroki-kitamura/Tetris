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
  name: String,
  axisOfRotation: {
    x: number,
    y: number
  }
  cells: Object,
  backgroundColor: String,
}
interface afterImageBlock {
  cells: Object;
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
    cells: getBlankCells(),
    activeBlock: null
  })

  const putActiveBlock = (): void => {
    const newBlock = BlockCreator();
    const newCells = deepMerge(tetrisState.cells, newBlock.cells)
    setTetrisState({
      cells: newCells,
      activeBlock: newBlock
    });
  }

  const spinActiveBlock = () => {
    if (tetrisState.activeBlock.name === 'square') return;

    let spinCellsOrigin = {};
    const afterImageBlock: afterImageBlock = {
      cells: {},
    };
    for (let posXStr in tetrisState.activeBlock.cells) {
      for (let posYStr in tetrisState.activeBlock.cells[posXStr]) {
        const posX: number = Number(posXStr)
        const posY: number = Number(posYStr)
        if (!afterImageBlock.cells.hasOwnProperty(posX)) {
          afterImageBlock.cells[posX] = {};
        }
        if (!afterImageBlock.cells[posX].hasOwnProperty(posY)) {
          afterImageBlock.cells[posX][posY] = {};
        }
        afterImageBlock.cells[posX][posY] = blankCell;

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

    const newCells = deepMerge(tetrisState.cells, deepMerge(afterImageBlock.cells, spinedCells))

    setTetrisState({
      cells: newCells,
      activeBlock: {
        ...tetrisState.activeBlock, cells: spinedCells
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
      name: tetrisState.activeBlock.name,
      axisOfRotation: {
        x: tetrisState.activeBlock.axisOfRotation.x + moveX,
        y: tetrisState.activeBlock.axisOfRotation.y + moveY
      },
      cells: {},
      backgroundColor: null
    };
    const afterImageBlock: afterImageBlock = {
      cells: {},
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

        if (!afterImageBlock.cells.hasOwnProperty(posX)) {
          afterImageBlock.cells[posX] = {};
        }
        if (!afterImageBlock.cells[posX].hasOwnProperty(posY)) {
          afterImageBlock.cells[posX][posY] = {};
        }
        afterImageBlock.cells[posX][posY] = blankCell;
      }
    }
    const newCells = deepMerge(tetrisState.cells, deepMerge(afterImageBlock.cells, movedBlock.cells))
    setTetrisState({
      cells: newCells,
      activeBlock: movedBlock
    });
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
        if (tetrisState.cells[posX + direction][posY].exist) {
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
        if (tetrisState.cells[posX][posY + 1].exist === true && !tetrisState.activeBlock.cells[posX].hasOwnProperty(posY + 1))
          return true;
      }
    }
    return false
  }

  const fixActiveBlock = (): void => {
    const newCells = deepMerge(tetrisState.cells, tetrisState.activeBlock.cells)
    setTetrisState({
      cells: newCells,
      activeBlock: {}
    })
    putActiveBlock()
  }

  const judgeRemoveBlock = () => {
    for (let posXStr in tetrisState.activeBlock.cells) {
      for (let posYStr in tetrisState.activeBlock.cells[posXStr]) {

      }
    }
  }

  const moveBlockHorizontal = (e): void => {
    if (e.key === 'ArrowLeft') moveActiveBlockIfCanMove('left')
    if (e.key === 'ArrowRight') moveActiveBlockIfCanMove('right')
    if (e.key === 'ArrowDown') moveActiveBlockIfCanMove('bottom')
    if (e.key === ' ') spinActiveBlock();
  }

  useEffect(() => {
    window.addEventListener('keydown', moveBlockHorizontal)
    window.addEventListener('click', putActiveBlock)
    return () => {
      window.removeEventListener('keydown', moveBlockHorizontal)
      window.removeEventListener('click', putActiveBlock)
    }
  }, [tetrisState.activeBlock])

  useEffect(() => {
    if (tetrisState.activeBlock) {
      var timeoutId = setTimeout(() => {
        moveActiveBlockIfCanMove('bottom');
      }, 300)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [tetrisState.activeBlock])

  return (
    <>
      <TetrisView cells={tetrisState.cells} />
    </>
  )
}

export { Tetris }