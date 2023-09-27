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

export const getDecimalCount = (number) => {
  try {
    return number.toString().split('.')[1].split('').length;
  } catch (e) {
    return 0;
  }
};

export const handleStore = (opts = {}, value) => {
  const { store_key, store_event } = opts;
  if (!store_key && !store_event) return;

  if (store_key && !store_event) {
    store_key.split(' ').forEach((key) => {
      Store.set({
        [key]: value
      });
    });
  }

  if (store_event && !store_key) {
    Store.fire(store_event);
  }

  if (store_event && store_key) {
    store_key.split(' ').forEach((key) => {
      Store.set({
        [key]: value
      });
    });
    Store.fire(store_event, {
      [store_key.split(' ')[0]]: value
    });
  }
}
