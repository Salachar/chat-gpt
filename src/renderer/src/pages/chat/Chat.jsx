import { createEffect, createSignal, For, onMount, onCleanup, Show, on } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store';

import { ActionsContainer, Eyes, TextArea, Button } from '@components';

import { parseMessagesForChat } from './utils';

export const Chat = () => {
  // Create a ref for your scrollable element
  let scrollable;

  const [getPrompt, setPrompt] = createSignal("");

  const onChatEvent = (event, message = {}) => {
    console.log(message);
    store.setIsWaiting(false);
    window.last_message = message;
    store.addMessage(message);
    store.setTokenData(message.token_data);
  };

  const onErrorMessage = (event, error) => {
    console.log(error);
    store.setIsWaiting(false);
    store.clearMessages();
  }

  onMount(() => {
    IPC.on('chat', onChatEvent);
    IPC.on('error', onErrorMessage);
  });

  onCleanup(() => {
    IPC.removeListener('chat', onChatEvent);
    IPC.removeListener('error', onErrorMessage);
  });

  // Use createEffect to scroll down whenever data changes
  createEffect(() => {
    if ((store.messages() || []).length && scrollable) {
      Prism.highlightAll();
      setTimeout(() => {
        scrollable.scrollTop = scrollable.scrollHeight;
      }, 0);
    }
  });

  const onClear = () => {
    // Clear the chat history
    // store.clearMessages();
    IPC.send('clear');
    store.clearMessages();
    store.addMessage({
      role: "generator",
      content: "Clearing chat history...",
    });
    store.addMessage({
      role: "assistant",
      content: "Chat history has been cleared.",
    });
  };

  return (
    <StyledContainer>
      <StyledTabs>
        Tabs
      </StyledTabs>

      <StyledDisplayWrapper>
        <StyledEyes />

        <StyledChatHistoryWrapper actions={{
            "x": () => {
              // Clear the chat history
              onClear();
            }
          }}>
          <StyledChatHistory ref={scrollable}>
            <For each={parseMessagesForChat(store.messages())}>
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
                            <StyledCodeMessageContainer actions={{
                              "files": () => {
                                // Copy code snippet to navigator clipboard
                                navigator.clipboard.writeText(sub_message.code_snippet);
                              },
                              "expand": () => {
                                // TODO: Open new tab with code snippet
                              },
                              "quotation-l": () => {
                                // Copy code snippet to code section
                                store.setCode(sub_message.code_snippet);
                              }
                            }}>
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


        <StyledPrompt
          value={getPrompt()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              store.addMessage({
                role: "user",
                content: getPrompt(),
              });
              IPC.send('chat', getPrompt());
              setTimeout(() => {
                setPrompt("");
              }, 0);
            }
          }}
          onChange={(value) => {
            setPrompt(value);
          }}
        />
      </StyledDisplayWrapper>

      <StyledChatActions>
        <StyledTokenData>
          <StyledTokenPiece>Token Data: 4096</StyledTokenPiece>
          <StyledTokenPiece>Completion: {JSON.stringify(store.tokenData().completion_tokens)}</StyledTokenPiece>
          <StyledTokenPiece>Prompt: {JSON.stringify(store.tokenData().prompt_tokens)}</StyledTokenPiece>
          <StyledTokenPiece>Remaining: {JSON.stringify(store.tokenData().tokens_left)}</StyledTokenPiece>
          <StyledTokenPiece>Total: {JSON.stringify(store.tokenData().total_tokens)}</StyledTokenPiece>
        </StyledTokenData>

        <For each={[{
          label: "Random Code",
          ipc: "random",
        }, {
          label: "Analyze",
          ipc: "analyze",
        }, {
          label: "To Javascript",
          ipc: "javascript",
        }, {
          label: "To React/Chakra",
          ipc: "stack",
        }, {
          label: "To React Native",
          ipc: "react-native",
        }, {
          label: "Chakratize",
          ipc: "chakratize",
        }, {
          label: "Utils Check",
          ipc: "utils",
        }, {
          label: "Unit Tests",
          ipc: "unit-tests",
        }, {
          label: "Cypress Tests",
          ipc: "cypress-tests",
        }, {
          label: "Storybook",
          ipc: "storybook",
        }]}>
          {(button_data) => (
            <StyledButtonWrapper>
              <StyledButton
                disabled={store.isWaiting()}
                label={button_data.label}
                onClick={() => {
                  if (store.isWaiting()) return;
                  store.addMessage({
                    role: "generator",
                    content: `Running ${button_data.label}...`,
                  });
                  store.setIsWaiting(true);
                  IPC.send(button_data.ipc, store.code());
                }}
              />
              <StyledRefreshButton
                disabled={store.isWaiting()}
                onClick={() => {
                  if (store.isWaiting()) return;
                  onClear();
                  store.addMessage({
                    role: "generator",
                    content: `Running ${button_data.label}...`,
                  });
                  store.setIsWaiting(true);
                  IPC.send(button_data.ipc, store.code());
                }}
              >
                <StyledRefreshIcon class="icss-synchronize" />
              </StyledRefreshButton>
            </StyledButtonWrapper>
          )}
        </For>
      </StyledChatActions>

      <StyledCodeSection actions={{
        "files": () => {
          // Copy code to navigator clipboard
          navigator.clipboard.writeText(store.code());
        },
        "x": () => {
          // Clear the code section
          store.setCode("");
        }
      }}>
        <StyledCodeTextArea
          value={store.code()}
          onChange={(value) => {
            store.setCode(value);
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

const StyledTabs = styled.div`
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
  grid-template-rows: 3rem 1fr 5rem;
  padding: 1rem 0;
  grid-template-areas:
    "eyes"
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

const StyledEyes = styled(Eyes)`
  grid-area: eyes;
`;

const StyledPrompt = styled(TextArea)`
  position: relative;
  resize: none;
  grid-area: prompt;
  background-color: var(--color-light-blue);
  overflow: hidden;
  border-bottom-right-radius: 0.5rem;
`;

const StyledChatActions = styled.div`
  grid-area: chatactions;
  /* margin-top: 1rem; */
  /* padding: 1rem; */
  /* padding-right */
  padding: 2rem 1rem 1rem 0;
`;

const StyledTokenData = styled.div`
  /* margin-bottom: 2rem; */
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
  padding: 0.25em 0.5em;
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
