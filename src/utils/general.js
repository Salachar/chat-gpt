export const alphaTrim = (string) => {
  return string
    ?.replace(/[\W_]+/g, "")
    .replace(/ /g, "")
    .toLowerCase()
    .trim();
};

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const copy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
