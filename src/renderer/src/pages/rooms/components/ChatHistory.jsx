import { createEffect, For } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store/roomsStore';

import { ActionsContainer } from '@components/Actions';
import { Message } from '@components/Message';

import { copy } from "@utils";

export const ChatHistory = (props) => {
  // Create a ref for your scrollable element
  let scrollable;

  // Use createEffect to scroll down whenever data changes
  createEffect(() => {
    // On messages change scroll to bottom if the chat is the current chat
    // if (store.getChatMessages().length && scrollable) {
    if (store.getRoom().messages.length && scrollable) {
      Prism.highlightAll();
      setTimeout(() => {
        scrollable.scrollTop = scrollable.scrollHeight;
      }, 0);
    }
  });

  return (
    <ActionsContainer
      class={props.class}
      label="Room Chat"
      style={{
        "font-size": "1.25rem",
      }}
      actions={{
        "recycle": {
          title: "Generate Room",
          disabled: store.getRoom()?.waiting,
          handler: () => {
            if (store.getRoom()?.waiting) return;
            store.setRoom("waiting", true);
            store.addMessage({
              message: {
                role: "generator",
                content: 'Generating room...',
              }
            });
            IPC.send('room', {
              id: store.getRoom().id,
              input_data: store.getAllReadableInputData(),
            });
          },
        }
      }}
    >
      <StyledHistory ref={scrollable}>
        <For each={store.getRoom().messages}>
          {(message) => (
            <StyledMessageContainer
              isUser={message.role === "user"}
              isAssistant={message.role === "assistant"}
              isGenerator={message.role === "generator"}
              isError={message.role === "error"}
            >
              <For each={message.content}>
                {(sub_message) => (
                  <>
                    {sub_message.type === "text" && (
                      <Message role={message.role} message={sub_message} />
                    )}
                    {sub_message.type === "code" && (
                      <ActionsContainer
                        label={sub_message.language}
                        actions={{
                          "files": {
                            title: "Copy to Clipboard",
                            handler: () => {
                              navigator.clipboard.readText().then((clipText) => {
                                // If item is already in clipboard, copy it to the prompt
                                if (clipText === sub_message.code_snippet) {
                                  store.setRoom("prompt", sub_message.code_snippet);
                                }
                              }).catch(err => {
                                console.error("Failed to read clipboard contents: ", err);
                              });
                              navigator.clipboard.writeText(sub_message.code_snippet);
                            },
                          },
                        }}
                      >
                        <StyledPre>
                          <code class="language-javascript" innerHTML={
                            Prism.highlight(sub_message.code_snippet, Prism.languages.javascript, 'javascript')
                          }></code>
                        </StyledPre>
                      </ActionsContainer>
                    )}
                  </>
                )}
              </For>
            </StyledMessageContainer>
          )}
        </For>
      </StyledHistory>
    </ActionsContainer>
  );
};

const StyledMessageContainer = styled.div`
  font-weight: 500;
  line-height: 1.1rem;
  font-size: 0.85rem;

  ${({ isUser }) => isUser && `
    color: var(--color-dark-white);
    border-left: 0.5rem solid var(--color-main-light);
  `}

  ${({ isAssistant }) => isAssistant && `
    color: var(--color-dark-white);
    background-color: var(--color-main);
  `}

  ${({ isGenerator }) => isGenerator && `
    color: #6ed86e;
  `}

  ${({ isError }) => isError && `
    color: #FF5C79;
    background-color: rgba(0, 0, 0, 0.25);
  `}
`;

const StyledHistory = styled.div`
  position: relative;
  background-color: var(--color-main-dark);
  overflow-y: scroll;
  height: 100%;
`;

const StyledPre = styled.pre`
  font-size: 0.9em !important;
  padding: 0 0.5em;
`;
