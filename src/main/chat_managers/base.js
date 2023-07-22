import MessageParser from "../../utils/message-parser";

const TOKEN_LIMIT = 4096;

export default class ChatBase {
  constructor (openai) {
    this.openai = openai;
  }

  send (opts = {}) {
    const {
      model,
      messages = [],
      onReply = () => {},
    } = opts;

    if (!model) {
      onReply({
        error: "There was no model for this chat.",
      });
      return;
    }

    console.log("Sending message to OpenAI API using model: ", model);

    this.openai.createChatCompletion({
      model: model,
      messages: messages,
      temperature: 1,
    }).then((res) => {
      try {
        const {
          data = {},
        } = res;
        const {
          usage = {},
          choices = [],
        } = data;
        const {
          prompt_tokens = 0,
          completion_tokens = 0,
          total_tokens = 0,
        } = usage;

        const tokens_left = TOKEN_LIMIT - total_tokens;
        const token_data = {
          prompt_tokens,
          completion_tokens,
          total_tokens,
          tokens_left
        };

        const message = choices[0].message;
        const parsed_message = MessageParser.parse(message);

        parsed_message.token_data = token_data;
        onReply({
          original: message,
          parsed: parsed_message,
        });
      } catch (e) {
        onReply({
          error: e.message,
        });
      }
    }).catch((e) => {
      onReply({
        error: e.message,
      });
    });
  }
};
