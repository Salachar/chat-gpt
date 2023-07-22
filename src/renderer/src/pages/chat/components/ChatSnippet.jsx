import { styled } from 'solid-styled-components';
import { store } from '@store';

import { ActionsContainer } from '../../../components/Actions';
import { TextArea } from '../../../components/TextArea';

export const ChatSnippet = (props) => {
  let textAreaRef;
  let preRef;

  return (
    <ActionsContainer
      class={props.class}
      label="Snippet Section"
      actions={{
        "visual-code": {
          title: "Code Format",
          toggled: store.getChatCodeFormat(),
          handler: () => {
            store.toggleChatCodeFormat();
          }
        },
        "text-justify": {
          title: "Word Wrap",
          toggled: store.getChatCodeWrap(),
          handler: () => {
            store.toggleChatCodeWrap();
          },
        },
        "files": {
          title: "Copy to Clipboard",
          handler: () => {
            navigator.clipboard.writeText(store.getChatCode());
          },
        },
        "expand": {
          title: "Open in new chat",
          handler: () => {
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
        },
        "x": {
          title: "Clear the Snippet Section",
          handler: () => {
            store.setChatCode({
              code: ""
            });
          }
        }
      }}
    >
      <StyledCodeTextArea
        spellcheck="false"
        wordwrap={store.getChatCodeWrap()}
        codeformat={store.getChatCodeFormat()}
        value={store.getChatCode()}
        ref={textAreaRef}
        onScroll={(e) => {
          if (textAreaRef && preRef) {
            preRef.scrollTop = textAreaRef.scrollTop;
            preRef.scrollLeft = textAreaRef.scrollLeft;
          }
        }}
        onChange={(value) => {
          store.setChatCode({
            code: value
          });
        }}
      />
      <StyledPre codeformat={store.getChatCodeFormat()} ref={preRef}>
        <code class="language-javascript" innerHTML={
          Prism.highlight(store.getChatCode(), Prism.languages[store.getChatCodeLanguage()], store.getChatCodeLanguage())
        }></code>
      </StyledPre>
    </ActionsContainer>
  );
};

const StyledCodeTextArea = styled(TextArea)`
  white-space: nowrap;
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 0.5rem 0.75rem !important;
  resize: none;

  font-family: "Fira Code", monospace !important;
  font-weight: 400 !important;
  font-size: 1em !important;
  line-height: 1.2em !important;
  letter-spacing: 0.05em !important;

  ${({ codeformat }) => codeformat && `
    position: absolute;
    white-space: nowrap !important;
    background-color: transparent !important;
    color: transparent !important;
    caret-color: white !important;
    z-index: 10;
  `}
`;

const StyledPre = styled.pre`
  position: absolute;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 0.5rem 0.75rem !important;
  z-index: 5;

  font-family: "Fira Code", monospace !important;
  font-weight: 400 !important;
  font-size: 1em !important;
  line-height: 1.2em !important;
  letter-spacing: 0.05em !important;

  * {
    font-family: "Fira Code", monospace !important;
    font-weight: 400 !important;
    font-size: 1em !important;
    line-height: 1.2em !important;
    letter-spacing: 0.05em !important;
  }

  visibility: hidden;
  ${({ codeformat }) => codeformat && `
    visibility: visible;
  `}
`;
