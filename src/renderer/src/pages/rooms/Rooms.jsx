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

import { copyToClipboard } from '@utils';

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
  flex: 1 0;
`;

export const Rooms = () => {
  const params = useParams();

  const createRoomAndUpdateState = () => {
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

  onMount(() => {
    const id = params.id || store.getRoom().id;
    if (id) {
      console.log(`Setting room ID on mount: ${id}`)
      store.setCurrentRoomId(id);
    } else {
      createRoomAndUpdateState();
    }
  });

  return (
    <SidebarContainer
      sidebar={<SidebarList
        items={store.rooms}
        selectedId={store.getRoom().id}
        onAdd={() => {
          createRoomAndUpdateState();
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
            messages={store.getRoom().messages}
            prompt={store.getRoom().prompt}
            setPrompt={(value) => {
              store.setRoom("prompt", value);
            }}
            sendPrompt={(e) => {
              RoomsIPCEvents.sendPrompt({
                from: "chat",
              });
            }}
            historyLabel="Clear the chat to reset tokens"
            historyStyle={{
              "font-size": "1.25rem",
            }}
            historyActions={{
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
            promptLabel="Ask me anything about the room you want to make!"
            promptActions={{}}
            messageActions={{
              "files": {
                title: "Copy to Clipboard",
                handler: (message) => {
                  copyToClipboard(message.original_content);
                }
              },
            }}
            codeActions={{
              "files": {
                title: "Copy to Clipboard",
                handler: (message) => {
                  copyToClipboard(message.code_snippet);
                },
              },
            }}
          />
        </StyledInputsContainer>

        <StyledRoomOutput
          onGenerateImage={(room) => {
            const image_prompt = room?.image_prompt
            if (!image_prompt || store.getRoom().waiting) return;
            store.setRoom("isGeneratingImages", true, { id: room.id });
            store.addMessage({
              id: room.id,
              message: {
                role: "generator",
                content: `Generating image with prompt: ${image_prompt}`,
              }
            });
            IPC.send('image-create', {
              id: room.id,
              prompt: image_prompt
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
