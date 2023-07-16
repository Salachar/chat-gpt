import { createEffect, createSignal, For, onMount, onCleanup, Show, on } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store';

import {
  ActionsContainer,
  Eyes,
  SpeechBubble,
  TextArea,
  Button,
  ChatList,
} from '@components';

import { parseMessagesForChat } from './utils';

export const Chat = () => {
  // Create a ref for your scrollable element
  let scrollable;

  const onLoadEvent = (event, events = []) => {
    if (!Array.isArray(events)) events = [];
    store.setEvents(events);
  };

  const onChatEvent = (event, data = {}) => {
    const { chatId, message } = data;
    store.setChatWaiting({
      id: chatId,
      waiting: false
    });
    window.last_message = message;
    store.addChatMessage({
      id: chatId,
      message: message
    });
    store.setChatTokenData({
      id: chatId,
      token_data: message.token_data
    });
  };

  const onErrorMessage = (event, data) => {
    const { chatId, error } = data;
    store.setChatWaiting({
      id: chatId,
      waiting: false
    });
    store.clearChatMessages(chatId);
  };

  onMount(() => {
    store.addChat();
    IPC.on('onload', onLoadEvent);
    IPC.on('chat', onChatEvent);
    IPC.on('error', onErrorMessage);
    IPC.send('onload');
  });

  onCleanup(() => {
    IPC.removeListener('onload', onLoadEvent);
    IPC.removeListener('chat', onChatEvent);
    IPC.removeListener('error', onErrorMessage);
  });

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

  const onClear = () => {
    // Clear the chat history
    IPC.send('clear', {
      chatId: store.currentChatId(),
    });
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
  };

  return (
    <StyledContainer>
      <StyledChatList />

      <StyledDisplayWrapper>
        <StyledSnippy>
          <StyledEyes />
          {store.getChatWaiting() && (
            <StyledSpeechBubble />
          )}
        </StyledSnippy>

        <StyledChatHistoryWrapper
          label="Clearing the chat will reset token data"
          actions={{
            "x": () => {
              onClear();
            }
          }}
        >
          <StyledChatHistory ref={scrollable}>
            <For each={parseMessagesForChat(store.getChatMessages())}>
              {(message) => (
                <>
                  <Show when={!message.parsed_sub_messages}>
                    <StyledMessage
                      isUser={message.role === "user"}
                      isAssistant={message.role === "assistant"}
                      isGenerator={message.role === "generator"}
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
          </StyledChatHistory>
        </StyledChatHistoryWrapper>

        <StyledPromptContainer
          label="Send prompts with the Code Section by ending with a semicolon;"
          actions={{
            "server": () => {
              // Send the prompt and the code together
              store.setChatWaiting({
                waiting: true
              });
              store.addChatMessage({
                message: {
                  role: "user",
                  content: store.getChatPrompt(),
                }
              });
              IPC.send('chat', {
                chatId: store.currentChatId(),
                prompt: store.getChatPrompt(),
                code: store.getChatCode(),
              });
              setTimeout(() => {
                store.setChatPrompt({
                  prompt: ""
                });
              }, 0);
            },
          }}
        >
          <StyledPrompt
            value={store.getChatPrompt()}
            onKeyDown={(e) => {
              console.log(e)
              // Enter potentially sends the prompt or combined with shift
              // does not send the prompt so a new line can be added
              if (e.key === "Enter") {
                if (e.shiftKey) return;

                store.setChatWaiting({
                  waiting: true
                });

                const trimmed_prompt = store.getChatPrompt().trim();

                const payload = {
                  prompt: trimmed_prompt,
                }
                // Check if the trimmed prompt ends with a semicolon
                // and if so attach the code to the payload
                if (trimmed_prompt.endsWith(";")) {
                  payload.code = store.getChatCode();
                }

                store.addChatMessage({
                  message: {
                    role: "user",
                    content: trimmed_prompt,
                  }
                });

                IPC.send('chat', {
                  chatId: store.currentChatId(),
                  ...payload,
                });

                setTimeout(() => {
                  store.setChatPrompt({
                    prompt: ""
                  });
                }, 0);
              }
            }}
            onChange={(value) => {
              store.setChatPrompt({
                prompt: value
              });
            }}
          />
        </StyledPromptContainer>

      </StyledDisplayWrapper>

      <StyledChatActions>
        <StyledTokenData>
          <StyledTokenPiece>Token Data: 4096</StyledTokenPiece>
          <StyledTokenPiece>Completion: {JSON.stringify(store.getChatTokenData().completion_tokens)}</StyledTokenPiece>
          <StyledTokenPiece>Prompt: {JSON.stringify(store.getChatTokenData().prompt_tokens)}</StyledTokenPiece>
          <StyledTokenPiece>Remaining: {JSON.stringify(store.getChatTokenData().tokens_left)}</StyledTokenPiece>
          <StyledTokenPiece>Total: {JSON.stringify(store.getChatTokenData().total_tokens)}</StyledTokenPiece>
        </StyledTokenData>

        <For each={store.events()}>
          {(button_data) => (
            <StyledButtonWrapper>
              <StyledButton
                disabled={store.getChatWaiting()}
                label={button_data.label}
                onClick={() => {
                  if (store.getChatWaiting()) return;
                  store.addChatMessage({
                    message: {
                      role: "generator",
                      content: `Running ${button_data.label}...`,
                    }
                  });
                  store.setChatWaiting({
                    waiting: true
                  });
                  IPC.send(button_data.event, {
                    chatId: store.currentChatId(),
                    code: store.getChatCode(),
                  });
                }}
              />
              <StyledRefreshButton
                disabled={store.getChatWaiting()}
                onClick={() => {
                  if (store.getChatWaiting()) return;
                  onClear();
                  store.addChatMessage({
                    message: {
                      role: "generator",
                      content: `Running ${button_data.label}...`,
                    }
                  });
                  store.setChatWaiting({
                    waiting: true
                  });
                  IPC.send(button_data.event, {
                    chatId: store.currentChatId(),
                    code: store.getChatCode(),
                  });
                }}
              >
                <StyledRefreshIcon class="icss-synchronize" />
              </StyledRefreshButton>
            </StyledButtonWrapper>
          )}
        </For>
      </StyledChatActions>

      <StyledCodeSection
        label="Code Section"
        actions={{
          "text-justify": () => {
            // Controls word wrap of the code section
            store.toggleChatWordwrap();
          },
          "files": () => {
            // Copy code to navigator clipboard
            navigator.clipboard.writeText(store.getChatCode());
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
          wordwrap={store.getChatCodeWrap()}
          value={store.getChatCode()}
          onChange={(value) => {
            store.setChatCode({
              code: value
            });
          }}
        />
      </StyledCodeSection>

    </StyledContainer>
  );
}

const StyledCodeSection = styled(ActionsContainer)`
  grid-area: codesection;
  padding: 1rem 0 1rem 1rem;
`;

const StyledPromptContainer = styled(ActionsContainer)`
  position: relative;
  grid-area: prompt;
`;

const StyledPrompt = styled(TextArea)`
  position: relative;
  resize: none;
  background-color: var(--color-light-blue);
  overflow: hidden;
  border-bottom-right-radius: 0.5rem;
  width: 100%;
  height: 100%;
`;

const StyledCodeTextArea = styled(TextArea)`
  white-space: nowrap;
  width: 100%;
  height: 100%;
  resize: none;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`;

const StyledChatHistoryWrapper = styled(ActionsContainer)`
  grid-area: chathistory;
  padding: 1rem 0 0 0;
  height: 100%;
  overflow: hidden;
`;

const StyledChatHistory = styled.div`
  position: relative;
  background-color: var(--color-dark-blue-70);
  overflow-y: scroll;
  height: 100%;
`;

const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  background-color: var(--color-blue);
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 10rem 1fr 0.9fr 11rem;
  grid-template-rows: 1fr;
  grid-template-areas: "tabs chatdisplay codesection chatactions";
`;

const StyledChatList = styled(ChatList)`
  grid-area: tabs;
  border-right: 1rem solid var(--color-light-blue);
`;

const StyledDisplayWrapper = styled.div`
  position: relative;
  grid-area: chatdisplay;
  display: grid;
  height: 100%;
  overflow: hidden;
  grid-template-columns: 1fr;
  grid-template-rows: 3rem 1fr 7rem;
  padding: 1rem 0;
  grid-template-areas:
    "snippy"
    "chathistory"
    "prompt";
`;

const StyledButtonWrapper = styled.div`
  height: 2rem;
  display: flex;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const StyledButton = styled(Button)`
  height: 2rem;
  font-size: 0.75rem;
  padding-right: 0.25rem;
`;

const StyledRefreshButton = styled.div`
  height: 2rem;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background-color: var(--color-orange-spice);
  padding-right: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:hover { filter: brightness(1.2); }
  &:active { filter: brightness(0.8); }
  ${({ disabled }) => disabled && `
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const StyledRefreshIcon = styled.i`
  font-size: 1.25rem;
  color: var(--color-red);
  cursor: pointer;
`;

const StyledSnippy = styled.div`
  grid-area: snippy;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const StyledEyes = styled(Eyes)`
  margin-right: 1rem;
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  font-size: 0.7rem;
`;

const StyledChatActions = styled.div`
  grid-area: chatactions;
  padding: 2rem 1rem 1rem 0;
`;

const StyledTokenData = styled.div`
  padding: 0 0 2rem 1rem;
`;

const StyledTokenPiece = styled.div`
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
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
