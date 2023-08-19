import { For } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store/roomsStore';
import { Button } from '@components/Button';

export const RoomList = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledRooms>
        <For each={store.rooms}>
          {(room) => {
            return (
              <StyledRoom
                label={room?.data?.name}
                isCurrent={store.getRoom().id === room.id}
                disabled={store.isGenerating()}
                onClick={() => {
                  if (props.isGeneratingRoom) return;
                  store.setCurrentRoomId(room.id);
                }}
              />
            );
          }}
        </For>
        <StyledAddButton
          disabled={store.isGenerating()}
          onClick={props.onAddNewRoom}
        />
      </StyledRooms>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  background-color: var(--color-main-dark);
`;

const StyledRooms = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: unset;
  align-items: end;
  padding: 0rem 0 0 1rem;
  width: 100%;
`;

const StyledRoom = styled(Button)`
  position: relative;
  padding: 0.5rem;
  color: white;
  font-weight: bold;
  /* background-color: var(--color-main); */
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s ease;

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

  background-color: var(--color-main);
  ${({ isCurrent }) => isCurrent && `
    background-color: var(--color-main-light);
  `}
  ${({ isWaiting }) => isWaiting && `
    background-color: var(--color-orange-spice);
  `}
`;

const StyledAddButton = styled.div`
  position: relative;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
  background-color: var(--color-blue);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  transition: all 0.2s ease;

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

  &:after, &:before {
    content: "";
    position: absolute;
    background-color: var(--color-orange-spice);
    border-radius: 0.2rem;
  }

  &:before {
    height: 0.4rem;
    left: 0.5rem;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    width: 0.4rem;
    top: 0.5rem;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;
