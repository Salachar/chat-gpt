import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledActionsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledActions = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
`;

const StyledIcon = styled.i`
  font-size: 1rem;
  color: var(--color-orange-spice);
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 1.25rem;
  }
`;

const StyledContent = styled.div`
  position: relative;
  flex-grow: 1;
  overflow: scroll;
`;

export const ActionsContainer = (props) => {
  return (
    <StyledActionsContainer
      class={props.class}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <StyledActions>
        <For each={Object.entries(props.actions)}>
          {([icon, handler]) => (
            <StyledIcon class={`icss-${icon}`} onClick={handler} />
          )}
        </For>
      </StyledActions>
      <StyledContent>
        {props.children}
      </StyledContent>
    </StyledActionsContainer>
  );
}
