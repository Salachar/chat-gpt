import { createSignal } from 'solid-js';

export const createAppStore = () => {
  // The list of the actions used to create buttons.
  const [events, setEvents] = createSignal([]);

  const [isWaiting, setIsWaiting] = createSignal(false);

  const [wordwrap, setWordwrap] = createSignal(false);
  const toggleWordwrap = () => setWordwrap(!wordwrap());

  const [messages, setMessages] = createSignal([]);
  const [code, setCode] = createSignal('');
  const [tokenData, setTokenData] = createSignal({
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0,
    tokens_left: 0,
  });

  const addMessage = (message) => {
    setMessages(oldMessages => [...oldMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    setTokenData({
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
      tokens_left: 0,
    });
  };

  return {
    events,
    setEvents,

    isWaiting,
    setIsWaiting,

    wordwrap,
    toggleWordwrap,

    tokenData,
    setTokenData,
    clearMessages,

    messages,
    setMessages,
    addMessage,

    code,
    setCode,
  };
}

export const store = createAppStore();
