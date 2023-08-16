import { onMount, onCleanup } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Sidebar } from '../../components/Sidebar';

export const Home = () => {
  onMount(() => {

  });

  onCleanup(() => {

  });

  return (
    <StyledContainer>
      <Sidebar />
      Home
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
