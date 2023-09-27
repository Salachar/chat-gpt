import { styled } from 'solid-styled-components';

export const StyledContainer = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  height: 1em;
  font-size: 1em;
  line-height: 1em;
  cursor: pointer;
`;

export const StyledCheckbox = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  height: 1em;
  width: 1em;
  color: white;
  box-sizing: border-box;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-size: 1.25em;
  line-height: 1em;
  text-align: center;

  ${({ checked }) => checked && `
    &:before {
      content: "";
      height: 0.5em;
      width: 0.5em;
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateX(-50%) translateY(-50%);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  `}

  &:hover {
    background-color: #666;
  }
  &:active {
    background-color: #EEE;
    color: #444;
  }
`;

export const StyledLabel = styled.div`
  display: inline-block;
  vertical-align: top;
  height: 1em;
  line-height: 1em;
  margin-left: 0.5em;
  color: #EEE;
`;
