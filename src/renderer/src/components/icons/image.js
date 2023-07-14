import { styled } from 'solid-styled-components';

export const StyledImage = styled.i`
  position: relative;
  display: inline-block;
  font-style: normal;
  background-color: currentColor;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;

  width: 1em;
  height: .75em;
  background-color: transparent;
  border-width: .065em;
  border-style: solid;
  overflow: hidden;
  border-radius: .05em;
  margin: .125em 0;

  &:before, &:after {
    content: "";
    border-width: 0;
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  &:before {
    border-style: solid;
    border-width: .3em;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: .25em -.45em;
    box-shadow: .25em -.45em;
    top: .4em;
    left: -.1em;
  }

  &:after {
    border-width: .08em;
    border-style: solid;
    left: .2em;
    top: .05em;
    border-radius: 100%;
  }
`;
