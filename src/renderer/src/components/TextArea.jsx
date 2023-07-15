import { styled } from 'solid-styled-components';

const StyledTextArea = styled.textarea`
  border: none;
  box-shadow: none;
  background-color: var(--color-dark-blue-70);
  padding: 0.5rem;
  box-sizing: border-box;
  outline: 0;
  resize: vertical;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  vertical-align: top;

  &::placeholder {
    color: #4f5886;
  }

`;

export const TextArea = (props) => {
  return (
    <StyledTextArea
      value={props.value || ""}
      class={props.class}
      hasDescription={Boolean(props.description)}
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
