import { For, Show } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';
import { Button } from '../../../components/Button';

export const ChatActions = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledModelDropdownWrapper>
        <StyledModelDropdown
          onChange={(e) => {
            store.setChatModel({
              model: e.currentTarget.value
            });
          }}
        >
          <For each={store.models()}>
            {(model) => (
              <StyledModelDropdownOption
                value={model}
                selected={model === store.getDropdownModel()}
              >
                {model}
              </StyledModelDropdownOption>
            )}
          </For>
        </StyledModelDropdown>
      </StyledModelDropdownWrapper>

      <StyledTokenData>
        <StyledTokenPiece>Completion: {JSON.stringify(store.getChatTokenData().completion_tokens)}</StyledTokenPiece>
        <StyledTokenPiece>Prompt: {JSON.stringify(store.getChatTokenData().prompt_tokens)}</StyledTokenPiece>
        <StyledTokenPiece>Remaining: {JSON.stringify(store.getChatTokenData().tokens_left)}</StyledTokenPiece>
        <StyledTokenPiece>Total: {JSON.stringify(store.getChatTokenData().total_tokens)}</StyledTokenPiece>
      </StyledTokenData>

      <For each={store.events()}>
        {(action) => (
          <Show when={!action.disabled}>
            <StyledButtonWrapper>
              <StyledButton
                disabled={store.getChatWaiting()}
                nonrefresh={action.non_refresh}
                label={action.label}
                toUpperCase={true}
                onClick={() => {
                  if (!action.non_waiting) {
                    if (store.getChatWaiting()) return;
                  }
                  if (!action.non_action) {
                    store.addChatMessage({
                      message: {
                        role: "generator",
                        content: `Running ${action.label}...`,
                      }
                    });
                    store.checkChatName({
                      action_name: action.label
                    });
                  }
                  if (!action.non_waiting) {
                    store.setChatWaiting({
                      waiting: true
                    });
                  }
                  IPC.send(action.event, {
                    chatId: store.currentChatId(),
                    snippet: store.getChatSnippet(),
                  });
                }}
              />
              {!action.non_refresh && (
                <StyledRefreshButton
                  title="Clear messages and run action"
                  disabled={store.getChatWaiting()}
                  onClick={() => {
                    if (!action.non_waiting) {
                      if (store.getChatWaiting()) return;
                    }
                    if (!action.non_action) {
                      store.clearChatMessages();
                      store.addChatMessages({
                        messages: [{
                          role: "generator",
                          content: "Chat history has been cleared.",
                        }, {
                          role: "generator",
                          content: `Running ${action.label}...`,
                        }]
                      });
                      store.checkChatName({
                        action_name: action.label
                      });
                    }
                    if (!action.non_waiting) {
                      store.setChatWaiting({
                        waiting: true
                      });
                    }
                    IPC.send(action.event, {
                      chatId: store.currentChatId(),
                      snippet: store.getChatSnippet(),
                    });
                  }}
                >
                  <StyledRefreshIcon class="icss-synchronize" />
                </StyledRefreshButton>
              )}
            </StyledButtonWrapper>
          </Show>
        )}
      </For>
    </StyledContainer>
  );
}

const StyledModelDropdownWrapper = styled.div`
  width: 100%;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

// Model dropdown
const StyledModelDropdown = styled.select`
  width: 100%;
  text-overflow: ellipsis;
  padding: 0.35rem;
  border-radius: 0.25rem;
  background-color: var(--color-main-light);
  color: white;
  outline: none;
  cursor: pointer;
  border: none;
`;

const StyledModelDropdownOption = styled.option`

`;

const StyledContainer = styled.div`
  position: relative;
`;

const StyledButtonWrapper = styled.div`
  height: 2rem;
  display: flex;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const StyledButton = styled(Button)`
  height: 2rem;
  font-size: 0.75rem;
  padding-right: 0.25rem;

  ${({ nonrefresh }) => nonrefresh && `
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  `}
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

const StyledTokenData = styled.div`
  padding: 0 0 2rem 1rem;
`;

const StyledTokenPiece = styled.div`
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;
