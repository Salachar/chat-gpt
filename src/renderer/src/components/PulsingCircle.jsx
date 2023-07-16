import { styled, keyframes } from 'solid-styled-components';

const animloader = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const StyledContainer = styled.div`
  font-size: 1rem;
`;

const StyledLoader = styled.div`
  width: 3em;
  height: 3em;
  display: inline-block;
  position: relative;

  &:after, &:before {
    content: '';
    box-sizing: border-box;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    background: #FFF;
    position: absolute;
    left: 0;
    top: 0;
    animation: ${animloader} 2s linear infinite;
  }

  &:after {
    animation-delay: 1s;
  }
`;

export const PulsingCircle = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledLoader />
    </StyledContainer>
  );
};
