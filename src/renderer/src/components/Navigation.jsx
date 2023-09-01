import { A } from "@solidjs/router";
import { For } from 'solid-js'
import { styled, keyframes } from 'solid-styled-components';
import { PAGES } from "../main";

const ACTIVE_CLASS = "active";

export const Navigation = (props) => {
  return (
    <StyledNavigation>
      <For each={PAGES.filter(page => !page.disabled)}>
        {({ name, icon, path, store }) => (
          <StyledIconWrapper
            title={name}
            activeClass={ACTIVE_CLASS}
            href={path}
            end={true}
            pageActive={store && store.isActive()}
          >
            <StyledIcon class={`icss-${icon}`} />
            <StyledName>{name}</StyledName>
          </StyledIconWrapper>
        )}
      </For>
    </StyledNavigation>
  );
};

const StyledNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  text-decoration: underline;
  width: 100%;
  padding-top: 0.5rem;
  margin: 0 0 1rem 0;
`;

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
`;

const StyledIconWrapper = styled(A)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1.75rem;
  text-decoration: none;

  opacity: 0.4;
  &.active {
    opacity: 1;
    animation: none !important;
  }

  ${({ pageActive }) => pageActive && `
    animation: ${fadeInOut} 1.5s linear infinite;
  `}
`;

const StyledIcon = styled.i`
  color: var(--color-orange-spice);
`;

const StyledName = styled.div`
  font-size: 0.75rem;
  color: var(--color-orange-spice);
  text-decoration: none;
  margin-top: 0.25rem;
`;
