import { store } from './store';

const default_world = "Dungeons & Dragons style magical medieval fanstasy";

export const schemaToAIMessage = () => {
  const schemaData = schema();
  // Add the initiate rules
  let message = schemaData.initiate.generationRules.join(' ');
  // Add all the input rules
  schemaData.inputs.forEach((input) => {
    message += input.generationRules.join(' ');
  });
  // Add the output rules
  message += schemaData.output.generationRules.join(' ');
  return message;
};

export const schema = () => ({
  initiate: {
    generationRules: [
      `You are a helpful assistant for a fantasy RPG room generator.`,
      `The following are the rules for generating a room.`,
      `ROOM GENERATION RULES:`,
    ],
  },
  inputs: [
    {
      key: "World",
      type: "text",
      size: 'small',
      label: "World setting",
      placeholder: 'Medieval high fantasy or dystopian steampunk',
      value: store.getRoom().input_data["World"] || default_world,
      onChange: (value) => {
        store.setRoomInputData("World", value);
      },
      generationRules: [
        `"World" definition:`,
        `- World or universe setting details, to help provide a general influence.`,
        `- Use provided value or high medieval fantasy similar to Dungeons & Dragons, Pathfinder, Lord of the Rings, and Warcraft.`,
      ],
    },
    {
      key: "Additional Info",
      type: "text",
      label: "Any additional information",
      value: store.getRoom().input_data["Additional Info"] || "",
      placeholder: 'In a magically suppressed city or the building is falling apart',
      size: 'large',
      onChange: (value) => {
        store.setRoomInputData("Additional Info", value);
      },
      generationRules: [
        `"Additional Info" definition:`,
        `- More focused details influencing the output more than World". Use value if provided.`,
        `- Examples include "In a magically suppressed city" or "the building is falling apart".`
      ],
    },
    {
      key: "Pre-Existing Flavor Text",
      type: "text",
      label: "Pre-existing description: if provided the generated output will enhance this",
      value: store.getRoom().input_data["Pre-Existing Flavor Text"] || "",
      placeholder: '',
      size: 'large',
      onChange: (value) => {
        store.setRoomInputData("Pre-Existing Flavor Text", value);
      },
      generationRules: [
        `"Pre-Existing Flavor Text" definition:`,
        `- Already existing flavor text. If provided, The output flavor text should incorporate, enhance and expand upon this text, while maintaining its overall theme and tone.`,
      ],
    },
    {
      key: "Room Name",
      type: "text",
      label: "Name of the room",
      value: store.getRoom().input_data["Room Name"] || "",
      placeholder: 'Laboratory',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("Room Name", value);
      },
      generationRules: [
        `"Room Name" definition:`,
        `- Name, title, or main descriptor of the room.`,
        `- A room can be a room in a multi-room building, or it can be a single room building like a hut, small tower, shop, cave, or cabin.`,
        `- Examples include things like 'Mage's Chamber', 'Knight's Quarters', 'Mystic Library', 'Ballroom', 'East Hallway'. 'Wizard's Hut', 'Goblin Cave', 'Majestic Hall', and 'Haunted Ballroom'.`,
        `- Generate if missing,`,
        `- JSON format: Required, top-level, string, field name must be 'name'`,
      ],
    },
    {
      key: "Keywords",
      type: "text",
      label: "Keywords or aspects of the room",
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
      },
      generationRules: [
        `"Keywords" definition:`,
        `- The room's functions, states, and unique attributes.`,
        `- A rooms functions are what the room is used for, such as a library, kitchen, barracks, or armory.`,
        `- A rooms states are the condition of the room, such as pristine, neglected, or overgrown.`,
        `- A rooms unique attributes are the special qualities of the room, such as haunted, enchanted, or secret.`,
        `- Generate 3-5 if missing.`,
        `- JSON format: Required, top-level, array of strings, field name must be 'keywords'`,
      ],
    },
    {
      key: "Flavor Text Length",
      type: "text",
      label: "Length of room flavor text",
      value: store.getRoom().input_data["Flavor Text Length"] || "",
      placeholder: '2 paragraphs of 3 to 5 sentences',
      size: 'small',
      onChange: (value) => {
        store.setRoomInputData("Flavor Text Length", value);
      },
      generationRules: [
        `"Flavor Text Length" definition:`,
        ` - Desired length of the flavor text. If missing, replace with "100-150 words or two paragraphs".`,
        `"Flavor Text: definition`,
        `- This is always newly generated data and never provided.`,
        `- Avoid using the room name in the flavor text, contextually the players know where they are and the name may not read well in the flavor text.`,
        `- Write from the perspective of standing a few feet into the room.`,
        `- Try using synonyms of 'Keywords' and 'Additional Info' in the flavor text.`,
        `- Avoid phrases that assume direct interactions like movement or touching.`,
        `- Magical effects should be more limited to magical environments, and be mundane effects like glowing runes, slightly hovering rocks, and magic lights.`,
        `- A 'Mage's Chamber' may have purely aesthetic glowing runes, but a kitchen would not.`,
        `- Include creatures only if mentioned directly in provided input.`,
        `- JSON format: Required, top-level, array of strings where each array item is an entry or paragraph, field name must be 'flavor_text'`,
      ],
    },
    {
      key: "Trinkets",
      type: "radio",
      label: "Trinkets",
      options: ['Common', 'Mundane', 'Magical', 'Mix'],
      onChange: (value) => {
        store.setRoomInputData("Trinkets", value);
      },
      generationRules: [
        `"Trinkets" definition:`,
        `- Trinkets are small to medium sized trinkets and oddities.`,
        `- Only common trivial trinkets should be mentioned in flavor text.`,
        `- Common Trinkets are common, everyday objects that add detail to a room but are not particularly notable or valuable.`,
        `- Common Trinkets examples include things like chairs, pots, brooms, candles, furniture, dishes, or simple tools, etc.`,
        `- Mundane Trinkets are not magical but are more unique or valuable than common trinkets. They may catch the eye or pique the interest of an observer due to their craftsmanship, rarity, or because they seem out of place. They could be valuable due to their material or the information they hold.`,
        `- Mundane Trinkets examples include things like beautifully crafted goblets, detailed maps, hand-written letters, ornate keys, rare books, etc.`,
        `- Magical Trinkets are items imbued with magic, which can often be seen or felt by those in the room. The magic may serve a functional purpose, or it could be purely aesthetic. These items usually carry a hint of mystery and potential power, making them attractive to adventurers. They might also be valuable to collectors of magical artifacts.`,
        `- Magical Trinkets examples include things like a floating feather pen that writes on its own, a globe that accurately depicts current weather patterns, or a small statue that changes its pose when no one is watching.`,
        `- Generate 5 trinkets.`,
        `- JSON format: Top-level, array of objects, contains the item suggestions for the room, field name must be 'trinkets'`,
        `- JSON format: 'trinkets' objects fields are 'name', 'type', and 'description' of type string.`,
      ],
    },
    {
      key: "Traps",
      type: "radio",
      label: "Traps",
      options: ['None', 'Mundane', 'Complex', 'Mix'],
      onChange: (value) => {
        store.setRoomInputData("Traps", value);
      },
      generationRules: [
        `"Traps" definition:`,
        `- Traps, hazards and obstacles, can range from manmade and intentional to accident of nature.`,
        `- Traps must never be mentioned in flavor text at all.`,
        `- Mundane Traps means non-magical and common.`,
        `- Mundane Traps examples include things like a simple pit trap, a simple tripwire, or a simple falling object.`,
        `- Magical Traps means weak, cantrip-level magic, mostly cosmetic or barely useful.`,
        `- Magical Traps examples include things like a simple alarm spell, a simple illusion, or a simple light spell.`,
        `- Complex Traps means requires special item, tool, or minor magic to bypass.`,
        `- Complex Traps examples include things like a complex pit trap, a complex tripwire, or a complex falling object.`,
        `- If not "None", generate 3 traps.`,
        `- JSON format: Top-level, array of objects, contains the trap suggestions for the room, field name must be 'traps'`,
        `- JSON format: 'traps' objects fields are 'name', 'type', and 'description' of type string.`,
        `- JSON format: If value is not provided or None, the field is not present in the JSON.`
      ],
    },
    {
      key: "Puzzles",
      type: "radio",
      label: "Puzzles",
      options: ['None', 'Mundane', 'Complex', 'Mix'],
      onChange: (value) => {
        store.setRoomInputData("Puzzles", value);
      },
      generationRules: [
        `"Puzzles" definition:`,
        `- Puzzles and unintuitive objects to interact with.`,
        `- Puzzles must never be mentioned in flavor text at all.`,
        `- Mundane Puzzles means non-magical and common.`,
        `- Mundane Puzzles examples include things like a simple riddle, a simple logic puzzle, or a simple combination lock.`,
        `- Magical Puzzles means weak, cantrip-level magic, mostly cosmetic or barely useful.`,
        `- Magical Puzzles examples include things like a simple illusion, a simple light spell, or a simple alarm spell.`,
        `- Complex Puzzles means requires special item, tool, or minor magic to bypass.`,
        `- Complex Puzzles examples include things like a complex riddle, a complex logic puzzle, or a complex combination lock.`,
        `- If not "None", generate 3 puzzles, each with a DC ability check solution.`,
        `- JSON format: Top-level, array of objects, contains the puzzle suggestions for the room, field name must be 'puzzles'`,
        `- JSON format: 'puzzles' objects fields are 'name', 'type', and 'description' of type string.`,
        `- JSON format: If value is not provided or None, the field is not present in the JSON.`
      ],
    },
  ],
  output: {
    generationRules: [
      `Room generation order:`,
      `1) "World"`,
      `2) "Additional Info"`,
      `3) "Pre-Existing Flavor Text"`,
      `4) "Room Name"`,
      `5) "Keywords"`,
      `6) "Flavor Text Length". `,
      `7) "Flavor Text"`,
      `8) "Trinkets"`,
      `9) "Traps"`,
      `10) "Puzzles"`,

      `JSON output format, all field names need to be proper strings and must not be altered or changed:`,
      `- 'is_room_json': required, boolean, must be present and true. This is used to identify the JSON as a room.`,
      `- 'generation_summary': string, should summarize what generated the "Room Name" and "Keywords". Aim for a conversational tone as this field will be displayed in an interactive chat window to the user.`,
      `- 'image_prompt': A mandatory field presented as a string, constructed to guide DALL-E image generation. The prompt should integrate elements from the 'Keywords' and newly generated 'Flavor Text'. The focus should only be on a couple key visual aspects of the room. Do not include auditory or olfactory elements. Emphasize objects and room layout over lighting and shadows. The description should be context-aware, avoiding anachronisms in historical or fantasy settings. Image prompt cannot exceed 300 characters.`,

      `REQUIRED RULES:`,
      `- Theses rules are required for all room generation requests and must be followed.`,
      `- A room must always be generated regardless of the amount of data provided.`,
      `- Room output must be JSON.`,
      `- All JSON must be valid, have no errors, and be formatted with 2 spaces.`,
      "- Any returned JSON must be in the following format, surrounded by triple backticks: ```<json>``` and marked as json language.",
      `- "generate" from the user is a keyword that indicates room generation request and the response must include valid room JSON according to the specified format.`,
      `- When prompted to generate, a room must always be generated and returned, regardless of the amount of data provided.`,
      `- Upon receiving a "generate" command from the user, the assistant must immediately generate a room based on the provided data, without prompting the user for additional information.`,
      `- Phrases like "generate an additional", "include another", or "please add" indicate a request for additional data to an existing room. The assistant must not generate a new room in response to these phrases.`,
      `- When generating addtional data, it should returned in the shell of the room output JSON with one additional top level boolean "is_room_json_addon" set to true.`,
      `END REQUIRED RULES.`,
      `END ROOM GENERATION RULES.`,
      `Initiate chat with a short friendly hello.`,
    ],
  },
});
