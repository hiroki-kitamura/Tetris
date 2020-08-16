import * as React from 'react';
import styled, { css } from 'styled-components';
import { Controller } from './Controller'
import { Screen } from 'views/Screen'

const TetrisViewBox = styled.div`
  display: flex;
`
interface Cells {
  [index: number]: {
    [index: number]: {
      exist: Boolean,
      backgroundColor: String
    }
  },
}

interface TetrisViewProps {
  viewCells: Cells,
  nextBlock: {
    name: string,
    cells: Cells
  },
  score: number,
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

export const TetrisView = (props: TetrisViewProps) => {
  return (
    <TetrisViewBox>
      <Screen viewCells={props.viewCells} nextBlock={props.nextBlock} score={props.score} />
      <Controller clickEvent={props.clickEvent} isPlay={props.isPlay} mute={props.mute} />
    </TetrisViewBox>
  )
}