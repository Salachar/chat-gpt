import { styled } from 'solid-styled-components';

const StyledTextArea = styled.textarea`
  border: none;
  box-shadow: none;
  background-color: var(--color-main-dark);
  padding: 0.5rem;
  box-sizing: border-box;
  outline: 0;
  resize: vertical;
  color: white;
  font-size: 0.9rem;
  /* font-weight: 600; */
  vertical-align: top;

  &::placeholder {
    color: #4f5886;
  }

  ${({ wordwrap }) => wordwrap && `
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  `}
`;

export const TextArea = (props) => {
  return (
    <StyledTextArea
      value={props.value || ""}
      class={props.class}
      wordwrap={props.wordwrap}
      spellcheck={props.spellcheck || true}
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
