import { onMount, onCleanup } from 'solid-js'
import { styled } from 'solid-styled-components';
import { store } from '@store';

export const App = () => {
  onMount(() => {

  });

  onCleanup(() => {

  });

  return (
    <StyledContainer>
      App
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
