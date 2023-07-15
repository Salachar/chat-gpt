import { styled } from 'solid-styled-components';

const StyledButton = styled.button`
  position: relative;
  cursor: pointer;
  background-color: var(--color-orange-spice);
  color: var(--color-blue);
  font-weight: bold;
  min-height: 2rem;
  width: 100%;
  border: 0;
  text-transform: uppercase;
  transition: all 0.1s ease;
  text-align: left;


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
`;

export const Button = (props) => {
  return (
    <StyledButton
      class={props.class}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </StyledButton>
  );
}
