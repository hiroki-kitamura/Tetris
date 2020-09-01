import * as React from 'react';
import styled, { css } from 'styled-components';

const Controler = styled.div`
  display:flex;
  flex-wrap:wrap;
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
  cursor: pointer;
`

const UpperArrow = styled.button`
  ${Arrow}
`
const LeftArrow = styled.button`
  ${Arrow}
`
const RightArrow = styled.button`
  ${Arrow}
`
const UnderArrow = styled.button`
  ${Arrow}
`

const ButtonBox = styled.div`
`
const Button = css`
  width:100px;
  height:40px;
  cursor: pointer;
`
const SpinButton = styled.button`
  ${Button}
`
const StartButton = styled.button`
  ${Button}
  margin-left: 10px;
`
const ResetButton = styled.button`
  ${Button}
  margin-left: 10px;
`
const MuteButton = styled.button`
  ${Button}
  margin-left: 10px;
`

interface ControllerProps {
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

export const Controller = (props: ControllerProps) => {
  let isResetDisabled
  let isStartDisabled

  if (props.isGameOver) {
    isStartDisabled = true;
    isResetDisabled = false;
  } else if (props.isPlay) {
    isStartDisabled = true;
    isResetDisabled = false;
  } else if (!props.isPlay) {
    isStartDisabled = false;
    isResetDisabled = true;
  }

  return (
    <Controler>
      <ArrowBox>
        <UpperArrowBox>
          <UpperArrow disabled={props.isPlay ? false : true}>↑</UpperArrow>
        </UpperArrowBox>
        <LeftArrowBox>
          <LeftArrow onClick={props.clickEvent.moveLeft} disabled={props.isPlay ? false : true}>←</LeftArrow>
        </LeftArrowBox>
        <RightArrowBox>
          <RightArrow onClick={props.clickEvent.moveRight} disabled={props.isPlay ? false : true}>→</RightArrow>
        </RightArrowBox>
        <UnderArrowBox>
          <UnderArrow onClick={props.clickEvent.moveBottom} disabled={props.isPlay ? false : true}>↓</UnderArrow>
        </UnderArrowBox>
      </ArrowBox>
      <ButtonBox>
        <SpinButton onClick={props.clickEvent.spin} disabled={props.isPlay ? false : true}>Spin</SpinButton>
        <StartButton onClick={props.clickEvent.startGame} disabled={isStartDisabled}>Start!</StartButton>
        <ResetButton onClick={props.clickEvent.resetGame} disabled={isResetDisabled}>Reset!</ResetButton>
        <MuteButton onClick={props.clickEvent.toggleAudioMute}>{props.isMute ? 'Audio Off' : 'Audio On'}</MuteButton>
      </ButtonBox>
    </Controler >
  )
}
