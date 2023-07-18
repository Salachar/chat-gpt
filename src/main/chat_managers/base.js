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

  // parseMessage (message) {
  //   message = JSON.parse(JSON.stringify(message));

  //   try {
  //     message.original_content = message.content;
  //     message.split_content = message.content.split(/(```(.*?)\n([\s\S]*?)```)/gs);
  //     message.parsed_sub_messages = [];

  //     for (let i = 0; i < message.split_content.length; i++) {
  //       let chunk = message.split_content[i];
  //       chunk = chunk.trim();
  //       // Triple backticks means code and the following line is the language
  //       // with the line after being the code snippet
  //       if (chunk.includes("```")) {
  //         const language = message.split_content[i + 1];
  //         const code_snippet = message.split_content[i + 2];
  //         i += 2;

  //         if (code_snippet) {
  //           const parsed_sub_message = {
  //             type: "code",
  //             language: language || "code",
  //             code_snippet,
  //           };
  //           message.parsed_sub_messages.push(parsed_sub_message);
  //         }
  //       } else {
  //         if (chunk) {
  //           const parsed_sub_message = {
  //             type: "text",
  //             content: chunk,
  //             split_content: chunk.split("\n"),
  //           };
  //           message.parsed_sub_messages.push(parsed_sub_message);
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     // console.log(e);
  //   }
  //   return message;
  // }

  checkStyles (pieces, type = "", indicator = "") {
    // Pieces is an array of word pieces that make up a line, typically a sentence
    // We need to go through pieces and check for styles like backticks, bold, italics, etc.
    if (!indicator) return pieces;

    let index = 0;
    let length = pieces.length;
    for (; index < length; ++index) {
      const piece = pieces[index];
      const {
        type: piece_type,
        piece: piece_content,
      } = piece;

      if (piece_type === "text") {
        const indicator_split = piece_content.split(indicator);
        const styles = indicator_split.map((value, style_index) => {
          // If index is odd, it means the string was inside whatever indicator we're using
          const odd = style_index % 2 !== 0;
          const word_type = odd ? type : "text";
          return {
            type: word_type,
            piece: value,
          };
        });

        // Remove the original piece and replace it with the styles
        pieces.splice(index, 1, ...styles);
        // Reset the index to the beginning of the styles
        // index = 0;
        // Reset the length to the new length of the pieces
        length = pieces.length;
      }
    }

    return pieces;

    // const indicator_split = line.split(indicator);
    // const styles = indicator_split.map((value, index) => {
    //   // If index is odd, it means the string was inside whatever indicator we're using
    //   const odd = index % 2 !== 0;
    //   const word_type = odd ? type : "text";
    //   return {
    //     type: word_type,
    //     piece: value,
    //   };
    // });

    // return styles;
  }

  parseMessage (message) {
    message = JSON.parse(JSON.stringify(message));

    try {
      const og_content = message.content;
      const split_content = og_content.split(/(```(.*?)\n([\s\S]*?)```)/gs);
      message.content = [];
      message.original_content = og_content;

      for (let i = 0; i < split_content.length; i++) {
        const chunk = split_content[i];
        const chunk_trimmed = chunk.trim();
        if (!chunk_trimmed) continue;

        let parsed_sub_message = null;
        if (chunk_trimmed.includes("```")) {
          // Triple backticks means code and the following line is the language
          // with the line after being the code snippet
          const language = split_content[i + 1];
          const code_snippet = split_content[i + 2];
          i += 2;

          if (!code_snippet) continue;

          parsed_sub_message = {
            type: "code",
            language: language || "code",
            code_snippet,
          };
          // message.content.push(parsed_sub_message);
        } else {
          // For now we consider these just normal text messages
          const subchunks = chunk.split("\n");

          let lines = [];
          // const lines = subchunks.map((line) => {
          for (let j = 0; j < subchunks.length; j++) {
            const line = subchunks[j];
            const trimmed_line = line.trim();
            // Every subchunk is initially just text
            let type = "text";
            // Check for list items, they start with a dash or asterisk
            // This ignores numbered lists for now
            if (trimmed_line.startsWith("-") || trimmed_line.startsWith("*")) {
              type = "list-item";
            }
            // Check for list headers, they end with a colon
            // Check for headers after items, sometimes they start with a dash or asterisk
            if (trimmed_line.endsWith(":")) {
              type = "list-header";
            }
            // Spacers are just empty lines
            if (!trimmed_line) {
              continue;
              type = "spacer";
            }

            // The initial pieces is the entire line
            let pieces = [{
              type: "text",
              piece: line,
            }];

            // After determinining type, we can breakdown the subchunk into styles like backticks, bold, italics, etc.
            pieces = this.checkStyles(pieces, "backticks", "`");
            // Check for bold
            pieces = this.checkStyles(pieces, "bold", "**");
            // Check for italics
            // pieces = this.checkStyles(pieces, "italics", "*");
            // Check for underline
            pieces = this.checkStyles(pieces, "underline", "__");

            lines.push({
              type,
              content: line,
              pieces,
            });
            // return {
            //   type,
            //   content: line,
            //   pieces,
            // };
          }

          // sub_C

          parsed_sub_message = {
            type: "text",
            lines,
          };

          // const subchunks = chunk.split("\n");
          // subchunks.forEach((subchunk) => {
          //   // Check for list headers, they end with a colon

          //   // Check for list items, they start with a dash or asterisk
          //   // This ignores numbered lists for now

          //   // After determinining type, we can breakdown the subchunk into styles like backticks, bold, italics, etc.
          //   // C

          // });
        }

        if (parsed_sub_message) {
          message.content.push(parsed_sub_message);
        }
      }
    } catch (e) {
      // console.log(e);
    }
    return message;
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
    }).catch((e) => {
      onReply({
        error: e.message,
      });
    });
  }
};
