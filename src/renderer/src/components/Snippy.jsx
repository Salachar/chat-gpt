import { Show, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { store } from '@store';

import { Eyes } from './Eyes';
import { SpeechBubble } from './SpeechBubble';

const ICONS = [
  'coffee-maker',
  'coffee-pot',
  'whiskey-jug',
  'glass-umbrella',
  'orangeade',
  'tea-cup',
  'coffee',
  'cheese',
  'snowflake',
  'tortoise',
  'gamepad',
  'billiard',
  'poolroom',
  'bowling',
  'flask',
  'scroll',
  'rocket',
  'color',
];

export const Snippy = () => {
  // We want the thought bubble to randomly appear every 5-10 seconds
  // const
  // const [thoughtBubble, setThoughtBubble] = createSignal(false);

  // const showThoughtBubble = () => {
  //   setThoughtBubble(true);

  // }

  // setInterval(() => {
  //   setThoughtBubble(true);
  //   // Make the thought bubble disappear 3 seconds after it appears
  //   setTimeout(() => {
  //     setThoughtBubble(false);
  //   }, 3000);

  //   // const five_to_ten_seconds = Math.floor(Math.random() * 5000) + 5000;
  //   const fifteen_to_twenty_seconds = Math.floor(Math.random() * 15000) + 5000;
  // }, fifteen_to_twenty_seconds);

  return (
    <StyledSnippy title="This is Snippy, the Code Snippet AI Bot">
      {/* <Show when={thoughtBubble()}>
        <StyledThoughtBubble>
          <i class={`icss-${ICONS[Math.floor(Math.random() * ICONS.length)]}`} />
        </StyledThoughtBubble>
      </Show> */}
      {store.getFirstWaiting() && (
        <StyledSpeechBubble />
      )}
      <StyledEyes animate_mustache={store.getFirstWaiting()} />
    </StyledSnippy>
  );
}

const StyledThoughtBubble = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-light-blue);
  opacity: 0.5;
  border-radius: 1rem;
  margin: 1rem;

  &:before {
    content: "";
    position: absolute;
    bottom: -10px;
    right: 10px;
    width: 1rem;
    height: 8px;
    background-color: var(--color-light-blue);
    border-radius: 1rem;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -18px;
    right: 12px;
    width: 10px;
    height: 6px;
    background-color: var(--color-light-blue);
    border-radius: 1rem;
  }
`;

const StyledSnippy = styled.div`
  grid-area: snippy;
  padding-bottom: 0.25rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const StyledEyes = styled(Eyes)`
  font-size: 0.9rem;
  white-space: nowrap;
  background-color: var(--color-light-blue);
  padding: 0.5rem;
  border-radius: 1rem;
  display: inline-block;
  margin: 4.5rem 0 0 0.5rem;
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.8rem;
  padding: 1rem 1rem 0 0;
`;
