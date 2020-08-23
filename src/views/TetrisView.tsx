import * as React from 'react';
import styled from 'styled-components';
import { Controller } from './Controller'
import { Screen } from 'views/Screen'
import { Cells } from 'interface/common'

const TetrisViewBox = styled.div`
  display: flex;
`

interface TetrisViewProps {
  viewCells: Cells,
  nextBlock: {
    name: string,
    cells: Cells
  },
  score: number,
  isPlay: boolean,
  isGameOver: boolean,
  isMute: boolean,
  clickEvent: {
    moveLeft: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveRight: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveBottom: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    startGame: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    resetGame: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    toggleAudioMute: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    spin: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  }
}

export const TetrisView = (props: TetrisViewProps) => {
  return (
    <TetrisViewBox>
      <Screen viewCells={props.viewCells} nextBlock={props.nextBlock} isGameOver={props.isGameOver} score={props.score} />
      <Controller clickEvent={props.clickEvent} isPlay={props.isPlay} isGameOver={props.isGameOver} isMute={props.isMute} />
    </TetrisViewBox>
  )
}