export interface Cell {
  exist: boolean,
  backgroundColor: string
}

export interface Cells {
  [index: string]: Cell
}

export interface Block {
  name: string,
  axisOfRotation: string,
  cells: Cells,
}

export interface TetrisState {
  viewCells: Cells,
  fixedCells: Cells,
  activeBlock: Block | null,
  nextBlock: Block,
  dropSpeed: number,
  score: number,
  isPlay: boolean,
  isGameOver: boolean,
  audio: {
    src: string,
    isMute: boolean,
    isPlay: boolean
  }
}

export interface TetrisProps {
  putActiveBlock,
  shiftActiveBlockLeft,
  shiftActiveBlockRight,
  dropActiveBlock,
  fixActiveBlock,
  gameOver,
  spinActiveBlock,
  resetGame,
  acceleDropSpeed,
  audioPlay,
  audioStop,
  toggleAudioMute,
  state: TetrisState
}