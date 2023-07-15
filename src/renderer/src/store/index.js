import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';

export const createAppStore = () => {
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
