import { styled } from 'solid-styled-components';

export const StyledContainer = styled.div`
  position: relative;
  display: block;
  min-width: 10em;

  ${({ inline }) => inline && `
    display: inline-block;
    vertical-align: top;
  `}
`;

export const StyledLabel = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 0.25em;
  font-size: 1em;
  opacity: 0.5;

  ${({ inline }) => inline && `
    display: inline-block;
    line-height: 2em
    margin-right: 0.5rem;
    vertical-align: top;
  `}
`;

export const StyledInputs = styled.div`
  position: relative;
  width: 100%;
  height: 2em;

  ${({ inline }) => inline && `
    display: inline-block;
    width: 12em;
  `}
`;

export const StyledArrowButton = styled.div`
  cursor: pointer;
  position: absolute;
  height: 2em;
  width: 20%;
  text-align: center;
  background-color: var(--color-button-bg);

  &:hover {
    background-color: var(--button-hover-color);
  }
  &:active {
    background-color: var(--button-active-color);
  }
  &:before {
    font-size: 1em;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 2em;
    font-weight: bold;
  }

  ${({ left }) => left && `
    left: 0;
    &:before {
      content: '\\2212' !important;
    }
  `}

  ${({ right }) => right && `
    right: 0;
    &:before {
      content: '\\002B' !important;
    }
  `}
`;

export const StyledInfo = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  color: white;
  line-height: 2em;
  font-weight: bold;
  opacity: 0.2;
  font-size: 1em;

  ${({ min }) => min && `
    padding-left: 0.25em;
    text-align: left;
    left: 20%;
  `}

  ${({ max }) => max && `
    padding-right: 0.25em;
    text-align: right;
    right: 20%;
  `}
`;

export const StyledInput = styled.input`
  width: 60%;
  text-align: center;
  vertical-align: top;
  height: 2em;
  padding: 0 0.5em;
  border: 0;
  background-color: rgba(255,255,255,0.1);
  color: white;
  box-sizing: border-box;
  font-size: 1em;
  position: absolute;
  top: 0;
  left: 20%;
`;
