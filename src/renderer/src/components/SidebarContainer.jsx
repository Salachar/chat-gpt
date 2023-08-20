import { styled } from 'solid-styled-components';

import { Sidebar } from './Sidebar';

export const SidebarContainer = (props) => {
  return (
    <StyledContainer>
      <StyledSidebar animateSnippy={props.animateSnippy}>
        {props.sidebar}
      </StyledSidebar>
      <StyledContent>
        {props.children}
      </StyledContent>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  font-size: 0.85rem;
  position: relative;
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-columns: 12rem 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "sidebar childcontent";
`;

const StyledSidebar = styled(Sidebar)`
  grid-area: sidebar;
`;

const StyledContent = styled.div`
  grid-area: childcontent;
  height: 100%;
  overflow: hidden;
`;
