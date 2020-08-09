import * as React from 'react';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';

const TetrisViewBox = styled.div`
  display: flex;
`
const Cells = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 400px;
`;

const Controler = styled.div`
  display:flex;
`
const ArrowBox = styled.div`
  display:flex;
  flex-wrap: wrap;
  align-items: center;
  width:200px;
  height:150px;
`
const UpperArrowBox = styled.div`
  width:100%;
  text-align:center;
`
const LeftArrowBox = styled.div`
  width:50%;
  text-align:center;
`
const RightArrowBox = styled.div`
  width:50%;
  text-align:center;
`
const UnderArrowBox = styled.div`
  width:100%;
  text-align:center;
`
const Arrow = css`
  display:inline-block;
  width:50px;
  height:50px;
  line-height:50px;
  font-size:20px;
  border: 1px solid #666;
  border-radius: 10px;
  box-sizing: border-box;
`
const UpperArrow = styled.a`
  ${Arrow}
`
const LeftArrow = styled.a`
  ${Arrow}
`
const RightArrow = styled.a`
  ${Arrow}
`
const UnderArrow = styled.a`
  ${Arrow}
`

const Button = css`
  content: ''
  width:100px;
  height:40px;
`
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
}

const TetrisView = (props: TetrisViewProps) => {
  const cellList = []
  let i = 0
  for (let y in props.cells[0]) {
    for (let x in props.cells) {
      cellList.push(
        <Cell theme={{ backgroundColor: props.cells[x][y]['backgroundColor'] }} key={i} >
          {x}, {y}
        </Cell>
      )
      i++
    }
  }
  return (
    <TetrisViewBox>
      <Cells>
        {cellList}
      </Cells>
      <Controler>
        <ArrowBox>
          <UpperArrowBox>
            <UpperArrow>↑</UpperArrow>
          </UpperArrowBox>
          <LeftArrowBox>
            <LeftArrow>←</LeftArrow>
          </LeftArrowBox>
          <RightArrowBox>
            <RightArrow>→</RightArrow>
          </RightArrowBox>
          <UnderArrowBox>
            <UnderArrow>↓</UnderArrow>
          </UnderArrowBox>
        </ArrowBox>
      </Controler>
    </TetrisViewBox>
  )
}

export { TetrisView }