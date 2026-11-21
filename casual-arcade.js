import { api, fa, read, zeroWorldProgress } from "./model.js?v=1.4.0";
import { icon } from "./icons.js?v=1.4.0";
import {
  MATCH_LEVELS,
  MATCH_SIZE,
  WASTE_TILES,
  adjacentMatchCells,
  makeMatchBoard,
  possibleMatchMoves,
  resolveMatchMove,
  PIPE_LEVELS,
  PIPE_DIRECTIONS,
  makePipeBoard,
  pipeConnections,
  rotateMask,
} from "./casual-games.js";

export const isCasualGame = (id) => id === "match" || id === "pipes";
const levelsFor = (id) => (id === "match" ? MATCH_LEVELS : PIPE_LEVELS);
const unlockedLevel = (id, best) => Math.min(best + 1, levelsFor(id).length);
const btn = (action, label, classes = "btn", symbol = "") =>
  `<button type="button" class="${classes}" data-action="zero-world" data-id="${action}">${symbol ? icon(symbol) : ""}${label}</button>`;

export function createCasualArcade(refresh) {
  let run;
  let timer;
  let pointer;
  let ignoreClick = false;
  const stop = () => {
    clearTimeout(timer);
    timer = undefined;
    run = undefined;
    pointer = undefined;
    ignoreClick = false;
  };
  const focusPiece = (n) =>
    document
      .querySelector('[data-match-cell="' + n + '"]')
      ?.focus({ preventScroll: true });
  const showBoard = (selector) => {
    const panel = document.querySelector(selector);
    panel?.scrollIntoView({ block: "start", behavior: "instant" });
    panel?.querySelector("button")?.focus({ preventScroll: true });
  };

  function start(id, stage) {
    const levels = levelsFor(id);
    const latest = zeroWorldProgress(read()).scores[id] || 0;
    if (
      !Number.isInteger(stage) ||
      stage < 1 ||
      stage > unlockedLevel(id, latest)
    )
      return;
    stop();
    const level = levels[stage - 1];
    run =
      id === "match"
        ? {
            id,
            stage,
            level,
            board: makeMatchBoard(),
            moves: level.moves,
            dry: 0,
            wet: 0,
            selected: null,
            focus: 0,
            phase: "play",
            message:
              "دو مهرهٔ کنار هم را انتخاب کن یا یکی را به سمت دیگری بکش.",
          }
        : {
            id,
            stage,
            level,
            board: makePipeBoard(level),
            rotations: 0,
            phase: "play",
          };
    refresh();
    showBoard(id === "match" ? ".match-board-panel" : ".pipe-board-panel");
  }

  const markCleared = () => {
    run.phase = "won";
    api.scoreZeroGame(run.id, run.stage);
  };

  function settlePair(a, b) {
    if (
      !run ||
      run.id !== "match" ||
      run.phase !== "play" ||
      !adjacentMatchCells(a, b)
    )
      return;
    const move = resolveMatchMove(run.board, a, b);
    run.selected = null;
    run.hint = null;
    run.focus = b;
    if (!move) {
      run.message = "اینجا ردیفی ساخته نشد. حرکتت کم نشد.";
      refresh();
      focusPiece(b);
      return;
    }
    run.phase = "drop";
    run.moves--;
    let turn = 0;
    const finish = () => {
      run.board = move.board;
      run.clearing = null;
      run.dry += move.totals.dry;
      run.wet += move.totals.wet;
      run.message =
        "این حرکت: " +
        fa(move.totals.dry) +
        " خشک و " +
        fa(move.totals.wet) +
        " تر" +
        (move.refreshed ? " · مهره‌های تازه چیده شدند." : ".");
      run.phase = "play";
      if (run.dry >= run.level.dry && run.wet >= run.level.wet) markCleared();
      else if (!run.moves) run.phase = "lost";
      refresh();
      if (run.phase === "play") focusPiece(b);
      else showBoard(".casual-result");
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const animate = () => {
      if (turn >= move.waves.length) {
        finish();
        return;
      }
      const wave = move.waves[turn++];
      run.board = wave.board;
      run.clearing = new Set(wave.matched);
      refresh();
      timer = setTimeout(animate, 140);
    };
    animate();
  }

  function choose(cell) {
    if (!run || run.id !== "match" || run.phase !== "play") return;
    run.focus = cell;
    const previous = run.selected;
    if (previous !== null && adjacentMatchCells(previous, cell)) {
      settlePair(previous, cell);
      return;
    }
    run.selected = previous === cell ? null : cell;
    refresh();
    focusPiece(cell);
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      const piece = event.target.closest("[data-match-cell]");
      if (
        !piece ||
        event.button !== 0 ||
        !event.isPrimary ||
        run?.phase !== "play"
      )
        return;
      ignoreClick = false;
      pointer = {
        id: event.pointerId,
        cell: Number(piece.dataset.matchCell),
        x: event.clientX,
        y: event.clientY,
      };
    },
    true,
  );
  document.addEventListener(
    "pointercancel",
    () => {
      pointer = undefined;
    },
    true,
  );
  document.addEventListener(
    "pointerup",
    (event) => {
      if (
        !pointer ||
        pointer.id !== event.pointerId ||
        run?.id !== "match" ||
        run.phase !== "play"
      )
        return;
      const { cell, x, y } = pointer;
      pointer = undefined;
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      const other =
        cell +
        (Math.abs(dx) >= Math.abs(dy)
          ? Math.sign(dx)
          : Math.sign(dy) * MATCH_SIZE);
      if (adjacentMatchCells(cell, other)) {
        ignoreClick = true;
        settlePair(cell, other);
      }
    },
    true,
  );
  document.addEventListener(
    "click",
    (event) => {
      if (!ignoreClick || !event.target.closest("[data-match-cell]")) return;
      ignoreClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );
  document.addEventListener("keydown", (event) => {
    const button = event.target.closest("[data-match-cell]");
    if (!button || run?.phase !== "play") return;
    const step = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -MATCH_SIZE,
      ArrowDown: MATCH_SIZE,
    }[event.key];
    if (!step) return;
    event.preventDefault();
    const cell = Number(button.dataset.matchCell);
    if (!adjacentMatchCells(cell, cell + step)) return;
    run.focus = cell + step;
    button.tabIndex = -1;
    const next = document.querySelector(
      '[data-match-cell="' + run.focus + '"]',
    );
    next.tabIndex = 0;
    next.focus({ preventScroll: true });
  });

  function handle(value) {
    const [action, id, stage] = value.split(":");
    if (action === "casual-start" && isCasualGame(id)) {
      start(id, Number(stage));
      return true;
    }
    if (action === "match-cell") {
      choose(Number(id));
      return true;
    }
    if (action === "match-hint") {
      if (run?.id === "match" && run.phase === "play") {
        const move = possibleMatchMoves(run.board)[0];
        if (!move) return true;
        run.selected = null;
        run.hint = [move.a, move.b];
        run.focus = move.a;
        run.message = "دو مهرهٔ مشخص‌شده را جابه‌جا کن.";
        refresh();
        focusPiece(move.a);
      }
      return true;
    }
    if (action === "pipe-cell") {
      const cell = Number(id);
      if (
        run?.id === "pipes" &&
        run.phase === "play" &&
        run.board[cell]?.kind === "pipe"
      ) {
        run.board[cell].mask = rotateMask(run.board[cell].mask);
        run.rotations++;
        if (pipeConnections(run.board, run.level.size).solved) markCleared();
        refresh();
        if (run.phase === "won") showBoard(".casual-result");
        else
          document
            .querySelector('[data-pipe-cell="' + cell + '"]')
            ?.focus({ preventScroll: true });
      }
      return true;
    }
    return false;
  }

  function levelSelection(id, best) {
    const levels = levelsFor(id);
    const match = id === "match";
    return `<section class="casual-intro"><div>
      <h2>${match ? "ردیف‌های تر و خشک" : "مسیر پاتوق تا مخزن"}</h2>
      <p>${match ? "سه یا چند مهرهٔ یکسان را در یک ردیف افقی یا عمودی جور کن. برای باز شدن مرحلهٔ بعد، هر دو هدف تر و خشک را پر کن." : "روی قطعه‌ها بزن تا بچرخند. راه پیوسته‌ای از پرچم تا مخزن بساز."}</p>
      <div class="casual-levels" aria-label="انتخاب مرحله">${levels
        .map((level, i) =>
          i + 1 <= unlockedLevel(id, best)
            ? btn(
                "casual-start:" + id + ":" + (i + 1),
                fa(i + 1) + ". " + level.title,
                "btn game-gold",
                i + 1 <= best ? "check" : "play",
              )
            : `<span class="casual-locked">${icon("lock")}${fa(i + 1)}. ${level.title}</span>`,
        )
        .join("")}</div></div></section>`;
  }

  function result(best) {
    const won = run.phase === "won";
    const levels = levelsFor(run.id);
    return `<section class="casual-result ${won ? "won" : ""}" role="status">
      <span class="result-medal">${icon(won ? "trophy" : "flag")}</span>
      <h2>${won ? "مرحله کامل شد!" : "حرکت‌ها تمام شدند"}</h2>
      <p>${run.id === "match" ? fa(run.dry) + " مهرهٔ خشک · " + fa(run.wet) + " مهرهٔ تر" : fa(run.rotations) + " چرخش برای وصل کردن مسیر"}</p>
      <p class="world-status">${fa(best)} از ${fa(levels.length)} مرحله کامل</p>
      <div class="row center">
      ${won && run.stage < levels.length ? btn("casual-start:" + run.id + ":" + (run.stage + 1), "مرحلهٔ بعد", "btn game-gold", "play") : ""}
      ${btn("casual-start:" + run.id + ":" + run.stage, "دوباره بازی کن", "btn", "play")}
      <a href="#/zero/games" class="btn">بازی‌های دیگر</a></div>
    </section>`;
  }

  function matchBoard() {
    const goals = [
      ["dry", "خشک"],
      ["wet", "تر"],
    ];
    const inputOpen = run.phase === "play";
    return `<section class="arcade-board match-board-panel">
      <div class="row between"><b>مرحلهٔ ${fa(run.stage)} · ${run.level.title}</b><span class="world-status">${fa(run.moves)} حرکت</span></div>
      <div class="match-goals">${goals
        .map(([key, name]) => {
          const have = Math.min(run[key], run.level[key]);
          return `<div class="match-goal ${key}"><div class="row between"><b>${name}</b><span>${fa(have)} از ${fa(run.level[key])}</span></div>
          <div class="world-meter" role="progressbar" aria-label="هدف پسماند ${name}" aria-valuemin="0" aria-valuemax="${run.level[key]}" aria-valuenow="${have}"><span style="--world-progress:${(100 * have) / run.level[key]}%"></span></div></div>`;
        })
        .join("")}</div>
      <div class="match-board" aria-label="صفحهٔ ردیف بازیافت">
        ${run.board
          .map((id, cell) => {
            const tile = WASTE_TILES[id];
            const picked = cell === run.selected;
            const group = tile.category === "dry" ? "خشک" : "تر";
            return `<button class="match-piece ${tile.color} ${run.clearing?.has(cell) ? "clearing" : ""} ${run.hint?.includes(cell) ? "hinted" : ""}" type="button"
            data-action="zero-world" data-id="match-cell:${cell}" data-match-cell="${cell}" data-tile="${id}" aria-pressed="${picked}"
            tabindex="${run.focus === cell ? 0 : -1}" aria-label="${tile.label}، ${group}، ردیف ${fa(Math.floor(cell / MATCH_SIZE) + 1)}، ستون ${fa((cell % MATCH_SIZE) + 1)}" ${inputOpen ? "" : "disabled"}>
            <span aria-hidden="true">${tile.icon}</span><small aria-hidden="true">${group}</small>
          </button>`;
          })
          .join("")}
      </div>
      <div class="row between"><p class="match-status" role="status">${run.message}</p>
        ${inputOpen ? btn("match-hint", "راهنمای حرکت", "btn", "bulb") : ""}</div>
    </section>`;
  }

  function pipeBoard() {
    const { connected } = pipeConnections(run.board, run.level.size);
    return `<section class="arcade-board pipe-board-panel">
      <div class="row between"><b>مرحلهٔ ${fa(run.stage)} · ${run.level.title}</b><span class="world-status">${fa(run.rotations)} چرخش</span></div>
      <div class="pipe-board" aria-label="صفحهٔ مسیر بازیافت" style="--pipe-columns:${run.level.size}">
      ${run.board
        .map((tile, i) => {
          const lit = connected.has(i);
          const exits = PIPE_DIRECTIONS.filter((dir) => tile.mask & dir.bit);
          const graphic = tile.mask
            ? `<span class="pipe-shape" aria-hidden="true"><i class="hub"></i>${exits.map((dir) => `<i class="${dir.name}"></i>`).join("")}</span>`
            : "";
          return `<div class="pipe-cell ${tile.kind} ${lit ? "connected" : ""}">
          ${
            tile.kind === "pipe"
              ? `<button type="button" data-action="zero-world" data-id="pipe-cell:${i}" data-pipe-cell="${i}" data-mask="${tile.mask}"
              aria-label="چرخاندن قطعه در ردیف ${fa(Math.floor(i / run.level.size) + 1)}، ستون ${fa((i % run.level.size) + 1)}. جهت‌ها: ${exits.map((dir) => dir.label).join("، ")}">${graphic}</button>`
              : `${graphic}${tile.kind === "start" || tile.kind === "end" ? `<span class="pipe-point" role="img" aria-label="${tile.kind === "start" ? "شروع از پاتوق" : "مخزن بازیافت"}">${icon(tile.kind === "start" ? "flag" : "recycle")}</span>` : ""}`
          }
        </div>`;
        })
        .join("")}</div>
      <p class="match-status"><span>${icon("flag")} پاتوق</span><span>${icon("recycle")} مخزن بازیافت</span></p>
    </section>`;
  }

  function view(id, best) {
    if (run?.id !== id) return levelSelection(id, best);
    if (run.phase === "won" || run.phase === "lost") return result(best);
    return id === "match" ? matchBoard() : pipeBoard();
  }
  return { stop, handle, view };
}
