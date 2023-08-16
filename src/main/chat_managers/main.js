import { ipcMain } from 'electron'
import axios from 'axios';
import yaml from 'js-yaml';

import ChatBase from './base';

const AI_RULES = [
  "You are Snippy, the Snippet AI, and are a generically helpful assistant.",
  "One of your primary functions is to help developers with their code.",
  "Another is to assist DMS with table top role playing games like D&D.",
  // Main stack rules
  // "Your default and primary language is Javascript, and assume the stack is: React, ChakraUI, Cypress, Jest, Storybook.",
  "Your default and primary language is Javascript, and assume the stack is: Vite, SolidJS, Styled Components, Electron.",
  // "When working with Java, the primary services development stack is: Java 11, Google Cloud Platform (GCP) SDK, Postgre, Maven, IntelliJ, Lombok.",
  // Output rules
  "List headers should always end with a colon.",
  "List headers should always have the same indent as the list items.",
  "Mark underline with double underscores, like this: __underline__.",
  // Code rules
  "Route names and endpoints such as '/api/integrations', '/v1/*' should always be formatted with single backticks, not triple backticks, like this: `<info>`.",
  "When referencing JSON field names or variables outside of code use single backticks, like this: `field_name`.",
  "JSON: All JSON must be valid and have no errors.",
  "JSON: All JSON must be formatted with 2 spaces.",
  "Required: JSON included in messages must be in the following format, surrounded by triple backticks: ```<json>```.",
  "Required: Code included in messages must be in the following format, surrounded by triple backticks: ```<code>```.",
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
  constructor (openai, opts) {
    super(openai, opts);
    const { default_model } = opts;
    this.default_model = default_model;

    this.__chats = {};

    this.setIPCEvents();
  }

  getActions () {
    return [{
      event: 'about',
      label: 'About',
      non_action: true,
      non_refresh: true,
      non_waiting: true,
      handler: (event, data) => {
        event.reply('about');
      }
    }, {
      event: 'example-code',
      label: 'Example Code',
      handler: (event, data) => {
        const { chatId = null } = data;
        this.addMessages(chatId, "system", [
          "Avoid generating examples similar to ones that have already been generated.",
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
          "Avoid generating examples similar to ones that have already been generated.",
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
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // analysis rules,
        ]).addMessages(chatId, "user", [
          "Analyze the following code snippet, look for any errors and potential improvements.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      event: 'to-javascript',
      label: 'Convert',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // javascript rules,
        ]).addMessages(chatId, "user", [
          "Convert the code or description in the following message to JavaScript.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      event: 'chakratize',
      label: 'Chakratize',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          CHAKRA_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Convert all following possible code using inline ChakraUI components.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      event: 'to-styled-components',
      label: 'Styled-Compize',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // Styled Components rules,
        ]).addMessages(chatId, "user", [
          "Convert the following code or snippet to use styled-components.",
          "If there are any `px` values, convert them to `em` values based off of a default 1rem of 16px.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      event: 'utils-check',
      label: 'Utils Check',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // Utils rules,
        ]).addMessages(chatId, "user", [
          "Analyze the following code and suggest any utility functions that can be created to reduce the logic in the component.",
          "Return a new snippet implementing the suggestions as best as possible with comments.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      event: 'unit-tests',
      label: 'Unit Tests',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // Utils rules,
        ]).addMessages(chatId, "user", [
          "Do your best to create a full unit test suite for the following code snippet, try to use the framework provided for the stack being used.",
          "If applicable to the framework, and the test uses an element that does not have a 'data-testid', suggest one and use it in the test.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      disabled: true,
      event: 'cypress-tests',
      label: 'Cypress Tests',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // Cypress rules,
          CYPRESS_OUTPUT_RULES,
        ]).addMessages(chatId, "user", [
          "Create a full Cypress (Javascript Test Library) test suite for the following code snippet.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      disabled: true,
      event: 'storybook',
      label: 'Storybook',
      handler: (event, data) => {
        const { chatId = null, snippet } = data;
        this.addMessages(chatId, "system", [
          // Storybook rules,
        ]).addMessages(chatId, "user", [
          "Create a full Storybook (React UI Component Library) story for the following code snippet.",
        ], snippet).sendChat(chatId, event);
      }
    }, {
      event: 'glaium-swagger',
      label: 'Glaium Swagger',
      handler: (event, data) => {
        const { chatId = null } = data;
        axios.get("https://api.glaium.io/api-docs/v1/swagger.yaml").then((response) => {
          const parsed_file = yaml.load(response.data);

          // Go through the entire file and remove any instances of "responses"
          // because it makes the payload too long for now until I have access to better models
          this.removeKeyFromWholeObject(parsed_file, "responses");

          this.addMessages(chatId, "system", [
            JSON.stringify(parsed_file),
            "Prompt context should default to the rules provided above.",
            "Give a very brief description of the rule and what it does.",
            "If there are any endpoints provided, briefly list them all."
          ]).addMessages(chatId, "user", [
            `Information on Glaium has just been added.`,
          ]).sendChat(chatId, event);
        });
      }
    }, {
      disabled: true,
      event: 'sanlo-swagger',
      label: 'Sanlo Swagger',
      handler: (event, data) => {
        const { chatId = null } = data;
        axios.get("https://app.dev.sanlo.io/api/v3/api-docs").then((response) => {
          const parsed_file = response.data;

          Object.keys(parsed_file.paths).forEach((path) => {
            // Set the path to empty obj to save space for now
            parsed_file.paths[path] = {};
          });
          // Kill components for now, its huge
          parsed_file.components = {};

          this.addMessages(chatId, "system", [
            JSON.stringify(parsed_file),
            "Prompt context should default to the rules provided above.",
            "Give a very brief description of the rule and what it does.",
          ]).addMessages(chatId, "user", [
            `Information on Sanlo has just been added.`,
          ]).sendChat(chatId, event);
        });
      }
    }];
  }

  removeKeyFromWholeObject (obj, key) {
    Object.keys(obj).forEach((k) => {
      if (k === key) {
        delete obj[k];
      } else if (typeof obj[k] === "object") {
        this.removeKeyFromWholeObject(obj[k], key);
      }
    });
  }

  sendChat (chatId, event, event_type = 'chat') {
    this.send({
      model:  this.__chats[chatId].model,
      messages: this.__chats[chatId].messages,
      onReply: (data) => {
        if (data.error) {
          event.reply('error', {
            chatId,
            chat: this.__chats[chatId],
            error: data.error,
          });
        } else {
          this.__chats[chatId].messages.push(data.original);
          event.reply(event_type, {
            chatId,
            chat: this.__chats[chatId],
            message: data.parsed,
          });
        }
      },
    });
  }

  addMessages (chatId, role, messages = [], snippet) {
    if (!this.__chats[chatId]) {
      this.__chats[chatId] = {
        id: chatId,
        model: this.default_model,
        messages: [{ // Add the AI rules to the chat as a system message.
          role: "system",
          content: AI_RULES,
        }],
      };
    }
    const message_content = messages.join(" ");
    let prompt_content = "";
    if (snippet) {
      prompt_content = `${message_content} Code: \`\`\`${snippet}\`\`\``;
    } else {
      prompt_content = `${message_content}`;
    }
    this.__chats[chatId].messages.push({
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
        chat: this.__chats[data.chatId],
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
        // return the entire event minus the handler function
        const { handler, ...rest } = event;
        return rest;
      }));
    });

    ipcMain.on('clear', async (event, data) => {
      const { chatId = null } = data;
      if (!this.__chats[chatId]) {
        this.__chats[chatId] = {
          id: chatId,
          model: this.default_model,
          messages: [{ // Add the AI rules to the chat as a system message.
            role: "system",
            content: AI_RULES,
          }],
        };
      } else {
        this.__chats[chatId].messages = [{
          role: "system",
          content: AI_RULES,
        }];
      }
    });

    ipcMain.on('chat', async (event, data) => {
      try {
        const { chatId, prompt = "", snippet = "" } = data;
        this.addMessages(chatId, "user", [
          prompt,
        ], snippet).sendChat(chatId, event);
      } catch (e) {
        event.reply('error', {
          chatId: data.chatId,
          chat: this.__chats[data.chatId],
          error: e.message,
        });
      }
    });

    ipcMain.on('chat-model-change', async (event, data) => {
      try {
        const { chatId, model } = data;
        if (!this.__chats[chatId]) {
          this.__chats[chatId] = {
            id: chatId,
            model,
            messages: [{
              role: "system",
              content: AI_RULES,
            }],
          };
        } else {
          this.__chats[chatId].model = model;
        }
      } catch (e) {
        event.reply('error', {
          chatId: data.chatId,
          chat: this.__chats[data.chatId],
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
