import MessageParser from "../../utils/message-parser";

const TOKEN_LIMIT_4K = 4096;

export default class ChatBase {
  constructor (openai) {
    this.openai = openai;
  }

  getTokenLimit (model) {
    let token_limit = 0;
    // gpt 3 models have a base limit of 4096 tokens
    if (model.includes("gpt-3")) {
      token_limit = TOKEN_LIMIT_4K;
    }
    // gpt 4 models have a base limit of 8192 tokens
    if (model.includes("gpt-4")) {
      token_limit = 2 * TOKEN_LIMIT_4K;
    }
    // check if the model has a limit defined in it like "16k" or "32k"
    if (model.includes("16k")) {
      token_limit = 4 * TOKEN_LIMIT_4K;
    }
    if (model.includes("32k")) {
      token_limit = 8 * TOKEN_LIMIT_4K;
    }
    return token_limit;
  }

  send (opts = {}) {
    let {
      model = "",
      messages = [],
      onReply = () => {},
    } = opts;

    if (!model) model = "gpt-4";
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

        const token_limit = this.getTokenLimit(model);
        const tokens_left = token_limit - total_tokens;
        const token_data = {
          prompt_tokens,
          completion_tokens,
          total_tokens,
          tokens_left,
          token_limit,
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
