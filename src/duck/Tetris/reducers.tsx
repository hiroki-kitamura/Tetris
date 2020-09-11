// actions
import { ActionTypes } from 'duck/Tetris/actions'
// types
import { TetrisState } from 'duck/Tetris/types'
// functions
import { BlockCreator } from 'duck/Tetris/common/BlockCreator'
import { shiftBlockPos, shiftBlockIfOverlaping, shiftBlockIfStickout, spinActiveBlock } from 'duck/Tetris/common/BlockShifter'
import { removeFullRow } from 'duck/Tetris/common/Remover'
import { getBlankCells, mergeCells } from 'duck/Tetris/common/Common'

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
    case ActionTypes.putActiveBlock:
      return {
        ...tetrisState,
        activeBlock: tetrisState.nextBlock,
        nextBlock: BlockCreator(),
        isPlay: true,
      }
    case ActionTypes.shiftActiveBlock:
      let shiftedBlock = shiftBlockPos(tetrisState.activeBlock, action.directionX, action.directionY)

      if (action.directionX) {
        shiftedBlock = shiftBlockIfStickout(shiftedBlock)
        shiftedBlock = shiftBlockIfOverlaping(tetrisState.fixedCells, shiftedBlock, tetrisState.activeBlock)
      }

      return {
        ...tetrisState,
        activeBlock: shiftedBlock
      }
    case ActionTypes.fixActiveBlock:
      return {
        ...tetrisState,
        fixedCells: mergeCells(tetrisState.fixedCells, tetrisState.activeBlock.cells),
        activeBlock: tetrisState.nextBlock,
        nextBlock: BlockCreator(),
      }
    case ActionTypes.spinActiveBlock:
      return {
        ...tetrisState,
        activeBlock: spinActiveBlock(tetrisState.fixedCells, tetrisState.activeBlock)
      }
    case ActionTypes.removeFullRow:
      return {
        ...tetrisState,
        fixedCells: removeFullRow(tetrisState.fixedCells)
      }
    case ActionTypes.setScore:
      return {
        ...tetrisState,
        score: action.score
      }
    case ActionTypes.startGame:
      return {
        ...tetrisState,
        isPlay: true,
      }
    case ActionTypes.resetGame:
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
    case ActionTypes.gameOver:
      return {
        ...tetrisState,
        activeBlock: BlockCreator(),
        isGameOver: true,
        isPlay: false,
      }
    case ActionTypes.setDropSpeed:
      return {
        ...tetrisState,
        dropSpeed: action.dropSpeed
      }
    default: return tetrisState
  }
}
