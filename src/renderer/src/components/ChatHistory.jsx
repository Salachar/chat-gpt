import { createEffect, For, Show } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store';

import { ActionsContainer } from './Actions';
import { Message } from './Message';

export const ChatHistory = (props) => {
  // Create a ref for your scrollable element
  let scrollable;

  // Use createEffect to scroll down whenever data changes
  createEffect(() => {
    // On messages change scroll to bottom if the chat is the current chat
    if (store.getChatMessages().length && scrollable) {
      Prism.highlightAll();
      setTimeout(() => {
        scrollable.scrollTop = scrollable.scrollHeight;
      }, 0);
    }
  });

  return (
    <StyledContainer
      class={props.class}
      label="Clearing the chat will reset token data"
      actions={{
        "x": {
          title: "Clear chat messages",
          handler: () => {
            store.clearChatMessages();
            store.addChatMessages({
              messages: [{
                role: "generator",
                content: "Clearing chat history...",
              }, {
                role: "assistant",
                content: "Chat history has been cleared.",
              }]
            });
          },
        }
      }}
    >
      <StyledHistory ref={scrollable}>
        <For each={store.getChatMessages()}>
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
                      // <For each={sub_message.lines}>
                      //   {(line) => <Line role={message.role} line={line} />}
                      // </For>
                      <Message role={message.role} message={sub_message} />
                    )}
                    {sub_message.type === "code" && (
                      <StyledCodeMessageContainer
                        label={sub_message.language}
                        actions={{
                          "files": {
                            title: "Copy to Clipboard",
                            handler: () => {
                              // Copy code snippet to navigator clipboard
                              navigator.clipboard.writeText(sub_message.code_snippet);
                            },
                          },
                          "expand": {
                            title: "Open in new chat",
                            handler: () => {
                              const newChatId = store.addChat();
                              store.setChatCode({
                                id: newChatId,
                                code: sub_message.code_snippet
                              });
                              // Set the language
                              store.setChatCodeLanguage({
                                code_language: sub_message.language
                              });
                              // Set the name of the new chat to the language or "Chat"
                              store.setChatName({
                                id: newChatId,
                                name: sub_message.language || "Chat"
                              });
                            }
                          },
                          "quotation-l": {
                            title: "Copy to Snippet Section",
                            handler: () => {
                              // Copy code snippet to code section
                              store.setChatCode({
                                code: sub_message.code_snippet
                              });
                              // Set the language
                              store.setChatCodeLanguage({
                                code_language: sub_message.language
                              });
                            }
                          }
                        }}
                      >
                        <StyledPre>
                          <code class="language-javascript" innerHTML={
                            Prism.highlight(sub_message.code_snippet, Prism.languages.javascript, 'javascript')
                          }></code>
                        </StyledPre>
                      </StyledCodeMessageContainer>
                    )}
                  </>
                )}
              </For>
            </StyledMessageContainer>
          )}
        </For>
      </StyledHistory>
    </StyledContainer>
  );
};

const StyledMessageContainer = styled.div`
  font-weight: 600;
  line-height: 1.1rem;
  font-size: 0.85rem;

  ${({ isUser }) => isUser && `
    color: var(--color-dark-white);
  `}

  ${({ isAssistant }) => isAssistant && `
    color: var(--color-dark-white);
    background-color: rgba(255, 255, 255, 0.08);
  `}

  ${({ isGenerator }) => isGenerator && `
    color: #6ed86e;
    font-weight: 600;
  `}

  ${({ isError }) => isError && `
    color: #FF5C79;
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.25);
  `}
`;

const StyledContainer = styled(ActionsContainer)`
  position: relative;
`;

const StyledHistory = styled.div`
  position: relative;
  background-color: var(--color-dark-blue-70);
  overflow-y: scroll;
  height: 100%;
`;

const StyledCodeMessageContainer = styled(ActionsContainer)`
  position: relative;
`;

const StyledPre = styled.pre`
  font-size: 0.9em !important;
  padding: 0 0.5em;
`;
