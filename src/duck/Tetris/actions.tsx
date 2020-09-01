export const putActiveBlock = () => ({
  type: "putActiveBlock"
})
export const shiftActiveBlockLeft = () => ({
  type: "shiftActiveBlockLeft"
})
export const shiftActiveBlockRight = () => ({
  type: "shiftActiveBlockRight"
})
export const dropActiveBlock = () => ({
  type: "dropActiveBlock"
})
export const fixActiveBlock = () => ({
  type: "fixActiveBlock"
})
export const gameOver = () => ({
  type: "gameOver"
})
export const spinActiveBlock = () => ({
  type: "spinActiveBlock"
})
export const resetGame = () => ({
  type: "resetGame"
})
export const acceleDropSpeed = () => ({
  type: "acceleDropSpeed"
})
export const audioPlay = () => ({
  type: "audioPlay",
})
export const audioStop = () => ({
  type: "audioStop",
})
export const toggleAudioMute = () => ({
  type: "toggleAudioMute"
})

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
  audioPlay,
  audioStop,
  toggleAudioMute
}