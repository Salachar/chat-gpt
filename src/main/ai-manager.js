import MainChat from './chat_managers/main';

class AIManager {
  constructor (openai) {
    this.openai = openai;

    this.default_model = "gpt-3.5-turbo";

    this.main_chat = new MainChat(openai, {
      default_model: this.default_model,
    });

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
        global.shared.mainWindow.webContents.send('model-list', {
          default_model: this.default_model,
          models: models,
        });
      } catch (e) {
        // console.log(e);
      }
    }).catch((e) => {
      // console.log(e);
      // Nothing needs to be sent, the default model is still set
    });
  }
}

export default AIManager;
