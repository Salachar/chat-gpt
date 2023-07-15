import { ipcMain } from 'electron'

import ChatBase from './base';

const CODE_OUTPUT_RULE = "Required: Code included in messages must be in the following format, surrounded by triple backticks: ```<code>```.";

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

  setIPCEvents () {
    ipcMain.on('chat', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('clear', async (event) => {
      this.messages = [];
    });

    ipcMain.on('random', async (event) => {
      this.messages.push({
        role: "user",
        content: "Please send me a random Javascript code snippet.",
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('analyze', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: "Do your best to analyze the following code snippet, look for any errors and potential improvements.",
      }, {
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('javascript', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: `Do your best to convert the code or description in the following message to JavaScript. ${CODE_OUTPUT_RULE}`,
      }, {
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('stack', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: `Using the following code or description, write Javascript code to satisfy it using React and ChakraUI when applicable. ${CODE_OUTPUT_RULE}`,
      }, {
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('react-native', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: `${CODE_OUTPUT_RULE}. Using the following code or description, write React Native code for a mobile application to satisfy it.
        Do not show the code being utilized in a mobile application, only the code itself. Code: ${prompt}.`,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('chakratize', async (event, prompt) => {
      // this.messages.push({
      //   role: "user",
      //   content: `Convert all following possible code into using ChakraUI components If styled-components are used, replace them with ChakraUI components as best possible. ${CODE_OUTPUT_RULE}`,
      // }, {
      //   role: "user",
      //   content: prompt,
      // });

      this.messages.push({
        role: "user",
        content: `${CODE_OUTPUT_RULE}. Convert all following possible code into using inline ChakraUI components.
        If styled-components are used, replace them with ChakraUI components as best possible, and remove all styled-component references.
        Use ChakraUI directly when possible avoiding separate variables like "StyledButton" or "StyledContainer". Code: ${prompt}.`,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('utils', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: `${CODE_OUTPUT_RULE}. Analyze the following component and suggest any pure helper functions that can be created to
        reduce the logic in the component as much as possible. Return a new component implementing the suggestions as best as possible with comments. Code: ${prompt}.`,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('unit-tests', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: `Do your best to create a full Jest unit test suite for the following code snippet. ${CODE_OUTPUT_RULE}`,
      }, {
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });

    ipcMain.on('cypress-tests', async (event, prompt) => {
      this.messages.push({
        role: "user",
        content: `Do your best to create a full Cypress (Javascript Test Library) test suite for the following code snippet. ${CODE_OUTPUT_RULE}`,
      }, {
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.messages,
        onReply: (message) => {
          this.messages.push(message.original);
          event.reply('chat', message.parsed);
        },
      });
    });
  }
}

export default MainChat;
