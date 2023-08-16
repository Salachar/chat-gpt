import { onMount, onCleanup } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Sidebar } from '../../components/Sidebar';

export const Rooms = () => {
  onMount(() => {

  });

  onCleanup(() => {

  });

  return (
    <StyledContainer>
      <Sidebar />
      Rooms
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
