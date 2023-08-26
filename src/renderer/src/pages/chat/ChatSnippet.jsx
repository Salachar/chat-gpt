import { styled } from 'solid-styled-components';
import { store } from './store';

import { ActionsContainer } from '@components/Actions';
import { TextArea } from '@inputs';

export const ChatSnippet = (props) => {
  let textAreaRef;
  let preRef;

  return (
    <ActionsContainer
      class={props.class}
      label="Notepad"
      actions={[
        {
          icon: "visual-code",
          title: "Code Format",
          toggled: store.getChatSnippetFormat() === "code",
          handler: () => {
            store.toggleChatCodeFormat();
          }
        }, {
          icon: "text-justify",
          title: "Word Wrap",
          toggled: store.getChatSnippetWrap(),
          handler: () => {
            store.toggleChatSnippetWrap();
          },
        }, {
          icon: "files",
          title: "Copy to Clipboard",
          handler: () => {
            navigator.clipboard.writeText(store.getChatSnippet());
          },
        }, {
          icon: "expand",
          title: "Open in new chat",
          handler: () => {
            store.addChat({
              snippet: store.getChatSnippet(),
              code_language: store.getChatCodeLanguage(),
            });
          },
        }, {
          icon: "x",
          title: "Clear the Notepad",
          handler: () => {
            store.setChatSnippet({
              snippet: ""
            });
          }
        }
      ]}
    >
      <StyledCodeTextArea
        spellcheck="false"
        wordwrap={store.getChatSnippetWrap()}
        codeformat={store.getChatSnippetFormat() === "code"}
        value={store.getChatSnippet()}
        ref={textAreaRef}
        onScroll={(e) => {
          if (textAreaRef && preRef) {
            preRef.scrollTop = textAreaRef.scrollTop;
            preRef.scrollLeft = textAreaRef.scrollLeft;
          }
        }}
        onChange={(value) => {
          store.setChatSnippet({
            snippet: value
          });
        }}
      />
      <StyledPre
        ref={preRef}
        codeformat={store.getChatSnippetFormat() === "code"}
      >
        <code class="language-javascript" innerHTML={
          Prism.highlight(store.getChatSnippet(), Prism.languages[store.getChatCodeLanguage()], store.getChatCodeLanguage())
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
