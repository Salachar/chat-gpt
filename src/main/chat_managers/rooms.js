import { ipcMain } from 'electron'
import { roomToRules } from '../rules';
import ruleset from './rooms_rules';

import ChatBase from './base';

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
      if (this.rooms[id]) return;

      this.rooms[id] = {
        messages: [{
          role: "system",
          content: ruleset,
        }],
      };

      this.send({
        messages: this.rooms[id].messages,
        onReply: (data) => {
          if (data.error) {
            event.reply('room-error', {
              id,
              error: data.error,
            });
            return;
          }

          this.rooms[id].messages.push(data.original);
          event.reply('room', {
            id,
            message: data.parsed
          });
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
        onReply: (data) => {
          if (data.error) {
            event.reply('room-error', {
              id,
              error: data.error,
            });
            return;
          }

          // Push the original message to the openai messages
          this.rooms[id].messages.push(data.original);
          // Find any JSON sent back from the room request
          let room_json = null;
          for (let i = 0; i < data.parsed.content.length; i++) {
            const message = data.parsed.content[i];
            if (message.type === "code" && message.language === "json") {
              try {
                const json = JSON.parse(message.code_snippet);
                if (json.is_room_json) {
                  room_json = json;
                }
              } catch (e) {
                console.log(e);
              }
              break;
            }
          }
          // Send the parsed message to the renderer
          event.reply('room', {
            id,
            message: data.parsed
          });
          // Send the room json to the renderer
          if (room_json) {
            event.reply('room-generation', {
              id,
              roomJSON: room_json
            });
          }
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
          if (data.error) {
            event.reply('room-error', {
              id,
              error: data.error,
            });
            return;
          }

          // Push the original message to the openai messages
          this.rooms[id].messages.push(data.original);
          // Find any JSON sent back from the room request
          let room_json = null;
          for (let i = 0; i < data.parsed.content.length; i++) {
            const message = data.parsed.content[i];
            if (message.type === "code" && message.language === "json") {
              try {
                const json = JSON.parse(message.code_snippet);
                if (json.is_room_json) {
                  room_json = json;
                }
              } catch (e) {
                console.log(e);
              }
              break;
            }
          }
          // Send the parsed message to the renderer
          event.reply('room', {
            id,
            message: data.parsed
          });
          // Send the room json to the renderer
          if (room_json) {
            event.reply('room-generation', {
              id,
              roomJSON: room_json
            });
          }
        },
      })
    });
  }
}

export default RoomsChat;
