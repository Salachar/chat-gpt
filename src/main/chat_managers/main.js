import { ipcMain } from 'electron'
import axios from 'axios';
import yaml from 'js-yaml';

import ChatBase from './base';

// const DEFAULT_MODEL = "gpt-3.5-turbo";
const DEFAULT_MODEL = "gpt-3.5-turbo-16k";

const AI_RULES = [
  "You are Snippy, the Code Snippet AI, and are a helpful assistant to developers.",
  // Main stack rules
  "When working with Javascript, the primary development stack is: React, ChakraUI, Cypress, Jest, Storybook.",
  "When working with Java, the primary development stack is: Java 11, Google Cloud Platform (GCP) SDK, Postgre, Maven, IntelliJ, Lombok.",
  // Output rules
  // "When outputing lists of information, never use nested lists.",
  "Lists must always be bulleted, never numbered.",
  "Lists must always be indentented with 4 spaces.",
  "Never use numbered lists like '1.' or '1)', only bulleted lists with '-' or '*'.",
  "List headers should always end with a colon.",
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
  constructor (openai, parent, opts) {
    super(openai, parent, opts);

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
          // analysis rules,
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
          // javascript rules,
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
          // react native rules,
        ]).addMessages(chatId, "user", [
          "Using the following code or description, write React Native code for a mobile application to satisfy it.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'To Java',
      label: 'to-java',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          "Java stack is based on Java 11 and uses Google Cloud Platform (GCP) SDK, Postgre, Maven, IntelliJ, Lombok",
        ]).addMessages(chatId, "user", [
          "Using the following code or description, write code using the Java stack to satisfy it.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'chakratize',
      label: 'Chakratize',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
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
          // Styled Components rules,
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
          // Utils rules,
        ]).addMessages(chatId, "user", [
          "Analyze the following code and suggest any utility functions that can be created to reduce the logic in the component.",
          "Return a new snippet implementing the suggestions as best as possible with comments.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'unit-tests',
      label: 'Unit Tests',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          // Utils rules,
        ]).addMessages(chatId, "user", [
          "Do your best to create a full unit test suite for the following code snippet, try to use the framework provided for the stack being used.",
          "If applicable to the framework, and the test uses an element that does not have a 'data-testid', suggest one and use it in the test.",
        ], code).sendChat(chatId, event);
      }
    }, {
      event: 'cypress-tests',
      label: 'Cypress Tests',
      handler: (event, data) => {
        const { chatId = null, code } = data;
        this.addMessages(chatId, "system", [
          // Cypress rules,
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
          // Storybook rules,
        ]).addMessages(chatId, "user", [
          "Create a full Storybook (React UI Component Library) story for the following code snippet.",
        ], code).sendChat(chatId, event);
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
          console.log(JSON.stringify(parsed_file).length);

          const rule_content = parsed_file;
          this.addMessages(chatId, "system", [
            JSON.stringify(rule_content),
            "Prompt context should default to the rules provided above.",
            "Give a very brief description of the rule and what it does.",
            "If there are any endpoints provided, briefly list them all."
          ]).addMessages(chatId, "user", [
            `Information on Glaium has just been added.`,
          ]).sendChat(chatId, event);
        });
      }
    }, {
      event: 'sanlo-swagger',
      label: 'Sanlo Swagger',
      handler: (event, data) => {
        const { chatId = null } = data;
        axios.get(" https://app.dev.sanlo.io/api/v3/api-docs").then((response) => {
          const parsed_file = response.data;

          Object.keys(parsed_file.paths).forEach((path) => {
            // Set the path to empty obj to save space for now
            parsed_file.paths[path] = {};
          });
          // Kill components for now, its huge
          parsed_file.components = {};

          const rule_content = parsed_file;
          this.addMessages(chatId, "system", [
            JSON.stringify(rule_content),
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

  addMessages (chatId, role, messages = [], code) {
    if (!this.__chats[chatId]) {
      this.__chats[chatId] = {
        id: chatId,
        model: DEFAULT_MODEL,
        messages: [{ // Add the AI rules to the chat as a system message.
          role: "system",
          content: AI_RULES,
        }],
      };
    }
    const message_content = messages.join(" ");
    let prompt_content = "";
    if (code) {
      prompt_content = `${message_content} Code: \`\`\`${code}\`\`\``;
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
        return {
          label: event.label,
          event: event.event,
          non_action: event.non_action,
          non_refresh: event.non_refresh,
          non_waiting: event.non_waiting,
        };
      }));
    });

    ipcMain.on('clear', async (event, data) => {
      const { chatId = null } = data;
      if (!this.__chats[chatId]) {
        this.__chats[chatId] = {
          id: chatId,
          model: DEFAULT_MODEL,
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
        const { chatId, prompt = "", code = "" } = data;
        this.addMessages(chatId, "user", [
          prompt,
        ], code).sendChat(chatId, event);
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
