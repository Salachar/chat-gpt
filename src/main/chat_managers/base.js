import MessageParser from "../../utils/message-parser";

const TOKEN_LIMIT = 4096;

export default class ChatBase {
  constructor (openai, parent, opts = {}) {
    const {
      temperature = 1,
      model = "gpt-3.5-turbo-16k",
    } = opts;

    this.openai = openai;
    this.parent = parent;

    this.temperature = temperature;
    this.model = model;
  }

  send (opts = {}) {
    const {
      model = this.model,
      messages = [],
      onReply = () => {},
    } = opts;

    console.log("Sending message to OpenAI API using model: " + model);

    this.openai.createChatCompletion({
      model: model,
      messages: messages,
      temperature: this.temperature,
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

        // const parsed_message = this.parseMessage(message);
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
