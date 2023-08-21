import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import { store } from '@store/roomsStore';
import { copy } from '@utils';

class RoomsIPCEvents {
  constructor () {
    this.initialize();

    this.event_history = {
      'room': [],
      'room-error': [],
      'room-generation': [],
      'image-created': [],
    };

    window.room_ipc_events = this;
  }

  getHistory () {
    return this.event_history;
  }

  sendPrompt (opts = {}) {
    const {
      from = "chat",
    } = opts;

    const prompt = copy(store.getRoom().prompt).trim();

    if (store.getRoom().waiting) {
      return store.addMessage({
        message: {
          role: "assistant",
          content: "Please wait until I'm ready.",
        }
      });
    }

    if (from === "generate") {
      store.addMessage({
        message: {
          role: "generator",
          content: 'Generating room...',
        }
      });
    }

    store.setRoom("waiting", true);

    let input_data = null;
    // We don't always want to attach the input data, keying
    // off the word generate is a good heuristic
    if (from === "generate" || prompt.includes("generate")) {
      input_data = copy(store.getAllReadableInputData());
    }

    store.addMessage({
      message: {
        role: "user",
        content: prompt,
      }
    });

    const id = copy(store.getRoom().id);
    IPC.send('room', {
      id,
      prompt,
      input_data,
    });

    setTimeout(() => {
      store.setRoom("prompt", "");
    }, 0);
  }

  initialize () {
    console.log("Initializing room IPC events");

    IPC.on('room', (event, data) => {
      this.event_history['room'].push(data);
      const { id, message } = data;
      store.setRoom("waiting", false, { id });
      store.addMessage({ id, message });
    });

    IPC.on('room-error', (event, data) => {
      this.event_history['room-error'].push(data);
      const { id, error } = data;
      store.setRoom("waiting", false, { id });
      store.addMessages({
        id,
        messages: [{
          role: "generator",
          content: "An error occurred.",
        }, {
          role: "error",
          content: error,
        }],
      });
    });

    IPC.on('room-generation', (event, data) => {
      this.event_history['room-generation'].push(data);
      const { id, roomJSON } = data;
      store.setRoom("waiting", false, { id });
      store.setRoom("data", roomJSON, { id });
    });

    IPC.on('room-generation-addon', (event, data) => {
      this.event_history['room-generation'].push(data);
      const { id, roomJSON } = data;
      store.setRoom("waiting", false, { id });
      const existing_data = copy(store.getRoom(id).data);
      const customizer = (objValue, srcValue) => {
        if (isArray(objValue)) {
          return objValue.concat(srcValue);
        }
      };
      var merged_data = mergeWith(existing_data, roomJSON, customizer);
      store.setRoom("data", merged_data, { id });
    });

    IPC.on('image-created', (event, data) => {
      this.event_history['image-created'].push(data);
      const { id, images } = data;
      store.setRoom("isGeneratingImages", false, { id });
      store.setRoom("images", images, { id });
    });
  }
}

export default new RoomsIPCEvents();
