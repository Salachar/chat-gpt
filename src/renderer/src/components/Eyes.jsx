import { styled, keyframes } from 'solid-styled-components';

const StyledContainer = styled.div`
  position: relative;
`;

const eyeShade = keyframes`
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(5px);
  }
  40%, 50% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-8px);
  }
  75% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
`;

const eyeMove = keyframes`
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(0px, 5px);
  }
  40%, 50% {
    transform: translate(0px, -5px);
  }
  60% {
    transform: translate(-10px, -5px);
  }
  75% {
    transform: translate(-20px, 5px);
  }
  100% {
    transform: translate(0, 0);
  }
`;

const StyledEyesLoader = styled.div`
  position: relative;
  width: var(--eyes-size);
  height: var(--eyes-size);
  border-radius: 50%;
  box-sizing: border-box;
  background: #fff;
  border: var(--eyes-border-size) solid #131a1d;
  overflow: hidden;
  box-sizing: border-box;
  display: inline-block;

  margin-left: 1rem;
  &:last-child {
    margin-left: 0.35rem;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: -50%;
    width: 100%;
    height: 100%;
    background: #263238 ;
    z-index: 5;
    border-bottom: var(--eyes-border-size) solid #131a1d;
    box-sizing: border-box;
    animation: ${eyeShade} 9s infinite;
    transition: all 0.2s ease;
  }

  &:before {
    content: '';
    position: absolute;
    left: var(--eyes-va1-1);
    bottom: var(--eyes-va1-2);
    width: var(--eyes-va1-3);
    z-index: 2;
    height: var(--eyes-va1-3);
    background: #111;
    border-radius: 50%;
    animation: ${eyeMove} 9s infinite;
    transition: all 0.2s ease;
  }
`;

export const Eyes = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledEyesLoader />
      <StyledEyesLoader />
    </StyledContainer>
  );
}
