export const getAddedPos = (XY: string, addX: number, addY: number): string => {
  let splitPos = XY.split(',')
  let X = Number(splitPos[0])
  let Y = Number(splitPos[1])

  return `${X + addX},${Y + addY}`
}

export const getPosNumber = (XY: string): Array<number> => {
  let splitPosList = XY.split(',')
  let X = Number(splitPosList[0])
  let Y = Number(splitPosList[1])

  return [X, Y]
}
