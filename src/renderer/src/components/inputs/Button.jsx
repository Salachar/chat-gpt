import { createEffect, createSignal, onMount } from 'solid-js'
import { styled } from 'solid-styled-components';

const StyledButton = styled.button`
  position: relative;
  cursor: pointer;
  background-color: var(--color-orange-spice);
  color: var(--color-blue);
  font-weight: bold;
  /* height: 100%; */
  min-height: 2rem;
  width: 100%;
  border: 0;
  border-radius: 0.5rem;
  text-transform: uppercase;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  ${({ disabled }) => disabled && `
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

export const Button = (props) => {
  return (
    <StyledButton
      class={props.class}
      onClick={props.onClick}
    >
      {props.label}
    </StyledButton>
  );
}
