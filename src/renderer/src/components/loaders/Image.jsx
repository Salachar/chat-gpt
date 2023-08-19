import { styled, keyframes } from 'solid-styled-components';

const slide = keyframes`
  0%, 100% {
    bottom: var(--image-anim-1);
  }
  25%, 75% {
    bottom: var(--image-anim-2);
  }
  20%, 80% {
    bottom: var(--image-anim-3);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(-15deg);
  }
  25%, 75% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(25deg);
  }
`;

const StyledImageLoader = styled.div`
  width: var(--image-size);
  height: var(--image-size);
  position: relative;
  background: #FFF;
  border-radius: var(--image-border-radius);
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: var(--image-before-size);
    height: var(--image-before-size);
    transform: rotate(45deg) translate(30%, 40%);
    background: #f4c788;
    box-shadow: var(--image-before-1) var(--image-before-2) 0 var(--image-before-3) var(--color-orange-spice);
    animation: ${slide} 2s infinite ease-in-out alternate;
  }

  &:after {
    content: "";
    position: absolute;
    left: var(--image-after-pos);
    top: var(--image-after-pos);
    width: var(--image-after-size);
    height: var(--image-after-size);
    border-radius: 50%;
    background: var(--color-orange-spice);
    transform: rotate(0deg);
    transform-origin: var(--image-after-origin-1) var(--image-after-origin-2);
    animation: ${rotate} 2s infinite ease-in-out;
  }
`;

export const ImageLoader = (props) => {
  return (
    <StyledImageLoader />
  );
}
