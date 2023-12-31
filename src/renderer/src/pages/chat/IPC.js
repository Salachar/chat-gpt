import { store } from './store';

const ABOUT_SNIPPET = `
 getActions () {
    return [{
      event: 'your-custom-action',
      label: 'Your Custom Action Label',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES, // You'll probably always want to keep these
          "One of your custom rules here for the system",
        ]).addMessages(chatId, "user", [
          "The "user's prompt" to trigger the generation",
        ], snippet).sendChat(chatId, event);
      }
    }];
  }
`;

class ChatIPCEvents {
  constructor () {
    this.initialize();

    // TODO: Make specific to chat
    IPC.send('onload');
  }

  sendPrompt (opts = {}) {
    const {
      event = {},
      from = "chat",
    } = opts;

    if (event.shiftKey) return;

    // If waiting, don't send another prompt
    if (store.getChatWaiting()) {
      event.preventDefault();
      store.addChatMessage({
        message: {
          role: "assistant",
          content: "Please wait until I'm finished with your last request.",
        }
      });
      return;
    }

    store.setChatWaiting({
      waiting: true
    });

    const trimmed_prompt = store.getChatPrompt().trim();

    const payload = {
      prompt: trimmed_prompt,
    }
    // Check if the trimmed prompt ends with a >
    // and if so attach the notepad to the payload
    if (trimmed_prompt.endsWith(">")) {
      payload.snippet = store.getChatSnippet();
    }

    store.addChatMessage({
      message: {
        role: "user",
        content: trimmed_prompt,
      }
    });

    IPC.send('chat', {
      chatId: store.currentChatId(),
      ...payload,
    });

    setTimeout(() => {
      store.setChatPrompt({
        prompt: ""
      });
    }, 0);
  }

  initialize () {
    IPC.on('model-list', (event, data) => {
      store.setDefaultModel(data.default_model);
      store.setModels(data.models);
    });

    IPC.on('onload', (event, events = []) => {
      if (!Array.isArray(events)) events = [];
      store.setEvents(events);
    });

    IPC.on('no-openai-api-key', (event, data) => {
      store.setNoAPIKey(true);
    });

    IPC.on('chat', (event, data = {}) => {
      const { chatId, chat, message } = data;
      store.setChatWaiting({
        id: chatId,
        waiting: false
      });
      window.last_message = message;
      store.addChatMessage({
        id: chatId,
        message: message
      });
      // If there are no tokens left, put a message in the chat
      if (message.token_data.tokens_left <= 0) {
        store.addChatMessage({
          id: chatId,
          message: {
            role: "error",
            content: "No tokens left, please clear the chat.",
          }
        });
      }
      store.setChatTokenData({
        id: chatId,
        token_data: message.token_data
      });
    });

    IPC.on('error', (event, data) => {
      const { chatId, error } = data;
      store.setChatWaiting({
        id: chatId,
        waiting: false
      });
      store.addChatMessages({
        id: chatId,
        messages: [{
          role: "generator",
          content: "An error occurred.",
        }, {
          role: "error",
          content: error,
        }],
      });
    });

    IPC.on('about', (event, data) => {
      store.addChatMessages({
        messages: [{
          role: "assistant",
          content: [{
            type: "text",
            lines: [{
              type: "text",
              pieces: [{
                type: "text",
                piece: "I can help you with creating your own actions. This will allow you to create buttons like those on the righthand side.",
              }],
            }, {
              type: "text",
              pieces: [{
                type: "text",
                piece: "The snippet below represents an example action you can create.",
              }],
            }],
          }, {
            type: "code",
            language: "src/main/chat_managers/main.js",
            code_snippet: ABOUT_SNIPPET,
          }]
        }],
      });
    });
  }
}

export default new ChatIPCEvents();
