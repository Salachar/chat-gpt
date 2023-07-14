import { styled } from 'solid-styled-components';

export const StyledFloppy = styled.i`
  position: relative;
  display: inline-block;
  font-style: normal;
  background-color: var(--color-orange-spice);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;

  width: .9em;
  height: .6em;
  background-color: transparent;
  border-radius: .05em;
  -webkit-box-shadow:
    inset .1em .1em,
    inset .1em -.1em,
    inset -.1em .1em,
    inset -.1em -.1em;
  box-shadow:
    inset .1em .1em,
    inset .1em -.1em,
    inset -.1em .1em,
    inset -.1em -.1em;
  margin: .4em .05em 0;

  &:before, &:after {
    content: "";
    border-width: 0;
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  &:before {
    width: 0;
    height: 0;
    background-color: transparent;
    border: .1em solid transparent;
    border-bottom: .1em solid currentColor;
    border-width: .1em .2em .2em 0;
    -webkit-box-shadow: 0 .25em;
    box-shadow: 0 .25em;
    top: -.5em;
    left: .7em;
  }

  &:after {
    width: .5em;
    height: .3em;
    border-radius: 0 0 .03em .03em;
    border: 0 solid transparent;
    border-width: .05em .1em .1em;
    -webkit-box-shadow: inset .12em 0,
      -.15em .05em 0 .05em,
      -.2em .2em,
      .2em .2em,
      .1em .5em 0 -.12em,
      .1em .65em 0 -.12em,
      -.1em .5em 0 -.12em,
      -.1em .65em 0 -.12em;
    box-shadow: inset .12em 0,
      -.15em .05em 0 .05em,
      -.2em .2em,
      .2em .2em,
      .1em .5em 0 -.12em,
      .1em .65em 0 -.12em,
      -.1em .5em 0 -.12em,
      -.1em .65em 0 -.12em;
    top: -.4em;
    left: .2em;
  }
`;
