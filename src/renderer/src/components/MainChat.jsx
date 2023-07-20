import { styled } from 'solid-styled-components';
import { store } from '@store';

import { ActionsContainer } from './Actions';
import { ChatHistory } from './ChatHistory';
import { TextArea } from './TextArea';
import { MainChatHeader } from './MainChatHeader';

export const MainChat = (props) => {
  return (
    <StyledContainer class={props.class}>
      {/* <StyledMainChatHeader /> */}

      <StyledChatHistory />

      <StyledPromptContainer
        label="Send prompts with the Snippet Section by ending with a semicolon;"
        actions={{
          "files": {
            title: "Copy to Clipboard",
            handler: () => {
              // Copy the current prompt to the navigator clipboard
              navigator.clipboard.writeText(store.getChatPrompt());
            }
          },
          "server": {
            title: "Send prompt with Snippet Section attached",
            handler: () => {
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
          }
        }}
      >
        <StyledPrompt
          value={store.getChatPrompt()}
          onKeyDown={(e) => {
            // Enter potentially sends the prompt or combined with shift
            // does not send the prompt so a new line can be added
            if (e.key === "Enter") {
              if (e.shiftKey) return;

              // If waiting, don't send another prompt
              if (store.getChatWaiting()) {
                e.preventDefault();
                // Add an assistant message saying to wait
                store.addChatMessage({
                  message: {
                    role: "assistant",
                    content: "Please wait until I'm finished with your last request.",
                  }
                });
                return;
              }

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
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  height: 100%;
  overflow: hidden;
  padding: 1rem 0;
`;

// const StyledMainChatHeader = styled(MainChatHeader)`
//   height: 3rem;
// `;

const StyledChatHistory = styled(ChatHistory)`
  height: 100%;
  overflow: hidden;
`;

const StyledPromptContainer = styled(ActionsContainer)`
  height: 8rem;
`;

const StyledPrompt = styled(TextArea)`
  resize: none;
  background-color: var(--color-main-light);
  overflow: hidden;
  border-bottom-right-radius: 0.5rem;
  width: 100%;
  height: 100%;
`;
