import { styled } from 'solid-styled-components';

const StyledTextInput = styled.input`
  border: none;
  box-shadow: none;
  background-color: var(--color-dark-blue-70);
  padding: 0.5rem;
  box-sizing: border-box;
  outline: 0;
  resize: vertical;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  vertical-align: top;
  white-space: nowrap;

  &::placeholder {
    color: #4f5886;
  }
`;

export const TextInput = (props) => {
  return (
    <StyledTextInput
      class={props.class}
      value={props.value || ""}
      placeholder={props.placeholder}
      onKeyDown={(e) => {
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      }}
      onKeyUp={(e) => {
        if (props.onChange) {
          props.onChange(e.currentTarget.value, e);
        }
      }}
    />
  );
}
