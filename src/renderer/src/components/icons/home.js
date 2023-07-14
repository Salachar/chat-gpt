import { styled } from 'solid-styled-components';

export const StyledHome = styled.i`
  position: relative;
  display: inline-block;
  font-style: normal;
  background-color: var(--color-orange-spice);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;

  width: .8em;
  height: .45em;
  background-color: transparent;
  border-width: 0;
  border-style: solid;
  border-radius: 0 0 .02em .02em;
  -webkit-box-shadow: inset .285em .1em, inset -.285em .1em;
  box-shadow: inset .285em .1em, inset -.285em .1em;
  margin: .55em .1em 0;

  &:before, &:after {
    content: "";
    border-width: 0;
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  &:before {
    border-width: 0 .4em .4em;
    border-style: solid;
    border-color: currentColor transparent;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    -webkit-box-shadow: 0 .1em;
    box-shadow: 0 .1em;
    top: -.4em;
    left: 50%;
  }

  &:after {
    width:.76em;
    height: .76em;
    border-width: 0.065em 0 0 0.065em;
    border-style: solid;
    -webkit-transform: translateX(-50%) rotate(45deg);
    -ms-transform: translateX(-50%) rotate(45deg);
    transform: translateX(-50%) rotate(45deg);
    top: -0.4em;
    left: 50%;
  }
`;
