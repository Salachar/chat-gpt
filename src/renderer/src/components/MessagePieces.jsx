import { For } from 'solid-js'
import { styled } from 'solid-styled-components';

export const MessagePieces = (props) => {
  return (
    <StyledMessagePieces
      isUser={props.role === "user"}
      isAssistant={props.role === "assistant"}
      isGenerator={props.role === "generator"}
      isError={props.role === "error"}
    >
      <For each={props.pieces}>
        {(piece) => (
          <>
            {piece.type === 'text' && (
              <>{piece.piece}</>
            )}
            {piece.type === 'backticks' && (
              <StyledBacktick>{piece.piece}</StyledBacktick>
            )}
            {piece.type === 'bold' && (
              <StyledBold>{piece.piece}</StyledBold>
            )}
            {piece.type === 'italics' && (
              <StyledItalics>{piece.piece}</StyledItalics>
            )}
            {piece.type === 'underline' && (
              <StyledUnderline>{piece.piece}</StyledUnderline>
            )}
          </>
        )}
      </For>
    </StyledMessagePieces>
  );
};

const StyledUnderline = styled.span`
  text-decoration: underline;
`;

const StyledItalics = styled.span`
  font-style: italic;
`;

const StyledBacktick = styled.span`
  color: var(--color-orange-spice);
  background-color: rgba(0, 0, 0, 0.25);
  padding: 0.2rem 0.4em;
  border-radius: 4px;
`;

const StyledBold = styled.span`
  font-weight: 800;
`;

const StyledMessagePieces = styled.span``;
