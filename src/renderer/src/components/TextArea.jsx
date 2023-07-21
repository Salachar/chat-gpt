import { styled } from 'solid-styled-components';

const StyledTextArea = styled.textarea`
  border: none;
  box-shadow: none;
  background-color: var(--color-main-dark);
  padding: 0.5rem;
  box-sizing: border-box;
  outline: 0;
  resize: vertical;
  color: white;
  font-size: 0.85rem;
  vertical-align: top;

  &::placeholder {
    color: #4f5886;
  }

  ${({ wordwrap }) => wordwrap && `
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  `}
`;

// const handleTab = (e) => {
//   const textarea = e.currentTarget;

//   // Get the current selection start and end positions
//   const start = textarea.selectionStart;
//   const end = textarea.selectionEnd;

//   // Check if there is any text selected
//   const hasTextSelected = start !== end;

//   if (hasTextSelected) {
//     // Get the full text of the textarea
//     const text = textarea.value;

//     // Get the start and end positions of the current line
//     let lineStart = start;
//     while (lineStart > 0 && text[lineStart - 1] !== '\n') {
//       lineStart--;
//     }
//     let lineEnd = end;
//     while (lineEnd < text.length && text[lineEnd] !== '\n') {
//       lineEnd++;
//     }

//     // Get the selected line
//     const selectedLine = text.slice(lineStart, lineEnd);

//     // Determine if the shift key is also pressed (for shift tab)
//     const isShiftKey = e.shiftKey;

//     // Insert the tab or shift tab depending on the shift key
//     const newText = isShiftKey ? unindent(selectedLine) : indent(selectedLine);

//     // Update the textarea value with the new text
//     textarea.value =
//       textarea.value.slice(0, lineStart) +
//       newText +
//       textarea.value.slice(lineEnd);

//     // Move the cursor position to the end of the inserted text
//     textarea.selectionStart = textarea.selectionEnd =
//       lineStart + newText.length;
//   } else {
//     // No text selected, behave like a normal tab event
//     const tabCharacter = '\t';

//     // Insert the tab character at the current cursor position
//     textarea.value =
//       textarea.value.slice(0, start) +
//       tabCharacter +
//       textarea.value.slice(end);

//     // Move the cursor position after the inserted tab character
//     textarea.selectionStart = textarea.selectionEnd = start + 1;
//   }
// };

const handleTab = (e) => {
  const textarea = e.currentTarget;
  const tabCharacter = '\t';

  // Get the current selection start and end positions
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // Check if there is any text selected
  const hasTextSelected = start !== end;

  if (hasTextSelected) {
    // Get the full text of the textarea
    const text = textarea.value;

    // Get the start and end positions of the current lines
    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
      lineStart--;
    }
    let lineEnd = end;
    while (lineEnd < text.length && text[lineEnd] !== '\n') {
      lineEnd++;
    }

    // Get the selected lines
    const selectedLines = text.slice(lineStart, lineEnd).split('\n');

    // Determine if the shift key is also pressed (for shift tab)
    const isShiftKey = e.shiftKey;

    // Indent or unindent each line individually
    const indentedLines = selectedLines.map((line) =>
      isShiftKey ? unindent(line) : indent(line)
    );

    // Construct the new text with the indented/unindented lines
    const newText =
      text.slice(0, lineStart) +
      indentedLines.join('\n') +
      text.slice(lineEnd);

    // Update the textarea value with the new text
    textarea.value = newText;

    // Move the cursor position to the end of the inserted text
    textarea.selectionStart = lineStart;
    textarea.selectionEnd = end + indentedLines.join('\n').length;
  } else {
    // No text selected, behave like a normal tab event

    // Insert the tab character at the current cursor position
    // textarea.value = textarea.value.slice(0, start) + tabCharacter + textarea.value.slice(end);
    textarea.value = textarea.value.slice(0, start) + '  ' + textarea.value.slice(end);

    // Move the cursor position after the inserted tab character
    textarea.selectionStart = textarea.selectionEnd = start + 2;
  }
};


const indent = (line) => {
  // Add tab character at the beginning of the line
  // return '\t' + line;
  return '  ' + line;
};

const unindent = (line) => {
  // Remove tab character from the beginning of the line
  // return line.replace(/^\t/, '');
  return line.replace(/^  /, '');
};

export const TextArea = (props) => {
  return (
    <StyledTextArea
      ref={props.ref}
      value={props.value || ""}
      class={props.class}
      wordwrap={props.wordwrap}
      spellcheck={props.spellcheck || true}
      placeholder={props.placeholder}
      onScroll={(e) => {
        if (props.onScroll) {
          props.onScroll(e);
        }
      }}
      onKeyDown={(e) => {
        // const textarea = e.currentTarget;
        if (e.key === 'Tab') {
          e.preventDefault(); // Prevent default focus switching behavior
          handleTab(e);
          // // Insert a tab character at the current caret position
          // const start = textarea.selectionStart;
          // const end = textarea.selectionEnd;
          // const value = textarea.value;

          // // Literally tab character
          // // textarea.value = value.substring(0, start) + '\t' + value.substring(end);
          // // 2 spaces
          // textarea.value = value.substring(0, start) + '  ' + value.substring(end);

          // // Move the caret position after the inserted tab character
          // textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      }}
      onKeyUp={(e) => {
        if (props.onChange) {
          props.onChange(e.currentTarget.value, e);
        }
      }}
    />
  );
}
