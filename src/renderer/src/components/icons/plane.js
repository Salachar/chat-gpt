import { styled } from 'solid-styled-components';

export const StyledPlane = styled.i`
  position: relative;
  display: inline-block;
  font-style: normal;
  background-color: var(--color-orange-spice);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;

  width: .25em;
  height: .25em;
  background-color: transparent;
  border-style: solid;
  border-color: var(--color-orange-spice) transparent;
  border-width: .25em .23em 0 0;
  margin: .62em .37em .13em .38em;

  &:before, &:after {
    content: "";
    border-width: 0;
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  &:before {
    width: .2em;
    height: .67em;
    border-style: solid;
    border-color: var(--color-orange-spice) transparent;
    border-width: 0 .38em .68em 0;
    -webkit-transform: rotate(30deg) skewX(-25deg);
    -ms-transform: rotate(30deg) skewX(-25deg);
    transform: rotate(30deg) skewX(-25deg);
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    top: -.68em;
    left: .61em;
  }

  &:after {
    width: .2em;
    height: .67em;
    border-style: solid;
    border-color: var(--color-orange-spice) transparent;
    border-width: 0 0 .68em .25em ;
    -webkit-transform:  rotate(30deg) skewX(-35deg);
    -ms-transform:  rotate(30deg) skewX(-35deg);
    transform:  rotate(30deg) skewX(-35deg);
    -webkit-transform-origin: .25em 0;
    -ms-transform-origin: .25em 0;
    transform-origin: .25em 0;
    top: -.68em;
    left: .36em;
  }
`;
