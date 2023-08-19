import { styled } from 'solid-styled-components';
import { TextArea, Button } from '@inputs';

export const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  padding: 1rem 1rem 1rem 0;
  background-color: var(--color-blue);
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr;
  grid-template-rows: 2rem 1fr 3rem;
  grid-template-areas:
    "actions"
    "chathistory"
    "prompt";
`;

export const StyledActions = styled.div`
  position: relative;
  grid-area: actions;
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
    /* user-select: all; */
    cursor: text;
  }
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
  font-size: 0.8em !important;
`;

export const StyledPromptContainer = styled.div`
  position: relative;
  grid-area: prompt;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
`;

export const StyledPrompt = styled(TextArea)`
  position: relative;
  resize: none;
  background-color: var(--color-light-blue);
  border-radius: 0;
`;
