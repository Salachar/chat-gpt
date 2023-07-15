import { styled } from 'solid-styled-components';

const StyledDescription = styled.p`
  margin: 0;
  position: relative;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  font-weight: 600;
  background-color: var(--color-dark-blue-70);
  padding: 0.5rem 0.5rem 0 0.5rem;
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
`;

const StyledTextArea = styled.textarea`
  border: none;
  box-shadow: none;
  background-color: var(--color-dark-blue-70);
  padding: 0.5rem;
  border-radius: 0.5rem;
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

  ${({ hasDescription }) => hasDescription && `
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  `}
`;

export const TextArea = (props) => {
  return (
    <>
      {props.description && (
        <StyledDescription>{props.description}</StyledDescription>
      )}
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
    </>
  );
}
