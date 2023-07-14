import { styled } from 'solid-styled-components';
import { TextArea, Button } from '@inputs';
import { StonerEyes } from '@components/loaders/StonerEyes';

export const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  padding: 1rem 1rem 1rem 0;
  background-color: var(--color-blue);
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 1fr 0.85fr 10rem;
  grid-template-rows: 4rem 1fr 5rem;
  grid-template-areas:
    "stonereyes tabs tabs"
    "chathistory codesection chatactions"
    "prompt codesection chatactions";
`;

export const StyledStonerEyes = styled(StonerEyes)`
  grid-area: stonereyes;
`;

export const StyledTabs = styled.div`
  grid-area: tabs;
`;

export const StyledDisplay = styled.div`
  position: relative;
  grid-area: chathistory;
  background-color: var(--color-dark-blue-70);
  margin: 1rem 0;
  padding: 0.25rem;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow-y: scroll;

  * {
    cursor: text;
  }
`;

export const StyledCodeSection = styled(TextArea)`
  grid-area: codesection;
  margin: 1rem 1rem 0 1rem;
`;

export const StyledChatActions = styled.div`
  grid-area: chatactions;
  margin: 1rem 0;
`;

export const StyledChatAction = styled(Button)`
`;

export const StyledPrompt = styled(TextArea)`
  position: relative;
  resize: none;
  grid-area: prompt;
  background-color: var(--color-light-blue);
  border-radius: 0;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
`;

export const StyledSendButton = styled.div`
  min-width: 3rem;
  height: 100%;
  font-size: 32px;
  cursor: not-allowed;
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  transition: all 0.2s ease;

  ${({ enabled }) => enabled && `
    cursor: pointer;
    opacity: 1;
  `}
`;

export const StyledMessage = styled.span`
  display: block;
  padding: 0.25em 0.5em;
  font-size: 0.9em;
  font-weight: 600;

  ${({ isUser }) => isUser && `
    color: white;
  `}

  ${({ isAssistant }) => isAssistant && `
    color: var(--color-orange-spice);
  `}

  ${({ isGenerator }) => isGenerator && `
    color: #6ed86e;
  `}

  ${({ isError }) => isError && `
    color: #FF5C79;
  `}
`;

export const StyledPre = styled.pre`
  font-size: 0.9em !important;
  padding: 0 0.5em;
`;
