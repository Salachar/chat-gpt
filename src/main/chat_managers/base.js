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

    this.setIPCEvents();
  }

  setIPCEvents () {

  }

  isJSONMessage (message) {
    try {
      const parsed_json = JSON.parse(message.content);
      if (Object.keys(parsed_json).length) {
        message.json = parsed_json;
      }
    } catch (e) {
      // console.log(e);
    }
    return message;
  }

  isCodeMessage (message) {
    try {
      if (message.content.includes("```")) {
        const code_chunks = message.content.split(/(```(.*?)\n([\s\S]*?)```)/gs);
        message.code_chunks = code_chunks;
        message.original_content = message.content;
        message.content = code_chunks[0];
        message.language = code_chunks[2];
        message.code_snippet = code_chunks[3];

        // if (i % 4 === 0) { // regular text
        //   return (
        //     <StyledMessage
        //       isUser={message.role === "user"}
        //       isAssistant={message.role === "assistant"}
        //       isGenerator={message.role === "generator"}
        //     >
        //       {part}
        //     </StyledMessage>
        //   );
        // } else if (i % 4 === 2) { // language specifier
        //   // We don't need to render the language specifier,
        //   // but you could do something with it here if you want
        //   return null;
        // } else if (i % 4 === 3) { // code snippet
        //   return (
        //     <StyledPre>
        //       <code class="language-javascript" innerHTML={
        //         Prism.highlight(part, Prism.languages.javascript, 'javascript')
        //       }></code>
        //     </StyledPre>
        //   );
        // } else { // backticks
        //   // We don't need to render the backticks
        //   return null;
        // }
      }
    } catch (e) {
      // console.log(e);
    }
    return message;
  }

  parseMessage (message) {
    message = JSON.parse(JSON.stringify(message));

    try {
      // message = this.isJSONMessage(message);
      // message = this.isCodeMessage(message);
      message.original_content = message.content;
      message.split_content = message.content.split(/(```(.*?)\n([\s\S]*?)```)/gs)
      message.parsed_sub_messages = [];

      // message.split_content.forEach((line) => {
        // line = line.trim();
        // const code_chunks = line.split(/(```(.*?)\n([\s\S]*?)```)/gs);

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
                language: language || "javascript",
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

        // if (line.includes("```")) {
        //   const code_chunks = line.split(/(```(.*?)\n([\s\S]*?)```)/gs);
        //   message.code_chunks = code_chunks;
        //   message.original_content = message.content;
        //   message.content = code_chunks[0];
        //   message.language = code_chunks[2];
        //   // message.code_snippet
        // }
      // });


      // message.split_content.forEach((line) => {
      //   line = line.trim();
      //   const code_chunks = line.split(/(```(.*?)\n([\s\S]*?)```)/gs);

      //   for (let i = 0; i < code_chunks.length; i++) {
      //     let chunk = code_chunks[i];
      //     // Triple backticks means code and the following line is the language
      //     // with the line after being the code snippet
      //     if (chunk.includes("```")) {
      //       const language = code_chunks[i + 1];
      //       const code_snippet = code_chunks[i + 2];
      //       const parsed_sub_message = {
      //         type: "code",
      //         language,
      //         code_snippet,
      //       };
      //       message.parsed_sub_messages.push(parsed_sub_message);
      //       i += 2;
      //     } else {
      //       const parsed_sub_message = {
      //         type: "text",
      //         content: chunk,
      //       };
      //       message.parsed_sub_messages.push(parsed_sub_message);
      //     }
      //   }

      //   // if (line.includes("```")) {
      //   //   const code_chunks = line.split(/(```(.*?)\n([\s\S]*?)```)/gs);
      //   //   message.code_chunks = code_chunks;
      //   //   message.original_content = message.content;
      //   //   message.content = code_chunks[0];
      //   //   message.language = code_chunks[2];
      //   //   // message.code_snippet
      //   // }
      // });

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

      console.log(JSON.stringify(token_data, null, 2));
      const message = choices[0].message;
      onReply({
        original: message,
        parsed: this.parseMessage(message),
        token_data,
      });
    } catch (e) {
      console.log("ERROR", e);
    }
  }
};
