import MainChat from './chat_managers/main';

class AIManager {
  constructor (openai) {
    this.openai = openai;

    this.main_chat = new MainChat(openai, this);

    this.listModels();

    return this;
  }

  listModels () {
    this.openai.listModels().then((res) => {
      try {
        const models = res.data.data.filter((model) => {
          if (model.id.match(/gpt/)) return true;
        }).map((model) => {
          return model.id;
        });
        console.log(models);
        global.shared.mainWindow.webContents.send('model-list', models);
      } catch (e) {
        console.log(e);
      }
    }).catch((e) => {
      console.log(e);
      // Nothing needs to be sent, the default model is still set
    });
  }
}

export default AIManager;
