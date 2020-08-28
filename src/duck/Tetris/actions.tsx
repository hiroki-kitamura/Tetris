export const putActiveBlock = () => {
  return {
    type: "putActiveBlock"
  }
}
export const shiftActiveBlockLeft = () => {
  return {
    type: "shiftActiveBlockLeft"
  }
}
export const shiftActiveBlockRight = () => {
  return {
    type: "shiftActiveBlockRight"
  }
}
export const dropActiveBlock = () => {
  return {
    type: "dropActiveBlock"
  }
}
export const fixActiveBlock = () => {
  return {
    type: "fixActiveBlock"
  }
}
export const gameOver = () => {
  return {
    type: "gameOver"
  }
}
export const spinActiveBlock = () => {
  return {
    type: "spinActiveBlock"
  }
}
export const resetGame = () => {
  return {
    type: "resetGame"
  }
}
export const acceleDropSpeed = () => {
  return {
    type: "acceleDropSpeed"
  }
}
export const toggleAudioPlay = (audio: HTMLAudioElement) => {
  return {
    type: "toggleAudioPlay",
    audio
  }
}
export const toggleAudioMute = () => {
  return {
    type: "toggleAudioMute"
  }
}

export const tetrisActions = {
  putActiveBlock,
  shiftActiveBlockLeft,
  shiftActiveBlockRight,
  dropActiveBlock,
  fixActiveBlock,
  gameOver,
  spinActiveBlock,
  resetGame,
  acceleDropSpeed,
  toggleAudioPlay,
  toggleAudioMute
}