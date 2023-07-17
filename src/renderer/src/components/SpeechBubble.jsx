import { styled, keyframes } from 'solid-styled-components';

const flash = keyframes`
  0% {
    background-color: var(--color-orange-spice);
    box-shadow: 1.25em 0 var(--color-orange-spice), -1.25em 0 var(--color-orange-spice-lightest);
  }
  50% {
    background-color: var(--color-orange-spice-lightest);
    box-shadow: 1.25em 0 var(--color-orange-spice), -1.25em 0 var(--color-orange-spice);
  }
  100% {
    background-color: var(--color-orange-spice);
    box-shadow: 1.25em 0 var(--color-orange-spice-lightest), -1.25em 0 var(--color-orange-spice);
  }
`;

const StyledContainer = styled.div`
  font-size: 1rem;
`;

const StyledSpeechBubble = styled.div`
  width: 6.25em; /* 100px */
  height: 4.6875em; /* 75px */
  margin: 0 auto;
  background: var(--color-light-blue);
  position: relative;
  border-radius: 100%;

  &:after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    border: 0.9375em solid transparent; /* 15px */
    border-top: 1.5625em solid var(--color-light-blue); /* 25px */
    transform: rotate(45deg);
    top: 3.125em; /* 50px */
    left: -0.9375em; /* -15px */
  }

  &:before {
    content: '';
    width: 0.75em; /* 12px */
    height: 0.75em; /* 12px */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50% , -50%);
    border-radius: 50%;
    background-color: var(--color-orange-spice);
    box-shadow: 1.25em 0 var(--color-orange-spice), -1.25em 0 var(--color-orange-spice);
    animation: ${flash} 0.5s ease-out infinite alternate;
  }
`;

export const SpeechBubble = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledSpeechBubble />
    </StyledContainer>
  );
};
