import { bindActionCreators } from "redux"

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
export const removefullRow= () => ({
  type: "removeFullRow"
})
export const gameOver = () => ({
  type: "gameOver"
})
export const spinActiveBlock = () => ({
  type: "spinActiveBlock"
})
export const startGame = () => ({
  type: "startGame"
})
export const resetGame = () => ({
  type: "resetGame"
})
export const setDropSpeed = (dropSpeed) => ({
  type: "setDropSpeed",
  dropSpeed: dropSpeed
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
  setDropSpeed,
}