import { onMount } from 'solid-js'
import { styled } from 'solid-styled-components';

import { SidebarContainer } from '@components/SidebarContainer';
import { SidebarList } from '@components/SidebarList';
import { ChatActions } from './ChatActions';
import { ChatSnippet } from './ChatSnippet';
import { SimpleChat } from '@components/SimpleChat';

import { store } from './store';
import ChatIPCEvents from "./IPC";

import { copyAction, copyCodeAction } from '@rendererUtils/actions';

import { copyToClipboard } from '@rendererUtils';

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

const StyledChatDisplay = styled(SimpleChat)`
  grid-area: chatdisplay;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  height: 100%;
  overflow: hidden;
`;

const StyledChatSnippet = styled(ChatSnippet)`
  grid-area: chatsnippet;
  padding: 1rem 0 1rem 1rem;
`;

const StyledChatActions = styled(ChatActions)`
  grid-area: chatactions;
  padding: 1rem 1rem 1rem 0;
`;

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
      sidebar={
        <SidebarList
          items={store.chats}
          selectedId={store.currentChatId()}
          onSelect={(id) => {
            store.setCurrentChatId(id);
          }}
          onClose={(id) => {
            store.removeChat(id);
          }}
          onAdd={() => {
            store.addChat();
          }}
        />
      }
      animateSnippy={store.getFirstWaiting()}
    >
      <StyledChat>
        <StyledChatDisplay
          messages={store.getChatMessages()}
          prompt={store.getChatPrompt()}
          setPrompt={(value) => {
            store.setChatPrompt({
              prompt: value,
            });
          }}
          sendPrompt={(e) => {
            ChatIPCEvents.sendPrompt({
              event: e,
              from: "chat",
            });
          }}
          historyLabel={`${store.getChatName()} - ${store.getChatModel()} - Clear the chat to reset tokens`}
          historyActions={[{
            icon: "x",
            title: "Clear chat messages",
            handler: () => {
              store.clearChatMessages();
              store.addChatMessages({
                messages: [{
                  role: "generator",
                  content: "Chat history has been cleared.",
                }]
              });
            },
          }]}
          promptLabel="Attach Notepad by ending prompt with a >"
          promptActions={[
            {
              icon: "files",
              title: "Copy to Clipboard",
              handler: () => {
                copyToClipboard(store.getChatPrompt());
              }
            }, {
              icon: "chevron-r",
              title: "Send prompt with Notepad",
              handler: () => {
                store.setChatWaiting({
                  waiting: true
                });
                store.addChatMessage({
                  message: {
                    role: "user",
                    content: store.getChatPrompt(),
                  }
                });
                IPC.send('chat', {
                  chatId: store.currentChatId(),
                  prompt: store.getChatPrompt(),
                  snippet: store.getChatSnippet(),
                });
                setTimeout(() => {
                  store.setChatPrompt({
                    prompt: ""
                  });
                }, 0);
              },
            }
          ]}
          messageActions={[
            copyAction(),
            {
              icon: "quotation-l",
              title: "Copy to Notepad",
              handler: (message) => {
                store.setChatSnippet({
                  snippet: message.original_content
                });
              }
            }
          ]}
          codeActions={[
            copyCodeAction(),
            {
              icon: "expand",
              title: "Open in new chat",
              handler: (message) => {
                store.addChat({
                  snippet: message.code_snippet,
                  code_language: message.language,
                })
              }
            }, {
              icon: "quotation-l",
              title: "Copy to Notepad",
              handler: (message) => {
                store.setChatSnippet({
                  snippet: message.code_snippet
                });
                store.setChatCodeLanguage({
                  code_language: message.language
                });
              }
            }
          ]}
        />
        <StyledChatSnippet />
        <StyledChatActions />
      </StyledChat>
    </SidebarContainer>
  );
}
