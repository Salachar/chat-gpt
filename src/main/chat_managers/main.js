import { ipcMain } from 'electron'

import ChatBase from './base';

const CODE_OUTPUT_RULES = [
  "Required: Code included in messages must be in the following format, surrounded by triple backticks: ```<code>```."
].join(" ");

// const CHAKRA_OUTPUT_RULES = [
//   "Use ChakraUI components directly instead of creating a separate `Styled*` variable for them such as 'StyledContainer' or 'StyledButton'.",
//   "Variables should only be created for components that are very similar and have a lot of shared styling.",
//   "If styled-components are used, remove them and replace them using inline ChakraUI components directly.",
//   "All styling should be done using ChakraUI components.",
// ];

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

// const CHAKRA_OUTPUT_RULES = [
//   "Use ChakraUI components directly for components that are not reused instead of creating a separate `Styled*` variable for them such as 'StyledContainer' or 'StyledButton'.",
//   "'Styled*' variables should only be created for components that are very similar and have a lot of shared styling.",
//   "If styled-components are used, remove them and replace them using inline ChakraUI components directly.",
//   "All styling should be done using ChakraUI components.",
// ];

class MainChat extends ChatBase {
  constructor (openai, parent, opts) {
    super(openai, parent, opts);

    this.__messages = [];

    this.setIPCEvents();
  }

  get messages () {
    return this.__messages;
  }

  set messages (new_messages = []) {
    this.__messages = new_messages;
  }

  sendChat (event, event_type = 'chat') {
    this.send({
      messages: this.messages,
      onReply: (data) => {
        if (data.error) {
          event.reply('error', data.error);
          return;
        }
        this.messages.push(data.original);
        event.reply(event_type, data.parsed);
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

  addUserMessage (prompt) {
    this.messages.push({
      role: "user",
      content: prompt,
    });
  }

  setIPCEvents () {
    ipcMain.on('clear', async (event) => {
      this.messages = [];
    });

    ipcMain.on('chat', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: prompt,
      });
      this.sendChat(event);
    });

    ipcMain.on('random', async (event) => {
      this.addUserMessage(this.addCodeRules([
        "Please send me a random Javascript code snippet.",
      ]));
      this.sendChat(event);
    });

    ipcMain.on('analyze', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Analyze the following code snippet, look for any errors and potential improvements.",
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('javascript', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Convert the code or description in the following message to JavaScript.",
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('stack', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Using the following code or description, write Javascript code to satisfy it using React and ChakraUI when applicable.",
        ...CHAKRA_OUTPUT_RULES,
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('react-native', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Using the following code or description, write React Native code for a mobile application to satisfy it.",
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('chakratize', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Convert all following possible code using inline ChakraUI components.",
        ...CHAKRA_OUTPUT_RULES,
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('utils', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Analyze the following code and suggest any utility functions that can be created to reduce the logic in the component.",
        "Return a new component implementing the suggestions as best as possible with comments.",
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('unit-tests', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Do your best to create a full Jest unit test suite for the following code snippet.",
        "If the test uses an element that does not have a data-testid, suggest one and use it in the test.",
      ], code));
      this.sendChat(event);
    });

    ipcMain.on('cypress-tests', async (event, code) => {
      this.addUserMessage(this.addCodeRules([
        "Do your best to create a full Cypress (Javascript Test Library) test suite for the following code snippet.",
        "You can assume the following helper functions exist:",
        "  - cy.login(username, password) to login before each test",
        "  - cy.getById() as a helper function to get an element by id that does more than cy.get()",
        "  - cy.checkLocal() as a helper function to check local storage for a value",
        "  - cy.waitList() as a helper function to wait for a list of interceptors to finish",
        "  - cy.setInput() as a helper function to set an input value, uses cy.getById()",
        "  - cy.clickItem() as a helper function to click any element, uses cy.getById()",
      ], code));
      this.sendChat(event);
    });
  }
}

export default MainChat;
