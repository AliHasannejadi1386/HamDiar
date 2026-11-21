// Version 1-L is sufficient for every alphanumeric coupon issued by this app.
const sizes = { size: 21, data: 19, error: 7 };
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
function multiply(x, y) {
  let z = 0;
  for (let bit = 7; bit >= 0; bit--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> bit) & 1) * x;
  }
  return z;
}
function parity(data) {
  const generator = [127, 122, 154, 164, 11, 68, 117];
  const result = new Uint8Array(sizes.error);
  for (const word of data) {
    const factor = word ^ result[0];
    result.copyWithin(0, 1);
    result[sizes.error - 1] = 0;
    for (let i = 0; i < result.length; i++)
      result[i] ^= multiply(generator[i], factor);
  }
  return result;
}
function codewords(text) {
  const bits = [];
  const push = (value, count) => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >> i) & 1);
  };
  push(2, 4);
  push(text.length, 9);
  for (let i = 0; i < text.length; i += 2) {
    const x = alphabet.indexOf(text[i]);
    if (i + 1 < text.length) push(x * 45 + alphabet.indexOf(text[i + 1]), 11);
    else push(x, 6);
  }
  push(0, Math.min(4, sizes.data * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let i = 0; i < bits.length; i += 8)
    data.push(bits.slice(i, i + 8).reduce((v, b) => v * 2 + b, 0));
  while (data.length < sizes.data)
    data.push((data.length - bits.length / 8) % 2 ? 0x11 : 0xec);
  return [...data, ...parity(data)];
}
export function couponGraphic(code) {
  const { size } = sizes;
  const matrix = Array.from({ length: size }, () => Array(size).fill(null));
  const set = (x, y, on) => {
    if (Math.min(x, y) >= 0 && Math.max(x, y) < size)
      matrix[y][x] = Boolean(on);
  };
  for (const [x, y] of [
    [3, 3],
    [17, 3],
    [3, 17],
  ]) {
    for (let dx = -4; dx <= 4; dx++)
      for (let dy = -4; dy <= 4; dy++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(x + dx, y + dy, d !== 4 && d !== 2);
      }
  }
  for (let i = 8; i < size - 8; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  const format = (index) => ((0x77c4 >>> index) & 1) !== 0; // Level L and mask zero.
  for (let i = 0; i <= 5; i++) set(8, i, format(i));
  set(8, 7, format(6));
  set(8, 8, format(7));
  set(7, 8, format(8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, format(i));
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, format(i));
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, format(i));
  set(8, size - 8, true);
  const data = codewords(code);
  let bit = 0;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right = 5;
    const up = ((right + 1) & 2) === 0;
    for (let step = 0; step < size; step++)
      for (let col = 0; col < 2; col++) {
        const y = up ? size - 1 - step : step;
        const x = right - col;
        if (matrix[y][x] !== null) continue;
        const one = ((data[Math.floor(bit / 8)] >>> (7 - (bit % 8))) & 1) !== 0;
        set(x, y, one !== ((x + y) % 2 === 0));
        bit++;
      }
  }
  const ink = matrix
    .map((row, y) =>
      row.map((on, x) => (on ? `M${x + 4},${y + 4}h1v1h-1z` : "")).join(""),
    )
    .join("");
  return `<svg class="coupon-qr" viewBox="0 0 29 29" role="img" aria-label="کد QR کوپن" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h29v29H0z"/><path fill="#142c22" d="${ink}"/></svg>`;
}
