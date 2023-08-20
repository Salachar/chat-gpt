import { onMount } from 'solid-js'
import { styled } from 'solid-styled-components';
import { useParams } from "@solidjs/router";
import html2canvas from 'html2canvas';
import { store, createNewRoom } from '@store/roomsStore';
import { SidebarContainer } from '../../components/SidebarContainer';
import { RoomInputs, RoomList, RoomOutput } from './sections';
import { Chat } from './sections/Chat';

const StyledContainer = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
  grid-template-columns: 32rem 1fr;
  grid-template-rows: 1fr 23rem;
  grid-template-areas:
    "roominputs roomoutput"
    "chat roomoutput";
`;

const StyledRoomInputs = styled(RoomInputs)`
  position: relative;
  grid-area: roominputs;
  padding: 1rem 0 0 1rem;
  overflow-y: scroll;
`;

const StyledRoomList = styled(RoomList)`
  grid-area: roomlist;
`;

const StyledChat = styled(Chat)`
  position: relative;
  grid-area: chat;
  font-size: 0.65rem !important;
  margin: 1rem 0;
  overflow: hidden;
`;

const StyledRoomOutput = styled(RoomOutput)`
  position: relative;
  grid-area: roomoutput;
  margin: 1rem;
  overflow-y: scroll;
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
      sidebar={<StyledRoomList />}
      animateSnippy={store.isAnyRoomWaiting()}
    >
      <StyledContainer>
        <StyledRoomInputs />
        <StyledChat />
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
