import { styled } from 'solid-styled-components';
import { MessagePieces } from './MessagePieces';

export const Message = (props) => {
  return (
    <StyledMessage
      isUser={props.role === "user"}
      isAssistant={props.role === "assistant"}
      isGenerator={props.role === "generator"}
      isError={props.role === "error"}
    >
      <For each={props.message.lines}>
        {(line) => (
          <StyledLine>
            <MessagePieces pieces={line.pieces} />
          </StyledLine>
        )}
      </For>
    </StyledMessage>
  );
};

const StyledMessage = styled.div`
  display: block;
  padding: 0.5em 1em;
  font-size: 0.9em;
`;

const StyledLine = styled.span`
  display: block;
  padding: 0.2em 0.4em;
  white-space: pre-wrap;
`;
