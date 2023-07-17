import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Eyes } from './Eyes';
import { SpeechBubble } from './SpeechBubble';
import { TextInput } from './TextInput';

export const MainChatHeader = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledSnippy>
        <StyledEyes />
        {store.getChatWaiting() && (
          <StyledSpeechBubble />
        )}
      </StyledSnippy>
      <StyledNameInput
        value={store.getChatName()}
        onChange={(value) => {
          store.setChatName({
            name: value,
          });
        }}
      />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
`;

const StyledSnippy = styled.div`
  grid-area: snippy;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 0.25rem;
`;

const StyledEyes = styled(Eyes)`
  margin-right: 1rem;
  font-size: 0.9rem;
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  font-size: 0.5rem;
`;

const StyledNameInput = styled(TextInput)`
  font-size: 1.25rem;
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
`;
