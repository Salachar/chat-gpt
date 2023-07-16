import { styled } from 'solid-styled-components';
import { store } from '@store';

import { ActionsContainer } from './Actions';
import { TextArea } from './TextArea';

const StyledContainer = styled(ActionsContainer)``;

const StyledCodeTextArea = styled(TextArea)`
  white-space: nowrap;
  width: 100%;
  height: 100%;
  resize: none;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`;

export const CodeSection = (props) => {
  return (
    <StyledContainer
      class={props.class}
      label="Code Section"
      actions={{
        "text-justify": () => {
          // Controls word wrap of the code section
          store.toggleChatWordwrap();
        },
        "files": () => {
          // Copy code to navigator clipboard
          navigator.clipboard.writeText(store.getChatCode());
        },
        "x": () => {
          // Clear the code section
          store.setChatCode({
            code: ""
          });
        }
      }}
    >
      <StyledCodeTextArea
        wordwrap={store.getChatCodeWrap()}
        value={store.getChatCode()}
        onChange={(value) => {
          store.setChatCode({
            code: value
          });
        }}
      />
    </StyledContainer>
  );
};
