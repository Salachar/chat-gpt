import { createSignal, onMount, onCleanup } from 'solid-js'
import { useParams } from "@solidjs/router";
import html2canvas from 'html2canvas';
import { store, createNewRoom } from '@store/roomsStore';
import { SidebarContainer } from '../../components/SidebarContainer';

import {
  StyledContainer,
  StyledRoomInputs,
  StyledRoomList,
  StyledChat,
  StyledActions,
  StyledActionButton,
  StyledRoomOutput,
} from './Rooms.styled';

export const Rooms = () => {
  const params = useParams();

  // The volatile inputs data, don't care if not saved between pages
  const [getRoomInputsData, setRoomInputsData] = createSignal({});

  const addMessages = (messages = []) => {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    store.setRoom("messages", [
      ...store.getRoom().messages,
      ...messages,
    ]);
  };

  // const onRoomEvent = (event, message = {}) => {
  //   store.setIsGeneratingRoom(false);
  //   if (message.room) {
  //     store.setRoom("data", message.room);
  //   }
  //   addMessages(message);
  // };

  const onRoomEvent = (event, room_json) => {
    console.log("Room event: ", room_json);
    console.log(JSON.stringify(room_json, null, 2));
    store.setIsGeneratingRoom(false);
    if (room_json) {
      store.setRoom("data", room_json);
    }
  };

  const onRoomInitEvent = (event) => {
    setTimeout(() => {
      store.setIsInitingRoom(false);
    }, 500);
  };

  const onImageCreateEvent = (event, images) => {
    store.setIsGeneratingImages(false);
    store.setRoom("images", images);
  };

  onMount(() => {
    IPC.on('room', onRoomEvent);
    IPC.on('room-init', onRoomInitEvent);
    IPC.on('image-created', onImageCreateEvent);

    const id = params.id || store.getRoom().id;
    if (id) {
      console.log(`Setting room ID on mount: ${id}`)
      store.setCurrentRoomId(id);
    } else {
      store.setIsInitingRoom(true);
      console.log('stuff')
      const new_room = createNewRoom();
      store.setCurrentRoomId(new_room.id);
      store.setRooms([
        ...store.rooms,
        new_room,
      ]);
      console.log(new_room)
      IPC.send('room-init', {
        id: new_room.id,
      });
    }
  });

  onCleanup(() => {
    IPC.removeListener('room', onRoomEvent);
    IPC.removeListener('room-init', onRoomInitEvent);
    IPC.removeListener('image-created', onImageCreateEvent);
  });

  return (
    <SidebarContainer sidebar={
      <StyledRoomList
        onAddNewRoom={() => {
          if (store.isGenerating()) return;
          store.setIsInitingRoom(true);
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
      />
    }>
      <StyledContainer>
        <StyledRoomInputs
          onUpdate={(room_data) => {
            setRoomInputsData(room_data);
          }}
        />
        <StyledChat
          omitCode={true}
          messages={store.getRoom().messages}
          onEnter={(prompt) => {
            if (store.isInitingRoom()) {
              return addMessages([{
                role: "assistant",
                content: "Please wait until I'm ready.",
              }]);
            }
            if (store.isGeneratingRoom()) {
              return addMessages([{
                role: "generator",
                content: prompt,
              }, {
                role: "assistant",
                content: "Please give me a moment to generate your room.",
              }]);
            }
            addMessages({
              role: "user",
              content: prompt,
            })
            IPC.send('room-chat', {
              id: store.getRoom().id,
              prompt,
            });
          }}
        >
          <StyledActions>
            <StyledActionButton
              label="Generate"
              disabled={store.isGenerating()}
              onClick={() => {
                if (store.isGenerating()) return;
                store.setIsGeneratingRoom(true);
                addMessages({
                  role: "generator",
                  content: 'Generating room...',
                })
                IPC.send('room-request', {
                  id: store.getRoom().id,
                  input_data: getRoomInputsData(),
                });
              }}
            />
          </StyledActions>
        </StyledChat>
        <StyledRoomOutput
          mouseState={store.roomListMouseState()}
          onGenerateImage={(room) => {
            const image_prompt = room?.data?.image_prompt;
            if (!image_prompt || store.isGenerating()) return;
            store.setIsGeneratingImages(true);
            const style = "Surrealism handrawn high fantasy illustration style.";
            const full_prompt = `${style} ${image_prompt}`;
            addMessages({
              role: "generator",
              content: `Generating image with prompt: ${full_prompt}`,
            })
            IPC.send('image-create', full_prompt);
          }}
          onExport={(room) => {
            if (store.isGenerating() || !room?.data?.flavor_text) return;
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
