export const roomToRules = (room_data) => {
  const {
    world = '',
    additional = '',
    pre_flavor = '',
    name = '',
    keywords = '',
    flavor = '',
    trinkets = '',
    traps = '',
    puzzles = ''
  } = room_data;

  const rules = [];
  // if (world) rules.push(`[World=${world}]`);
  // if (additional) rules.push( `[Additional Info=${additional}]`);
  // if (pre_flavor) rules.push( `[Pre-Existing Flavor Text=${pre_flavor}]`);
  // if (name) rules.push( `[Room Name=${name}]`);
  // if (keywords) rules.push( `[Keywords=${keywords}]`);
  // if (flavor) rules.push(`[Flavor Text Length=${flavor}]`);
  // if (items) rules.push(`[Items=${items}]`);
  // if (traps) rules.push(`[Traps=${traps}]`);
  // if (puzzles) rules.push(`[Puzzles=${puzzles}]`);

  // if (world) rules.push(`"World" value in brackets [${world}].`);
  // if (additional) rules.push(`"Additional Info" value in brackets [${additional}].`);
  // if (pre_flavor) rules.push(`"Pre-Existing Flavor Text" value in brackets [${pre_flavor}].`);
  // if (name) rules.push(`"Room Name" value in brackets [${name}].`);
  // if (keywords) rules.push(`"Keywords" value in brackets [${keywords}].`);
  // if (flavor) rules.push(`"Flavor Text Length" value in brackets [${flavor}].`);
  // if (items) rules.push(`"Items" value in brackets [${items}].`);
  // if (traps) rules.push(`"Traps" value in brackets [${traps}].`);
  // if (puzzles) rules.push(`"Puzzles" value in brackets [${puzzles}].`);

  rules.push("Please generate a room:")
  if (world) rules.push(`"World" value is: ${world}.`);
  if (additional) rules.push(`"Additional Info" value is: ${additional}.`);
  if (pre_flavor) rules.push(`"Pre-Existing Flavor Text" value is: ${pre_flavor}.`);
  if (name) rules.push(`"Room Name" value is: ${name}.`);
  if (keywords) rules.push(`"Keywords" value is: ${keywords}.`);
  if (flavor) rules.push(`"Flavor Text Length" value is: ${flavor}.`);
  if (trinkets !== "None") rules.push(`"Trinkets" value is: ${trinkets}.`);
  if (traps !== "None") rules.push(`"Traps" value is: ${traps}.`);
  if (puzzles !== "None") rules.push(`"Puzzles" value is: ${puzzles}.`);

  let joined = rules.join(" ");
  joined = joined.replace(/\.\./g, '.');
  return joined;
}
