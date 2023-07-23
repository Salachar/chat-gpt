import { createSignal, onCleanup, onMount } from 'solid-js';
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
  'banjo',
  'soccer',
  'headphone',
];

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getRandomSeconds = (min, max) => {
  return getRandom(min, max) * 1000;
};

const getRandomIcon = () => {
  return ICONS[getRandom(0, ICONS.length - 1)];
};

export const Snippy = () => {
  let thoughtBubbleInterval;

  const [thoughtBubble, setThoughtBubble] = createSignal(false);
  const [thoughtBubbleIcon, setThoughtBubbleIcon] = createSignal(getRandomIcon());

  onMount(() => {
    // Start the thought bubble interval
    thoughtBubbleInterval = setInterval(() => {
      // Set the icon to a random icon
      setThoughtBubbleIcon(getRandomIcon());
      // Make the thought bubble appear
      setThoughtBubble(true);
      // Make the thought bubble disappear 3 seconds after it appears
      setTimeout(() => {
        setThoughtBubble(false);
      }, getRandomSeconds(5, 7));
    }, getRandomSeconds(15, 20));
  });

  onCleanup(() => {
    clearInterval(thoughtBubbleInterval);
  });

  return (
    <StyledSnippy title="This is Snippy, the Code Snippet AI Bot">
      <StyledThoughtBubble visible={thoughtBubble()}>
        <StyledThoughtBubbleIcon class={`icss-${thoughtBubbleIcon()}`} />
      </StyledThoughtBubble>
      {store.getFirstWaiting() && (
        <StyledSpeechBubble />
      )}
      <StyledEyes animate_mustache={store.getFirstWaiting()} />
    </StyledSnippy>
  );
}

const StyledThoughtBubbleIcon = styled.i`
  font-size: 1.75rem;
  color: white;
`;

const StyledThoughtBubble = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-light-blue);
  opacity: 0;
  border-radius: 1rem;
  margin: 1rem;
  text-align: center;
  line-height: 3rem;
  transition: all 1s ease;

  ${({ visible }) => visible && `
    opacity: 0.5;
  `}

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
  margin-bottom: 2.5rem;
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
