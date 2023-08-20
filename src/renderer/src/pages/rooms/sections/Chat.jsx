import { styled } from 'solid-styled-components';
import { store } from '@store/roomsStore';

import { ActionsContainer } from '../../../components/Actions';
import { ChatHistory } from './ChatHistory';
import { TextArea } from '../../../components/TextArea';
import { copy } from "@utils";

export const Chat = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledChatHistory />

      <StyledPromptContainer
        label="Ask me anything about the room you want to make!"
        actions={{}}
      >
        <StyledPrompt
          value={store.getRoom().prompt}
          onKeyDown={(e) => {
            const prompt = copy(store.getRoom().prompt).trim();
            // Enter potentially sends the prompt or combined with shift
            // does not send the prompt so a new line can be added
            if (e.key === "Enter") {
              if (store.getRoom().waiting) {
                return store.addMessage({
                  message: {
                    role: "assistant",
                    content: "Please wait until I'm ready.",
                  }
                });
              }

              store.setRoom("waiting", true);

              store.addMessage({
                message: {
                  role: "user",
                  content: prompt,
                }
              });

              const id = copy(store.getRoom().id);
              IPC.send('room-chat', { id, prompt });

              setTimeout(() => {
                store.setRoom("prompt", "");
              }, 0);
            }
          }}
          onChange={(value) => {
            store.setRoom("prompt", value);
          }}
        />
      </StyledPromptContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledChatHistory = styled(ChatHistory)`
  height: 100%;
  overflow: hidden;
`;

const StyledPromptContainer = styled(ActionsContainer)`
  height: 6rem;
`;

const StyledPrompt = styled(TextArea)`
  resize: none;
  background-color: var(--color-main-light);
  border-bottom-right-radius: 0.5rem;
  width: 100%;
  height: 100%;
`;
