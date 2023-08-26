import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledKeywords = styled.div`
  display: block;
  margin-bottom: 0.5rem;
`;

const StyledKeyword = styled.span`
  font-weight: 600;
  opacity: 0.3;
  color: var(--color-orange-spice);
  text-transform: uppercase;
  margin: 0 0.5rem;
  display: inline-block;
  font-size: 0.9rem;
  vertical-align: top;

  &:first-child {
    margin-left: 0;
  }
`;

export const Keywords = (props) => {
  const getKeywords = () => {
    return props?.keywords || null;
  };

  return (
    <>
      {getKeywords() && (
        <StyledKeywords>
          <For each={getKeywords()}>
            {(keyword) => {
              return (
                <StyledKeyword>{keyword}</StyledKeyword>
              );
            }}
          </For>
        </StyledKeywords>
      )}
    </>
  );
}
