interface Block {
  name: String
  cells: Array<[Number, Number]>,
  axisOfRotation: Array<Number>,
  backgroundColor: String;
}

const squareBlock: Block = {
  name: 'square',
  axisOfRotation: [1, 1],
  cells: [[0, 0], [1, 0], [0, 1], [1, 1]],

  backgroundColor: 'yellow'
};
const straightBlock: Block = {
  name: 'straight',
  axisOfRotation: [2, 0],
  cells: [[0, 0], [1, 0], [2, 0], [3, 0]],
  backgroundColor: 'aqua'
}
const lBlock: Block = {
  name: 'l',
  axisOfRotation: [0, 1],
  cells: [[0, 0], [1, 0], [0, 1], [0, 2]],
  backgroundColor: 'blue'
};
const reLBlock: Block = {
  name: 'reL',
  axisOfRotation: [1, 1],
  cells: [[0, 0], [1, 0], [1, 1], [1, 2]],
  backgroundColor: 'orange'
};
const zigzagBlock: Block = {
  name: 'zigzag',
  axisOfRotation: [1, 1],
  cells: [[0, 0], [1, 0], [1, 1], [2, 1]],
  backgroundColor: 'red'
};
const reZigzagBlock: Block = {
  name: 'reZingzag',
  axisOfRotation: [1, 1],
  cells: [[0, 1], [1, 1], [1, 0], [2, 0]],
  backgroundColor: 'green'
};
const tBlock: Block = {
  name: 't',
  axisOfRotation: [1, 0],
  cells: [[0, 0], [1, 0], [1, 1], [2, 0]],
  backgroundColor: 'purple'
};

interface Cell {
  exist: Boolean,
  backgroundColor: String
}
export const BlockCreator = () => {
  const randomNumber = Math.floor(Math.random() * 6) // 0から6の値
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
    axisOfRotation: {
      x: null,
      y: null
    },
    cells: {},
    backgroundColor: ''
  }
  const cell: Cell = {
    exist: true,
    backgroundColor: selectedBlock.backgroundColor
  }

  block.name = selectedBlock.name

  block.axisOfRotation.x = selectedBlock.axisOfRotation[0] + centerCol
  block.axisOfRotation.y = selectedBlock.axisOfRotation[1]
  selectedBlock.cells.forEach(pos => {
    let posX = Number(pos[0])
    const posY = Number(pos[1])
    posX = posX + centerCol;

    if (block.cells[posX] === undefined) {
      block.cells[posX] = {};
      if (block.cells[posX][posY] === undefined) {
        block.cells[posX][posY] = {};
      }
    }

    block.cells[posX][posY] = cell;
  })
  return block
}
