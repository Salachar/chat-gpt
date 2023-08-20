import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledItems = styled.div`
  position: relative;
`;

const StyledItem = styled.div`
  position: relative;

  &:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

const StyledHeader = styled.h2`
  margin-bottom: 0.5rem;
`;

const StyledMeta = styled.div`
  position: relative;
`;

const StyledName = styled.span`
  color: var(--color-orange-spice);
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  margin-right: 0.5rem;
`;

const StyledType = styled.span`
  color: white;
  opacity: 0.5;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.7rem;
  display: inline-block;
`;

const StyledDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
`;

export const RoomPuzzles = (props) => {
  const getPuzzles = () => {
    return props?.room?.data?.puzzles || [];
  };

  return (
    <>
      {getPuzzles().length && (
        <StyledItems>
          <StyledHeader>Puzzles</StyledHeader>
          <For each={getPuzzles()}>
            {(puzzle) => {
              const {
                name = "",
                type = "",
                description = "",
              } = puzzle;
              return (
                <StyledItem>
                  <StyledMeta>
                    <StyledName>{name}</StyledName>
                    <StyledType>{type}</StyledType>
                  </StyledMeta>
                  <StyledDescription>{description}</StyledDescription>
                </StyledItem>
              );
            }}
          </For>
        </StyledItems>
      )}
    </>
  );
}