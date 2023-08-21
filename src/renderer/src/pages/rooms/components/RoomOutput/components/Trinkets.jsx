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
  font-size: 0.9em;
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

export const RoomTrinkets = (props) => {
  const getTrinkets = () => {
    return props?.room?.data?.trinkets || [];
  };

  return (
    <>
      {getTrinkets().length && (
        <StyledItems>
          <StyledHeader>Trinkets</StyledHeader>
          <For each={getTrinkets()}>
            {(trinket) => {
              const {
                name = "",
                type = "",
                description = "",
              } = trinket;
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
