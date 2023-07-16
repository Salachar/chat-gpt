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
