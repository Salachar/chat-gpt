import { styled } from 'solid-styled-components';

import { ActionsContainer } from '@components/Actions';
import { ChatHistory } from './ChatHistory';
import { TextArea } from '@inputs';

export const SimpleChat = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledChatHistory
        style={props.historyActionsStyle}
        label={props.label}
        messages={props.messages}
        actions={props.actions}
        message_actions={props.message_actions}
        code_actions={props.code_actions}
      />

      <StyledPromptContainer
        label="Ask me anything about the room you want to make!"
        actions={{}}
      >
        <StyledPrompt
          value={props.prompt}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.sendPrompt();
            }
          }}
          onChange={(value) => {
            props.setPrompt(value);
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
