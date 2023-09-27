import { createSignal } from 'solid-js'
import { styled } from 'solid-styled-components';
import { handleStore } from "@utils";

const StyledContainer = styled.div`
  position: relative;
`;

const StyledLabel = styled.div`
  text-align: center;
  margin-bottom: 0.25em;
  font-size: var(--font-medium);
  opacity: 0.5;
`;

const StyledButtons = styled.div`
  height: 2em;
`;

const StyledButton = styled.div`
  cursor: pointer;
  position: relative;
  float: left;
  height: 2em;
  width: 25%;
  font-size: 1em;
  text-align: center;
  background-color: var(--color-button-bg);

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 2em;
  }

  &:last-child {
    margin-right: 0
  }
  &:hover {
    background-color: var(--button-hover-color);
  }
  &:active {
    background-color: var(--button-active-color);
  }

  ${({ top }) => top && `
    &:before { content: '\\25B2'; }
  `}
  ${({ bottom }) => bottom && `
    &:before { content: '\\25BC'; }
  `}
  ${({ left }) => left && `
    &:before { content: '\\25C4'; }
  `}
  ${({ right }) => right && `
    &:before { content: '\\25B6'; }
  `}
`;

export const ArrowInput = (props) => {
  const [timer, setTimer] = createSignal(null);

  const stopTimer = () => {
    clearInterval(timer());
    setTimer(null);
  }

  const fireInput = (x, y) => {
    let offset = {
      x: x * props.step,
      y: y * props.step
    };

    handleStore({
      store_key: props.storeKey,
      store_event: props.storeEvent,
    }, offset);

    if (typeof props.interval === 'number') {
      setTimer(setInterval(() => {
        handleStore({
          store_key: props.storeKey,
          store_event: props.storeEvent,
        }, offset);
      }, props.interval));
    }
  }

  return (
    <StyledContainer class={props.class}>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledButtons>
        <StyledButton top
          onMouseDown={() => {
            fireInput(0, -1);
          }}
          onMouseUp={() => {
            stopTimer();
          }}
        />
        <StyledButton bottom
          onMouseDown={() => {
            fireInput(0, 1);
          }}
          onMouseUp={() => {
            stopTimer();
          }}
        />
        <StyledButton left
          onMouseDown={() => {
            fireInput(-1, 0);
          }}
          onMouseUp={() => {
            stopTimer();
          }}
        />
        <StyledButton right
          onMouseDown={() => {
            fireInput(1, 0);
          }}
          onMouseUp={() => {
            stopTimer();
          }}
        />
      </StyledButtons>
    </StyledContainer>
  );
}
