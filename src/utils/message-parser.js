class MessageParser {
  static parse(message) {
    message = JSON.parse(JSON.stringify(message));

    try {
      if (Array.isArray(message.content)) {
        // This is a message that has already been parsed and can be returned
        console.log("Already parsed");
        return message;
      }

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
        } else {
          // For now we consider these just normal text messages
          const subchunks = chunk.split("\n");

          let lines = [];
          for (let j = 0; j < subchunks.length; j++) {
            let line = subchunks[j];
            let trimmed_line = line.trim();

            // Every subchunk is initially just text
            let type = "text";
            let indent_count = null;

            // Check for a list type item, starting with hypen or asterisk, or ending with colon
            if (trimmed_line.match(/^-|^\*|:$/)) {
              type = trimmed_line.endsWith(":") ? "list-header" : "list-item";
              indent_count = line.match(/^\s*/)[0].length;
              // if (indent_count < 2) indent_count = 2;
              if (trimmed_line.startsWith("-")) {
                line = line.trim().replace(/^-/, "").trim();
              } else if (trimmed_line.startsWith("*")) {
                line = line.trim().replace(/^\*/, "").trim();
              }
            }

            // Spacers are just empty lines
            if (!trimmed_line) continue;

            // The initial pieces is the entire line
            let pieces = [{
              type: "text",
              piece: line,
            }];

            // After determinining type, we can breakdown the subchunk into styles
            pieces = this.checkStyles(pieces, "backticks", "`");
            pieces = this.checkStyles(pieces, "bold", "**");
            pieces = this.checkStyles(pieces, "underline", "__");
            // Italics needs better parsing or a better indicator
            // asterisks are used for lists and bold
            // pieces = this.checkStyles(pieces, "italics", "*");

            const line_data = {
              type,
              content: line,
              pieces,
            }
            // We want to make sure we capture 0 indent counts
            if (typeof indent_count === "number") line_data.indent_count = indent_count;

            lines.push(line_data);
          }

          let first_indent_found = false;
          let indent_divisor_mod = 1;
          let indent_mod_buffer = 0;
          for (let j = 0; j < lines.length; j++) {
            const line = lines[j];
            const { indent_count, type = "" } = line;
            // Ignore non-list types
            if (!type.match(/list-/)) continue;

            if (typeof indent_count === "number" && !first_indent_found) {
              // We found the first indent, so we can use it as the divisor if
              // the indent seems set higher than 2.
              first_indent_found = true;
              if (indent_count > 2) {
                // The indent count is too high, so we need to reset it
                indent_divisor_mod = indent_count / 2;
              }
              if (indent_count === 0) {
                // Set the buffer, which adds whitespace to lists that seemingly have no indent
                indent_mod_buffer = 2;
              }
            }

            // If the item is a list-header and the next line is not a list- type
            // We want to set it to a text type and ignore it
            if (type === "list-header") {
              const next_line = lines[j + 1];
              // If there is no next line, or the next line is not a list type
              if (!next_line || next_line.type !== "list-item") {
                line.type = "text";
                continue;
              }
            }

            // Divide the indent count by the divisor mod
            line.indent_count = indent_count / indent_divisor_mod;
            // Add the buffer to the indent count
            line.indent_count += indent_mod_buffer;
          }

          parsed_sub_message = {
            type: "text",
            lines,
          };
        }

        if (parsed_sub_message) {
          message.content.push(parsed_sub_message);
        }
      }
    } catch (e) {
      console.log(e);
    }
    return message;
  }

  static checkStyles(pieces, type = "", indicator = "") {
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
        // Reset the length to the new length of the pieces
        length = pieces.length;
      }
    }

    return pieces;
  }
}

export default MessageParser;
