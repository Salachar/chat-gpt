export const parseMessagesForChat = (messages = [], opts = {}) => {
  const { omitCode = false } = opts;
  const parsedMessages = [];

  if (!Array.isArray(messages)) {
    console.log("Messages is not an array, I don't know what the fuck is happening");
    return parsedMessages;
  }

  messages.forEach((message) => {
    const {
      role = "",
      content = "",
      room = null,
    } = message;

    // No system messages in the chat
    if (role === 'system') return;
    // Generation prompts
    if (role === "user" && content.match(/Please generate a room/)) return;

    if (role === "assistant") { // Format and ouput any room generation messages
      if (room) {
        parsedMessages.push({
          role: "generator",
          content: `Generated Room: ${room.name}`
        });
        if (room.generation_summary) {
          parsedMessages.push({
            role: "generator",
            content: `Generation Summary: ${room.generation_summary}`
          });
        }
        if (room.image_prompt) {
          parsedMessages.push({
            role: "generator",
            content: `Current Image Prompt: ${room.image_prompt}`
          });
        }
        if (!omitCode) {
          parsedMessages.push({
            role,
            code_snippet: JSON.stringify(room, null, 2),
            language: "JSON",
          });
        }
        parsedMessages.push({
          role,
          content: `I'm ready to assist you again!`
        });
        return;
      }
    }

    parsedMessages.push(message);
  });

  return parsedMessages;
}
