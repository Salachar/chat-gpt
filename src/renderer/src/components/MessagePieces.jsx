import { For } from 'solid-js'
import { styled } from 'solid-styled-components';

export const MessagePieces = (props) => {
  return (
    <>
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
    </>
  );
};

const StyledUnderline = styled.span`
  text-decoration: underline;
`;

const StyledItalics = styled.span`
  font-style: italic;
`;

const StyledBacktick = styled.span`
  color: #f8c555;
  background-color: #262433 !important;
  padding: 0.2em 0.4em;
  border-radius: 4px;
`;

const StyledBold = styled.span`
  font-weight: 800;
`;
