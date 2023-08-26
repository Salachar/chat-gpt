import { copyToClipboard } from '@utils';

export const copyAction = (message_field) => {
  return {
    icon: "files",
    title: "Copy to Clipboard",
    handler: (message) => {
      let text = "";
      if (message_field) {
        text = message[message_field];
      } else {
        text = message;
      }
      copyToClipboard(text);
    },
  };
};
