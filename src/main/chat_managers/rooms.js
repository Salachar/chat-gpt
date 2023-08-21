import { ipcMain } from 'electron'
import ruleset from './rooms_rules';

import ChatBase from './base';

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

    ipcMain.on('room', async (event, data = {}) => {
      let { id = "", prompt = "", input_data = " "} = data;

      if (!id) {
        console.log("Could not find an id for the room, exiting");
        return;
      }

      let prompt_content = "";
      if (prompt && input_data) {
        prompt_content = prompt + "\n\n" + input_data;
      } else if (prompt) {
        prompt_content = prompt;
      } else if (input_data) {
        prompt_content = input_data;
      }

      this.rooms[id].messages.push({
        role: "user",
        content: prompt_content,
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
          let room_json_addon = null;

          for (let i = 0; i < data.parsed.content.length; i++) {
            const message = data.parsed.content[i];
            if (message.type === "code" && message.language === "json") {
              try {
                const json = JSON.parse(message.code_snippet);
                if (json.is_room_json && !json.is_room_json_addon) {
                  room_json = json;
                } else if (json.is_room_json_addon) {
                  room_json_addon = json;
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

          if (room_json_addon) {
            event.reply('room-generation-addon', {
              id,
              roomJSON: room_json_addon
            });
          }
        },
      });
    });
  }
}

export default RoomsChat;
