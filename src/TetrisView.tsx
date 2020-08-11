import * as React from 'react';
import styled, { css } from 'styled-components';
import { Controller } from './Controller'
import { Cell } from './Cell';

const TetrisViewBox = styled.div`
  display: flex;
`
const Cells = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 400px;
`;


interface CellPosY {
  exist: Boolean,
  backgroundColor: String
}
interface CellPosX {
  0: CellPosY,
  1: CellPosY,
  2: CellPosY,
  3: CellPosY,
  4: CellPosY,
  5: CellPosY,
  6: CellPosY,
  7: CellPosY,
  8: CellPosY,
  9: CellPosY,
  10: CellPosY,
  11: CellPosY,
  12: CellPosY,
  13: CellPosY,
  14: CellPosY,
  15: CellPosY,
  16: CellPosY,
  17: CellPosY,
  18: CellPosY,
  19: CellPosY,
}

interface Cells {
  0: CellPosX,
  1: CellPosX,
  2: CellPosX,
  3: CellPosX,
  4: CellPosX,
  5: CellPosX,
  6: CellPosX,
  7: CellPosX,
  8: CellPosX,
  9: CellPosX,
}
interface TetrisViewProps {
  cells: Cells
  clickEvent: {
    moveLeft: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveRight: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveBottom: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    startGame: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    spin: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  }
}

const TetrisView = (props: TetrisViewProps) => {
  const cellList = []
  let i = 0
  for (let y in props.cells[0]) {
    for (let x in props.cells) {
      cellList.push(
        <Cell theme={{ backgroundColor: props.cells[x][y]['backgroundColor'] }} key={i} />
      )
      i++
    }
  }
  return (
    <TetrisViewBox>
      <Cells>
        {cellList}
      </Cells>
      <Controller clickEvent={props.clickEvent} />
    </TetrisViewBox>
  )
}

export { TetrisView }