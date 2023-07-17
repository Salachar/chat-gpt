import { ipcMain } from 'electron'

import ChatBase from './base';

const AI_RULES = [
  "You are Snippy, the Code Snippet AI.",
  "You are a code snippet AI that can help developers with various tasks.",
  "The primary language you use is JavaScript.",
].join(" ");

const GENERIC_CODE_OUTPUT_RULES = [
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
  "Box is preferred over div for all components.",
  "Do not create but suggest css variables for colors and other styling.",
  "Do not create additional props for any components.",
].join(" ");

const CYPRESS_OUTPUT_RULES = [
  "You can assume the following Cypress helper functions exist:",
  "  - cy.login(username, password) to login before each test",
  "  - cy.getById() as a helper function to get an element by id that does more than cy.get()",
  "  - cy.checkLocal() as a helper function to check local storage for a value",
  "  - cy.waitList() as a helper function to wait for a list of interceptors to finish",
  "  - cy.setInput() as a helper function to set an input value, uses cy.getById()",
  "  - cy.clickItem() as a helper function to click any element, uses cy.getById()",
].join(" ");

class MainChat extends ChatBase {
  constructor (openai, parent, opts) {
    super(openai, parent, opts);

    this.__chats = {};

    this.setIPCEvents();
  }

  getActions () {
    return [{
      event: 'example-code',
      label: 'Example Code',
      handler: (event, data) => {
        const { chatId = null } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
          "Try to avoid generating examples similar to ones that have already been generated.",
        ]).addMessages(chatId, "user", [
          "Generate an example javascript function.",
        ]).sendChat(chatId, event);
      }
    }, {
      event: 'example-json',
      label: 'Example JSON',
      handler: (event, data) => {
        const { chatId = null } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
          "Try to avoid generating examples similar to ones that have already been generated.",
          "Example JSON should be medium sized, showing various types of data.",
          "The test data should look realistic, but not be real data.",
        ]).addMessages(chatId, "user", [
          "Generate a JSON object with random data.",
        ]).sendChat(chatId, event);
      }
    }, {
      event: 'analyze',
      label: 'Analyze',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Analyze the following code snippet, look for any errors and potential improvements.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'to-javascript',
      label: 'To Javascript',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Convert the code or description in the following message to JavaScript.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'to-react-chakra',
      label: 'To React/Chakra',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
          CHAKRA_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Using the following code or description, write Javascript code to satisfy it using React and ChakraUI when applicable.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'to-react-native',
      label: 'To React Native',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Using the following code or description, write React Native code for a mobile application to satisfy it.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'chakratize',
      label: 'Chakratize',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
          CHAKRA_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Convert all following possible code using inline ChakraUI components.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'styled-components',
      label: 'Styled Comp',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Convert the following code or snippet to use styled-components.",
          "If there are any `px` values, convert them to `em` values based off of a default 1rem of 16px.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'utils-check',
      label: 'Utils Check',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Analyze the following code and suggest any utility functions that can be created to reduce the logic in the component.",
          "Return a new component implementing the suggestions as best as possible with comments.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'unit-tests',
      label: 'Unit Tests',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Do your best to create a full Jest unit test suite for the following code snippet.",
          "If the test uses an element that does not have a data-testid, suggest one and use it in the test.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'cypress-tests',
      label: 'Cypress Tests',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
          CYPRESS_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Create a full Cypress (Javascript Test Library) test suite for the following code snippet.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'storybook',
      label: 'Storybook',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          GENERIC_CODE_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Create a full Storybook (React UI Component Library) story for the following code snippet.",
        ], code).sendChat(chatId, event);
      }
    }];
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

  addMessages (chatId, role, messages = [], code) {
    if (!this.__chats[chatId]) {
      this.__chats[chatId] = [];
      // Add the AI rules to the chat as a system message.
      this.__chats[chatId].push({
        role: "system",
        content: AI_RULES,
      });
    }
    const message_content = messages.join(" ");
    let prompt_content = "";
    if (code) {
      prompt_content = `${message_content} Code: \`\`\`${code}\`\`\``;
    } else {
      prompt_content = `${message_content}`;
    }
    this.__chats[chatId].push({
      role,
      content: prompt_content,
    });
    return this;
  }

  // A wrapper to put around handlers to send a generic error message
  // if the handler fails.
  handlerWrapper (event, data, handler) {
    try {
      handler(event, data);
    } catch (e) {
      event.reply('error', {
        chatId: data.chatId,
        error: e.message,
      });
    }
  }

  setIPCEvents () {
    // A list that represents the buttons that will be displayed in the chat
    // and the IPC event that will be triggered when the button is clicked.
    const actions = this.getActions();

    // setup onload event that will send a JSON list of buttons to the chat
    // using the events array above.
    ipcMain.on('onload', async (event) => {
      event.reply('onload', actions.map((event) => {
        return {
          label: event.label,
          event: event.event,
        };
      }));
    });

    ipcMain.on('clear', async (event, data) => {
      // Clear out the chat for the passed in chatId
      const { chatId = null } = data;
      this.__chats[chatId] = [];
      // Add the AI rules to the chat as a system message.
      this.__chats[chatId].push({
        role: "system",
        content: AI_RULES,
      });
      // Send the chat back to the renderer.
      // this.sendChat(chatId, event);
    });

    ipcMain.on('chat', async (event, data) => {
      try {
        const { chatId, prompt = "", code = "" } = data;
        if (code) {
          this.addMessages(chatId, "system", [
            GENERIC_CODE_OUTPUT_RULES,
          ]).addMessages(chatId, "user", [
            prompt,
          ], code).sendChat(chatId, event);
        } else {
          this.addMessages(chatId, "user", [
            prompt,
          ]).sendChat(chatId, event);
        }
      } catch (e) {
        event.reply('error', {
          chatId: data.chatId,
          error: e.message,
        });
      }
    });

    // Go through the events and set the IPC events for each one.
    actions.forEach(({ event: eventName, handler }) => {
      ipcMain.on(eventName, (event, data) => {
        this.handlerWrapper(event, data, handler);
      });
    });
  }
}

export default MainChat;
