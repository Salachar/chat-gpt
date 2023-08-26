import { onMount } from 'solid-js'
import { styled } from 'solid-styled-components';
import { useParams } from "@solidjs/router";
import html2canvas from 'html2canvas';

import { SidebarContainer } from '@components/SidebarContainer';
import { GenerationInput } from '@components/GenerationInput';
import { SidebarList } from '@components/SidebarList';
import { RoomOutput } from './RoomOutput';
import { SimpleChat } from '@components/SimpleChat';

import { store, createNewRoom } from './store';
import { schema } from './schema';
import RoomsIPCEvents from "./IPC";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const StyledInputsContainer = styled.div`
  display: flex;
  width: 32rem;
  flex-direction: column;
`;

const StyledRoomInputs = styled(GenerationInput)`
  padding-top: 1rem;
  overflow-y: scroll;
  flex: 0 1 auto;
`;

const StyledChat = styled(SimpleChat)`
  font-size: 0.65rem !important;
  margin-bottom: 1rem;
  overflow: hidden;
  flex: 1 0 28rem;
`;

const StyledRoomOutput = styled(RoomOutput)`
  margin: 1rem;
  overflow-y: scroll;
  flex-grow: 1;
`;

export const Rooms = () => {
  const params = useParams();

  onMount(() => {
    const id = params.id || store.getRoom().id;
    if (id) {
      console.log(`Setting room ID on mount: ${id}`)
      store.setCurrentRoomId(id);
    } else {
      const new_room = createNewRoom();
      store.setCurrentRoomId(new_room.id);
      store.setRooms([
        ...store.rooms,
        new_room,
      ]);
      IPC.send('room-init', {
        id: new_room.id,
      });
    }
  });

  return (
    <SidebarContainer
      sidebar={<SidebarList
        items={store.rooms}
        selectedId={store.getRoom().id}
        onAdd={() => {
          const new_room = createNewRoom();
          store.setCurrentRoomId(new_room.id);
          store.setRooms([
            ...store.rooms,
            new_room,
          ]);
          IPC.send('room-init', {
            id: new_room.id,
          });
        }}
        onSelect={(id) => {
          store.setCurrentRoomId(id);
        }}
        onClose={(id) => {
          store.removeRoom(id);
        }}
      />}
      animateSnippy={store.isAnyRoomWaiting()}
    >
      <StyledContainer>
        <StyledInputsContainer>
          <StyledRoomInputs schema={schema} />
          <StyledChat
            prompt={store.getRoom().prompt}
            setPrompt={(value) => {
              store.setRoom("prompt", value);
            }}
            sendPrompt={() => {
              RoomsIPCEvents.sendPrompt({
                from: "chat",
              });
            }}
            label="Clear the chat to reset tokens"
            historyActionsStyle={{
              "font-size": "1.25rem",
            }}
            messages={store.getRoom().messages}
            actions={{
              "recycle": {
                title: "Generate Room",
                disabled: store.getRoom()?.waiting,
                handler: () => {
                  RoomsIPCEvents.sendPrompt({
                    from: "generate"
                  });
                },
              }
            }}
            message_actions={{
              "files": {
                title: "Copy to Clipboard",
                handler: () => {
                  navigator.clipboard.readText().then((clipText) => {
                    // If item is already in clipboard, copy it to the prompt
                    if (clipText === props.message.original_content) {
                      store.setChatPrompt({
                        prompt: props.message.original_content,
                      });
                    }
                  }).catch(err => {
                    console.error("Failed to read clipboard contents: ", err);
                  });
                  navigator.clipboard.writeText(props.message.original_content);
                }
              },
              "quotation-l": {
                title: "Copy to Notepad",
                handler: () => {
                  store.setChatSnippet({
                    snippet: props.message.original_content
                  });
                }
              }
            }}
            code_actions={{
              "files": {
                title: "Copy to Clipboard",
                handler: () => {
                  navigator.clipboard.readText().then((clipText) => {
                    // If item is already in clipboard, copy it to the prompt
                    if (clipText === sub_message.code_snippet) {
                      store.setChatPrompt({
                        prompt: sub_message.code_snippet,
                      });
                    }
                  }).catch(err => {
                    console.error("Failed to read clipboard contents: ", err);
                  });
                  navigator.clipboard.writeText(sub_message.code_snippet);
                },
              },
              "expand": {
                title: "Open in new chat",
                handler: () => {
                  store.addChat({
                    snippet: sub_message.code_snippet,
                    code_language: sub_message.language,
                  })
                }
              },
              "quotation-l": {
                title: "Copy to Notepad",
                handler: () => {
                  store.setChatSnippet({
                    snippet: sub_message.code_snippet
                  });
                  store.setChatCodeLanguage({
                    code_language: sub_message.language
                  });
                }
              }
            }}
          />
        </StyledInputsContainer>

        <StyledRoomOutput
          onGenerateImage={(room) => {
            const image_prompt = room?.data?.image_prompt;
            if (!image_prompt || store.getRoom().waiting) return;
            store.setRoom("isGeneratingImages", true, { id: room.id });
            const style = "Surrealism handrawn high fantasy illustration style.";
            const full_prompt = `${style} ${image_prompt}`;
            store.addMessage({
              id: room.id,
              message: {
                role: "generator",
                content: `Generating image with prompt: ${full_prompt}`,
              }
            });
            IPC.send('image-create', {
              id: room.id,
              prompt: full_prompt
            });
          }}
          onExport={(room) => {
            if (store.getRoom().waiting || !room?.data?.flavor_text) return;
            html2canvas(document.getElementById('generated_room_output'), {
              allowTaint: true,
            }).then((canvas) => {
              if (!room?.data?.name) {
                console.log("No name for map with data: ", room);
                return;
              }
              // Convert our canvas to a data URL
              let canvasUrl = canvas.toDataURL();
              // Create an anchor, and set the href value to our data URL
              const createEl = document.createElement('a');
              createEl.href = canvasUrl;
              // This is the name of our downloaded file
              createEl.download = room.data.name;
              // Click the download button, causing a download, and then remove it
              createEl.click();
              createEl.remove();
            });
          }}
        />
      </StyledContainer>
    </SidebarContainer>
  );
}
