import { ipcMain } from 'electron'

import ChatBase from './base';

const CODE_OUTPUT_RULES = [
  "Required: Code included in messages must be in the following format, surrounded by triple backticks: ```<code>```."
].join(" ");

const CHAKRA_OUTPUT_RULES = [
  "Use ChakraUI components directly instead of creating a separate `Styled*` variable for them such as 'StyledContainer' or 'StyledButton'.",
  "If styled-components are used, remove them and replace them using inline ChakraUI components directly.",
  "All styling should be done using ChakraUI components.",
];

class MainChat extends ChatBase {
  constructor (openai, parent, opts) {
    super(openai, parent, opts);

    this.__messages = [];
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
      onReply: (message) => {
        this.messages.push(message.original);
        event.reply(event_type, message.parsed);
      },
    });
  }


  addCodeRules (message_array = [], prompt) {
    // Join code rules, message array, and prompt together into one openai message content
    const message_content = message_array.join(" ");
    let prompt_content = "";
    if (prompt) {
      prompt_content = `${CODE_OUTPUT_RULES} ${message_content} Code: \`\`\`${prompt}\`\`\``;
    } else {
      prompt_content = `${CODE_OUTPUT_RULES} ${message_content}`;
    }
    return prompt_content;
  };

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
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Please send me a random Javascript code snippet.",
        ]),
      });
      this.sendChat(event);
    });

    ipcMain.on('analyze', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Analyze the following code snippet, look for any errors and potential improvements.",
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('javascript', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Convert the code or description in the following message to JavaScript.",
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('stack', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Using the following code or description, write Javascript code to satisfy it using React and ChakraUI when applicable.",
          ...CHAKRA_OUTPUT_RULES,
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('react-native', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Using the following code or description, write React Native code for a mobile application to satisfy it.",
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('chakratize', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Convert all following possible code into using inline ChakraUI components.",
          ...CHAKRA_OUTPUT_RULES,
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('utils', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Analyze the following code and suggest any utility functions that can be created to reduce the logic in the component.",
          "Return a new component implementing the suggestions as best as possible with comments.",
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('unit-tests', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Do your best to create a full Jest unit test suite for the following code snippet.",
          "If the test uses an element that does not have a data-testid, suggest one and use it in the test.",
        ], prompt),
      });
      this.sendChat(event);
    });

    ipcMain.on('cypress-tests', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: this.addCodeRules([
          "Do your best to create a full Cypress (Javascript Test Library) test suite for the following code snippet.",
          "You can assume the following helper functions exist:",
          "  - cy.login(username, password) to login before each test",
          "  - cy.getById() as a helper function to get an element by id that does more than cy.get()",
          "  - cy.checkLocal() as a helper function to check local storage for a value",
          "  - cy.waitList() as a helper function to wait for a list of interceptors to finish",
          "  - cy.setInput() as a helper function to set an input value, uses cy.getById()",
          "  - cy.clickItem() as a helper function to click any element, uses cy.getById()",
        ], prompt),
      });
      this.sendChat(event);
    });
  }
}

export default MainChat;
