import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Eyes } from './Eyes';
import { SpeechBubble } from './SpeechBubble';

export const MainChatHeader = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledSnippy>
        <StyledEyes />
        {store.getChatWaiting() && (
          <StyledSpeechBubble />
        )}
      </StyledSnippy>
      <StyledBigRedCancelButton onClick={() => {
        IPC.send('clear', {
          chatId: store.currentChatId(),
        });
        store.clearChat();
      }}>
        <StyledX class="icss-x" />
      </StyledBigRedCancelButton>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
`;

const StyledSnippy = styled.div`
  grid-area: snippy;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const StyledEyes = styled(Eyes)`
  margin-right: 1rem;
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  font-size: 0.7rem;
`;

const StyledBigRedCancelButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-red);
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.8);
  }
`;

const StyledX = styled.i`
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 2rem;
  transform: translateX(-50%) translateY(-50%);
`;
