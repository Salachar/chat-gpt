import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledActionsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledLabel = styled.span`
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
`;

const StyledActions = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const StyledIconWrapper = styled.div`
  cursor: pointer;
  &:hover {
    filter: brightness(1.3);
  }
  &:active {
    filter: brightness(0.8);
  }
  &:not(:last-child) {
    margin-right: 1.25rem;
  }
`;

const StyledIcon = styled.i`
  font-size: 1rem;
  color: var(--color-orange-spice);
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
      <StyledHeader>
        <StyledLabel>{props.label}</StyledLabel>
        <StyledActions>
          <For each={Object.entries(props.actions)}>
            {([icon, handler]) => (
              <StyledIconWrapper onClick={handler}>
                <StyledIcon class={`icss-${icon}`} />
              </StyledIconWrapper>
            )}
          </For>
        </StyledActions>
      </StyledHeader>
      <StyledContent>
        {props.children}
      </StyledContent>
    </StyledActionsContainer>
  );
}
