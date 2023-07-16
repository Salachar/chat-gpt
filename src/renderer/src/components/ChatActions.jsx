import { For } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Button } from './Button';

export const ChatActions = (props) => {
  return (
    <StyledContainer class={props.class}>
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
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
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

// const StyledChatActions = styled.div`
//   grid-area: chatactions;
//   padding: 2rem 1rem 1rem 0;
// `;

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
