import { ipcMain } from 'electron'

import ChatBase from './base';

const CODE_OUTPUT_RULES = [
  "JSON: All JSON must be valid and have no errors.",
  "JSON: All JSON must be formatted with 2 spaces.",
  "Required: JSON included in messages must be in the following format, surrounded by triple backticks: ```<json>```.",
  "Required: Code included in messages must be in the following format, surrounded by triple backticks: ```<code>```."
].join(" ");

const CHAKRA_OUTPUT_RULES = [
  "Use ChakraUI components for all components and styling.",
  "'Styled*' should be created for components, inline and direct styling should not be used.",
  "Reusable components should be created for components that are very similar and have a lot of shared styling.",
  "If styled-components are used, remove all of them and replace them using ChakraUI components.",
  "All styling should be done using ChakraUI components.",
  "Ensure all ChakraUI components are imported from '@chakra-ui/react'.",
  "Do not create but suggest css variables for colors and other styling.",
  "Do not create additional props for any components.",
];

// This was a good rule for converting the loaders I use in 3.5 gpt
// Convert the following to a styled-component replacing all `px` values with `em` values based off of 1rem;

class MainChat extends ChatBase {
  constructor (openai, parent, opts) {
    super(openai, parent, opts);

    this.__chats = {};
    this.__messages = [];

    this.setIPCEvents();
  }

  get messages () {
    return this.__messages;
  }

  set messages (new_messages = []) {
    this.__messages = new_messages;
  }

  sendChat (chatId, event, event_type = 'chat') {
    this.send({
      messages: this.__chats[chatId],
      onReply: (data) => {
        if (data.error) {
          event.reply('error', {
            chatId,
            error: data.error,
          });
        } else {
          this.__chats[chatId].push(data.original);
          event.reply(event_type, {
            chatId,
            message: data.parsed,
          });
        }
      },
    });
  }

  addCodeRules (message_array = [], code) {
    // Join code rules, message array, and prompt together into one openai message content
    const message_content = message_array.join(" ");
    let prompt_content = "";
    if (code) {
      prompt_content = `${CODE_OUTPUT_RULES} ${message_content} Code: \`\`\`${code}\`\`\``;
    } else {
      prompt_content = `${CODE_OUTPUT_RULES} ${message_content}`;
    }
    return prompt_content;
  };

  addUserMessage (chatId, prompt) {
    if (!this.__chats[chatId]) {
      this.__chats[chatId] = [];
    }
    this.__chats[chatId].push({
      role: "user",
      content: prompt,
    });
  }

  setIPCEvents () {
    // A list that represents the buttons that will be displayed in the chat
    // and the IPC event that will be triggered when the button is clicked.
    const events = [{
      event: 'random',
      label: 'Random Code',
      handler: (event, data) => {
        const { chatId = null } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Please send me a random Javascript code snippet.",
        ]));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'random-json',
      label: 'Random JSON',
      handler: (event, data) => {
        const { chatId = null } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Please send me a random chunk of JSON with an assortment of types and values for testing.",
        ]));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'analyze',
      label: 'Analyze',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Analyze the following code snippet, look for any errors and potential improvements.",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'javascript',
      label: 'To Javascript',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Convert the code or description in the following message to JavaScript.",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'stack',
      label: 'To React/Chakra',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Using the following code or description, write Javascript code to satisfy it using React and ChakraUI when applicable.",
          ...CHAKRA_OUTPUT_RULES,
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'react-native',
      label: 'To React Native',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Using the following code or description, write React Native code for a mobile application to satisfy it.",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'chakratize',
      label: 'Chakratize',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Convert all following possible code using inline ChakraUI components.",
          ...CHAKRA_OUTPUT_RULES,
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'styled-components',
      label: 'Styled Comp',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Convert the following code or snippet to use styled-components.",
          "If there are any `px` values, convert them to `em` values based off of a default 1rem of 16px.",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'utils',
      label: 'Utils Check',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Analyze the following code and suggest any utility functions that can be created to reduce the logic in the component.",
          "Return a new component implementing the suggestions as best as possible with comments.",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'unit-tests',
      label: 'Unit Tests',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Do your best to create a full Jest unit test suite for the following code snippet.",
          "If the test uses an element that does not have a data-testid, suggest one and use it in the test.",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'cypress-tests',
      label: 'Cypress Tests',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Do your best to create a full Cypress (Javascript Test Library) test suite for the following code snippet.",
          "You can assume the following helper functions exist:",
          "  - cy.login(username, password) to login before each test",
          "  - cy.getById() as a helper function to get an element by id that does more than cy.get()",
          "  - cy.checkLocal() as a helper function to check local storage for a value",
          "  - cy.waitList() as a helper function to wait for a list of interceptors to finish",
          "  - cy.setInput() as a helper function to set an input value, uses cy.getById()",
          "  - cy.clickItem() as a helper function to click any element, uses cy.getById()",
        ], code));
        this.sendChat(chatId, event);
      }
    }, {
      event: 'storybook',
      label: 'Storybook',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addUserMessage(chatId, this.addCodeRules([
          "Do your best to create a full Storybook (React UI Component Library) story for the following code snippet.",
        ], code));
        this.sendChat(chatId, event);
      }
    }];

    // setup onload event that will send a JSON list of buttons to the chat
    // using the events array above.
    ipcMain.on('onload', async (event) => {
      event.reply('onload', events.map((event) => {
        return {
          label: event.label,
          event: event.event,
        };
      }));
    });

    ipcMain.on('clear', async (event) => {
      this.messages = [];
    });

    ipcMain.on('chat', async (event, data) => {
      const { chatId, prompt = "", code = "" } = data;
      if (code) {
        this.addUserMessage(chatId, this.addCodeRules([prompt], code));
      } else {
        this.addUserMessage(chatId, prompt);
      }
      this.sendChat(chatId, event);
    });

    // Go through the events and set the IPC events for each one.
    events.forEach((event) => {
      ipcMain.on(event.event, event.handler);
    });
  }
}

export default MainChat;
