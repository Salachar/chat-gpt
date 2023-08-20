import { store } from '@store/roomsStore';

class RoomIPCEvents {
  constructor () {
    this.initialize();
  }

  initialize () {
    IPC.on('room', (event, data) => {
      const { id, message } = data;
      store.setRoom("waiting", false, { id });
      store.addMessage({ id, message });
    });

    IPC.on('room-error', (event, data) => {
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
      const { id, roomJSON } = data;
      store.setRoom("waiting", false, { id });
      store.setRoom("data", roomJSON, { id });
    });

    IPC.on('image-created', (event, data) => {
      const { id, images } = data;
      store.setRoom("isGeneratingImages", false, { id });
      store.setRoom("images", images, { id });
    });
  }
}

export default RoomIPCEvents;
