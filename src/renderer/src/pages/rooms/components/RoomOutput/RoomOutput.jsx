import { styled } from 'solid-styled-components';

import { ImageLoader } from '@components/loaders/Image';
import { ImageGallery } from './components/ImageGallery';
import { RoomName } from './components/Name';
import { RoomKeywords } from './components/Keywords';
import { RoomFlavorText } from './components/FlavorText';
import { RoomTrinkets } from './components/Trinkets';
import { RoomTraps } from './components/Traps';
import { RoomPuzzles } from './components/Puzzles';
import { ActionsContainer } from '@components/Actions';

import { store } from '@store/roomsStore';
import { copy } from '@utils';

const StyledImageLoaderContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  height: 0;
  margin: 0 0;
  transition: height 0.2s ease, margin 0.2s ease;

  ${({ show }) => show && `
    overflow: visible;
    height: var(--image-size);
    margin: 3rem 0;
  `}
`;

const StyledRoomDataContainer = styled.div`
  background-color: var(--color-main-dark);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem;
  color: wheat;
`;

export const RoomOutput = (props) => {
  const room = () => store.getRoom();

  return (
    <ActionsContainer
      class={props.class}
      label="Room Output"
      style={{
        "font-size": "1.5rem",
      }}
      contentStyle={{
        "background-color": "var(--color-main-dark)",
        "border-bottom-left-radius": "0.5rem",
        "border-bottom-right-radius": "0.5rem",
      }}
      actions={{
        "recycle": {
          title: "Generate Room",
          disabled: room()?.waiting,
          handler: () => {
            if (room()?.waiting) return;
            store.setRoom("waiting", true);
            store.addMessage({
              message: {
                role: "generator",
                content: 'Generating room...',
              }
            });
            const input_data = copy(store.getRoom().input_data);
            IPC.send('room-request', {
              id: store.getRoom().id,
              input_data,
            });
          },
        },
        "image": {
          title: "Generate Images",
          disabled: !room()?.data?.image_prompt,
          handler: () => {
            props.onGenerateImage(room());
          }
        },
        "floppy": {
          title: "Save Room",
          disabled: !room()?.data?.flavor_text,
          handler: () => {
            props.onExport(room());
          },
        },
      }}
    >
      {Object.keys(room().data).length && (
        <StyledRoomDataContainer id="generated_room_output">
          <RoomName room={room()} />
          <RoomKeywords room={room()} />
          <StyledImageLoaderContainer show={room()?.isGeneratingImages}>
            <ImageLoader />
          </StyledImageLoaderContainer>
          {!room()?.isGeneratingImages && (
            <ImageGallery images={room().images} />
          )}
          <RoomFlavorText room={room()} />
          <RoomTrinkets room={room()} />
          <RoomTraps room={room()} />
          <RoomPuzzles room={room()} />
        </StyledRoomDataContainer>
      )}
    </ActionsContainer>
  );
};
