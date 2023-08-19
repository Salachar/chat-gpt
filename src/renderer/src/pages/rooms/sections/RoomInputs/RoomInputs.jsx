import { createEffect, createSignal, onMount } from 'solid-js'
import { styled } from 'solid-styled-components';
import { TextArea, Text, Radio } from '@inputs';

const StyledContainer = styled.div`
  position: relative;
`;

const StyledText = styled(Text)`
  margin-bottom: 0.5rem;
`;

const StyledTextArea = styled(TextArea)`
  margin-bottom: 0.5rem;
`;

const StyledRadio = styled(Radio)`
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const RoomInputs = (props) => {
  const [getWorld, setWorld] = createSignal('');
  const [getName, setName] = createSignal('');
  const [getKeywords, setKeywords] = createSignal("");
  const [getFlavor, setFlavor] = createSignal("");
  const [getPreFlavor, setPreFlavor] = createSignal("");
  const [getAdditional, setAdditional] = createSignal("");
  const [getTrinkets, setTrinkets] = createSignal("");
  const [getTraps, setTraps] = createSignal("");
  const [getPuzzles, setPuzzles] = createSignal("");

  const getRoomData = () => {
    return {
      world: getWorld(),
      name: getName(),
      keywords: getKeywords(),
      flavor: getFlavor(),
      pre_flavor: getPreFlavor(),
      additional: getAdditional(),
      trinkets: getTrinkets(),
      traps: getTraps(),
      puzzles: getPuzzles(),
    };
  }

  return (
    <StyledContainer class={props.class}>
      <StyledTextArea
        description='World setting'
        value="Dungeons & Dragons style magical medieval fanstasy"
        placeholder='Medieval high fantasy or dystopian steampunk'
        onChange={(value) => {
          setWorld(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledTextArea
        description='Any additional information'
        placeholder='In a magically suppressed city or the building is falling apart'
        onChange={(value) => {
          setAdditional(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledTextArea
        description='Pre-existing description: if provided the generated output will enhance this'
        onChange={(value) => {
          setPreFlavor(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledText
        description='Name of the room'
        placeholder='Laboratory'
        onChange={(value) => {
          setName(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledText
        description='Keywords or aspects of the room'
        placeholder='Alchemy, Tidy, Well-stocked'
        onChange={(value) => {
          setKeywords(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledText
        description='Length of room flavor text'
        placeholder='2 paragraphs of 3 to 5 sentences'
        onChange={(value) => {
          setFlavor(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledRadio
        label="Trinkets"
        options={['Boring', 'Mundane', 'Magical', 'Mix']}
        onChange={(value) => {
          setTrinkets(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledRadio
        label="Traps"
        options={['None', 'Mundane', 'Complex', 'Mix']}
        onChange={(value) => {
          setTraps(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
      <StyledRadio
        label="Puzzles"
        options={['None', 'Mundane', 'Complex', 'Mix']}
        onChange={(value) => {
          setPuzzles(value);
          if (props.onUpdate) props.onUpdate(getRoomData());
        }}
      />
    </StyledContainer>
  );
}
