import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';

const ROOM_SCHEMA = {
  id: null,
  data: {
    name: "New Room",
  },
  messages: [],
  images: [],
};

export const createNewRoom = () => {
  const new_room = copy(ROOM_SCHEMA);
  new_room.id = uuid();
  return new_room;
}

export const createRoomsStore = () => {
  // Main chat page messages holder
  const [messages, setMessages] = createSignal([]);

  const addMessage = (message) => {
    setMessages(oldMessages => [...oldMessages, message]);
  };

  // Mostly Room related shit
  const [isInitingRoom, setIsInitingRoom] = createSignal(false);
  const [isGeneratingRoom, setIsGeneratingRoom] = createSignal(false);
  const [isGeneratingImages, setIsGeneratingImages] = createSignal(false);

  // A third signal that watches both.
  const [isGenerating, setIsGenerating] = createSignal(false);

  // An effect that updates the third signal based on the values of the other two signals.
  createEffect(() => {
    setIsGenerating(isGeneratingRoom() || isGeneratingImages() || isInitingRoom());
  });

  const [currentRoomId, setCurrentRoomId] = createSignal(null);
  const [rooms, setRooms] = createStore([]);

  const getRoom = () => {
    const room = rooms.find(room => room.id === currentRoomId());
    return room || {
      id: null,
      data: {},
      messages: [],
      images: [],
    };
  };

  const setRoom = (field, data) => {
    setRooms(room => room.id === currentRoomId(), field, data);
  };

  // Return the store with states and getters/setters
  return {
    isInitingRoom,
    setIsInitingRoom,

    messages,
    setMessages,
    addMessage,

    isGeneratingRoom,
    setIsGeneratingRoom,
    isGeneratingImages,
    setIsGeneratingImages,
    isGenerating,

    setCurrentRoomId,
    rooms,
    setRooms,
    getRoom,
    setRoom,
  };
}

export const store = createRoomsStore();
