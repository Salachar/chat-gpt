import { Index } from 'solid-js'
import { styled } from 'solid-styled-components';
import { Radio } from '@inputs';
import { TextArea } from '@inputs';
import { ActionsContainer } from '@components/Actions';
import { store } from '@store/roomsStore';

const StyledContainer = styled.div`
  position: relative;
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
  height: 100%;

  ${({ size }) => size === 'small' && `
    height: 2.25rem;
    resize: none;
  `}

  ${({ size }) => size === 'large' && `
    height: 3.5rem;
  `}
`;

export const RoomInputs = (props) => {
  const room_text_area_inputs = () => [
    {
      key: "world",
      label: "World setting",
      actions: {},
      value: store.getRoom().input_data?.world || "",
      placeholder: 'Medieval high fantasy or dystopian steampunk',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("world", value);
      }
    },
    {
      key: "additional",
      label: "Any additional information",
      actions: {},
      value: store.getRoom().input_data?.additional || "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        store.setRoomInputData("additional", value);
      }
    },
    {
      key: "pre_flavor",
      label: "Pre-existing description: if provided the generated output will enhance this",
      actions: {},
      value: store.getRoom().input_data?.pre_flavor || "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        store.setRoomInputData("pre_flavor", value);
      }
    },
    {
      key: "name",
      label: "Name of the room",
      actions: {},
      value: store.getRoom().input_data?.name || "",
      placeholder: 'Laboratory',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("name", value);
      }
    },
    {
      key: "keywords",
      label: "Keywords or aspects of the room",
      actions: {},
      value: store.getRoom().input_data?.keywords || "",
      placeholder: 'Alchemy, Tidy, Well-stocked',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("keywords", value);
      }
    },
    {
      key: "flavor",
      label: "Length of room flavor text",
      actions: {},
      value: store.getRoom().input_data?.flavor || "",
      placeholder: '2 paragraphs of 3 to 5 sentences',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("flavor", value);
      }
    },
  ];

  return (
    <StyledContainer class={props.class}>
      <Index each={room_text_area_inputs()}>
        {(room_input) => {
          return (
            <ActionsContainer
              label={room_input().label}
              actions={room_input().actions}
            >
              <StyledTextArea
                value={room_input().value}
                placeholder={room_input().placeholder}
                size={room_input().size}
                onChange={room_input().onChange}
              />
            </ActionsContainer>
          );
        }}
      </Index>
      <Radio
        label="Trinkets"
        options={['Boring', 'Mundane', 'Magical', 'Mix']}
        onChange={(value) => {
          store.setRoomInputData("trinkets", value);
        }}
      />
      <Radio
        label="Traps"
        options={['None', 'Mundane', 'Complex', 'Mix']}
        onChange={(value) => {
          store.setRoomInputData("traps", value);
        }}
      />
      <Radio
        label="Puzzles"
        options={['None', 'Mundane', 'Complex', 'Mix']}
        onChange={(value) => {
          store.setRoomInputData("puzzles", value);
        }}
      />
    </StyledContainer>
  );
}

