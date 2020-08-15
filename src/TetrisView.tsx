import * as React from 'react';
import styled, { css } from 'styled-components';
import { Controller } from './Controller'
import { Cell, NextCell } from './Cell';
import { BlockCreator } from './BlockCreator';
const deepMerge = require('deepmerge')

const TetrisViewBox = styled.div`
  display: flex;
`
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

const Screen = styled.div`
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

interface TetrisViewProps {
  viewCells: Cells,
  score: number,
  nextBlock: {
    name: string,
    cells: Cells
  },
  isPlay: boolean,
  mute: boolean,
  clickEvent: {
    moveLeft: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveRight: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveBottom: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    startGame: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    resetGame: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    toggleMuteAudio: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    spin: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  }
}

const TetrisView = (props: TetrisViewProps) => {
  let viewCells = viewCellsCreator(props.viewCells)
  let viewNextBlockCells = NextBlockCellsCreator(props.nextBlock)
  return (
    <TetrisViewBox>
      <Screen>
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
      </Screen>
      <Controller clickEvent={props.clickEvent} isPlay={props.isPlay} mute={props.mute} />
    </TetrisViewBox>
  )
}

export { TetrisView }