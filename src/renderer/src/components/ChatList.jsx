import { For } from 'solid-js'
import { styled, keyframes } from 'solid-styled-components';
import { store } from '@store';

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: unset;
  align-items: end;
  background-color: var(--color-dark-blue-70);
  padding: 1rem 0 0 1rem;
`;

const StyledChat = styled.div`
  position: relative;
  padding: 0.5rem;
  color: white;
  font-weight: bold;
  background-color: var(--color-blue);
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  ${({ isCurrent }) => isCurrent && `
    background-color: var(--color-light-blue);
  `}

  ${({ isWaiting }) => isWaiting && `
    background-color: var(--color-orange-spice);
  `}
`;

const StyledAddButton = styled.div`
  position: relative;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
  background-color: var(--color-blue);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  &:after, &:before {
    content: "";
    position: absolute;
    background-color: var(--color-orange-spice);
    border-radius: 0.2rem;
  }

  &:before {
    height: 0.4rem;
    left: 0.5rem;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    width: 0.4rem;
    top: 0.5rem;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const ChatList = (props) => {
  return (
    <StyledContainer class={props.class}>
      <For each={store.chats}>
        {(chat) => {
          return (
            <StyledChat
              isCurrent={store.currentChatId() === chat.id}
              isWaiting={chat.waiting}
              onClick={() => {
                store.setCurrentChatId(chat.id);
              }}
            >
              {chat.name}
            </StyledChat>
          );
        }}
      </For>
      <StyledAddButton
        onClick={() => {
          store.addChat();
        }}
      />
    </StyledContainer>
  );
}
