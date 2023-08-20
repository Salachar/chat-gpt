import { createSignal } from 'solid-js'
import { styled } from 'solid-styled-components';
import { Radio } from '@inputs';
import { TextArea } from '@inputs';
import { ActionsContainer } from '@components/Actions';
import { store } from '@store/roomsStore';

const StyledContainer = styled.div`
  position: relative;
`;

const StyledRadio = styled(Radio)`
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const StyledTextAreaContainer = styled(ActionsContainer)`
  margin-bottom: 0.5rem;
`;

const StyledTextAreaOther = styled(TextArea)`
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  width: 100%;
  height: 100%;

  ${({ size }) => size === 'small' && `
    height: 2rem;
    resize: none;
  `}

  ${({ size }) => size === 'large' && `
    height: 3rem;
  `}
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

  const setRoomData = (room_data) => {
    store.setRoom("input_data", room_data);
  }

  const room_text_area_inputs = [
    {
      label: "World setting",
      actions: {},
      value: "Dungeons & Dragons style magical medieval fanstasy",
      placeholder: 'Medieval high fantasy or dystopian steampunk',
      size: 'small',
      onChange: (value) => {
        setWorld(value);
        setRoomData(getRoomData());
      }
    },
    {
      label: "Any additional information",
      actions: {},
      value: "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        setAdditional(value);
        setRoomData(getRoomData());
      }
    },
    {
      label: "Pre-existing description: if provided the generated output will enhance this",
      actions: {},
      value: "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        setPreFlavor(value);
        setRoomData(getRoomData());
      }
    },
    {
      label: "Name of the room",
      actions: {},
      value: "",
      placeholder: 'Laboratory',
      size: 'small',
      onChange: (value) => {
        setName(value);
        setRoomData(getRoomData());
      }
    },
    {
      label: "Keywords or aspects of the room",
      actions: {},
      value: "",
      placeholder: 'Alchemy, Tidy, Well-stocked',
      size: 'small',
      onChange: (value) => {
        setKeywords(value);
        setRoomData(getRoomData());
      }
    },
    {
      label: "Length of room flavor text",
      actions: {},
      value: "",
      placeholder: '2 paragraphs of 3 to 5 sentences',
      size: 'small',
      onChange: (value) => {
        setFlavor(value);
        setRoomData(getRoomData());
      }
    },
  ];

  return (
    <StyledContainer class={props.class}>
      {room_text_area_inputs.map((input) => (
        <StyledTextAreaContainer
          label={input.label}
          actions={input.actions}
        >
          <StyledTextAreaOther
            value={input.value}
            placeholder={input.placeholder}
            size={input.size}
            onChange={input.onChange}
          />
        </StyledTextAreaContainer>
      ))}
      <StyledRadio
        label="Trinkets"
        options={['Boring', 'Mundane', 'Magical', 'Mix']}
        onChange={(value) => {
          setTrinkets(value);
          setRoomData(getRoomData());
        }}
      />
      <StyledRadio
        label="Traps"
        options={['None', 'Mundane', 'Complex', 'Mix']}
        onChange={(value) => {
          setTraps(value);
          setRoomData(getRoomData());
        }}
      />
      <StyledRadio
        label="Puzzles"
        options={['None', 'Mundane', 'Complex', 'Mix']}
        onChange={(value) => {
          setPuzzles(value);
          setRoomData(getRoomData());
        }}
      />
    </StyledContainer>
  );
}

