import { createEffect, createSignal, onMount } from 'solid-js'
import { styled } from 'solid-styled-components';

const StyledButton = styled.button`
  position: relative;
  cursor: pointer;
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
