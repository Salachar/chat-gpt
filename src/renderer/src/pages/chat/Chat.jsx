import { createEffect, createSignal, For, onMount, onCleanup, Show } from 'solid-js'
import { styled } from 'solid-styled-components';
import Prism from 'prismjs';
import { store } from '@store';

import { TextArea, Button } from '@inputs';
import { StonerEyes } from '@components/loaders/StonerEyes';

import { parseMessagesForChat } from './utils';

export const Chat = () => {
  // Create a ref for your scrollable element
  let scrollable;

  const [getPrompt, setPrompt] = createSignal("");

  const onChatEvent = (event, message = {}) => {
    console.log(message);
    window.last_message = message;
    store.addMessage(message);
  };

  onMount(() => {
    IPC.on('chat', onChatEvent);
  });

  onCleanup(() => {
    IPC.removeListener('chat', onChatEvent);
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

  return (
    <StyledContainer>
      <StyledStonerEyes />

      <StyledTabs />

      <StyledDisplay ref={scrollable}>
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
                        <StyledPre>
                          <code class="language-javascript" innerHTML={
                            Prism.highlight(sub_message.code_snippet, Prism.languages.javascript, 'javascript')
                          }></code>
                        </StyledPre>
                      )}
                    </>
                  )}
                </For>
              </Show>
            </>
          )}
        </For>
      </StyledDisplay>

      <StyledChatActions>
        <Button
          label="Clear"
          onClick={() => {
            store.setMessages([]);
            IPC.send('clear');
          }}
        />
        <Button
          label="Random Code"
          onClick={() => {
            IPC.send('random');
          }}
        />
        <Button
          label="Analyze"
          onClick={() => {
            IPC.send('analyze', store.code());
          }}
        />
        <Button
          label="To Javascript"
          onClick={() => {
            IPC.send('javascript', store.code());
          }}
        />
        <Button
          label="To React/Chakra"
          onClick={() => {
            IPC.send('stack', store.code());
          }}
        />
        <Button
          label="To React Native"
          onClick={() => {
            IPC.send('react-native', store.code());
          }}
        />
        <Button
          label="Chakratize"
          onClick={() => {
            IPC.send('chakratize', store.code());
          }}
        />
        <Button
          label="Utils Check"
          onClick={() => {
            IPC.send('utils', store.code());
          }}
        />
        <Button
          label="Unit Tests"
          onClick={() => {
            IPC.send('unit-tests', store.code());
          }}
        />
        <Button
          label="Cypress Tests"
          onClick={() => {
            IPC.send('cypress-tests', store.code());
          }}
        />
      </StyledChatActions>

      <StyledCodeSection
        value={store.code()}
        onChange={(value) => {
          store.setCode(value);
        }}
      />

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
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  padding: 1rem 1rem 1rem 0;
  background-color: var(--color-blue);
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 1fr 0.85fr 10rem;
  grid-template-rows: 4rem 1fr 5rem;
  grid-template-areas:
    "stonereyes tabs tabs"
    "chathistory codesection chatactions"
    "prompt codesection chatactions";
`;

const StyledStonerEyes = styled(StonerEyes)`
  grid-area: stonereyes;
`;

const StyledTabs = styled.div`
  grid-area: tabs;
`;

const StyledDisplay = styled.div`
  position: relative;
  grid-area: chathistory;
  background-color: var(--color-dark-blue-70);
  margin: 1rem 0;
  padding: 0.25rem;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow-y: scroll;

  * {
    cursor: text;
  }
`;

const StyledCodeSection = styled(TextArea)`
  grid-area: codesection;
  margin: 1rem 1rem 0 1rem;
`;

const StyledChatActions = styled.div`
  grid-area: chatactions;
  margin: 1rem 0;
`;

const StyledPrompt = styled(TextArea)`
  position: relative;
  resize: none;
  grid-area: prompt;
  background-color: var(--color-light-blue);
  border-radius: 0;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
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
