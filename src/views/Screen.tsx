import * as React from 'react';
import styled, { css } from 'styled-components';
import { Cell, NextCell } from 'views/Cell';
const deepMerge = require('deepmerge')

const CellsView = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  border: 1px solid black;
`;

const StatusView = styled.div`
  width:160px;
  padding:10px;
  background-Color:black;
  border-left: 1px solid aqua;
  box-sizing:border-box;
`

const ScreenBox = styled.div`
  display:flex;
`
const ScoreView = styled.div`
  text-align: center;
  font-size:20px;
  color:white;
`
const TitleStyle = css`
  margin:0 auto 20px;
  text-align:center;
  color:white;
`
const NextBlockTitle = styled.h3`
  ${TitleStyle}
`
const ScoreTitle = styled.h3`
  ${TitleStyle}
`
const NextBlockView = styled.div`
  display:flex;
  flex-wrap:wrap;
  width:120px;
  margin:0 auto;
`

interface Cells {
  [index: number]: {
    [index: number]: {
      exist: Boolean,
      backgroundColor: String
    }
  },
}

interface NextBlock {
  name: string,
  cells: Cells
}

const makeBlankSquareCells = (colNumber: number) => {
  let cells = {}
  let startCol = 4
  for (let x = startCol; x < startCol + colNumber; x++) {
    cells[x] = {}
  }
  for (let x = startCol; x < startCol + colNumber; x++) {
    for (let y = 0; y < colNumber; y++) {
      cells[x][y] = {
        exist: true,
        backgroundColor: 'black'
      };
    }
  }
  return cells
}
const viewCellsCreator = (cells): Array<JSX.Element> => {
  const cellList = []
  let i = 0
  for (let y in cells[0]) {
    for (let x in cells) {
      cellList.push(
        <Cell backgroundColor={cells[x][y]['backgroundColor']} key={i} />
      )
      i++
    }
  }
  return cellList
}

const NextBlockCellsCreator = (nextBlock: NextBlock): Array<JSX.Element> => {
  let blankCells
  switch (nextBlock.name) {
    case 'square':
    case 'l':
    case 'reL':
    case 'zigzag':
    case 'reZigzag':
    case 't':
      blankCells = makeBlankSquareCells(3)
      break;
    case 'straight':
      blankCells = makeBlankSquareCells(4)
      break;
  }

  let nextBlockCells = deepMerge(blankCells, nextBlock.cells)
  let cellList = []
  let i = 0

  for (let y in nextBlockCells[4]) {
    for (let x in nextBlockCells) {
      cellList.push(
        <NextCell name={nextBlock.name} backgroundColor={nextBlockCells[x][y]['backgroundColor']} key={i} />
      )
      i++
    }
  }
  return cellList
}

interface ScreenProps {
  viewCells: Cells,
  nextBlock: {
    name: string,
    cells: Cells
  }
  score: number,
}

export const Screen = (props: ScreenProps): JSX.Element => {
  let viewCells = viewCellsCreator(props.viewCells)
  let viewNextBlockCells = NextBlockCellsCreator(props.nextBlock)

  return (
    <ScreenBox>
      <CellsView>
        {viewCells}
      </CellsView>
      <StatusView>
        <NextBlockView>
          <NextBlockTitle>
            NextBlock
            </NextBlockTitle>
          {viewNextBlockCells}
        </NextBlockView>
        <ScoreView>
          <ScoreTitle>
            Score
            </ScoreTitle>
          {props.score}
        </ScoreView>
      </StatusView>
    </ScreenBox>
  )
}

