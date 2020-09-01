// types
import { Cell, Block } from 'duck/Tetris/types'
// functions 
import { getAddedPos } from 'duck/Tetris/common/PositionShifter'

const squareBlock = {
  name: 'square',
  axisOfRotation: '1,1',
  cells: [[0, 0], [1, 0], [0, 1], [1, 1]],

  backgroundColor: 'yellow'
};
const straightBlock = {
  name: 'straight',
  axisOfRotation: '2,0',
  cells: [[0, 0], [1, 0], [2, 0], [3, 0]],
  backgroundColor: 'aqua'
}
const lBlock = {
  name: 'l',
  axisOfRotation: '1,0',
  cells: [[0, 0], [1, 0], [2, 0], [0, 1]],
  backgroundColor: 'blue'
};
const reLBlock = {
  name: 'reL',
  axisOfRotation: '1,0',
  cells: [[0, 0], [1, 0], [2, 0], [2, 1]],
  backgroundColor: 'orange'
};
const zigzagBlock = {
  name: 'zigzag',
  axisOfRotation: '1,1',
  cells: [[0, 0], [1, 0], [1, 1], [2, 1]],
  backgroundColor: 'red'
};
const reZigzagBlock = {
  name: 'reZigzag',
  axisOfRotation: '1,1',
  cells: [[0, 1], [1, 1], [1, 0], [2, 0]],
  backgroundColor: 'green'
};
const tBlock = {
  name: 't',
  axisOfRotation: '1,0',
  cells: [[0, 0], [1, 0], [1, 1], [2, 0]],
  backgroundColor: 'purple'
};

export const BlockCreator = (): Block => {
  const randomNumber = Math.floor(Math.random() * 7) // 0から6の値
  let selectedBlock;

  switch (randomNumber) {
    case 0:
      selectedBlock = squareBlock;
      break;
    case 1:
      selectedBlock = straightBlock;
      break;
    case 2:
      selectedBlock = lBlock;
      break;
    case 3:
      selectedBlock = reLBlock;
      break;
    case 4:
      selectedBlock = zigzagBlock;
      break;
    case 5:
      selectedBlock = reZigzagBlock;
      break;
    case 6:
      selectedBlock = tBlock;
      break;
  }

  const centerCol = 4
  const block = {
    name: '',
    axisOfRotation: null,
    cells: {},
  }
  const cell: Cell = {
    exist: true,
    backgroundColor: selectedBlock.backgroundColor
  }

  block.name = selectedBlock.name

  const axisOfRotation = getAddedPos(selectedBlock.axisOfRotation, centerCol, 0)

  block.axisOfRotation = axisOfRotation

  selectedBlock.cells.forEach(pos => {
    const X = Number(pos[0])
    const Y = Number(pos[1])

    block.cells[`${X + centerCol},${Y}`] = cell;
  })

  return block
}
