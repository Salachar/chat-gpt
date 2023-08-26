import { styled } from 'solid-styled-components';

import { ActionsContainer } from '@components/Actions';
import { ImageLoader } from '@components/loaders/Image';
import {
  Name,
  Keywords,
  FlavorText,
  ImageGallery,
  Items,
} from '@components/generation-outputs';

import { store } from './store';

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
  const room = () => {
    return store.getRoom();
  }

  const data = () => {
    return room()?.data || {};
  }

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
        "image": {
          title: "Generate Images",
          disabled: !data().image_prompt,
          handler: () => {
            props.onGenerateImage(room());
          }
        },
        "floppy": {
          title: "Save Room",
          disabled: !data().flavor_text,
          handler: () => {
            props.onExport(room());
          },
        },
      }}
    >
      {Object.keys(room()).length && (
        <StyledRoomDataContainer id="generated_room_output">
          <Name name={data().name} />
          <Keywords keywords={data().keywords} />
          <StyledImageLoaderContainer show={room().isGeneratingImages}>
            <ImageLoader />
          </StyledImageLoaderContainer>
          {!room().isGeneratingImages && (
            <ImageGallery images={room().images} />
          )}
          <FlavorText flavor_text={data().flavor_text} />
          <Items label="Trinkets" items={data().trinkets} />
          <Items label="Traps" items={data().traps} />
          <Items label="Puzzles" items={data().puzzles} />
        </StyledRoomDataContainer>
      )}
    </ActionsContainer>
  );
};
