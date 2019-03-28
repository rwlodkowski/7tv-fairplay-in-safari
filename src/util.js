export function arrayToString(array) {
  const uint16array = new Uint16Array(array.buffer);
  return String.fromCharCode.apply(null, uint16array);
}

export function stringToArray(string) {
  const { length } = string;

  // 2 bytes for each char
  const buffer = new ArrayBuffer(length * 2);

  const array = new Uint16Array(buffer);

  for (let i = 0; i < length; i += 1) {
    array[i] = string.charCodeAt(i);
  }

  return array;
}
