export const getAddedPos = (XY: string, addX: number, addY: number): string => {
  const splitPos = XY.split(',')
  const X = Number(splitPos[0])
  const Y = Number(splitPos[1])

  return `${X + addX},${Y + addY}`
}

export const getPosNumber = (XY: string): Array<number> => {
  const splitPosList = XY.split(',')
  const X = Number(splitPosList[0])
  const Y = Number(splitPosList[1])

  return [X, Y]
}
