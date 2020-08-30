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
