import { For } from 'solid-js'
import { styled } from 'solid-styled-components';
import { Button } from '@inputs';

export const SidebarList = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledTabs>
        <For each={props.items}>
          {(item) => {
            return (
              <StyledTab>
                <StyledClose
                  isCurrent={props.selectedId === item.id}
                  isWaiting={item.waiting}
                  onClick={() => {
                    props.onClose(item.id);
                  }}
                >
                  <i class="icss-x" />
                </StyledClose>
                <StyledName
                  label={item?.name || item?.data?.name}
                  isCurrent={props.selectedId === item.id}
                  isWaiting={item.waiting}
                  onClick={() => {
                    props.onSelect(item.id);
                  }}
                />
              </StyledTab>
            );
          }}
        </For>
        <StyledAddButton
          onClick={() => {
            props.onAdd();
          }}
        />
      </StyledTabs>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  background-color: var(--color-main-dark);
`;

const StyledTabs = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: unset;
  align-items: end;
  padding: 0rem 0 0 1rem;
  width: 100%;
`;

const StyledTab = styled.div`
  position: relative;
  color: white;
  font-weight: bold;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const StyledAddButton = styled.div`
  position: relative;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
  background-color: var(--color-main);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    filter: brightness(0.8);
  }

  &:after, &:before {
    content: "";
    position: absolute;
    background-color: var(--color-orange-spice);
    border-radius: 0.2rem;
  }

  &:before {
    height: 0.4rem;
    left: 0.5rem;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  &:after {
    width: 0.4rem;
    top: 0.5rem;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const StyledClose = styled.div`
  font-size: 0.8rem;
  line-height: 2rem;
  height: 2rem;
  color: var(--color-red);
  padding: 0 0.5rem 0 0.5rem;
  transition: all 0.1s ease;

  &:hover { filter: brightness(1.2); }
  &:active { filter: brightness(0.8); }

  background-color: var(--color-main);
  ${({ isCurrent }) => isCurrent && `
    background-color: var(--color-main-light);
  `}
  ${({ isWaiting }) => isWaiting && `
    background-color: var(--color-orange-spice);
  `}
`;

const StyledName = styled(Button)`
  height: 2rem;
  font-size: 0.75rem;
  padding-left: 0.25rem;
  font-weight: bold;
  color: white;

  background-color: var(--color-main);
  ${({ isCurrent }) => isCurrent && `
    background-color: var(--color-main-light);
  `}
  ${({ isWaiting }) => isWaiting && `
    background-color: var(--color-orange-spice);
  `}
`;
