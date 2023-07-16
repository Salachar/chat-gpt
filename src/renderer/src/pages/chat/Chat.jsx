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
} from '@components';

import { parseMessagesForChat } from './utils';

export const Chat = () => {
  // Create a ref for your scrollable element
  let scrollable;

  const [getPrompt, setPrompt] = createSignal("");

  const onLoadEvent = (event, events = []) => {
    if (!Array.isArray(events)) events = [];
    store.setEvents(events);
  };

  const onChatEvent = (event, message = {}) => {
    store.setIsWaiting(false);
    window.last_message = message;
    store.addMessage(message);
    store.setTokenData(message.token_data);
  };

  const onErrorMessage = (event, error) => {
    console.log(error);
    store.setIsWaiting(false);
    store.clearMessages();
  };

  onMount(() => {
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
    if ((store.messages() || []).length && scrollable) {
      Prism.highlightAll();
      setTimeout(() => {
        scrollable.scrollTop = scrollable.scrollHeight;
      }, 0);
    }
  });

  const onClear = () => {
    // Clear the chat history
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
        <StyledSnippy>
          <StyledEyes />
          {store.isWaiting() && (
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
                            <StyledCodeMessageContainer
                              label={sub_message.language}
                              actions={{
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
              store.setIsWaiting(true);
              store.addMessage({
                role: "user",
                content: getPrompt(),
              });
              IPC.send('chat', {
                prompt: getPrompt(),
                code: store.code()
              });
              setTimeout(() => {
                setPrompt("");
              }, 0);
            },
          }}
        >
          <StyledPrompt
            value={getPrompt()}
            onKeyDown={(e) => {
              // Enter potentially sends the prompt or combined with shift
              // does not send the prompt so a new line can be added
              if (e.key === "Enter") {
                if (e.shiftKey) return;

                store.setIsWaiting(true);

                const trimmed_prompt = getPrompt().trim();
                const payload = {
                  prompt: trimmed_prompt,
                }
                // Check if the trimmed prompt ends with a semicolon
                // and if so attach the code to the payload
                if (trimmed_prompt.endsWith(";")) {
                  payload.code = store.code();
                }

                store.addMessage({
                  role: "user",
                  content: trimmed_prompt,
                });
                IPC.send('chat', payload);
                setTimeout(() => {
                  setPrompt("");
                }, 0);
              }
            }}
            onChange={(value) => {
              setPrompt(value);
            }}
          />
        </StyledPromptContainer>

      </StyledDisplayWrapper>

      <StyledChatActions>
        <StyledTokenData>
          <StyledTokenPiece>Token Data: 4096</StyledTokenPiece>
          <StyledTokenPiece>Completion: {JSON.stringify(store.tokenData().completion_tokens)}</StyledTokenPiece>
          <StyledTokenPiece>Prompt: {JSON.stringify(store.tokenData().prompt_tokens)}</StyledTokenPiece>
          <StyledTokenPiece>Remaining: {JSON.stringify(store.tokenData().tokens_left)}</StyledTokenPiece>
          <StyledTokenPiece>Total: {JSON.stringify(store.tokenData().total_tokens)}</StyledTokenPiece>
        </StyledTokenData>

        <For each={store.events()}>
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
                  IPC.send(button_data.event, store.code());
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
                  IPC.send(button_data.event, store.code());
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
            store.toggleWordwrap();
          },
          "files": () => {
            // Copy code to navigator clipboard
            navigator.clipboard.writeText(store.code());
          },
          "x": () => {
            // Clear the code section
            store.setCode("");
          }
        }}
      >
        <StyledCodeTextArea
          wordwrap={store.wordwrap()}
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
