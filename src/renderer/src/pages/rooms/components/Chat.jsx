import { styled } from 'solid-styled-components';

import { ActionsContainer } from '@components/Actions';
import { ChatHistory } from './ChatHistory';
import { TextArea } from '@inputs';

import { store } from '@store/roomsStore';
import RoomsIPCEvents from "@ipc/rooms";

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
            if (e.key === "Enter") {
              RoomsIPCEvents.sendPrompt({
                from: "chat",
              });
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
