import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';
import MessageParser from '../../../utils/message-parser';

const ROOM_SCHEMA = {
  id: null,
  model: "gpt-3.5-turbo-16k",
  data: {
    name: "New Room",
  },
  // Room state
  waiting: true, // true until room is ready
  isGeneratingImages: false,
  // Images
  images: [],
  // Room input data
  input_data: {},
  // Chat data
  messages: [],
  prompt: "",
};

const makeInputAIReadable = (key, value) => {
  const readable = `"${key}" value is: ${value}.`;
  return readable;
};

export const createNewRoom = () => {
  const new_room = copy(ROOM_SCHEMA);
  new_room.id = uuid();
  return new_room;
}

export const createRoomsStore = () => {
  const [rooms, setRooms] = createStore([]);
  const [currentRoomId, setCurrentRoomId] = createSignal(null);

  const getRoom = () => {
    const room = rooms.find(room => room.id === currentRoomId());
    return room || copy(ROOM_SCHEMA);
  };

  const setRoom = (field, data, opts = {}) => {
    const { id = null } = opts;
    const room_id = id || currentRoomId();
    setRooms(room => room.id === room_id, field, data);
  };

  const setRoomInputData = (field, data, opts = {}) => {
    // Modify a specific field in the input_data object
    const { id = null } = opts;
    const room_id = id || currentRoomId();
    setRooms(room => room.id === room_id, 'input_data', field, data);
  };

  const getAllReadableInputData = () => {
    const room = getRoom();
    const { input_data = {} } = room;

    // if input data is empty, return empty string
    if (Object.keys(input_data).length === 0) return "";

    const input_data_readable = [];
    input_data_readable.push("Please generate a room:");

    Object.entries(input_data).forEach(([key, value]) => {
      const readable = makeInputAIReadable(key, value);
      input_data_readable.push(readable);
    });

    let joined = input_data_readable.join(" ");
    joined = joined.replace(/\.\./g, '.');
    console.log("joined", joined);

    return joined;
  };

  const removeRoom = (id) => {
    const removing_current_room = id === currentRoomId();
    const filtered_rooms = rooms.filter(room => room.id !== id);
    setRooms(filtered_rooms);
    if (filtered_rooms.length === 0) {
      addRoom();
    } else if (removing_current_room) {
      setCurrentRoomId(filtered_rooms[0].id);
    }
  }

  const addMessage = ({ id = null, message = {} }) => {
    id = id || currentRoomId();
    addMessages({ id, messages: [message] });
  };

  const addMessages = ({ id = null, messages = [] }) => {
    id = id || currentRoomId();
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    messages = messages.map(message => MessageParser.parse(message));
    setRooms(room => room.id === id, 'messages', old_messages => [
      ...old_messages,
      ...messages,
    ]);
  }

  const isAnyRoomWaiting = () => {
    return rooms.find(room => room.waiting) || null;
  };

  // Return the store with states and getters/setters
  return {
    rooms,
    setRooms,
    getRoom,
    setRoom,
    setRoomInputData,
    getAllReadableInputData,
    removeRoom,
    addMessage,
    addMessages,
    setCurrentRoomId,
    isAnyRoomWaiting
  };
}

export const store = createRoomsStore();
