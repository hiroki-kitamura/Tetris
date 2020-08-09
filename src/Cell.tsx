import styled from 'styled-components';

interface CellProps {
  theme: {
    backgroundColor: string
  }
}

export const Cell = styled.div<CellProps>`
  width: 40px;
  height: 40px;
  font-size:8px;
  line-height: 40px;
  text-align: center;
  background-color: ${(props) => props.theme.backgroundColor ? props.theme.backgroundColor : 'gray'};
  border: 1px solid #000;
  box-sizing: border-box;
`;

