import { onMount } from 'solid-js'
import { styled } from 'solid-styled-components';
import { useParams } from "@solidjs/router";
import html2canvas from 'html2canvas';

import { SidebarContainer } from '@components/SidebarContainer';
import { RoomInputs } from './components/RoomInputs';
import { RoomList } from './components/RoomList';
import { RoomOutput } from './components/RoomOutput';
import { Chat } from './components/Chat';

import { store, createNewRoom } from '@store/roomsStore';

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

const StyledRoomInputs = styled(RoomInputs)`
  padding-top: 1rem;
  overflow-y: scroll;
  flex: 0 1 auto;
`;

const StyledChat = styled(Chat)`
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
      sidebar={<RoomList />}
      animateSnippy={store.isAnyRoomWaiting()}
    >
      <StyledContainer>
        <StyledInputsContainer>
          <StyledRoomInputs />
          <StyledChat />
        </StyledInputsContainer>
        <StyledRoomOutput
          mouseState={store.roomListMouseState()}
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
