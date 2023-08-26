export const alphaTrim = (string) => {
  return string
    ?.replace(/[\W_]+/g, "")
    .replace(/ /g, "")
    .toLowerCase()
    .trim();
};

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const copy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

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
