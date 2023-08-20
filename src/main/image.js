import { ipcMain } from 'electron'

class ImageAI {
  constructor (openai) {
    this.openai = openai;

    this.setIPCEvents();
  }

  setIPCEvents () {
    ipcMain.on('image-create', async (event, data) => {
      const {
        id = "",
        prompt = "",
      } = data;
      const response = await this.openai.createImage({
        prompt,
        size: "512x512", // "256x256" | "1024x1024"
        n: 6, // max 10
      });
      try {
        const images = response?.data?.data || [];
        event.reply('image-created', {
          id,
          images
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
}

export default ImageAI;
