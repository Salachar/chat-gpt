import { styled } from 'solid-styled-components';
import { MessagePieces } from './MessagePieces';
import { ActionsContainer } from './Actions';

export const Message = (props) => {
  return (
    <StyledMessage
      isUser={props.role === "user"}
      isAssistant={props.role === "assistant"}
      isGenerator={props.role === "generator"}
      isError={props.role === "error"}
      lowProfileHeader={true}
      noHeader={props.role === "generator" || props.role === "error"}
      actions={props.actions}
      actionContext={props.message}
    >
      <For each={props.message.lines}>
        {(line) => (
          <>
            {line.type === "text" && (
              <StyledLine>
                <MessagePieces pieces={line.pieces} />
              </StyledLine>
            )}
            {line.type === "list-header" && (
              <StyledListHeader indentCount={line.indent_count}>
                <MessagePieces pieces={line.pieces} />
              </StyledListHeader>
            )}
            {line.type === "list-item" && (
              <StyledListItem indentCount={line.indent_count}>
                <li><MessagePieces pieces={line.pieces} /></li>
              </StyledListItem>
            )}
          </>
        )}
      </For>
    </StyledMessage>
  );
};

const StyledMessage = styled(ActionsContainer)`
  display: block;
  padding: 0.5em 1em;
  font-size: 0.9em;
  ${({ lowProfileHeader }) => lowProfileHeader && `
    padding-right: 4em;
  `}
`;

const StyledLine = styled.span`
  display: block;
  padding: 0.2em 0.4em;
  white-space: pre-wrap;
`;

const StyledListHeader = styled.span`
  display: block;
  font-weight: 800;
  text-decoration: underline;
  padding-left: ${(props) => (props.indentCount - 1.5)}em;
  margin: 0.1em 0;
`;

const StyledListItem = styled.ul`
  display: block;
  padding-left: ${(props) => (props.indentCount * 1)}em;
  margin: 0.4em 0;
`;
