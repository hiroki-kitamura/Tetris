import * as React from 'react';
import styled, { css } from 'styled-components';
import { Cell, NextCell } from 'components/Cell';
import { Cells } from 'duck/Tetris/types'
import { getPosNumber } from 'functions/PositionShifter'
const deepMerge = require('deepmerge')

const CellsView = styled.div`
  display: flex;
  position:relative;
  flex-wrap: wrap;
  width: 400px;
  border: 1px solid black;
`;
interface GameOverProps {
  isGameOver: boolean
}
const GameOver = styled.div<GameOverProps>`
  position: absolute;
  top: 100px;
  display: ${(props) => props.isGameOver ? 'block' : 'none'};
  width:100%;
  line-height:50px;
  font-size:40px;
  text-align: center;
  background-color:red;
  color: black;
`

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

interface NextBlock {
  name: string,
  cells: Cells
}

const makeBlankSquareCells = (colNumber: number) => {
  let cells = {}
  let startCol = 4
  for (let x = startCol; x < startCol + colNumber; x++) {
    for (let y = 0; y < colNumber; y++) {
      cells[`${x},${y}`] = {
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
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      cellList.push(
        <Cell backgroundColor={cells[`${x},${y}`]['backgroundColor']} key={i} />
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

  for (let XY in nextBlockCells) {
    const [X, Y] = getPosNumber(XY)
    cellList.push(
      <NextCell name={nextBlock.name} backgroundColor={nextBlockCells[`${X},${Y}`]['backgroundColor']} key={i} />
    )
    i++
  }
  return cellList
}

interface ScreenProps {
  viewCells: Cells,
  nextBlock: {
    name: string,
    cells: Cells
  }
  isGameOver: boolean,
  score: number,
}

export const Screen = (props: ScreenProps): JSX.Element => {
  let viewCells = viewCellsCreator(props.viewCells)
  let viewNextBlockCells = NextBlockCellsCreator(props.nextBlock)

  return (
    <ScreenBox>
      <CellsView>
        {viewCells}
        <GameOver isGameOver={props.isGameOver}>Game Over</GameOver>
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
