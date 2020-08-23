import styled from 'styled-components';
import { Cell as CellInterface } from 'interface/common'

interface CellProps {
  name?: string,
  backgroundColor: string
}

export const Cell = styled.div<CellProps>`
  width: 40px;
  height: 40px;
  font-size:8px;
  line-height: 40px;
  box-shadow: ${(props) => props.backgroundColor === 'black' ? 'none' : '0px 0px 1px 1px #fff inset'};
  background-color: ${(props) => props.backgroundColor ? props.backgroundColor : 'white'};
  box-sizing: border-box;
`;

export const NextCell = styled.div<CellProps>`
  width: ${props => props.name === 'straight' ? '30px' : '40px'};
  height: ${props => props.name === 'straight' ? '30px' : '40px'};
  box-shadow: ${(props) => props.backgroundColor === 'black' ? 'none' : '0px 0px 1px 1px #fff inset'};
  background-color: ${props => props.backgroundColor};
  box-sizing: border-box;
`
