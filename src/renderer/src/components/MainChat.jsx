import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Eyes } from './Eyes';
import { SpeechBubble } from './SpeechBubble';
import { ActionsContainer } from './Actions';
import { ChatHistory } from './ChatHistory';
import { TextArea } from './TextArea';
import { MainChatHeader } from './MainChatHeader';

export const MainChat = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledMainChatHeader />

      <StyledChatHistory />

      <StyledPromptContainer
        label="Send prompts with the Code Section by ending with a semicolon;"
        actions={{
          "files": () => {
            // Copy the current prompt to the navigator clipboard
            navigator.clipboard.writeText(store.getChatPrompt());
          },
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

const StyledMainChatHeader = styled(MainChatHeader)`
  height: 3rem;
`;

const StyledChatHistory = styled(ChatHistory)`
  height: 100%;
  overflow: hidden;
`;

const StyledPromptContainer = styled(ActionsContainer)`
  height: 7rem;
`;

const StyledPrompt = styled(TextArea)`
  resize: none;
  background-color: var(--color-light-blue);
  overflow: hidden;
  border-bottom-right-radius: 0.5rem;
  width: 100%;
  height: 100%;
`;
