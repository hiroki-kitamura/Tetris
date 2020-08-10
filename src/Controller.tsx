import * as React from 'react';
import styled, { css } from 'styled-components';

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
  cursor: pointer;
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
  cursor: pointer;
`
const StartButton = styled.button`
  ${Button}
`

const SpinButton = styled.button`
  ${Button}
`

interface ControllerProps {
  clickEvent: {
    moveLeft: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveRight: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    moveBottom: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    startGame: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    spin: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  }
}
export const Controller = (props: ControllerProps) => {

  return (
    <Controler>
      <ArrowBox>
        <UpperArrowBox>
          <UpperArrow>↑</UpperArrow>
        </UpperArrowBox>
        <LeftArrowBox>
          <LeftArrow onClick={props.clickEvent.moveLeft}>←</LeftArrow>
        </LeftArrowBox>
        <RightArrowBox>
          <RightArrow onClick={props.clickEvent.moveRight}>→</RightArrow>
        </RightArrowBox>
        <UnderArrowBox>
          <UnderArrow onClick={props.clickEvent.moveBottom}>↓</UnderArrow>
        </UnderArrowBox>
      </ArrowBox>
      <StartButton onClick={props.clickEvent.startGame}>START!</StartButton>
      <SpinButton onClick={props.clickEvent.spin}>Spin</SpinButton>
    </Controler>
  )
}
