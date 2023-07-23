import MainChat from './chat_managers/main';

class AIManager {
  constructor (openai) {
    this.openai = openai;

    this.default_model = "gpt-3.5-turbo";

    this.main_chat = new MainChat(openai, {
      default_model: this.default_model,
    });

    this.main_window_ready = false;
    this.models_ready = false;
    this.models = [];

    this.fetchModels();

    return this;
  }

  getModelData () {
    return {
      default_model: this.default_model,
      models: this.models,
    };
  }

  onWindowReady () {
    this.main_window_ready = true;
    if (this.models_ready) {
      // If the main window is ready and the models are ready, send the model data
      global.shared.mainWindow.webContents.send('model-list', this.getModelData());
    }
  }

  fetchModels () {
    this.openai.listModels().then((res) => {
      try {
        const models = res.data.data.filter((model) => {
          if (model.id.match(/gpt/)) return true;
        }).map((model) => {
          return model.id;
        });
        this.models_ready = true;
        this.models = models;
        if (this.main_window_ready) {
          global.shared.mainWindow.webContents.send('model-list', this.getModelData());
        }
      } catch (e) {
        console.log(e);
      }
    }).catch((e) => {
      // Nothing needs to be sent, the default model is still set
      console.log(e);
    });
  }
}

export default AIManager;
