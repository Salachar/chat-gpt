import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';

import MessageParser from '@utils/message-parser';

const SCHEMA = {
  id: null,
  model: "gpt-3.5-turbo-16k",
  data: {
    name: "New Room",
  },
  // Item state
  waiting: true, // true until item is ready
  isGeneratingImages: false,
  // Images
  image_prompt: "",
  images: [],
  // Item input data
  input_data: {},
  input_data_parsed: {},
  // Chat data
  messages: [],
  prompt: "",
};

const makeInputAIReadable = (key, value) => {
  const readable = `"${key}" value is: "${value}".`;
  return readable;
};

export const createNewRoom = () => {
  const new_item = copy(SCHEMA);
  new_item.id = uuid();
  return new_item;
}

export const createItemsStore = () => {
  const [items, setItems] = createStore([]);
  const [currentItemId, setCurrentItemId] = createSignal(null);

  const getItem = () => {
    const item = items.find(item => item.id === currentItemId());
    return item || copy(SCHEMA);
  };

  const setItem = (field, data, opts = {}) => {
    const { id = null } = opts;
    const item_id = id || currentItemId();
    setItems(item => item.id === item_id, field, data);
  };

  const setItemInputData = (field, data, opts = {}) => {
    const {
      id = null,
      parser = null,
    } = opts;
    const item_id = id || currentItemId();
    setItems(item => item.id === item_id, 'input_data', field, data);
    if (parser) {
      const readable = makeInputAIReadable(field, parser(data));
      setItems(item => item.id === item_id, 'input_data_parsed', field, readable);
    }
  };

  const getAllReadableInputData = () => {
    const item = getItem();
    const { input_data = {} } = item;

    if (Object.keys(input_data).length === 0) return "";

    const input_data_readable = [];
    input_data_readable.push("Please generate a room:");

    Object.entries(input_data).forEach(([key, value]) => {
      const { input_data_parsed = {} } = item;
      const parsed_value = input_data_parsed[key];
      if (parsed_value) {
        input_data_readable.push(parsed_value);
        return;
      }
      if (!value) return;
      if (typeof value === "string" && value.toLowerCase() === "none") return;
      const readable = makeInputAIReadable(key, value);
      input_data_readable.push(readable);
    });

    let joined = input_data_readable.join(" ");
    joined = joined.replace(/\.\./g, '.');

    return joined;
  };

  const removeItem = (id) => {
    const removing_current_item = id === currentItemId();
    const filtered_items = items.filter(item => item.id !== id);
    setItems(filtered_items);
    if (filtered_items.length === 0) {
      addItem();
    } else if (removing_current_item) {
      setCurrentItemId(filtered_items[0].id);
    }
  }

  const addMessage = ({ id = null, message = {} }) => {
    id = id || currentItemId();
    addMessages({ id, messages: [message] });
  };

  const addMessages = ({ id = null, messages = [] }) => {
    id = id || currentItemId();
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    messages = messages.map(message => MessageParser.parse(message));
    setItems(item => item.id === id, 'messages', old_messages => [
      ...old_messages,
      ...messages,
    ]);
  }

  const isAnyItemWaiting = () => {
    return items.find(item => item.waiting) || null;
  };

  return {
    rooms: items,
    setRooms: setItems,
    getRoom: getItem,
    setRoom: setItem,
    setRoomInputData: setItemInputData,
    getAllReadableInputData: getAllReadableInputData,
    removeRoom: removeItem,
    addMessage: addMessage,
    addMessages: addMessages,
    setCurrentRoomId: setCurrentItemId,
    isAnyRoomWaiting: isAnyItemWaiting,
    setImagePrompt: (image_prompt, opts = {}) => {
      let { id = null } = opts;
      id = id || currentItemId();
      setItems(item => item.id === id, 'image_prompt', image_prompt);
    }
  };
}

export const store = createItemsStore();
