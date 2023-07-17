import { styled } from 'solid-styled-components';
import { store } from '@store';

import { ActionsContainer } from './Actions';
import { TextArea } from './TextArea';

export const CodeSection = (props) => {
  return (
    <StyledContainer
      class={props.class}
      label="Code Section"
      actions={{
        "text-justify": () => {
          // Controls word wrap of the code section
          store.toggleChatCodeWrap();
        },
        "files": () => {
          // Copy code to navigator clipboard
          navigator.clipboard.writeText(store.getChatCode());
        },
        "expand": () => {
          const currentChatId = store.currentChatId();
          const newChatId = store.addChat();
          store.setChatCode({
            id: newChatId,
            code: store.getChatCode(currentChatId),
          });
          store.setChatCodeLanguage({
            code_language: store.getChatCodeLanguage(currentChatId),
          });
          store.setChatName({
            id: newChatId,
            name: "Code Section",
          });
        },
        "x": () => {
          // Clear the code section
          store.setChatCode({
            code: ""
          });
        }
      }}
    >
      <StyledCodeTextArea
        spellcheck="false"
        wordwrap={store.getChatCodeWrap()}
        value={store.getChatCode()}
        onChange={(value) => {
          store.setChatCode({
            code: value
          });
        }}
      />
      {/* <StyledPre wordwrap={store.getChatCodeWrap()}>
        <code class="language-javascript" innerHTML={
          Prism.highlight(store.getChatCode(), Prism.languages[store.getChatCodeLanguage()], store.getChatCodeLanguage())
        }></code>
      </StyledPre> */}
    </StyledContainer>
  );
};

const StyledContainer = styled(ActionsContainer)``;

const StyledCodeTextArea = styled(TextArea)`
  /* position: absolute; */
  white-space: nowrap;
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 0.5rem 0.75rem !important;

  font-family: "Fira Code", monospace !important;
  font-weight: 400 !important;
  font-size: 1em !important;
  line-height: 1em !important;
  letter-spacing: 0.05em !important;

  /* background-color: transparent !important; */
  resize: none;
  /* color: transparent !important; */
  /* z-index: 10; */
`;

const StyledPre = styled.pre`
  position: absolute;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 0.25rem 0.5em !important;

  font-family: "Fira Code", monospace !important;
  font-weight: 400 !important;
  font-size: 1em !important;
  line-height: 1em !important;
  letter-spacing: 0.05em !important;

  z-index: 5;

  * {
    font-family: "Fira Code", monospace !important;
    font-weight: 400 !important;
    font-size: 1em !important;
    line-height: 1em !important;
    letter-spacing: 0.05em !important;
  }

  ${({ wordwrap }) => wordwrap && `
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  `}
`;
