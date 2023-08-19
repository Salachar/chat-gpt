import { styled } from 'solid-styled-components';

import { DieLoader } from '@components/loaders/Die';
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

const StyledContainer = styled(ActionsContainer)`
  position: relative;
  background-color: var(--color-dark-blue-70);
  color: white;
`;

const StyledLoaderContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  height: 0;
  margin-top: 0;
  transition: height 0.2s ease, margin-top 0.2s ease;

  ${({ show }) => show && `
    overflow: visible;
    height: var(--die-size);
    margin-top: var(--die-size);
  `}
`;

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

const StyledIcon = styled.i`
  cursor: pointer;
  font-size: 32px;
  position: absolute !important;
  top: 1rem;
  z-index: 10;
  color: var(--color-orange-spice);

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  ${({ disabled }) => disabled && `
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const StyledRoomDataContainer = styled.div`
  background-color: var(--color-dark-blue-70);
`;

const StyledExportContainer = styled.div`
  background-color: var(--color-dark-blue-70);
  padding: 1rem;
`;

export const RoomOutput = (props) => {
  const room = () => store.getRoom();

  return (
    <StyledContainer
      class={props.class}
      label="Room Output"
      actions={{
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
        }
      }}
    >
      <StyledLoaderContainer show={store.isGeneratingRoom()}>
        <DieLoader />
      </StyledLoaderContainer>

      {(!store.isGeneratingRoom() && Object.keys(room().data).length) && (
        <StyledRoomDataContainer>
          {/* <StyledIcon
            class={`icss-image`}
            disabled={!room()?.data?.image_prompt}
            style={{ right: '4rem' }}
            onClick={() => {
              props.onGenerateImage(room());
            }}
          />
          <StyledIcon
            class={`icss-floppy`}
            disabled={!room()?.data?.flavor_text}
            style={{ right: '1rem' }}
            onClick={() => {
              props.onExport(room());
            }}
          /> */}

          <StyledExportContainer id="generated_room_output">
            <RoomName room={room()} />
            <RoomKeywords room={room()} />
            <StyledImageLoaderContainer show={store.isGeneratingImages()}>
              <ImageLoader />
            </StyledImageLoaderContainer>
            {!store.isGeneratingImages() && (
              <ImageGallery images={room().images} />
            )}
            <RoomFlavorText room={room()} />
            <RoomTrinkets room={room()} />
            <RoomTraps room={room()} />
            <RoomPuzzles room={room()} />
          </StyledExportContainer>
        </StyledRoomDataContainer>
      )}
    </StyledContainer>
  );
};
