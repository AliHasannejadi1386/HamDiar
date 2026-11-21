export const WASTE_TILES = [
  { label: "بطری خالی", icon: "🧴", category: "dry", color: "water" },
  { label: "روزنامه", icon: "📰", category: "dry", color: "paper" },
  { label: "قوطی تمیز", icon: "🥫", category: "dry", color: "metal" },
  { label: "پوست موز", icon: "🍌", category: "wet", color: "banana" },
  { label: "پوست پرتقال", icon: "🍊", category: "wet", color: "orange" },
  { label: "برگ باغچه", icon: "🍂", category: "wet", color: "leaf" },
];

export const MATCH_SIZE = 7;
export const MATCH_LEVELS = [
  { title: "شروع در بوستان", dry: 6, wet: 6, moves: 14 },
  { title: "کنار باغچه", dry: 9, wet: 12, moves: 15 },
  { title: "پاتوق پاک", dry: 15, wet: 12, moves: 16 },
];

const SIZE = MATCH_SIZE;
const sameRow = (a, b) => Math.floor(a / SIZE) === Math.floor(b / SIZE);
const validCell = (n) => Number.isInteger(n) && n >= 0 && n < SIZE * SIZE;
export const adjacentMatchCells = (a, b) =>
  validCell(a) &&
  validCell(b) &&
  (Math.abs(a - b) === SIZE || (Math.abs(a - b) === 1 && sameRow(a, b)));

function swapped(board, a, b) {
  const next = [...board];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export function matchCells(board) {
  const matches = new Set();
  for (let line = 0; line < SIZE; line++) {
    for (const horizontal of [true, false]) {
      const stride = horizontal ? 1 : SIZE;
      const first = line * (horizontal ? SIZE : 1);
      for (let start = 0; start < SIZE;) {
        let end = start + 1;
        while (
          end < SIZE &&
          board[first + start * stride] === board[first + end * stride]
        )
          end++;
        if (end - start >= 3) {
          for (let cell = start; cell < end; cell++)
            matches.add(first + cell * stride);
        }
        start = end;
      }
    }
  }
  return [...matches];
}

export function possibleMatchMoves(board) {
  const moves = [];
  for (let a = 0; a < board.length; a++) {
    for (const b of [a + 1, a + SIZE]) {
      if (!adjacentMatchCells(a, b) || board[a] === board[b]) continue;
      const matches = matchCells(swapped(board, a, b));
      if (matches.length) moves.push({ a, b, matches });
    }
  }
  return moves;
}

function rollTile(random) {
  return Math.floor(random() * WASTE_TILES.length);
}

export function makeMatchBoard(random = Math.random) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const board = [];
    for (let i = 0; i < SIZE * SIZE; i++) {
      const options = WASTE_TILES.map((_, tile) => tile).filter(
        (tile) =>
          !(i % SIZE >= 2 && board[i - 1] === tile && board[i - 2] === tile) &&
          !(
            i >= 2 * SIZE &&
            board[i - SIZE] === tile &&
            board[i - 2 * SIZE] === tile
          ),
      );
      board.push(options[Math.floor(random() * options.length)]);
    }
    if (possibleMatchMoves(board).length) return board;
  }
  // A rare no-move grid falls back to a checked, playable opening.
  return [
    1, 0, 1, 0, 3, 2, 5, 4, 1, 5, 4, 0, 5, 3, 2, 0, 4, 0, 2, 3, 1, 1, 5, 3, 2,
    4, 1, 0, 5, 4, 0, 1, 5, 2, 3, 2, 3, 5, 0, 3, 0, 2, 5, 0, 4, 2, 5, 3, 4,
  ];
}

function dropTiles(board, removed, random) {
  const next = [...board];
  for (let x = 0; x < SIZE; x++) {
    let write = SIZE - 1;
    for (let y = SIZE - 1; y >= 0; y--) {
      const index = y * SIZE + x;
      if (!removed.has(index)) next[write-- * SIZE + x] = board[index];
    }
    while (write >= 0) next[write-- * SIZE + x] = rollTile(random);
  }
  return next;
}

export function resolveMatchMove(board, a, b, random = Math.random) {
  if (!adjacentMatchCells(a, b) || board[a] === board[b]) return null;
  let next = swapped(board, a, b);
  let matched = matchCells(next);
  if (!matched.length) return null;
  const waves = [];
  const totals = { wet: 0, dry: 0 };
  // Bound replenishment when a deterministic random source repeatedly supplies the same piece.
  while (matched.length && waves.length < 12) {
    const cleared = { wet: 0, dry: 0 };
    for (const cell of matched) {
      const group = WASTE_TILES[next[cell]].category;
      totals[group]++;
      cleared[group]++;
    }
    waves.push({ board: next, matched, cleared });
    next = dropTiles(next, new Set(matched), random);
    matched = matchCells(next);
  }
  const refreshed =
    Boolean(matched.length) || possibleMatchMoves(next).length === 0;
  return {
    board: refreshed ? makeMatchBoard(random) : next,
    waves,
    totals,
    refreshed,
  };
}

export const PIPE_LEVELS = [
  {
    title: "راه کوتاه",
    size: 4,
    path: [
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    extra: [],
  },
  {
    title: "دور باغچه",
    size: 5,
    path: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4],
    ],
    extra: [
      [3, 1, 3],
      [4, 2, 10],
    ],
  },
  {
    title: "تا پاتوق",
    size: 6,
    path: [
      [5, 0],
      [4, 0],
      [4, 1],
      [3, 1],
      [3, 2],
      [2, 2],
      [2, 3],
      [1, 3],
      [1, 4],
      [0, 4],
      [0, 5],
    ],
    extra: [
      [5, 3, 3],
      [2, 5, 5],
      [0, 1, 10],
    ],
  },
];

export const PIPE_DIRECTIONS = [
  { bit: 1, opposite: 4, y: -1, x: 0, name: "north", label: "بالا" },
  { bit: 2, opposite: 8, y: 0, x: 1, name: "east", label: "راست" },
  { bit: 4, opposite: 1, y: 1, x: 0, name: "south", label: "پایین" },
  { bit: 8, opposite: 2, y: 0, x: -1, name: "west", label: "چپ" },
];
export const rotateMask = (mask) => ((mask << 1) | (mask >> 3)) & 15;
function pipeBit([y, x], [nextY, nextX]) {
  return (
    PIPE_DIRECTIONS.find((d) => nextY - y === d.y && nextX - x === d.x)?.bit ||
    0
  );
}

export function makePipeBoard(level, random = Math.random) {
  const { size, path, extra } = level;
  const board = Array.from({ length: size * size }, () => ({
    kind: "grass",
    mask: 0,
  }));
  const write = (y, x, kind, solution) => {
    let mask = solution;
    if (kind === "pipe") {
      const turns = 1 + Math.floor(random() * 3);
      for (let j = 0; j < turns; j++) mask = rotateMask(mask);
    }
    board[y * size + x] = { kind, mask, solution };
  };
  path.forEach((p, i) => {
    const end = i === path.length - 1;
    const back = i ? pipeBit(p, path[i - 1]) : 0;
    const forward = end ? 0 : pipeBit(p, path[i + 1]);
    write(...p, !i ? "start" : end ? "end" : "pipe", back | forward);
  });
  extra.forEach(([y, x, mask]) => write(y, x, "pipe", mask));
  if (pipeConnections(board, size).solved) {
    const first = path[1];
    const tile = board[first[0] * size + first[1]];
    tile.mask = rotateMask(tile.mask);
  }
  return board;
}

export function pipeConnections(board, size) {
  const start = board.findIndex((cell) => cell.kind === "start");
  const seen = new Set([start]);
  const queue = [start];
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const i = queue[cursor];
    for (const dir of PIPE_DIRECTIONS) {
      const y = Math.floor(i / size) + dir.y;
      const x = (i % size) + dir.x;
      if (
        !(board[i].mask & dir.bit) ||
        y < 0 ||
        y >= size ||
        x < 0 ||
        x >= size
      )
        continue;
      const next = y * size + x;
      if (!seen.has(next) && board[next].mask & dir.opposite) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return {
    connected: seen,
    solved: seen.has(board.findIndex((cell) => cell.kind === "end")),
  };
}
