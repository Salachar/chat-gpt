import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';
import MessageParser from '../../../utils/message-parser';

const CHAT_SCHEMA = {
  id: null,
  name: "Chat",
  waiting: false,
  messages: [],
  code: "",
  code_langugage: "javascript",
  code_wrap: true,
  prompt: "",
  token_data: {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0,
    tokens_left: 0,
  },
};

export const createAppStore = () => {
  // The list of the actions used to create buttons.
  const [events, setEvents] = createSignal([]);

  const [chats, setChats] = createStore([]);
  const [currentChatId, setCurrentChatId] = createSignal(null);

  const getChat = (id) => {
    id = id || currentChatId();
    const chat = chats.find((chat) => {
      if (chat && chat.id === id) {
        return chat;
      }
    });
    return chat || copy(CHAT_SCHEMA);
  };

  const addChat = () => {
    const new_chat = copy(CHAT_SCHEMA);
    new_chat.id = uuid();
    setChats(chats => [...chats, new_chat]);
    setCurrentChatId(new_chat.id);
    return new_chat.id;
  };

  const clearChat = (id) => {
    // Clear the whole chat
    id = id || currentChatId();
    clearChatMessages(id);
    setChatCode({ id, code: "" });
    setChatPrompt({ id, prompt: "" });
    setChatWaiting({ id, waiting: false });
  }

  const removeChat = (id) => {
    const removing_current_chat = id === currentChatId();
    const filtered_chats = chats.filter(chat => chat.id !== id);
    setChats(filtered_chats);
    if (filtered_chats.length === 0) {
      addChat();
    } else if (removing_current_chat) {
      setCurrentChatId(filtered_chats[0].id);
    }
  }

  const getChatName = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.name;
  };

  const setChatName = ({ id = null, name = "Chat" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'name', name);
  };

  const checkChatName = ({ id = null, action_name = "" }) => {
    id = id || currentChatId();
    const current_name = getChatName(id);
    if (current_name === "Chat") {
      setChatName({ id, name: action_name });
    } else {
      const event = events().find(event => event.label === current_name);
      if (event) {
        setChatName({ id, name: action_name });
      }
    }
  }

  const getChatWaiting = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.waiting;
  };

  const setChatWaiting = ({ id = null, waiting = false }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'waiting', waiting);
  };

  const getFirstWaiting = () => {
    const chat = chats.find(chat => chat.waiting);
    return chat ? chat.id : null;
  };

  const getChatMessages = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.messages;
  };

  const addChatMessage = ({ id = null, message = {} }) => {
    id = id || currentChatId();
    addChatMessages({ id, messages: [message] });
  };

  const addChatMessages = ({ id = null, messages = [] }) => {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    id = id || currentChatId();

    // parse the incoming messages
    messages = messages.map(message => {
      const parsed_message = MessageParser.parse(message);
      return parsed_message;
    });

    setChats(chat => chat.id === id, 'messages', old_message => [
      ...old_message,
      ...messages,
    ]);
  }

  const clearChatMessages = (id) => {
    id = id || currentChatId();
    IPC.send('clear', {
      chatId: id,
    });
    setChats(chat => chat.id === id, 'messages', []);
    setChats(chat => chat.id === id, 'token_data', {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
      tokens_left: 0,
    });
  };

  const getChatCode = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.code;
  };

  const setChatCode = ({ id = null, code = "" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'code', code);
  };

  const getChatCodeLanguage = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.code_langugage;
  };

  const setChatCodeLanguage = ({ id = null, code_langugage = "javascript" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'code_langugage', code_langugage);
  };

  const getChatCodeWrap = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.code_wrap;
  };

  const setChatCodeWrap = ({ id = null, code_wrap = false }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'code_wrap', code_wrap);
  };

  const toggleChatCodeWrap = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    setChats(chat => chat.id === id, 'code_wrap', !chat.code_wrap);
  };

  const getChatPrompt = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.prompt;
  };

  const setChatPrompt = ({ id = null, prompt = "" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'prompt', prompt);
  };

  const getChatTokenData = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.token_data;
  };

  const setChatTokenData = ({ id = null, token_data = {} }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'token_data', old_token_data => ({
      ...old_token_data,
      ...token_data,
    }));
  };

  return {
    events,
    setEvents,

    currentChatId,
    setCurrentChatId,

    chats,
    setChats,

    getChat,
    addChat,
    clearChat,
    removeChat,

    getChatName,
    setChatName,
    checkChatName,
    getChatWaiting,
    getFirstWaiting,
    setChatWaiting,
    getChatMessages,
    addChatMessage,
    addChatMessages,
    clearChatMessages,
    getChatCode,
    setChatCode,
    getChatCodeLanguage,
    setChatCodeLanguage,
    getChatCodeWrap,
    setChatCodeWrap,
    toggleChatCodeWrap,
    getChatPrompt,
    setChatPrompt,
    getChatTokenData,
    setChatTokenData,
  };
}

export const store = createAppStore();
