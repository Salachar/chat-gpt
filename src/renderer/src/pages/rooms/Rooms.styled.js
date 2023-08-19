import { styled } from 'solid-styled-components';
import { RoomInputs, RoomList, RoomOutput } from './sections';
import { Chat } from "@components/chat";
import { Button } from '@inputs';

export const StyledContainer = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-main-dark);
  grid-template-columns: 32rem 1fr;
  grid-template-rows: 1fr 23rem;
  grid-template-areas:
    "roominputs roomoutput"
    "chat roomoutput";
`;

export const StyledRoomInputs = styled(RoomInputs)`
  position: relative;
  grid-area: roominputs;
  padding: 1rem 1rem 0 1rem;
  overflow-y: scroll;
`;

export const StyledRoomList = styled(RoomList)`
  grid-area: roomlist;
`;

export const StyledActions = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

export const StyledActionButton = styled(Button)`
  background-color: var(--color-orange-spice);
  color: var(--color-blue);
  font-weight: bold;
  height: 100%;
  border: 0;
  border-radius: 0.5rem;
  text-transform: uppercase;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  &:not(:first-child) {
    margin-left: 1rem;
  }

  ${({ disabled }) => disabled && `
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

export const StyledChat = styled(Chat)`
  position: relative;
  grid-area: chat;
  /* margin: 1rem 1rem 0 0; */
  margin: 1rem 0 0 0;
  /* border-top-right-radius: 1rem; */
  font-size: 0.65rem !important;
  padding-right: 0 !important;
`;

export const StyledRoomOutput = styled(RoomOutput)`
  position: relative;
  grid-area: roomoutput;
  margin: 1rem 0 0 0;
  border-top-left-radius: 1rem;
  border-top: 1rem solid var(--color-blue);
  border-left: 1rem solid var(--color-blue);
  overflow-y: scroll;
  transition: all 0.2s ease;
`;
