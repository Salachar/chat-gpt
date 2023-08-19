import { ipcMain } from 'electron'
import { roomToRules } from '../rules';
import ruleset from './rooms_rules';

import ChatBase from './base';

// const BASE_MESSAGES = [
//   "You are a helpful assistant for a fantasy RPG room generator.",
//   "Room generation will only occur when explicitly requested by the user, it should never happen automatically or without the users intention.",
//   "All room generation output is JSON only.",
//   "JSON: All JSON must be valid and have no errors.",
//   "JSON: All JSON must be formatted with 2 spaces.",
//   "Required: JSON must be in the following format, surrounded by triple backticks: ```<json>```.",
// ].join(" ");

const BASE_MESSAGE_SET = [{
  role: "system",
  content: ruleset,
}];

class RoomsChat extends ChatBase {
  constructor (openai, opts) {
    super(openai, opts);

    this.rooms = {};

    this.setIPCEvents();
  }

  getRoom (id) {
    return this.rooms[id];
  }

  setIPCEvents () {
    ipcMain.on('room-init', async (event, data) => {
      const { id = "" } = data;

      console.log('thing');

      if (this.rooms[id]) {
        console.log("Room already exists, exiting init");
        return;
      }

      this.rooms[id] = {
        messages: JSON.parse(JSON.stringify(BASE_MESSAGE_SET)), // messages should never pre-exist here
      };

      console.log('sending')

      this.send({
        messages: this.rooms[id].messages,
        onReply: (data) => {
          console.log(JSON.stringify(data, null, 2));
          this.rooms[id].messages.push(data.original);
          event.reply('room', data.parsed);
          event.reply('room-init');
        },
      });
    });

    ipcMain.on('room-chat', async (event, data = {}) => {
      const { id = "", prompt = "" } = data;

      if (!id) {
        console.log("Could not find an id for the room chat, exiting");
        return;
      }

      this.rooms[id].messages.push({
        role: "user",
        content: prompt,
      });

      this.send({
        messages: this.rooms[id].messages,
        onReply: (message) => {
          this.rooms[id].messages.push(message.original);
          if (message.parsed.json) message.parsed.room = message.parsed.json;
          event.reply('room', message.parsed);
        },
      });
    });

    ipcMain.on('room-request', async (event, data = {}) => {
      const { id = "", input_data = {} } = data;

      if (!id) {
        console.log("Could not find an id for the room chat, exiting");
        return;
      }

      this.rooms[id].messages.push({
        role: "user",
        content: roomToRules(input_data),
      });

      this.send({
        messages: this.rooms[id].messages,
        onReply: (data) => {
          console.log(JSON.stringify(data, null, 2));
          // Go through the parsed messages and find the first code block, its the room json
          // const json = data.parsed.content.find((message) => {
          let room_json = null;
          for (let i = 0; i < data.parsed.content.length; i++) {
            const message = data.parsed.content[i];
            // "type": "code",
            // "language": "json",
            // "code_snippet": "{\n  \"name\":
            if (message.type === "code" && message.language === "json") {
              try {
                room_json = JSON.parse(message.code_snippet);
              } catch (e) {
                console.log(e);
              }
              break;
            }
          }

          // this.rooms[id].messages.push(message.original);
          // if (message.parsed.json) message.parsed.room = message.parsed.json;
          // event.reply('room', message.parsed);
          event.reply('room', room_json);
        },
      })
    });
  }
}

export default RoomsChat;
