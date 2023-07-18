import { Show } from 'solid-js'
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
      <Show when={!props.message.pieces || !props.message.pieces.length}>
        {props.message.content}
      </Show>
      <Show when={props.message.pieces && props.message.pieces.length}>
        <MessagePieces pieces={props.message.pieces} />
      </Show>
    </StyledMessage>
  );
};

const StyledMessage = styled.span`
  display: block;
  padding: 0.5em 1em;
  font-size: 0.9em;
`;
