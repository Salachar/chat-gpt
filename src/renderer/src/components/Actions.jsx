import { For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';

const StyledActionsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
`;

const StyledHeader = styled.div`
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.35em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ lowProfileHeader }) => lowProfileHeader && `
    background-color: transparent;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem 0.5rem 0.25rem 0;
  `}
`;

const StyledLabel = styled.span`
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7em;
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
    margin-right: 1.25em;
  }

  ${({ lowProfileHeader }) => lowProfileHeader && `
    &:not(:last-child) {
      margin-right: 0.5em;
    }
  `}

  ${({ togglable }) => togglable && `
    opacity: 0.4;
  `}

  ${({ toggled }) => toggled && `
    opacity: 1;
  `}

  ${({ disabled }) => disabled && `
    opacity: 0.2;
    cursor: default;
    pointer-events: none;
  `}
`;

const StyledIcon = styled.i`
  font-size: 0.9em;
  color: var(--color-orange-spice);

  ${({ lowProfileHeader }) => lowProfileHeader && `
    font-size: 0.8em;
    opacity: 0.8;
    color: var(--color-light-blue);
  `}
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
      style={props.style}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Show when={!props.noHeader}>
        <StyledHeader lowProfileHeader={props.lowProfileHeader}>
          {!props.lowProfileHeader && (
            <StyledLabel>{props.label}</StyledLabel>
          )}
          <StyledActions>
            <For each={Object.entries(props.actions)}>
              {([icon, action]) => (
                <StyledIconWrapper
                  title={action.title}
                  // onClick={action.handler}
                  onClick={() => {
                    if (action.disabled) return;
                    action.handler();
                  }}
                  lowProfileHeader={props.lowProfileHeader}
                  togglable={typeof action.toggled === "boolean"}
                  toggled={action.toggled}
                  disabled={action.disabled}
                >
                  <StyledIcon
                    class={`icss-${icon}`}
                    lowProfileHeader={props.lowProfileHeader}
                  />
                </StyledIconWrapper>
              )}
            </For>
          </StyledActions>
        </StyledHeader>
      </Show>
      <StyledContent
        style={props.contentStyle}
        lowProfileHeader={props.lowProfileHeader}
      >
        {props.children}
      </StyledContent>
    </StyledActionsContainer>
  );
};
