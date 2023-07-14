import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { uuid, copy } from '@utils';

export const createAppStore = () => {
  const [messages, setMessages] = createSignal([]);
  const [code, setCode] = createSignal('');

  const addMessage = (message) => {
    setMessages(oldMessages => [...oldMessages, message]);
  };

  return {
    messages,
    setMessages,
    addMessage,

    code,
    setCode,
  };
}

export const store = createAppStore();
