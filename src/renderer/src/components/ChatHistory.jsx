import { createEffect, For, Show } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store';

import { ActionsContainer } from './Actions';

import { parseMessagesForChat } from '@utils';

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
        "x": () => {
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
        }
      }}
    >
      <StyledHistory ref={scrollable}>
        <For each={parseMessagesForChat(store.getChatMessages())}>
          {(message) => (
            <>
              <Show when={!message.parsed_sub_messages}>
                <StyledMessage
                  isUser={message.role === "user"}
                  isAssistant={message.role === "assistant"}
                  isGenerator={message.role === "generator"}
                  isError={message.role === "error"}
                >
                  {message.content}
                </StyledMessage>
              </Show>

              <Show when={message.parsed_sub_messages}>
                <For each={message.parsed_sub_messages}>
                  {(sub_message) => (
                    <>
                      {sub_message.type === "text" && (
                        <For each={sub_message.split_content}>
                          {(chunk) => (
                            <StyledMessage
                              isUser={message.role === "user"}
                              isAssistant={message.role === "assistant"}
                              isGenerator={message.role === "generator"}
                              isError={message.role === "error"}
                            >
                              {chunk}
                            </StyledMessage>
                          )}
                        </For>
                      )}
                      {sub_message.type === "code" && (
                        <StyledCodeMessageContainer
                          label={sub_message.language}
                          actions={{
                            "files": () => {
                              // Copy code snippet to navigator clipboard
                              navigator.clipboard.writeText(sub_message.code_snippet);
                            },
                            "expand": () => {
                              // TODO: Open new tab with code snippet
                              const newChatId = store.addChat();
                              store.setChatCode({
                                id: newChatId,
                                code: sub_message.code_snippet
                              });
                            },
                            "quotation-l": () => {
                              // Copy code snippet to code section
                              store.setChatCode({
                                code: sub_message.code_snippet
                              });
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
              </Show>
            </>
          )}
        </For>
      </StyledHistory>
    </StyledContainer>
  );
};

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
  margin: 0.5rem 0;
`;

const StyledMessage = styled.span`
  display: block;
  padding: 0.35em 0.5em;
  font-size: 0.9em;
  font-weight: 600;

  ${({ isUser }) => isUser && `
    color: white;
  `}

  ${({ isAssistant }) => isAssistant && `
    color: var(--color-orange-spice);
  `}

  ${({ isGenerator }) => isGenerator && `
    color: #6ed86e;
  `}

  ${({ isError }) => isError && `
    color: #FF5C79;
  `}
`;

const StyledPre = styled.pre`
  font-size: 0.9em !important;
  padding: 0 0.5em;
`;
