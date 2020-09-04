// node
const path = require('path');
const src = path.resolve(__dirname, 'src');
// types
import { TetrisState } from 'duck/Tetris/types'
// functions
import { BlockCreator } from 'duck/Tetris/common/BlockCreator'
import { shiftBlockPos, shiftBlockIfOverlaping, shiftBlockIfStickout, spinActiveBlock } from 'duck/Tetris/common/BlockShifter'
import { removeColIfFulledCol, extractColShouldRemove } from 'duck/Tetris/common/Remover'
import { getBlankCells, mergeCells, scoreCalculater } from 'duck/Tetris/common/Common'

const initialTetrisState: TetrisState = {
  fixedCells: getBlankCells(),
  activeBlock: BlockCreator(),
  nextBlock: BlockCreator(),
  dropSpeed: 1000,
  score: 0,
  isPlay: false,
  isGameOver: false,
}

export const tetris = (tetrisState = initialTetrisState, action) => {
  switch (action.type) {
    case 'putActiveBlock':
      return {
        ...tetrisState,
        activeBlock: tetrisState.nextBlock,
        nextBlock: BlockCreator(),
        isPlay: true,
      }
    case 'shiftActiveBlockLeft':
      let leftShiftedBlock = shiftBlockPos(tetrisState.activeBlock, -1, 0)

      leftShiftedBlock = shiftBlockIfStickout(leftShiftedBlock)
      leftShiftedBlock = shiftBlockIfOverlaping(tetrisState.fixedCells, leftShiftedBlock, tetrisState.activeBlock)

      return {
        ...tetrisState,
        activeBlock: leftShiftedBlock
      }
    case 'shiftActiveBlockRight':
      let rightShiftedBlock = shiftBlockPos(tetrisState.activeBlock, 1, 0)

      rightShiftedBlock = shiftBlockIfStickout(rightShiftedBlock)
      rightShiftedBlock = shiftBlockIfOverlaping(tetrisState.fixedCells, rightShiftedBlock, tetrisState.activeBlock)

      return {
        ...tetrisState,
        activeBlock: rightShiftedBlock
      }
    case 'dropActiveBlock':
      const dropedActiveBlock = shiftBlockPos(tetrisState.activeBlock, 0, 1)

      return {
        ...tetrisState,
        fixedCells: tetrisState.fixedCells,
        activeBlock: dropedActiveBlock,
      }
    case 'fixActiveBlock':
      const mergedCells = mergeCells(tetrisState.fixedCells, tetrisState.activeBlock.cells)
      const newFixedCells = removeColIfFulledCol(mergedCells)
      const removeColList = extractColShouldRemove(mergedCells)
      const newScore = scoreCalculater(removeColList.length) + tetrisState.score
      const newActiveBlock = tetrisState.nextBlock;

      return {
        ...tetrisState,
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
        activeBlock: spinedBlock
      }
    case 'startGame':
      return {
        ...tetrisState,
        isPlay: true,
      }
    case 'resetGame':
      return {
        ...tetrisState,
        fixedCells: getBlankCells(),
        activeBlock: BlockCreator(),
        nextBlock: BlockCreator(),
        score: 0,
        isPlay: false,
        isGameOver: false,
        dropSpeed: 1000,
      }
    case 'setDropSpeed':
      console.log(action)
      return {
        ...tetrisState,
        dropSpeed: action.dropSpeed
      }
    default: return tetrisState
  }
}
