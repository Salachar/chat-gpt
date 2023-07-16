import { onMount, onCleanup } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

import {
  ChatList,
  ChatActions,
  MainChat,
  CodeSection,
} from '@components';

export const Chat = () => {
  const onLoadEvent = (event, events = []) => {
    if (!Array.isArray(events)) events = [];
    store.setEvents(events);
  };

  const onChatEvent = (event, data = {}) => {
    const { chatId, message } = data;
    store.setChatWaiting({
      id: chatId,
      waiting: false
    });
    window.last_message = message;
    store.addChatMessage({
      id: chatId,
      message: message
    });
    store.setChatTokenData({
      id: chatId,
      token_data: message.token_data
    });
  };

  const onErrorMessage = (event, data) => {
    const { chatId, error } = data;
    store.setChatWaiting({
      id: chatId,
      waiting: false
    });
    store.addChatMessages({
      messages: [{
        role: "generator",
        content: "An error occurred.",
      }, {
        role: "error",
        content: error,
      }],
    });
  };

  onMount(() => {
    store.addChat();
    IPC.on('onload', onLoadEvent);
    IPC.on('chat', onChatEvent);
    IPC.on('error', onErrorMessage);
    IPC.send('onload');
  });

  onCleanup(() => {
    IPC.removeListener('onload', onLoadEvent);
    IPC.removeListener('chat', onChatEvent);
    IPC.removeListener('error', onErrorMessage);
  });

  return (
    <StyledContainer>
      <StyledChatList />
      <StyledMainChat />
      <StyledCodeSection />
      <StyledChatActions />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  background-color: var(--color-blue);
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 12rem 1fr 0.9fr 11rem;
  grid-template-rows: 1fr;
  grid-template-areas: "tabs chatdisplay codesection chatactions";
`;

const StyledChatList = styled(ChatList)`
  grid-area: tabs;
  border-right: 1rem solid var(--color-light-blue);
`;

const StyledMainChat = styled(MainChat)`
  grid-area: chatdisplay;
  display: flex;
  flex-direction: column;
`;

const StyledCodeSection = styled(CodeSection)`
  grid-area: codesection;
  padding: 1rem 0 1rem 1rem;
`;

const StyledChatActions = styled(ChatActions)`
  grid-area: chatactions;
  padding: 2rem 1rem 1rem 0;
`;
