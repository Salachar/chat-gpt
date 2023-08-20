import { onMount } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

import { ChatList } from './components/ChatList';
import { ChatActions } from './components/ChatActions';
import { ChatDisplay } from './components/ChatDisplay';
import { ChatSnippet } from './components/ChatSnippet';

import { SidebarContainer } from '../../components/SidebarContainer';

export const Chat = () => {
  const onNoAPIKey = (event, data) => {
    store.addChatMessages({
      messages: [{
        role: "error",
        content: "No API key was found in the .env file.",
      }, {
        role: "assistant",
        content: [{
          type: "text",
          lines: [{
            type: "text",
            pieces: [{
              type: "text",
              piece: "Please add an API key, it is required to use this application.",
            }],
          }, {
            type: "text",
            pieces: [{
              type: "text",
              piece: "You might have to create an `.env` file in the root of the application.",
            }],
          }],
        }, {
          type: "code",
          language: ".env",
          code_snippet: "OPENAI=your-api-key-here",
        }]
      }],
    });
  }

  onMount(() => {
    // Only add a chat if there are no chats
    if (store.chats.length === 0) store.addChat();
    if (store.noAPIKey()) onNoAPIKey();
  });

  return (
    <SidebarContainer
      sidebar={<ChatList />}
      animateSnippy={store.getFirstWaiting()}
    >
      <StyledChat>
        <StyledChatDisplay />
        <StyledChatSnippet />
        <StyledChatActions />
      </StyledChat>
    </SidebarContainer>
  );
}

const StyledChat = styled.div`
  font-size: 0.85rem;
  position: relative;
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 1fr 0.75fr 11rem;
  grid-template-rows: 1fr;
  grid-template-areas: "chatdisplay chatsnippet chatactions";
`;

const StyledChatDisplay = styled(ChatDisplay)`
  grid-area: chatdisplay;
  display: flex;
  flex-direction: column;
`;

const StyledChatSnippet = styled(ChatSnippet)`
  grid-area: chatsnippet;
  padding: 1rem 0 1rem 1rem;
`;

const StyledChatActions = styled(ChatActions)`
  grid-area: chatactions;
  padding: 1rem 1rem 1rem 0;
`;
