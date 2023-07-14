import { ipcMain } from 'electron'

import MainChat from './chat_managers/main';

class AIManager {
  constructor (openai) {
    this.openai = openai;

    this.main_chat = new MainChat(openai, this);

    this.listModels();
  }

  async listModels () {
    const response = await this.openai.listModels();
    try {
      response.data.data.forEach((model) => {
        if (model.id.match(/gpt/)) {
          console.log(model.id);
        }
      });
    } catch (e) {}
  }
}

export default AIManager;
