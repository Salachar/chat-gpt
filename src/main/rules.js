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
