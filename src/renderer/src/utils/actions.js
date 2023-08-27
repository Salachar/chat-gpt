import { copyToClipboard } from '@rendererUtils';

export const copyAction = () => {
  return {
    icon: "files",
    title: "Copy to Clipboard",
    handler: (message) => {
      copyToClipboard(message.original_content);
    },
  };
};

export const copyCodeAction = () => {
  return {
    icon: "files",
    title: "Copy Code to Clipboard",
    handler: (message) => {
      copyToClipboard(message.code_snippet);
    },
  };
}
