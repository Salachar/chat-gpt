import { store } from '@store/roomsStore';

class RoomIPCEvents {
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

  initialize () {
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
      window.last_room_json = roomJSON;
      store.setRoom("waiting", false, { id });
      store.setRoom("data", roomJSON, { id });
    });

    IPC.on('image-created', (event, data) => {
      this.event_history['image-created'].push(data);
      const { id, images } = data;
      store.setRoom("isGeneratingImages", false, { id });
      store.setRoom("images", images, { id });
    });
  }
}

export default RoomIPCEvents;
