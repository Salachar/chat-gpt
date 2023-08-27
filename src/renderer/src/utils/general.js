export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    // Success callback
  }).catch((err) => {
    console.error("Failed to copy text to clipboard: ", err);
  });

  // navigator.clipboard.readText().then((clipText) => {
  //   // If item is already in clipboard, copy it to the prompt
  //   if (clipText === message.original_content) {
  //     store.setChatPrompt({
  //       prompt: message.original_content,
  //     });
  //   }
  // }).catch(err => {
  //   console.error("Failed to read clipboard contents: ", err);
  // });
  // navigator.clipboard.writeText(message.original_content);
};
