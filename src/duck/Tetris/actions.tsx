export enum ActionTypes {
  putActiveBlock = "putActiveBlock",
  shiftActiveBlock = "shiftActiveBlock",
  dropActiveBlock = "dropActiveBlock",
  fixActiveBlock = "fixActiveBlock",
  removeFullRow = "removeFullRow",
  setScore = "setScore",
  gameOver = "gameOver",
  spinActiveBlock = "spinActiveBlock",
  startGame = "startGame",
  resetGame = "resetGame",
  setDropSpeed = "setDropSpeed"
}

export const putActiveBlock = () => ({
  type: ActionTypes.putActiveBlock
})
export const shiftActiveBlock = (directionX: number = -1 | 0 | -1, directionY: number = 0 | 1) => ({
  type: ActionTypes.shiftActiveBlock,
  directionX: directionX,
  directionY: directionY
})
export const dropActiveBlock = () => ({
  type: ActionTypes.dropActiveBlock
})
export const fixActiveBlock = () => ({
  type: ActionTypes.fixActiveBlock
})
export const removeFullRow = () => ({
  type: ActionTypes.removeFullRow
})
export const setScore = (score: number) => ({
  type: ActionTypes.setScore,
  score: score
})
export const gameOver = () => ({
  type: ActionTypes.gameOver
})
export const spinActiveBlock = () => ({
  type: ActionTypes.spinActiveBlock
})
export const startGame = () => ({
  type: ActionTypes.startGame
})
export const resetGame = () => ({
  type: ActionTypes.resetGame
})
export const setDropSpeed = (dropSpeed: number) => ({
  type: ActionTypes.setDropSpeed,
  dropSpeed: dropSpeed
})

