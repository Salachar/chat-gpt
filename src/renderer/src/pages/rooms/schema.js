import { store } from './store';

const default_world = "Dungeons & Dragons style magical medieval fanstasy";

export const schema = () => [
  {
    key: "World",
    type: "text",
    size: 'small',
    label: "World setting",
    placeholder: 'Medieval high fantasy or dystopian steampunk',
    value: store.getRoom().input_data["World"] || default_world,
    onChange: (value) => store.setRoomInputData("World", value),
    actions: {},
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
