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
      key: "World",
      type: "text",
      label: "World setting",
      actions: {},
      value: store.getRoom().input_data["World"] || "Dungeons & Dragons style magical medieval fanstasy",
      placeholder: 'Medieval high fantasy or dystopian steampunk',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("World", value);
      }
    },
    {
      key: "Additional Info",
      type: "text",
      label: "Any additional information",
      actions: {},
      value: store.getRoom().input_data["Additional Info"] || "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        store.setRoomInputData("Additional Info", value);
      }
    },
    {
      key: "Pre-Existing Flavor Text",
      type: "text",
      label: "Pre-existing description: if provided the generated output will enhance this",
      actions: {},
      value: store.getRoom().input_data["Pre-Existing Flavor Text"] || "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        store.setRoomInputData("Pre-Existing Flavor Text", value);
      }
    },
    {
      key: "Room Name",
      type: "text",
      label: "Name of the room",
      actions: {},
      value: store.getRoom().input_data["Room Name"] || "",
      placeholder: 'Laboratory',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("Room Name", value);
      }
    },
    {
      key: "Keywords",
      type: "text",
      label: "Keywords or aspects of the room",
      actions: {},
      value: store.getRoom().input_data["Keywords"] || "",
      placeholder: 'Alchemy, Tidy, Well-stocked',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("Keywords", value, {
          parser: (value) => {
            // Try and make the string a proper comma separated list
            // split on space and rejoined with commas
            let keywords = value.split(' ').join(', ');
            // Remove any double commas
            keywords = keywords.split(',,').join(',');
            // Remove any leading or trailing commas
            keywords = keywords.replace(/^,|,$/g, '');
            // Remove any leading or trailing spaces
            keywords = keywords.trim();
            return keywords;
          }
        });
      }
    },
    {
      key: "Flavor Text Length",
      type: "text",
      label: "Length of room flavor text",
      actions: {},
      value: store.getRoom().input_data["Flavor Text Length"] || "",
      placeholder: '2 paragraphs of 3 to 5 sentences',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("Flavor Text Length", value);
      }
    },
    {
      key: "Trinkets",
      type: "radio",
      label: "Trinkets",
      options: ['Boring', 'Mundane', 'Magical', 'Mix'],
      onChange: (value) => {
        store.setRoomInputData("Trinkets", value);
      }
    },
    {
      key: "Traps",
      type: "radio",
      label: "Traps",
      options: ['None', 'Mundane', 'Complex', 'Mix'],
      onChange: (value) => {
        store.setRoomInputData("Traps", value);
      }
    },
    {
      key: "Puzzles",
      type: "radio",
      label: "Puzzles",
      options: ['None', 'Mundane', 'Complex', 'Mix'],
      onChange: (value) => {
        store.setRoomInputData("Puzzles", value);
      }
    },
  ];

  return (
    <StyledContainer class={props.class}>
      <Index each={room_text_area_inputs()}>
        {(room_input) => {
          if (room_input().type === "text") {
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
          }
          if (room_input().type === "radio") {
            return (
              <Radio
                label={room_input().label}
                options={room_input().options}
                onChange={room_input().onChange}
              />
            );
          }
        }}
      </Index>
    </StyledContainer>
  );
}

