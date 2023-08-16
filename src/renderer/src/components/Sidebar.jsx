import { styled } from 'solid-styled-components';

import { Navigation } from './Navigation';
import { Snippy } from './Snippy';

export const Sidebar = (props) => {
  return (
    <StyledSidebar>
      <Navigation />
      <Snippy />
      {props.children}
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div`
  border-right: 1rem solid var(--color-main-light);
  background-color: var(--color-main-dark);
  height: 100%;
  max-width: 12rem;
`;
