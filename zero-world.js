import { icon } from "./icons.js?v=1.4.0";
import { api, fa, zeroWorldProgress } from "./model.js?v=1.4.0";
import { createCasualArcade, isCasualGame } from "./casual-arcade.js";
import {
  ARCADE_GAMES,
  COMPANIONS,
  LANTERN_PADS,
  SORT_ITEMS,
  ZERO_BOOK,
  ZERO_EPISODE,
  ZERO_PRODUCTS,
  gameStars,
} from "./zero-world-data.js?v=1.4.0";

const image = (name, alt = "") =>
  `<img src="./assets/${name}" alt="${alt}" loading="lazy" decoding="async">`;
const link = (route, label, symbol = "", classes = "btn") =>
  `<a class="${classes}" href="#/${route}">${symbol ? icon(symbol) : ""}${label}</a>`;
const button = (
  action,
  label,
  { symbol = "", classes = "btn", disabled = false } = {},
) =>
  `<button type="button" class="${classes}" data-action="zero-world" data-id="${action}" ${disabled ? "disabled" : ""}>${symbol ? icon(symbol) : ""}${label}</button>`;

const sections = [
  ["games", "بازی‌ها", "sparkle"],
  ["watch", "تماشا", "play"],
  ["store", "ویترین", "gift"],
  ["companions", "همراهان", "team"],
  ["collection", "کلکسیون", "trophy"],
];
export const isWorldSection = (section) =>
  section === "book" || sections.some(([id]) => id === section);
export function companionFor(state) {
  return (
    COMPANIONS.find(({ id }) => id === zeroWorldProgress(state).companion) ||
    COMPANIONS[0]
  );
}
export const companionPortrait = (companion) =>
  companion.id === "robot"
    ? `<img class="companion-pic robot" src="./assets/zero-robot.webp" alt="${companion.title}">`
    : `<span role="img" aria-label="${companion.title}" class="companion-pic ${companion.id}"></span>`;

export function companionTip(state, context = "tip") {
  const companion = companionFor(state);
  return `<aside class="world-guide">${companionPortrait(companion)}<div><b>${companion.title}</b><p>${companion[context]}</p></div>${link("zero/companions", "تغییر همراه", "user", "btn quiet")}</aside>`;
}
export function worldPortals(state, compact = false) {
  const portals = [
    [
      "games",
      "آرکید زیرو",
      fa(ARCADE_GAMES.length) + " بازی کوتاه",
      "zero-lanterns.webp",
      "sparkle",
    ],
    ["watch", "تماشاخانه", "پیش‌نمایش تصویری داستان", "zero-team.webp", "play"],
    [
      "store",
      "ویترین زیرو",
      "کتاب، فیگور و برچسب",
      "zero-collectibles.webp",
      "gift",
    ],
  ];
  return `<section class="world-portals ${compact ? "home-portals" : ""}" aria-label="دروازه‌های جهان زیرو">
    <div class="section-head"><div><h2>دروازه‌های جهان زیرو</h2></div>${link("zero/collection", "کلکسیون من", "trophy", "btn quiet")}</div>
    <div class="world-portal-grid">${portals.map(([id, title, desc, art, symbol]) => `<a class="world-portal ${id}" href="#/zero/${id}">${image(art)}<div>${icon(symbol)}<b>${title}</b><span>${desc}</span></div></a>`).join("")}</div>
    ${companionTip(state)}
  </section>`;
}
const stars = (count) =>
  `<span class="star-row" aria-label="${fa(count)} از ۳ ستاره">${[1, 2, 3].map((n) => icon("star", n <= count ? "earned" : "")).join("")}</span>`;
const meter = (
  at,
  total,
  label,
) => `<div class="world-meter" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${at}">
  <span style="--world-progress:${(100 * at) / total}%"></span></div>`;
function worldPage(section, title, description, body, art = "") {
  const nav = `<nav class="world-nav" aria-label="بخش‌های جهان زیرو">${sections
    .map(
      ([id, label, symbol]) =>
        `<a href="#/zero/${id}" class="btn ${section === id ? "active" : ""}" ${section === id ? 'aria-current="page"' : ""}>${icon(symbol)}${label}</a>`,
    )
    .join("")}</nav>`;
  return `<div class="page game-page world-page"><div class="breadcrumb">${link("zero", "سرزمین زیرو", "", "")}${icon("next")}<span>${title}</span></div>
    <section class="world-head">${art ? image(art) : ""}<div><h1>${title}</h1><p>${description}</p></div></section>
    ${nav}${body}</div>`;
}
const productArt = (position) =>
  `<div class="product-art ${position}" role="img" aria-label="نمونهٔ تصویری محصول زیرو"></div>`;
function shuffledItems() {
  const items = [...SORT_ITEMS];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
function productSave(world, id) {
  const saved = world.saved.includes(id);
  return `<button type="button" class="btn" data-action="zero-world" data-id="save:${id}" aria-pressed="${saved}">${icon(saved ? "check" : "heart")}${saved ? "در فهرست من" : "ذخیره در فهرست من"}</button>`;
}
function productView(id, world) {
  if (!id) {
    return worldPage(
      "store",
      "ویترین زیرو",
      "پیش‌نمایش کتاب، فیگور و محصولات جانبی این جهان.",
      `<div class="world-product-grid">${ZERO_PRODUCTS.map(
        (
          product,
        ) => `<article class="world-product">${productArt(product.position)}
      <div class="world-card-body"><span class="world-status">${product.kind}</span><h2>${product.title}</h2><p>${product.description}</p>
      <div class="row">${link(product.path, product.action, product.icon, "btn primary")}${productSave(world, product.id)}</div></div></article>`,
      ).join("")}</div>`,
      "zero-collectibles.webp",
    );
  }
  const product = ZERO_PRODUCTS.find((entry) => entry.id === id);
  if (!product)
    return worldPage(
      "store",
      "ویترین زیرو",
      "این نمونه در ویترین پیدا نشد.",
      link("zero/store", "بازگشت به ویترین", "gift"),
    );
  return worldPage(
    "store",
    product.title,
    product.description,
    `<section class="world-product detail"><figure>${productArt(product.position)}<figcaption>تصویر مفهومی محصول</figcaption></figure>
    <div class="world-card-body"><h2>${product.kind}</h2>
      ${id === "stickers" ? '<p>تصویر پیش‌نمایش مجموعه برای دریافت آماده است.</p><a class="btn primary" href="./assets/zero-collectibles.webp" download="zero-collectibles.webp">دریافت تصویر مجموعه</a>' : ""}
      ${id === "book" ? link("zero/book", "خواندن نمونه", "book", "btn primary") : ""}
      ${productSave(world, id)}${link("zero/store", "همهٔ محصولات", "gift")}</div></section>`,
  );
}
function companionsView(state, world) {
  return worldPage(
    "companions",
    "همراهان زیرو",
    "یک همراه انتخاب کن تا در بازی‌ها، راهنمای سایت و مسیر مأموریت کنارت باشد.",
    `<div class="world-companion-grid">${COMPANIONS.map((companion) => {
      const selected = world.companion === companion.id;
      return `<article class="world-companion-card ${companion.id} ${selected ? "selected" : ""}">${companionPortrait(companion)}
        <div><h2>${companion.title}</h2><p>${companion.role}</p></div>
        <button type="button" class="btn ${selected ? "" : "primary"}" data-action="zero-world" data-id="companion:${companion.id}" aria-pressed="${selected}">${icon(selected ? "check" : "user")}${selected ? "همراه فعلی" : "انتخاب همراه"}</button></article>`;
    }).join("")}</div>${companionTip(state)}`,
  );
}
const scoreUnit = (id) =>
  id === "sort" ? "پاسخ درست" : id === "lantern" ? "دور کامل" : "مرحلهٔ کامل";

function collectionView(world) {
  const badges = [
    ...ARCADE_GAMES.map((game) => [
      game.badge,
      "رسیدن به " +
        fa(game.target) +
        " " +
        scoreUnit(game.id) +
        " در «" +
        game.title +
        "»",
      world.scores[game.id] >= game.target,
      game.icon,
      "zero/games/" + game.id,
    ]),
    [
      "تماشاگر محله",
      "دیدن تمام قاب‌های پیش‌نمایش",
      world.viewed.episode,
      "play",
      "zero/watch",
    ],
    [
      "کتاب‌خوان زیرو",
      "خواندن سه صفحهٔ نمونه",
      world.viewed.book,
      "book",
      "zero/book",
    ],
  ];
  const saved = ZERO_PRODUCTS.filter((product) =>
    world.saved.includes(product.id),
  );
  return worldPage(
    "collection",
    "کلکسیون زیرو",
    "نشان‌ها و محصولاتی که در فهرستت ذخیره کرده‌ای.",
    `<section class="world-badges"><h2>نشان‌ها</h2><div class="world-badge-grid">${badges
      .map(
        ([title, tip, earned, symbol, path]) =>
          `<article class="world-badge ${earned ? "earned" : "locked"}"><span>${icon(earned ? symbol : "lock")}</span><h3>${title}</h3><p>${tip}</p>${link(path, earned ? "مشاهده" : "رفتن به فعالیت", symbol, "btn quiet")}</article>`,
      )
      .join("")}</div></section>
    <section class="world-badges"><h2>فهرست من · ${fa(saved.length)}</h2>${saved.length ? `<ul class="world-saved">${saved.map((product) => `<li>${link(product.path, product.title, product.icon)}</li>`).join("")}</ul>` : link("zero/store", "دیدن ویترین", "gift")}</section>`,
  );
}
function gamesView(world) {
  return worldPage(
    "games",
    "آرکید زیرو",
    "یک بازی کوتاه انتخاب کن، رکوردت را بهتر کن و نشان بگیر.",
    `<div class="world-games-grid">${ARCADE_GAMES.map(
      (game) => `<article class="world-game">${image(game.image)}
      <div class="world-card-body"><h2>${game.title}</h2><p>${game.description}</p>
      <div class="row between">${stars(gameStars(game.id, world.scores[game.id] || 0))}<span class="world-status">${fa(world.scores[game.id] || 0)} از ${fa(game.rounds)} ${scoreUnit(game.id)}</span></div>
      ${link("zero/games/" + game.id, "بازی کن", "play", "btn game-gold")}</div></article>`,
    ).join("")}</div>`,
  );
}
function gameEnd(game, score, best) {
  return `<div class="world-game-result" role="status">
    <h2>نتیجهٔ این بازی</h2>${stars(gameStars(game.id, score))}
    <p>${fa(score)} از ${fa(game.rounds)} ${game.id === "sort" ? "پاسخ درست" : "دور کامل"}</p>
    <p class="world-status">بهترین نتیجه · ${fa(best)}${best >= game.target ? " · نشان «" + game.badge + "» باز شد" : ""}</p>
    <div class="row center">${button("retry:" + game.id, "دوباره بازی کن", { symbol: "play", classes: "btn game-gold" })}${link("zero/collection", "کلکسیون", "trophy")}</div>
  </div>`;
}

export function createZeroWorld({ refresh, toast }) {
  const casual = createCasualArcade(refresh);
  const lanternGame = ARCADE_GAMES.find(({ id }) => id === "lantern");
  let route = "";
  let run;
  let timer;
  let episode = { index: 0, playing: false };
  let pageIndex = 0;
  const stop = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const sync = (next) => {
    if (next === route) return;
    stop();
    casual.stop();
    route = next;
    run = undefined;
    episode = { index: 0, playing: false };
    pageIndex = 0;
  };
  const focus = (selector) =>
    document.querySelector(selector)?.focus({ preventScroll: true });
  const finishGame = () => {
    stop();
    run.phase = "done";
    api.scoreZeroGame(run.id, run.score);
    refresh();
    focus('.world-game-result [data-action="zero-world"]');
  };
  function playPattern() {
    run.phase = "watch";
    run.pattern = Array.from(
      { length: run.score + 3 },
      () => LANTERN_PADS[Math.floor(Math.random() * LANTERN_PADS.length)].id,
    );
    run.position = 0;
    let cursor = 0;
    const showNext = () => {
      if (cursor === run.pattern.length) {
        run.phase = "answer";
        refresh();
        focus(".lantern-pad");
        return;
      }
      run.active = run.pattern[cursor++];
      refresh();
      timer = setTimeout(() => {
        run.active = "";
        refresh();
        timer = setTimeout(showNext, 210);
      }, 520);
    };
    showNext();
  }
  function episodeAdvance() {
    if (episode.index < ZERO_EPISODE.length - 1) episode.index++;
    if (episode.index === ZERO_EPISODE.length - 1) {
      api.finishZeroSample("episode");
      episode.playing = false;
    }
    stop();
    refresh();
    if (episode.playing) timer = setTimeout(episodeAdvance, 6000);
  }
  function handle(value) {
    if (casual.handle(value)) return;
    const [action, id] = value.split(":");
    switch (action) {
      case "companion":
        api.chooseCompanion(id);
        refresh();
        focus('[data-id="companion:' + id + '"]');
        toast("همراه انتخاب شد.");
        return;
      case "save": {
        const saved = api.saveZeroProduct(id);
        refresh();
        focus('[data-id="save:' + id + '"]');
        toast(saved ? "در فهرستت ذخیره شد." : "از فهرستت برداشته شد.");
        return;
      }
      case "retry":
        stop();
        run = undefined;
        refresh();
        focus('[data-id="start:' + id + '"]');
        return;
      case "start":
        run = { id, phase: "play", score: 0, index: 0, feedback: null };
        if (id === "lantern") playPattern();
        else {
          run.items = shuffledItems();
          refresh();
          focus('[data-id="sort:dry"]');
        }
        return;
      case "sort":
        if (run?.id !== "sort" || run.phase !== "play" || run.feedback) return;
        run.feedback = run.items[run.index].bin === id ? "correct" : "missed";
        if (run.feedback === "correct") run.score++;
        refresh();
        focus('[data-id="sort-next"]');
        return;
      case "sort-next":
        if (run?.id !== "sort" || run.phase !== "play" || !run.feedback) return;
        if (run.index === run.items.length - 1) {
          finishGame();
          return;
        }
        run.index++;
        run.feedback = null;
        refresh();
        focus('[data-id="sort:dry"]');
        return;
      case "lantern-next":
        if (run?.id === "lantern" && run.phase === "round") playPattern();
        return;
      case "lantern":
        if (run?.id !== "lantern" || run.phase !== "answer") return;
        if (run.pattern[run.position] !== id) {
          finishGame();
          return;
        }
        run.position++;
        if (run.position === run.pattern.length) {
          run.score++;
          if (run.score === lanternGame.rounds) {
            finishGame();
            return;
          }
          run.phase = "round";
        }
        refresh();
        if (run.phase === "round") focus('[data-id="lantern-next"]');
        else focus('[data-id="lantern:' + id + '"]');
        return;
      case "episode-toggle":
        stop();
        if (episode.index === ZERO_EPISODE.length - 1) episode.index = 0;
        episode.playing = !episode.playing;
        if (episode.playing) timer = setTimeout(episodeAdvance, 6000);
        refresh();
        focus('[data-id="episode-toggle"]');
        return;
      case "episode-next":
        episodeAdvance();
        focus(
          episode.index === ZERO_EPISODE.length - 1
            ? '[data-id="episode-toggle"]'
            : '[data-id="episode-next"]',
        );
        return;
      case "episode-prev":
        stop();
        episode.playing = false;
        episode.index = Math.max(0, episode.index - 1);
        refresh();
        focus(
          episode.index === 0
            ? '[data-id="episode-next"]'
            : '[data-id="episode-prev"]',
        );
        return;
      case "book-next":
        pageIndex = Math.min(ZERO_BOOK.length - 1, pageIndex + 1);
        if (pageIndex === ZERO_BOOK.length - 1) api.finishZeroSample("book");
        refresh();
        focus(
          pageIndex === ZERO_BOOK.length - 1
            ? '[data-id="book-prev"]'
            : '[data-id="book-next"]',
        );
        return;
      case "book-prev":
        pageIndex = Math.max(0, pageIndex - 1);
        refresh();
        focus(
          pageIndex === 0 ? '[data-id="book-next"]' : '[data-id="book-prev"]',
        );
        return;
    }
  }

  function gamePage(id, state, world) {
    const game = ARCADE_GAMES.find((item) => item.id === id);
    if (!game) return gamesView(world);
    if (isCasualGame(id))
      return worldPage(
        "games",
        game.title,
        game.description,
        casual.view(id, world.scores[id] || 0) + companionTip(state, id),
      );
    let stage;
    if (!run) {
      stage = `<section class="world-game-start">${image(game.image)}
        <div class="world-card-body"><h2>${game.title}</h2><p>${game.description}</p>${button("start:" + id, "شروع بازی", { symbol: "play", classes: "btn game-gold" })}</div></section>`;
    } else if (run.phase === "done") {
      stage = gameEnd(game, run.score, world.scores[id] || 0);
    } else if (id === "sort") {
      const item = run.items[run.index];
      stage = `<section class="arcade-board recycling-board">
        <div class="row between"><b>نوبت ${fa(run.index + 1)} از ${fa(game.rounds)}</b><span>${icon("star")} ${fa(run.score)} پاسخ درست</span></div>${meter(run.index, game.rounds, "پیشرفت بازی")}
        <div class="sort-item"><div aria-hidden="true">${item.art}</div><h2>${item.label}</h2></div>
        <div class="sort-bins">${button("sort:dry", "پسماند خشک", { symbol: "recycle", classes: "sort-bin dry", disabled: !!run.feedback })}${button("sort:organic", "پسماند آلی", { symbol: "leaf", classes: "sort-bin organic", disabled: !!run.feedback })}</div>
        ${run.feedback ? `<div class="arcade-feedback ${run.feedback}" role="status"><p><b>${run.feedback === "correct" ? "درست بود!" : "این بار جابه‌جا شد."}</b> ${item.hint}</p>${button("sort-next", run.index === game.rounds - 1 ? "دیدن نتیجه" : "نوبت بعد", { classes: "btn primary" })}</div>` : ""}
      </section>`;
    } else {
      const active = LANTERN_PADS.find((pad) => pad.id === run.active);
      const message =
        run.phase === "watch"
          ? active
            ? "چراغ " + active.label
            : "ترتیب را به‌خاطر بسپار"
          : run.phase === "round"
            ? "این دور را درست زدی!"
            : "نوبت توست · " +
              fa(run.position) +
              " از " +
              fa(run.pattern.length);
      stage = `<section class="arcade-board lantern-board">
        <div class="row between"><b>${fa(run.score)} از ${fa(game.rounds)} دور کامل</b><span class="world-status">دور ${fa(Math.min(run.score + 1, game.rounds))}</span></div>
        ${meter(run.score, game.rounds, "دورهای کامل")}<p class="lantern-status" role="status">${message}</p>
        <div class="lantern-grid">${LANTERN_PADS.map((pad) => button("lantern:" + pad.id, pad.label, { symbol: pad.icon, classes: "lantern-pad " + pad.color + (run.active === pad.id ? " active" : ""), disabled: run.phase !== "answer" })).join("")}</div>
        ${run.phase === "round" ? button("lantern-next", "دور بعد", { symbol: "play", classes: "btn game-gold" }) : ""}
      </section>`;
    }
    return worldPage(
      "games",
      game.title,
      game.description,
      stage + companionTip(state, id),
    );
  }
  function videoView(world) {
    const frame = ZERO_EPISODE[episode.index];
    const speaker = COMPANIONS.find(
      (companion) => companion.id === frame.speaker,
    );
    const final = episode.index === ZERO_EPISODE.length - 1;
    return worldPage(
      "watch",
      "تماشاخانهٔ زیرو",
      "«قرار کنار فواره» · پیش‌نمایش تصویری یک قسمت داستانی",
      `<section class="world-screen"><div class="world-screen-frame">${image(frame.image)}
        <span class="world-status">قاب ${fa(episode.index + 1)} از ${fa(ZERO_EPISODE.length)}</span></div>
        <div class="world-card-body"><h2>${frame.title}</h2><div class="world-guide">${companionPortrait(speaker)}<div><b>${speaker.title}</b><p>${frame.text}</p></div></div>
          ${meter(episode.index + 1, ZERO_EPISODE.length, "پیشرفت پیش‌نمایش")}
          <div class="row">${button("episode-prev", "قاب قبل", { disabled: episode.index === 0 })}${button("episode-toggle", episode.playing ? "توقف" : final ? "تماشا از اول" : "پخش خودکار", { symbol: "play", classes: "btn game-gold" })}${button("episode-next", "قاب بعد", { disabled: final })}</div>
          ${final && world.viewed.episode ? link("zero/collection", "نشان تماشاگر محله", "trophy") : ""}</div></section>`,
    );
  }
  function bookView(world) {
    const page = ZERO_BOOK[pageIndex];
    const final = pageIndex === ZERO_BOOK.length - 1;
    return worldPage(
      "book",
      "نقشه‌ای زیر نیمکت",
      "نمونهٔ خواندنی کتاب تصویری زیرو",
      `<section class="world-reading">${image(page.image)}
        <div class="world-card-body"><span class="world-status">صفحهٔ ${fa(pageIndex + 1)} از ${fa(ZERO_BOOK.length)}</span><h2>${page.title}</h2><p>${page.text}</p>
          <div class="row">${button("book-prev", "صفحهٔ قبل", { disabled: pageIndex === 0 })}${button("book-next", "صفحهٔ بعد", { classes: "btn game-gold", disabled: final })}${productSave(world, "book")}</div>
          ${final && world.viewed.book ? link("zero/collection", "نشان کتاب‌خوان زیرو", "trophy") : ""}</div></section>`,
    );
  }
  function view(section, id, state) {
    const world = zeroWorldProgress(state);
    switch (section) {
      case "games":
        return id ? gamePage(id, state, world) : gamesView(world);
      case "watch":
        return videoView(world);
      case "store":
        return productView(id, world);
      case "book":
        return bookView(world);
      case "companions":
        return companionsView(state, world);
      case "collection":
        return collectionView(world);
    }
  }
  return { sync, view, handle };
}
