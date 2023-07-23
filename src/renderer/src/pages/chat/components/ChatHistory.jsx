import { createEffect, For } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store';

import { ActionsContainer } from '../../../components/Actions';
import { Message } from '../../../components/Message';

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
      // label="Clear the chat to reset tokens"
      label={`${store.getChatName()} - ${store.getChatModel()} - Clear the chat to reset tokens`}
      actions={{
        "x": {
          title: "Clear chat messages",
          handler: () => {
            store.clearChatMessages();
            store.addChatMessages({
              messages: [{
                role: "generator",
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
                      <Message role={message.role} message={sub_message} />
                    )}
                    {sub_message.type === "code" && (
                      <StyledCodeMessageContainer
                        label={sub_message.language}
                        actions={{
                          "files": {
                            title: "Copy to Clipboard",
                            handler: () => {
                              navigator.clipboard.writeText(sub_message.code_snippet);
                            },
                          },
                          "expand": {
                            title: "Open in new chat",
                            handler: () => {
                              store.addChat({
                                snippet: sub_message.code_snippet,
                                code_language: sub_message.language,
                              })
                            }
                          },
                          "quotation-l": {
                            title: "Copy to Snippet",
                            handler: () => {
                              store.setChatSnippet({
                                snippet: sub_message.code_snippet
                              });
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

const StyledContainer = styled(ActionsContainer)`
  position: relative;
`;

const StyledHistory = styled.div`
  position: relative;
  background-color: var(--color-main-dark);
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
