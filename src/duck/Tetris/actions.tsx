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
export const removeFullRow = () => ({
  type: "removeFullRow"
})
export const setScore = (score: number) => ({
  type: "setScore",
  score: score
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
export const setDropSpeed = (dropSpeed: number) => ({
  type: "setDropSpeed",
  dropSpeed: dropSpeed
})

