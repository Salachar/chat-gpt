import { styled } from 'solid-styled-components';
import { handleStore } from "@utils";

const StyledButton = styled.button`
  position: relative;
  cursor: pointer;
  background-color: var(--color-orange-spice);
  color: var(--color-main-dark);
  font-weight: bold;
  min-height: 2rem;
  width: 100%;
  border: 0;
  transition: all 0.1s ease;
  /* text-align: left; */
  text-align: inherit;
  padding: 0 0.25rem;

  &:hover {
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.8);
  }

  ${({ disabled }) => disabled && `
    cursor: not-allowed;
    opacity: 0.5;
  `}

  ${({ toUpperCase }) => toUpperCase && `
    text-transform: uppercase;
  `}

  ${({ borderRadius }) => borderRadius === 'right' && `
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  `}

  ${({ borderRadius }) => borderRadius === 'left' && `
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  `}
`;

export const Button = (props) => {
  return (
    <StyledButton
      class={props.class}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }

        if (props.storeEvent) {
          handleStore({
            storeEvent: props.storeEvent,
          });
        }

        if (props.ipcEvent) {
          IPC.send(props.ipcEvent);
        }
      }}
      disabled={props.disabled}
      toUpperCase={props.toUpperCase}
      borderRadius={props.borderRadius}
    >
      {props.label}
    </StyledButton>
  );
}
