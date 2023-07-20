import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Eyes } from './Eyes';
import { SpeechBubble } from './SpeechBubble';

export const Snippy = () => {
  return (
    <StyledSnippy title="This is Snippy, the Code Snippet AI Bot">
      {/* <StyleThoughtBubble /> */}
      {store.getFirstWaiting() && (
        <StyledSpeechBubble />
      )}
      <StyledEyes animate_mustache={store.getFirstWaiting()} />
    </StyledSnippy>
  );
}

const StyleThoughtBubble = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-light-blue);
  opacity: 0.5;
  border-radius: 1rem;
  margin: 1rem;

  &:before {
    content: "";
    position: absolute;
    bottom: -10px;
    right: 10px;
    width: 1rem;
    height: 8px;
    background-color: var(--color-light-blue);
    border-radius: 1rem;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -18px;
    right: 12px;
    width: 10px;
    height: 6px;
    background-color: var(--color-light-blue);
    border-radius: 1rem;
  }
`;

const StyledSnippy = styled.div`
  grid-area: snippy;
  padding-bottom: 0.25rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const StyledEyes = styled(Eyes)`
  margin-right: 0.5rem;
  font-size: 0.9rem;
  white-space: nowrap;
  background-color: var(--color-light-blue);
  padding: 0.5rem;
  border-radius: 1rem;
  display: inline-block;
  margin-top: 4.5rem;
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.8rem;
  padding: 1rem 1rem 0 0;
`;
