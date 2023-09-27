import { For, Show } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from './store';
import { Button } from '@inputs';

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
              <option
                value={model}
                selected={model === store.getDropdownModel()}
              >
                {model}
              </option>
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

      <StyledButtonsWrapper>
        <For each={store.events()}>
          {(action) => (
            <Show when={!action.disabled}>
              <StyledButton
                disabled={store.getChatWaiting()}
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
            </Show>
          )}
        </For>
      </StyledButtonsWrapper>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  grid-area: chatactions;
  padding: 1rem 0;
`;

const StyledModelDropdownWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

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

const StyledButtonsWrapper = styled.div`
  padding-right: 1rem;
`;

const StyledButton = styled(Button)`
  height: 2rem;
  font-size: 0.75rem;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
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
