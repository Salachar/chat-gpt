import { styled } from 'solid-styled-components';

import { ActionsContainer } from '@components/Actions';
import { ChatHistory } from './ChatHistory';
import { TextArea } from '@inputs';

export const SimpleChat = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledChatHistory
        style={props.historyStyle}
        label={props.historyLabel}
        messages={props.messages}
        actions={props.historyActions}
        messageActions={props.messageActions}
        codeActions={props.codeActions}
      />

      <StyledPromptContainer
        label={props.promptLabel}
        actions={props.promptActions}
      >
        <StyledPrompt
          value={props.prompt}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.sendPrompt(e);
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
