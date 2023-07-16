const TOKEN_LIMIT = 4096;

export default class ChatBase {
  constructor (openai, parent, opts = {}) {
    const {
      temperature = 1,
      model = "gpt-3.5-turbo",
    } = opts;

    this.openai = openai;
    this.parent = parent;

    this.temperature = temperature;
    this.model = model;
  }

  parseMessage (message) {
    message = JSON.parse(JSON.stringify(message));

    try {
      message.original_content = message.content;
      message.split_content = message.content.split(/(```(.*?)\n([\s\S]*?)```)/gs);
      console.log(message.split_content)
      message.parsed_sub_messages = [];

      for (let i = 0; i < message.split_content.length; i++) {
        let chunk = message.split_content[i];
        chunk = chunk.trim();
        // Triple backticks means code and the following line is the language
        // with the line after being the code snippet
        if (chunk.includes("```")) {
          const language = message.split_content[i + 1];
          const code_snippet = message.split_content[i + 2];
          i += 2;

          if (code_snippet) {
            const parsed_sub_message = {
              type: "code",
              language: language || "code",
              code_snippet,
            };
            message.parsed_sub_messages.push(parsed_sub_message);
          }
        } else {
          if (chunk) {
            const parsed_sub_message = {
              type: "text",
              content: chunk,
              split_content: chunk.split("\n"),
            };
            message.parsed_sub_messages.push(parsed_sub_message);
          }
        }
      }
    } catch (e) {
      // console.log(e);
    }
    return message;
  }

  async send (opts = {}) {
    const {
      messages = [],
      onReply = () => {},
    } = opts;

    const chatCompletion = await this.openai.createChatCompletion({
      model: this.model,
      messages: messages,
      temperature: this.temperature,
    });

    try {
      const {
        data = {},
      } = chatCompletion;
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
      const parsed_message = this.parseMessage(message);
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
  }
};
