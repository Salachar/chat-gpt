import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';
import MessageParser from '../../../utils/message-parser';
import Prism from 'prismjs';

const CHAT_SCHEMA = {
  id: null,
  name: "Chat",
  waiting: false,
  messages: [],
  snippet: "",
  code_langugage: "javascript",
  snippet_wrap: true,
  snippet_format: "text",
  prompt: "",
  model: "",
  token_data: {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0,
    tokens_left: 0,
  },
};

export const createAppStore = () => {
  // The list of models for the openai api.
  const [defaultModel, setDefaultModel] = createSignal(null);
  const [noAPIKey, setNoAPIKey] = createSignal(false);
  const [models, setModels] = createSignal([]);
  // The list of the actions used to create buttons.
  const [events, setEvents] = createSignal([]);

  const [chats, setChats] = createStore([]);
  const [currentChatId, setCurrentChatId] = createSignal(null);

  const getNewChat = (chat_props = {}) => {
    let new_chat = copy(CHAT_SCHEMA);
    new_chat.id = uuid();
    new_chat.model = defaultModel();
    new_chat = {
      ...new_chat,
      ...chat_props,
    };
    return new_chat;
  };

  const getChat = (id) => {
    id = id || currentChatId();
    const chat = chats.find((chat) => {
      if (chat && chat.id === id) {
        return chat;
      }
    });
    return chat || getNewChat();
  };

  const addChat = (chat_props = {}) => {
    const new_chat = getNewChat(chat_props);
    setChats(chats => [...chats, new_chat]);
    setCurrentChatId(new_chat.id);
    return new_chat.id;
  };

  const clearChat = (id) => {
    // Clear the whole chat
    id = id || currentChatId();
    clearChatMessages(id);
    setChatSnippet({ id, snippet: "" });
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
    return getChat(id).name;
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

  const getChatModel = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    return chat.model || defaultModel();
  };

  const setChatModel = ({ id = null, model = "" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'model', model);
    IPC.send('chat-model-change', {
      chatId: id,
      model: model,
    });
  };

  const getDropdownModel = (id) => {
    id = id || currentChatId();
    const chat = getChat(id);
    const model = models().find(model => model === chat.model);
    return model || defaultModel();
  };

  const getChatWaiting = (id) => {
    return getChat(id).waiting;
  };

  const setChatWaiting = ({ id = null, waiting = false }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'waiting', waiting);
  };

  const getFirstWaiting = () => {
    return chats.find(chat => chat.waiting) || null;
  };

  const getChatMessages = (id) => {
    return getChat(id).messages;
  };

  const addChatMessage = ({ id = null, message = {} }) => {
    id = id || currentChatId();
    addChatMessages({ id, messages: [message] });
  };

  const addChatMessages = ({ id = null, messages = [] }) => {
    id = id || currentChatId();
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    messages = messages.map(message => MessageParser.parse(message));
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

  const getChatSnippet = (id) => {
    return getChat(id).snippet;
  };

  const setChatSnippet = ({ id = null, snippet = "" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'snippet', snippet);
  };

  const getChatCodeLanguage = (id) => {
    return getChat(id).code_langugage || "javascript";
  };

  const setChatCodeLanguage = ({ id = null, code_langugage = "javascript" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'code_langugage', code_langugage);
  };

  const getChatSnippetWrap = (id) => {
    return getChat(id).snippet_wrap;
  };

  const setChatSnippetWrap = ({ id = null, snippet_wrap = false }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'snippet_wrap', snippet_wrap);
  };

  const toggleChatSnippetWrap = (id) => {
    const chat = getChat(id);
    const new_snippet_wrap = !chat.snippet_wrap;
    if (new_snippet_wrap) {
      setChats(c => c.id === chat.id, 'snippet_format', "text");
    }
    setChats(c => c.id === chat.id, 'snippet_wrap', new_snippet_wrap);
  };

  const getChatSnippetFormat = (id) => {
    return getChat(id).snippet_format;
  };

  const setChatSnippetFormat = ({ id = null, snippet_format = "text" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'snippet_format', snippet_format);
  };

  const toggleChatCodeFormat = (id) => {
    const chat = getChat(id);
    // Non-code snippets always go to code, code snippets always go to text.
    const new_snippet_format = chat.snippet_format !== "code" ? "code" : "text";
    if (new_snippet_format === "code") {
      setChats(c => c.id === chat.id, 'snippet_wrap', false);
    }
    setChats(c => c.id === chat.id, 'snippet_format', new_snippet_format);
    Prism.highlightAll();
  };

  const getChatPrompt = (id) => {
    return getChat(id).prompt;
  };

  const setChatPrompt = ({ id = null, prompt = "" }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'prompt', prompt);
  };

  const getChatTokenData = (id) => {
    return getChat(id).token_data;
  };

  const setChatTokenData = ({ id = null, token_data = {} }) => {
    id = id || currentChatId();
    setChats(chat => chat.id === id, 'token_data', old_token_data => ({
      ...old_token_data,
      ...token_data,
    }));
  };

  return {
    defaultModel,
    setDefaultModel,
    noAPIKey,
    setNoAPIKey,
    getDropdownModel,
    models,
    setModels,
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

    getChatModel,
    setChatModel,
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
    getChatSnippet,
    setChatSnippet,
    getChatCodeLanguage,
    setChatCodeLanguage,

    getChatSnippetWrap,
    setChatSnippetWrap,
    toggleChatSnippetWrap,
    getChatSnippetFormat,
    setChatSnippetFormat,
    toggleChatCodeFormat,

    getChatPrompt,
    setChatPrompt,
    getChatTokenData,
    setChatTokenData,
  };
}

export const store = createAppStore();
