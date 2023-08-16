import { onMount, onCleanup } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

import { ChatList } from './components/ChatList';
import { ChatActions } from './components/ChatActions';
import { ChatDisplay } from './components/ChatDisplay';
import { ChatSnippet } from './components/ChatSnippet';

const ABOUT_SNIPPET = `
 getActions () {
    return [{
      event: 'your-custom-action',
      label: 'Your Custom Action Label',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES, // You'll probably always want to keep these
          "One of your custom rules here for the system",
        ]).addMessages(chatId, "user", [
          "The "user's prompt" to trigger the generation",
        ], snippet).sendChat(chatId, event);
      }
    }];
  }
`;

export const Chat = () => {
  const onChatEvent = (event, data = {}) => {
    const { chatId, chat, message } = data;
    console.log(chat);
    store.setChatWaiting({
      id: chatId,
      waiting: false
    });
    window.last_message = message;
    store.addChatMessage({
      id: chatId,
      message: message
    });
    // If there are no tokens left, put a message in the chat
    if (message.token_data.tokens_left <= 0) {
      store.addChatMessage({
        id: chatId,
        message: {
          role: "error",
          content: "No tokens left, please clear the chat.",
        }
      });
    }
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

  const onAbout = (event, data) => {
    store.addChatMessages({
      messages: [{
        role: "assistant",
        content: [{
          type: "text",
          lines: [{
            type: "text",
            pieces: [{
              type: "text",
              piece: "I can help you with creating your own actions. This will allow you to create buttons like those on the righthand side.",
            }],
          }, {
            type: "text",
            pieces: [{
              type: "text",
              piece: "The snippet below represents an example action you can create.",
            }],
          }],
        }, {
          type: "code",
          language: "src/main/chat_managers/main.js",
          code_snippet: ABOUT_SNIPPET,
        }]
      }],
    });
  };

  onMount(() => {
    // Only add a chat if there are no chats
    if (store.chats.length === 0) store.addChat();
    if (store.noAPIKey()) onNoAPIKey();

    IPC.on('chat', onChatEvent);
    IPC.on('error', onErrorMessage);
    IPC.on('about', onAbout);
  });

  onCleanup(() => {
    IPC.removeListener('chat', onChatEvent);
    IPC.removeListener('error', onErrorMessage);
    IPC.removeListener('about', onAbout);
  });

  return (
    <StyledContainer>
      <StyledChatList />
      <StyledChatDisplay />
      <StyledChatSnippet />
      <StyledChatActions />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 12rem 1fr 0.75fr 11rem;
  grid-template-rows: 1fr;
  grid-template-areas: "chatlist chatdisplay chatsnippet chatactions";
`;

const StyledChatList = styled(ChatList)`
  grid-area: chatlist;
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
