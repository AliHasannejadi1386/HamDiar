import {
  AREAS,
  ALLEYS,
  MISSION_ART,
  LEVELS,
  PRIZES,
  LEARNING,
  PRODUCTS,
  CALENDAR,
  PROJECTS,
  TEAMS,
  MARKET,
  REPORT_STEPS,
  REPORT_CATS,
  POLL,
  QUIZ,
  SATISFACTION,
  MONTHS,
  REQUESTS,
  WASTE_RATES,
  ROLES,
  SAMPLE_NOTICES,
  CLEAN_PARK,
  CULTURAL_PRIZES,
} from "./data.js?v=1.4.0";
import {
  api,
  read,
  fa,
  dateLabel,
  normalizeDigits,
  level,
  audience,
  consentNeeded,
  rolesAllowed,
  allReports,
  approvedCount,
  productById,
  missionCatalog,
  campaignClosed,
  communityPosts,
  discussion,
  actor,
  demoActors,
  uid,
  reportStatus,
  wheelDay,
  missionProgress,
  missionStages,
  zeroProgress,
  zeroUnlocked,
} from "./model.js?v=1.4.0";
import { icon } from "./icons.js?v=1.4.0";
import { ZERO_CHAPTERS } from "./zero.js";
import { ARCADE_GAMES } from "./zero-world-data.js?v=1.4.0";
import {
  createZeroWorld,
  isWorldSection,
  worldPortals,
  companionFor,
  companionPortrait,
  companionTip,
} from "./zero-world.js?v=1.4.0";
import { couponGraphic } from "./qr.js";
import {
  storeReportFiles,
  removeReportFiles,
  readReportFile,
  clearReportFiles,
  requestPosition,
} from "./report-media.js";

const $ = (selector) => document.querySelector(selector);
const shell = $("#content");
const modal = $("#dialog");
const teaser = $("#teaser-dialog");
const video = $("#teaser-video");
const clean = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (x) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        x
      ],
  );
const url = (path = "") => "#/" + path;
const current = () =>
  (location.hash.startsWith("#/") ? location.hash.slice(2) : "").split("/");
const path = () => current().join("/");
const asset = (name) => "./assets/" + name;
const pointsLabel = (n) => fa(n) + " امتیاز";
const minutes = (n) => fa(n) + " دقیقه";
const demo = '<span class="demo">نمونهٔ آزمایشی</span>';
const duration = (n) => icon("clock") + minutes(n);
let state = read();
let listFilter = "";
let dashboardArea = "";
let toastTimeout;
let tutorialStep = 0;
let recording;
const recordedFiles = new WeakMap();
let mediaUrls = [];
const tabs = [
  { label: "خانه", route: "", icon: "home" },
  { label: "مأموریت‌ها", route: "missions", icon: "flag" },
  { label: "محله", route: "feed", icon: "heart" },
  { label: "جوایز", route: "rewards", icon: "gift" },
  { label: "پروفایل", route: "profile", icon: "user" },
];
const services = [
  ["academy", "آکادمی مهارت", "یادگیری کنار هم", "school", "violet"],
  ["voice", "صدای محله", "ثبت و پیگیری گزارش", "voice", ""],
  ["events", "رویدادها", "دورهمی‌های محله", "calendar", "coral"],
  ["services", "همهٔ خدمات", "نقشه، تیم‌ها و بیشتر", "grid", "blue"],
];
const other = [
  ["cafe", "کافهٔ فرهنگی", "پاتوق و ثبت درخواست", "coffee", "coral"],
  ["neighborhood", "نقشهٔ محله", "مقصدها و امکانات محله", "map", ""],
  ["impact", "تغییرات محله", "قبل و بعد پروژه‌ها", "leaf", ""],
  ["teams", "تیم‌های محله", "چالش‌ها و گروه‌های داوطلبی", "team", "violet"],
  ["league", "لیگ کوچه‌ها", "قرارداد محله و هدف مشترک", "trophy", "sun"],
  ["market", "بازارچه", "محصولات محلی", "cart", "coral"],
  ["zero", "سرزمین زیرو", "ماجراجویی و نشان‌ها", "sparkle", "violet"],
  [
    "zero/games",
    "آرکید زیرو",
    "ردیف بازیافت، مسیر بازیافت، تفکیک و حافظه",
    "play",
    "sun",
  ],
  [
    "zero/watch",
    "تماشاخانهٔ زیرو",
    "پیش‌نمایش تصویری قسمت داستانی",
    "play",
    "blue",
  ],
  ["zero/store", "ویترین زیرو", "کتاب، فیگور و محصولات جانبی", "gift", "coral"],
  [
    "dashboard",
    "داشبوردها",
    "مدیر مرکز، مربی، پاتوق و شهرداری",
    "chart",
    "blue",
  ],
  ["help", "راهنما و پشتیبانی", "پرسش‌ها و درخواست‌ها", "voice", "blue"],
];
const statusMeta = {
  pending: ["در انتظار بررسی", "status-wait"],
  approved: ["تأییدشده", "status-current"],
  rejected: ["نیازمند اصلاح", "status-rejected"],
};
const go = (route) => {
  if (modal.open) modal.close();
  if (path() === route) render();
  else location.hash = url(route);
};
const world = createZeroWorld({ refresh: () => render(), toast });
const a = (route, label, cls = "btn", symbol = "") =>
  `<a class="${cls}" href="${url(route)}">${symbol ? icon(symbol) : ""}${label}</a>`;
const b = (name, label, cls = "btn", symbol = "", id = "") =>
  `<button type="button" class="${cls}" data-action="${name}" ${id ? `data-id="${clean(id)}"` : ""}>${symbol ? icon(symbol) : ""}${label}</button>`;
const ib = (name, label, symbol, extra = "") =>
  `<button class="icon-button" type="button" data-action="${name}" aria-label="${label}">${icon(symbol)}${extra}</button>`;
const tile = (symbol, tone = "") =>
  `<span class="tile-icon ${tone}">${icon(symbol)}</span>`;
const empty = (message) => `<p class="empty">${message}</p>`;
const notice = (message, kind = "") =>
  `<p class="notice ${kind}">${message}</p>`;
const tag = (text, cls = "") => `<span class="tag ${cls}">${text}</span>`;
const status = (entry) => (entry ? tag(...statusMeta[entry.status]) : "");
const bar = (value, label) =>
  `<div class="bar" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.floor(Math.min(100, value))}"><span style="--p:${Math.min(100, value)}%"></span></div>`;
const head = (title, text = "", action = "") =>
  `<div class="section-head"><div><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>${action}</div>`;
const img = (name, alt = "", lazy = true) =>
  `<img src="${asset(name)}" alt="${alt}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;
const quick = ([route, title, desc, symbol, tone]) =>
  `<a class="quick" href="${url(route)}">${tile(symbol, tone)}<span><b>${title}</b><small>${desc}</small></span>${icon("next", "quick-go")}</a>`;
const stats = (rows) =>
  `<div class="stats">${rows.map(([val, name]) => `<div class="stat"><b>${val}</b><span>${name}</span></div>`).join("")}</div>`;
const list = (rows, fallback) =>
  rows.length ? `<div class="list">${rows.join("")}</div>` : empty(fallback);
const listing = (symbol, title, text, last = "", target = "") => {
  const body = `${tile(symbol)}<span><b>${title}</b>${text ? `<small>${text}</small>` : ""}</span>${last ? `<span class="end">${last}</span>` : ""}`;
  return target
    ? `<a class="list-item" href="${url(target)}">${body}</a>`
    : `<div class="list-item">${body}</div>`;
};
const card = (
  title,
  text,
  { image = "", symbol = "", tone = "", meta = "", buttons = "" } = {},
) =>
  `<article class="content-card">${image ? img(image) : ""}<div class="card-body">${symbol ? tile(symbol, tone) : ""}<h3>${title}</h3><p>${text}</p>${meta ? `<div class="row">${meta}</div>` : ""}${buttons ? `<div class="row">${buttons}</div>` : ""}</div></article>`;
const panel = (title, body) =>
  `<section class="panel stack">${title ? `<h2>${title}</h2>` : ""}${body}</section>`;
const page = (
  title,
  text,
  body,
  { image = "", back = "", parent = "خانه", symbol = "" } = {},
) => `<div class="page"><div class="breadcrumb">${a(back, parent, "", "")}${icon("next")}<span>${title}</span></div>
  <section class="page-hero"><div><div class="row">${symbol ? tile(symbol) : ""}${demo}</div><h1>${title}</h1><p>${text}</p></div>${image ? img(image, "", false) : ""}</section>${body}</div>`;
const unknown = () =>
  page(
    "این صفحه پیدا نشد",
    "می‌توانید از خانه یا میان‌برهای خدمات ادامه دهید.",
    a("", "بازگشت به خانه", "btn primary", "home"),
  );
const form = (action, id, body, label) =>
  `<form class="form" data-form="${action}" data-id="${clean(id)}">${body}<p class="field-error" role="alert" hidden></p><button type="submit" class="btn primary">${label}</button></form>`;
const select = (name, label, rows, value = "") =>
  `<label>${label}<select name="${name}" required>${rows.map(([id, title]) => `<option value="${clean(id)}" ${id === value ? "selected" : ""}>${clean(title)}</option>`).join("")}</select></label>`;
const field = (name, label, opts = {}) =>
  `<label>${label}<input name="${name}" type="${opts.type || "text"}" value="${clean(opts.value)}" ${opts.min !== undefined ? `min="${opts.min}"` : ""} ${opts.max !== undefined ? `max="${opts.max}"` : ""} ${opts.step ? `step="${opts.step}"` : ""} ${opts.pattern ? `pattern="${opts.pattern}"` : ""} ${opts.inputmode ? `inputmode="${opts.inputmode}"` : ""} placeholder="${clean(opts.placeholder || "")}" maxlength="${opts.length || 120}" ${opts.required === false ? "" : "required"}></label>`;
const areaSelect = (selected = state.profile.area) =>
  select(
    "area",
    "محله",
    AREAS.map((x) => [x, x]),
    selected,
  );
const textarea = (name, label, value = "", placeholder = "") =>
  `<label>${label}<textarea name="${name}" maxlength="550" placeholder="${clean(placeholder)}" required>${clean(value)}</textarea></label>`;
const check = (name, label, on = false) =>
  `<label class="check"><input type="checkbox" name="${name}" ${on ? "checked" : ""}> ${label}</label>`;
const browseBtn = (route, label) => a(route, label, "btn quiet");
const filters = (items) =>
  `<div class="filters" aria-label="فیلتر فهرست">${["همه", ...items].map((item) => `<button class="btn ${(listFilter || "همه") === item ? "active" : ""}" type="button" data-action="filter" data-id="${clean(item)}" aria-pressed="${(listFilter || "همه") === item}">${clean(item)}</button>`).join("")}</div>`;
const filtered = (items, selector = (item) => item.cat) =>
  !listFilter || listFilter === "همه"
    ? items
    : items.filter((x) => selector(x) === listFilter);
const currentAlley = () =>
  ALLEYS.find((x) => x.area === state.profile.area) || ALLEYS[0];
const missionTitle = (m) =>
  clean(m.edited || m.created ? m.title : MISSION_ART[m.id]?.title || m.title);
const cityAccess = () => rolesAllowed.city.includes(state.profile.role);
const currentSpin = () => state.spins[actor(state) + ":" + wheelDay()];
const activeMissions = () =>
  missionCatalog(state).filter((m) => !m.archived && !campaignClosed(m));
const storyStars = () =>
  Object.values(zeroProgress(state)).reduce(
    (sum, result) => sum + result.best,
    0,
  );
const starRow = (
  earned,
) => `<span class="star-row" aria-label="${fa(earned)} از ۳ ستاره">
  ${[1, 2, 3].map((star) => icon("star", star <= earned ? "earned" : "")).join("")}</span>`;
const missionCard = (m) => {
  const visual = MISSION_ART[m.id] || {};
  const entry = state.submissions[m.id];
  const steps =
    entry?.status === "approved"
      ? missionStages.length
      : missionProgress(state, m.id).length;
  return `<article class="mission-card">
    <div class="mission-art ${visual.tone || ""}">${visual.img ? img(visual.img) : icon(visual.icon || "flag", "art-icon")}${tag(clean(m.cat))}</div>
    <div class="mission-body"><h3>${missionTitle(m)}</h3><p>${clean(m.goal)}</p>
      <div class="mission-meta"><span class="metric-chip xp">${icon("star")} ${m.xpNote && !m.xp ? "امتیاز وزنی" : pointsLabel(m.xp)}</span><span class="metric-chip">${duration(m.min)}</span>${status(entry)}</div>
      ${steps > 0 ? `<div class="quest-track" aria-label="${fa(steps)} از ۳ مرحله">${[1, 2, 3].map((marker) => `<span class="${marker <= steps ? "done" : ""}"></span>`).join("")}</div>` : ""}
      ${a("missions/" + m.id, entry ? "مشاهدهٔ وضعیت" : "دیدن مأموریت", "btn card-btn")}
    </div>
  </article>`;
};
const progress = () => {
  const cur = level(state);
  const next = LEVELS.find((l) => l.xp > cur.xp);
  const pct = next
    ? Math.min(
        100,
        Math.floor(((state.xp - cur.xp) * 100) / (next.xp - cur.xp)),
      )
    : 100;
  const rank = LEVELS.indexOf(cur) + 1;
  return `<section class="progress-card">
    <div class="progress-top"><span class="rank-seal">${icon("trophy")}<b>${fa(rank)}</b></span><div><h2>مسیر پیشرفت من</h2><p>${cur.name}</p></div></div>
    <div class="progress-number"><b>${fa(state.xp)}</b><span>امتیاز</span></div>
    ${bar(pct, "پیشرفت سطح")}
    <div class="progress-copy"><span>${next ? `تا «${next.name}»` : "بالاترین سطح"}</span><span>${next ? fa(Math.max(next.xp - state.xp, 0)) + " امتیاز" : fa(100) + "٪"}</span></div>
    ${a("profile/achievements", "نشان‌ها و پیشرفت", "btn lime full", "star")}
    ${a("zero", icon("star") + " " + fa(storyStars()) + " ستارهٔ داستان", "story-score-link")}
  </section>`;
};
const alleyCard = () => {
  const alley = currentAlley();
  const points = alley.points + approvedCount(state) * 20;
  return `<section class="panel alley-card"><div class="row">${tile("bulb", "sun")}<div><h2>${alley.name}</h2><p class="muted small">هدف جمعی · ${alley.goal.title}</p></div></div>
    ${bar((100 * points) / alley.goal.target, "پیشرفت هدف کوچه")}<div class="progress-copy"><span>${fa(points)} از ${fa(alley.goal.target)} امتیاز</span>${a("league", "لیگ کوچه‌ها", "strong")}</div></section>`;
};
function home() {
  const campaign = missionCatalog(state).find((m) => m.id === CLEAN_PARK.id);
  const featured = ["quiz-waste", "poll-light", "event-meet"]
    .map((id) => activeMissions().find((m) => m.id === id))
    .filter(Boolean);
  return `<div class="dashboard game-home">
    <div class="location-line"><span>${icon("pin")} تهران، منطقهٔ ۱۸ <span aria-hidden="true">/</span> ${clean(state.profile.area)}</span>${demo}</div>
    <section class="hero game-hero">
      <div class="hero-copy"><span class="hero-kicker">${icon("sparkle")} سرزمین زیرو</span>
        <h1>محلهٔ ما، <em>قصهٔ ما</em></h1>
        <p>با گروه زیرو محله را کشف کن، فصل‌های داستان را باز کن و برای کارهای واقعی محله مأموریت بردار.</p>
        <nav class="hero-actions" aria-label="منوی اصلی هم‌دیار">${a("zero", storyStars() ? "ادامهٔ ماجراجویی" : "شروع ماجراجویی", "btn game-gold", "play")}${a("missions", "مأموریت‌های محله", "btn game-ghost", "flag")}${b("teaser", "تماشای تیزر", "btn game-ghost", "play")}${b("tutorial", "راهنمای خانه", "btn quiet", "book")}</nav>
      </div>
      <div class="hero-art">${img("zero-team.webp", "سه نوجوان و ربات سفید گروه زیرو در محله", false)}
        ${a("zero", icon("star") + " " + fa(storyStars()) + " ستارهٔ داستان", "map-pin")}</div>
    </section>
    <nav class="quick-grid game-shortcuts" aria-label="میان‌برهای خدمات">${services.map(quick).join("")}</nav>
    ${worldPortals(state, true)}
    ${cityAccess() ? a("dashboard/city", "ورود به پنل شهرداری", "btn primary city-entry", "chart") : ""}
    ${campaignCard(campaign)}
    <div class="home-grid">
      <section>${head("تابلوی مأموریت‌ها", "مأموریت‌های پیشنهادی برای شروع", browseBtn("missions", "همهٔ مأموریت‌ها"))}<div class="mission-grid">${featured.map(missionCard).join("")}</div></section>
      <aside class="stack" aria-label="پیشرفت محله و عضو">${state.profile.role === "guest" ? panel("عضویت هم‌دیار", a("auth", "ورود آزمایشی", "btn primary", "user")) : progress()}${alleyCard()}</aside>
    </div>
    <div class="after-home">${head("تازه‌های محله", "", browseBtn("feed", "رفتن به فید"))}
      <div class="feed-grid">${communityPosts(state).slice(0, 2).map(activityPost).join("")}</div></div>
  </div>`;
}
function missionIndex(sub) {
  if (sub === "mine") {
    const rows = missionCatalog(state)
      .filter((m) => state.submissions[m.id])
      .map((m) =>
        listing(
          "flag",
          missionTitle(m),
          dateLabel(state.submissions[m.id].at),
          status(state.submissions[m.id]),
          "missions/" + m.id,
        ),
      );
    return page(
      "مأموریت‌های من",
      "وضعیت و بازخورد فعالیت‌هایی که ثبت کرده‌اید.",
      `<div class="row">${b("new-personal", "ساخت مأموریت شخصی", "btn primary", "flag")}${a("missions", "دیدن فهرست عمومی")}</div>
      <div class="split after-home">${panel("مأموریت‌های شخصی", personalTasks())}${panel("سوابق مشارکت", list(rows, "هنوز مأموریتی در سوابق ثبت نشده است."))}</div>`,
      { back: "missions", parent: "مأموریت‌ها" },
    );
  }
  if (sub)
    return missionDetail(missionCatalog(state).find((m) => m.id === sub));
  const items = activeMissions().filter((m) => audience(state, m));
  const filteredItems = filtered(items);
  return page(
    "مأموریت‌های محله",
    "یک کار کوچک انتخاب کنید، نتیجه را ثبت کنید و اثر مشارکتتان را ببینید.",
    `
    <div class="row mission-links">${a("missions/mine", "مأموریت‌های من", "btn", "flag")}${b("new-personal", "ساخت مأموریت شخصی", "btn", "plus")}${cityAccess() ? a("dashboard/missions", "مدیریت مأموریت‌ها", "btn primary", "tool") : ""}</div>
    <div class="row between">${filters([...new Set(items.map((m) => m.cat))])}</div>
    <div class="mission-grid">${filteredItems.map(missionCard).join("")}</div>
    <div class="after-home">${head("نمونهٔ مأموریت‌ها در فید", "", browseBtn("feed", "دیدن همه"))}
      <div class="feed-grid">${["seed-green", "seed-park"].map((id) => activityPost(communityPosts(state).find((item) => item.id === id))).join("")}</div>
    </div>`,
    { image: "kiosk.jpg", symbol: "flag" },
  );
}
function missionDetail(m) {
  if (!m) return unknown();
  const entry = state.submissions[m.id];
  const practice = state.testSubmissions[actor(state)]?.[m.id];
  const steps =
    entry && entry.status !== "rejected"
      ? entry.steps || missionStages
      : missionProgress(state, m.id);
  const manual = ["checkin", "confirm", "invite"].includes(m.type);
  const showChecklist =
    manual &&
    !m.archived &&
    !campaignClosed(m) &&
    rolesAllowed.join.includes(state.profile.role) &&
    audience(state, m);
  const published = state.activityPosts.find(
    (post) => post.mission === m.id && post.owner === actor(state),
  );
  const locked =
    m.teen &&
    (!audience(state, m) || (consentNeeded(state) && !state.profile.consent));
  const visit =
    m.type === "report"
      ? a("voice/new", "ثبت گزارش", "btn primary", "pin")
      : m.type === "waste"
        ? a("neighborhood", "پیدا کردن پاتوق", "btn primary", "map")
        : b(
            "start-mission",
            entry?.status === "rejected"
              ? "اصلاح و ارسال دوباره"
              : "شروع مأموریت",
            "btn primary",
            "flag",
            m.id,
          );
  const action =
    state.profile.role === "guest"
      ? a("auth", "ورود برای مشارکت", "btn primary", "user")
      : locked
        ? notice(
            "این مأموریت به مسیر نوجوان سفیر، رضایت سرپرست و حضور مربی نیاز دارد.",
            "warning",
          ) + a("profile", "مشاهدهٔ پروفایل")
        : m.archived || campaignClosed(m)
          ? notice(
              m.archived
                ? "این مأموریت از فهرست عمومی برداشته شده است."
                : "مهلت این کمپین به پایان رسیده است.",
              "warning",
            )
          : !rolesAllowed.join.includes(state.profile.role) && !entry
            ? notice("با نقش شهروند می‌توانید نتیجهٔ مأموریت را ثبت کنید.") +
              a("profile", "تنظیم نقش یا حالت تست")
            : entry && entry.status !== "rejected"
              ? notice("برای مشاهدهٔ آخرین وضعیت به «مأموریت‌های من» بروید.") +
                a("missions/mine", "مأموریت‌های من")
              : manual && steps.length < missionStages.length
                ? notice(
                    "سه مرحلهٔ زیر را به‌ترتیب تکمیل کنید تا بتوانید نتیجه را بفرستید.",
                  )
                : visit;
  return page(
    missionTitle(m),
    clean(m.goal),
    `<div class="split">${panel(
      "اطلاعات مأموریت",
      `<div class="row">${tag(duration(m.min))} ${tag(clean(m.cat))} ${status(entry)}</div>
    <p><b>شرایط ایمنی</b> · ${clean(m.safety)}</p><p><b>روش تأیید</b> · ${clean(m.verify)}</p><p><b>پاداش مشارکت</b> · ${m.xpNote && !m.xp ? clean(m.xpNote) : pointsLabel(m.xp)}</p>
    ${m.fund ? `<p class="muted small">منبع نمونهٔ اعتبار · ${m.fund}</p>` : ""}${m.note ? notice(m.note) : ""}`,
    )}
    ${panel(
      "مشارکت شما",
      `${entry ? `<p class="small"><b>شناسه </b><bdi>${entry.id}</bdi> · ${dateLabel(entry.at)}</p>` : ""}${entry?.note ? notice(clean(entry.note)) : ""}${entry?.preliminary ? notice("بررسی اولیه · " + clean(entry.preliminary)) : ""}${action}
    ${showChecklist ? `<div class="quest-stages"><div class="row between"><b>مسیر مأموریت</b><span>${fa(steps.length)} از ۳ مرحله</span></div>${bar((100 * steps.length) / 3, "پیشرفت مأموریت")}<div class="stage-list">${missionStages.map((label, index) => `<label class="check"><input type="checkbox" data-mission-stage="${index}" data-id="${m.id}" ${index < steps.length ? "checked" : ""} ${(entry && entry.status !== "rejected") || index > steps.length ? "disabled" : ""}><span class="stage-node" aria-hidden="true">${index < steps.length ? icon("check") : fa(index + 1)}</span><span>${label}</span></label>`).join("")}</div></div>` : ""}
    ${state.profile.testMode && state.profile.role !== "guest" && !m.archived ? (practice ? notice("پایان تمرین ثبت شد · بدون امتیاز") : b("practice", "انجام آزمایشی مأموریت", "btn", "check", m.id)) : ""}
    ${published ? a("feed/" + published.id, "مشاهدهٔ پست") : entry?.status === "approved" && (entry.actor || "neighbor") === actor(state) ? b("publish-mission", "انتشار در فید محله", "btn", "plus", m.id) : ""}
    ${cityAccess() ? a("dashboard/missions/" + m.id, "ویرایش در پنل شهرداری") : ""}`,
    )}</div>${rolesAllowed.join.includes(state.profile.role) ? companionTip(state, "mission") : ""}`,
    {
      image: MISSION_ART[m.id]?.img,
      back: "missions",
      parent: "مأموریت‌ها",
      symbol: "flag",
    },
  );
}

function campaignCard(campaign) {
  if (!campaign || campaign.archived || campaignClosed(campaign)) return "";
  return `<section class="campaign-banner">
    <div class="campaign-art">${img("zero-cleanup.webp", "گروه زیرو در حال جمع‌آوری پسماند در پارک")}</div>
    <div class="campaign-copy">${tag("کمپین موقت", "status-current")}
      <h2>${missionTitle(campaign)}</h2><p>${clean(campaign.goal)}</p>
      <div class="row">${a("missions/" + campaign.id, "پیوستن به کمپین", "btn primary", "leaf")}
      ${campaign.ends ? `<span class="small">تا ${dateLabel(campaign.ends + "T12:00:00Z")}</span>` : ""}</div>
    </div>
  </section>`;
}
function personalTasks() {
  const rows = state.personalTasks.filter(
    (entry) => entry.owner === actor(state),
  );
  return list(
    rows.map((task) => {
      const post = state.activityPosts.find(
        (entry) => entry.mission === task.id,
      );
      return `<article class="list-item personal"><div><b>${clean(task.title)}</b><small>${clean(task.goal)}</small></div>
      <div class="row">${task.completedAt ? tag("انجام شد", "status-current") : b("complete-personal", "علامت انجام شد", "btn", "check", task.id)}
      ${post ? a("feed/" + post.id, "پست محله") : task.completedAt ? b("publish-mission", "انتشار در فید", "btn", "plus", task.id) : ""}</div></article>`;
    }),
    "مأموریت‌های شخصی این حساب در اینجا نمایش داده می‌شوند.",
  );
}

function socialBlock(key, link = "", full = false) {
  const thread = discussion(state, key);
  const here = actor(state);
  const visible = thread.comments.filter((entry) => !entry.hidden);
  const reaction = (
    action,
    items,
    label,
    symbol,
  ) => `<button type="button" class="btn reaction"
    data-action="${action}" data-id="${clean(key)}" aria-pressed="${items.includes(here)}">${icon(symbol)} <span>${label} · ${fa(items.length)}</span></button>`;
  return `<div class="discussion">
    <div class="row reactions">${reaction("like", thread.likes, "پسند", "heart")}
    ${key.startsWith("report:") ? reaction("flag-report", thread.flags, "پیشنهاد رد", "flag") : ""}
    ${link ? a(link, "نظرها · " + fa(visible.length), "btn", "voice") : b("comment", "ثبت نظر · " + fa(visible.length), "btn", "voice", key)}</div>
    ${full && visible.length ? `<ul class="comment-list">${visible.map((entry) => `<li><div class="row"><b>${clean(entry.author)}</b>${entry.role === "city" ? tag("شهرداری") : ""}</div><p>${clean(entry.text)}</p></li>`).join("")}</ul>` : ""}
    ${full && !visible.length ? '<p class="muted small">هنوز نظری ثبت نشده است.</p>' : ""}
  </div>`;
}
function activityPost(entry, full = false) {
  const steps = entry.steps ?? 3;
  return `<article class="activity-post">
    <header>${tile("user", "violet")}<div><b>${clean(entry.author)}</b><span>${entry.at ? dateLabel(entry.at) : "پست نمونه"}</span></div>
      ${tag(steps === 3 ? "تکمیل‌شده" : "در حال انجام", steps === 3 ? "status-current" : "status-wait")}</header>
    ${entry.image ? img(entry.image, "") : ""}
    <div class="post-content"><h2>${clean(entry.title)}</h2><p>${clean(entry.text)}</p>
      ${steps < 3 ? `<div class="post-steps">${bar((100 * steps) / 3, "مراحل مأموریت")}<span>${fa(steps)} از ۳ مرحله</span></div>` : ""}
      ${socialBlock("post:" + entry.id, full ? "" : "feed/" + entry.id, full)}</div>
  </article>`;
}
function feedPage(id) {
  const entries = communityPosts(state);
  if (id) {
    const entry = entries.find((item) => item.id === id);
    return entry
      ? page(
          "پست محله",
          "فعالیت‌ها و تجربه‌های همسایه‌ها",
          activityPost(entry, true),
          { back: "feed", parent: "فید محله", symbol: "heart" },
        )
      : unknown();
  }
  return page(
    "فید محله",
    "محلهٔ ما، قصهٔ ما. از کارهای انجام‌شده و گزارش‌های همسایه‌ها باخبر شوید.",
    `${campaignCard(missionCatalog(state).find((m) => m.id === CLEAN_PARK.id))}
    <div class="row mission-links">${a("missions/mine", "مأموریت‌های من", "btn", "flag")}${a("voice/new", "ثبت گزارش حادثه", "btn primary", "pin")}${a("voice", "همهٔ گزارش‌ها", "btn", "voice")}</div>
    <div class="feed-grid">${entries.map((entry) => activityPost(entry)).join("")}</div>
    <div class="after-home">${head("گزارش‌های اخیر", "", browseBtn("voice", "همهٔ گزارش‌ها"))}
    <div class="feed-grid">${allReports(state).slice(0, 4).map(reportPreview).join("")}</div></div>`,
    { symbol: "heart" },
  );
}
function reportPreview(entry) {
  const title =
    REPORT_CATS.find((cat) => cat.id === entry.cat)?.name || "گزارش محله";
  return `<article class="activity-post"><header>${tile("pin")}<div><b>${clean(title)}</b><span>${clean(entry.area)}</span></div>${tag(reportStatus(entry), entry.rejection ? "status-rejected" : "")}</header>
    <div class="post-content"><p>${a("voice/" + entry.id, clean(entry.text), "report-text")}</p>${socialBlock("report:" + entry.id, "voice/" + entry.id)}</div></article>`;
}
function reportAttachments(entry) {
  return entry.attachments?.length
    ? `<div class="report-attachments">${entry.attachments
        .map(
          (file) => `<figure><figcaption>${clean(file.name)}</figcaption>
        <div data-media-id="${clean(file.id)}" data-kind="${clean(file.kind)}" aria-live="polite">در حال بارگذاری پیوست…</div></figure>`,
        )
        .join("")}</div>`
    : "";
}
async function hydrateAttachments() {
  for (const node of shell.querySelectorAll("[data-media-id]")) {
    try {
      const blob = await readReportFile(node.dataset.mediaId);
      if (!node.isConnected) continue;
      if (!blob) {
        node.textContent = "پیوست روی این دستگاه پیدا نشد.";
        continue;
      }
      const url = URL.createObjectURL(blob);
      mediaUrls.push(url);
      const element = document.createElement(
        node.dataset.kind === "image" ? "img" : node.dataset.kind,
      );
      if (element instanceof HTMLImageElement) element.alt = "عکس پیوست گزارش";
      else {
        element.controls = true;
        element.preload = "metadata";
        element.playsInline = true;
      }
      element.src = url;
      node.replaceChildren(element);
    } catch {
      node.textContent = "باز کردن پیوست ممکن نشد.";
    }
  }
}
function locationFields(draft) {
  return `<fieldset class="report-fieldset"><legend>موقعیت حادثه</legend>
    ${field("location", "نشانی تقریبی", { value: draft.location, placeholder: "نمونه: کنار ورودی بوستان", required: false })}
    <div class="row">${b("report-location", "دریافت موقعیت دستگاه", "btn", "pin")}<span id="position-status" role="status" class="muted small"></span></div>
    <details><summary>وارد کردن دستی مختصات</summary><div class="split">
    ${field("lat", "عرض جغرافیایی", { type: "number", min: -90, max: 90, step: "any", value: draft.lat, required: false })}
    ${field("lon", "طول جغرافیایی", { type: "number", min: -180, max: 180, step: "any", value: draft.lon, required: false })}
    </div></details></fieldset>`;
}
function attachmentFields() {
  return `<fieldset class="report-fieldset"><legend>عکس، ویس و ویدیو</legend><div class="media-inputs">
    <label>عکس<input type="file" name="image" accept="image/*"></label>
    <label>فایل صوتی<input type="file" name="audio" accept="audio/*"></label>
    <label>ویدیو<input type="file" name="video" accept="video/*"></label></div>
    <div class="row">${b("record-voice", "ضبط ویس", "btn", "mic")}<button type="button" class="btn quiet" data-action="discard-voice" hidden>حذف ویس ضبط‌شده</button><span id="record-status" role="status" class="muted small"></span></div>
    <p class="muted small">عکس تا ۱۲، صدا تا ۱۵ و ویدیو تا ۴۰ مگابایت. حداکثر سه پیوست.</p>
  </fieldset>`;
}
function voice(sub) {
  if (sub === "new") {
    const draft = state.draftReport;
    return page(
      "ثبت گزارش محله یا حادثه",
      "نوع حادثه یا مشکل، موقعیت و شرح آن را وارد کنید. می‌توانید عکس، ویس و ویدیو هم اضافه کنید.",
      panel(
        "",
        state.profile.role === "guest"
          ? a("auth", "ورود برای ارسال گزارش", "btn primary")
          : form(
              "report",
              "",
              select(
                "cat",
                "دسته‌بندی",
                REPORT_CATS.map((x) => [x.id, x.name]),
                draft.cat || "incident",
              ) +
                areaSelect(draft.area) +
                locationFields(draft) +
                textarea(
                  "text",
                  "شرح مشکل",
                  draft.text,
                  "چه چیزی نیاز به رسیدگی دارد؟",
                ) +
                attachmentFields(),
              "ثبت و دریافت کد رهگیری",
            ),
      ),
      { back: "voice", parent: "صدای محله", symbol: "pin" },
    );
  }
  if (sub) {
    const r = allReports(state).find((x) => x.id === sub);
    if (!r) return unknown();
    const mine = state.reports.some(
      (x) => x.id === r.id && (x.actor || "neighbor") === actor(state),
    );
    const feedback = state.feedback.find((x) => x.report === r.id);
    return page(
      "پیگیری گزارش",
      clean(r.text),
      `${stats([
        [`<bdi>${r.id}</bdi>`, "کد رهگیری"],
        [clean(r.area), "محله"],
        [reportStatus(r), "وضعیت"],
      ])}<div class="split">
      ${panel(
        "خط زمانی رسیدگی",
        `<ol class="timeline">${REPORT_STEPS.map((step, i) => {
          const event = r.history?.find((h) => h.step === i);
          return `<li class="${i <= r.step ? "done" : ""}">${step}${event ? `<small> · ${dateLabel(event.at)} ${clean(event.note)}</small>` : ""}</li>`;
        }).join("")}</ol>`,
      )}
      ${panel(
        "اطلاعات گزارش",
        `<p>${clean(r.location || r.area)}</p>
        ${r.coordinates ? `<div class="row"><bdi class="coordinates">${r.coordinates.lat}, ${r.coordinates.lon}</bdi>${b("copy-coordinates", "کپی مختصات", "btn", "pin", r.id)}</div>` : ""}
        ${r.rejection ? notice("دلیل رد شهرداری · " + clean(r.rejection.reason), "warning") : ""}
        ${feedback ? notice("آخرین بازخورد · " + clean(feedback.text)) : ""}
        ${reportAttachments(r)}
        ${mine ? b("feedback", "ثبت بازخورد خصوصی", "btn", "voice", r.id) : ""}
        ${cityAccess() ? `<div class="row">${b("report-decision", r.rejection ? "بازگشایی گزارش" : "رد گزارش", "btn", "flag", r.id)}${!r.rejection && r.step < 4 ? b("advance-report", "ثبت گام بعد", "btn primary", "check", r.id) : ""}</div>` : ""}`,
      )}</div>
      <div class="after-home">${panel("واکنش و نظر همسایه‌ها", socialBlock("report:" + r.id, "", true))}</div>`,
      { back: "voice", parent: "صدای محله", symbol: "voice" },
    );
  }
  const rows = allReports(state);
  const mineIds = new Set(
    state.reports
      .filter((x) => (x.actor || "neighbor") === actor(state))
      .map((x) => x.id),
  );
  const mine = rows
    .filter((r) => mineIds.has(r.id))
    .map((r) =>
      listing(
        "pin",
        clean(r.text),
        clean(r.area) + " · " + reportStatus(r),
        tag("گزارش من"),
        "voice/" + r.id,
      ),
    );
  const examples = rows.filter((r) => !mineIds.has(r.id));
  return page(
    "صدای محله",
    "مشکل مسیر را ثبت کنید و مراحل بررسی و رسیدگی را پیگیری کنید.",
    `<div class="row">${a("voice/new", "ثبت گزارش یا حادثه", "btn primary", "pin")}${a("neighborhood", "نقشهٔ محله", "btn", "map")}</div><div class="after-home">
    ${panel("گزارش‌های من", list(mine, "هنوز گزارشی برای این حساب ثبت نشده است."))}</div>
    <div class="after-home">${head("گزارش‌های محله")}<div class="feed-grid">${examples.map(reportPreview).join("")}</div></div>`,
    { symbol: "voice" },
  );
}

function wheelResult(entry) {
  return (
    notice(entry.title, entry.coupon ? "" : "warning") +
    (entry.coupon
      ? a("rewards/coupon/" + entry.coupon, "دیدن کوپن امروز", "btn", "gift")
      : "") +
    '<p class="muted small">نوبت بعدی از نیمه‌شب به وقت تهران.</p>'
  );
}
function rewards(sub, id) {
  if (sub === "wallet") {
    const rows = state.transactions
      .filter((t) => t.wallet === "xp")
      .map((t) =>
        listing(
          "bolt",
          clean(t.title),
          dateLabel(t.at),
          tag(pointsLabel(t.amount)),
        ),
      );
    const coupons = state.coupons.map((c) =>
      listing(
        "gift",
        clean(c.title),
        "اعتبار تا " + dateLabel(c.until),
        tag(c.used ? "مصرف‌شده" : c.until < Date.now() ? "منقضی" : "فعال"),
        "rewards/coupon/" + c.code,
      ),
    );
    return page(
      "کیف پول هم‌دیار",
      "امتیازهای مشارکت و کوپن‌های فرهنگی اینجا ثبت می‌شوند.",
      stats([
        [fa(state.xp), "امتیاز"],
        [fa(approvedCount(state)), "مأموریت تأییدشده"],
        [fa(coupons.length), "کوپن"],
      ]) +
        `<div class="split after-home">${panel("تاریخچهٔ امتیاز", list(rows, "هنوز سابقهٔ امتیازی ثبت نشده است."))}${panel("کوپن‌های من", list(coupons, "کوپنی دریافت نشده است."))}</div>`,
      { back: "rewards", parent: "باشگاه جوایز", symbol: "wallet" },
    );
  }
  if (sub === "wheel") {
    const entry = currentSpin();
    return page(
      "گردونهٔ فرهنگی",
      "هر روز یک چرخش رایگان به‌وقت تهران.",
      `<div class="split">
      ${panel(
        "",
        `<div class="wheel-wrap"><i aria-hidden="true"></i><div class="wheel" id="wheel" aria-hidden="true">
        ${CULTURAL_PRIZES.map((p, i) => `<span class="wheel-label" style="--angle:${30 + 60 * i}deg">${p.label}</span>`).join("")}${tile("gift")}
      </div></div><div id="wheel-result" class="stack" aria-live="polite">${entry ? wheelResult(entry) : b("spin", "چرخش امروز", "btn primary full", "sparkle")}</div>`,
      )}
      ${panel(
        "خانه‌های گردونه",
        list(
          CULTURAL_PRIZES.map((p) =>
            listing(p.empty ? "sparkle" : "gift", p.title, ""),
          ),
          "",
        ) + a("rewards/wallet", "کوپن‌های من", "btn", "wallet"),
      )}
      </div>`,
      { back: "rewards", parent: "باشگاه جوایز", symbol: "gift" },
    );
  }
  if (sub === "coupon") {
    const c = state.coupons.find((x) => x.code === id);
    if (!c) return unknown();
    return page(
      clean(c.title),
      "کوپن را به مسئول پاتوق نشان دهید.",
      panel(
        "کوپن پاداش",
        `${tag(c.used ? "مصرف‌شده" : c.until < Date.now() ? "منقضی" : "قابل‌استفاده")}
      ${couponGraphic(c.code)}<p class="coupon-code">${c.code}</p><p>اعتبار تا ${dateLabel(c.until)} · یک‌بارمصرف</p>
      ${b("copy", "کپی کد کوپن", "btn", "check", c.code)}${a("rewards/wallet", "کیف پول")}`,
      ),
      { back: "rewards/wallet", parent: "کیف پول", symbol: "gift" },
    );
  }
  if (sub) {
    const reward = PRIZES.find((x) => x.id === sub);
    if (!reward) return unknown();
    return page(
      reward.title,
      "جزئیات استفاده از مزیت آزمایشی.",
      panel(
        "شرایط دریافت",
        `<p>کوپن یک‌بارمصرف تا یک ماه پس از دریافت فعال است.</p><p>ارائه‌دهندهٔ نمونه · ${reward.fund}</p>
      ${state.profile.role === "guest" ? a("auth", "ورود برای دریافت", "btn primary") : b("redeem", "دریافت کوپن", "btn primary", "gift", reward.id)}
      ${a("rewards/wallet", "کوپن‌های من", "btn", "wallet")}`,
      ),
      { back: "rewards", parent: "باشگاه جوایز", symbol: "gift" },
    );
  }
  return page(
    "باشگاه جوایز",
    "مزیت‌های فرهنگی، آموزشی و کافه را پیدا کنید.",
    `<div class="row">${a("rewards/wheel", "گردونهٔ فرهنگی", "btn primary", "sparkle")}${a("rewards/wallet", "کوپن‌های من", "btn", "wallet")}${a("cafe/offers", "تخفیف‌های کافه", "btn", "coffee")}</div>
    <div class="grid after-home">${PRIZES.filter((r) => audience(state, r))
      .map((r, i) =>
        card(r.title, r.fund, {
          symbol: i % 2 ? "gift" : "star",
          tone: i % 2 ? "violet" : "sun",
          buttons: a("rewards/" + r.id, "جزئیات جایزه"),
        }),
      )
      .join("")}</div>`,
    { symbol: "gift" },
  );
}

function cafe(sub, id) {
  if (sub === "cart") {
    const rows = Object.entries(state.cart).map(([key, count]) => {
      const item = productById(key);
      return `<div class="list-item">${tile("cart")}<span><b>${item.title}</b></span><span class="row end">
        ${b("cart-remove", "کم‌کردن", "btn", "", key)}<b>${fa(count)}</b>${b("cart-add", "افزودن", "btn", "", key)}</span></div>`;
    });
    return page(
      "سبد خرید",
      "اقلام و تعداد آن‌ها را مرور کنید.",
      `<div class="split">
      ${panel("اقلام سبد", list(rows, "سبد خرید خالی است.") + a("cafe", "منوی کافه"))}
      ${panel(
        "خلاصهٔ سفارش",
        `${notice("درخواست آزمایشی اقلام در پاتوق ثبت می‌شود.")}
        ${rows.length ? (state.profile.role === "guest" ? a("auth", "ورود برای ثبت سفارش", "btn primary") : form("order", "", "", "تأیید و ثبت سفارش")) : ""}`,
      )}
    </div>`,
      { back: "cafe", parent: "کافه فرهنگی", symbol: "cart" },
    );
  }
  if (sub === "orders" || sub === "order") {
    if (id) {
      const r = state.orders.find((item) => item.id === id);
      if (!r) return unknown();
      return page(
        "رسید سفارش",
        "سفارش آزمایشی ثبت شد.",
        panel(
          "سفارش " + r.id,
          `
        ${list(
          Object.entries(r.items).map(([key, count]) =>
            listing("cart", productById(key).title, fa(count) + " عدد"),
          ),
          "",
        )}
        ${a("cafe/orders", "سوابق سفارش‌ها")}`,
        ),
        { back: "cafe/orders", parent: "سفارش‌ها", symbol: "cart" },
      );
    }
    return page(
      "سفارش‌های من",
      "رسیدهای ثبت‌شده در این دستگاه.",
      list(
        state.orders.map((r) =>
          listing(
            "cart",
            "سفارش " + r.id,
            dateLabel(r.at),
            tag("ثبت شد"),
            "cafe/order/" + r.id,
          ),
        ),
        "هنوز سفارشی ثبت نشده است.",
      ),
      { back: "cafe", parent: "کافه فرهنگی", symbol: "cart" },
    );
  }
  if (sub === "offers")
    return page(
      "تخفیف‌های کافه",
      "مزایای منتخب کافه را فعال کنید. کوپن در کیف پول ثبت می‌شود.",
      `<div class="grid">${PRIZES.filter((r) => r.fund.includes("کافه"))
        .map((r) =>
          card(r.title, "تخفیف آزمایشی اقلام منتخب", {
            symbol: "gift",
            tone: "sun",

            buttons: a("rewards/" + r.id, "شرایط و دریافت"),
          }),
        )
        .join("")}</div>`,
      { back: "cafe", parent: "کافه فرهنگی", symbol: "coffee" },
    );
  if (sub === "products") {
    const p = productById(id);
    if (!p) return unknown();
    return page(
      p.title,
      p.cat || "بازارچهٔ هم‌دیار",
      panel(
        "انتخاب محصول",
        `${form("add-product", p.id, field("quantity", "تعداد", { type: "number", min: 1, max: 9, value: 1 }), "افزودن به سبد")}${a("cafe/cart", "دیدن سبد", "btn", "cart")}`,
      ),
      {
        image: p.img,
        back: p.cat ? "cafe" : "market",
        parent: p.cat ? "کافه فرهنگی" : "بازارچه",
        symbol: p.cat ? "coffee" : "cart",
      },
    );
  }
  if (sub) return unknown();
  return page(
    "کافه فرهنگی هم‌دیار",
    "دورهمی، نوشیدنی و برنامه‌های محلی در پاتوق پیشنهادی بوستان قائم.",
    `
    <div class="row">${a("cafe/cart", "سبد خرید · " + fa(Object.values(state.cart).reduce((x, y) => x + y, 0)), "btn primary", "cart")}
      ${a("cafe/offers", "کوپن‌های کافه", "btn", "gift")}${a("cafe/orders", "سفارش‌ها", "btn", "book")}${a("events", "برنامه‌های پاتوق", "btn", "calendar")}</div>
    <div class="after-home">${head("منوی آزمایشی کافه", "زمان و منوی قطعی پس از تأیید مرکز اعلام می‌شود.")}
      ${filters([...new Set(PRODUCTS.map((p) => p.cat))])}<div class="grid">${filtered(
        PRODUCTS,
      )
        .map((p) =>
          card(p.title, p.cat, {
            symbol: p.cat === "خوراکی" ? "gift" : "coffee",
            tone: p.cat === "نوشیدنی سرد" ? "blue" : "coral",

            buttons: a("cafe/products/" + p.id, "جزئیات و افزودن"),
          }),
        )
        .join("")}</div></div>`,
    { image: "cafe.jpg", symbol: "coffee" },
  );
}
function academy(sub, id) {
  if (sub === "mine") {
    if (id) {
      const e = state.enrollments[id];
      const course = LEARNING.find((c) => c.id === id);
      if (!e || !course) return unknown();
      return page(
        course.title,
        "ثبت‌نام آزمایشی تأیید شده است.",
        `<div class="split">${panel("رسید دوره", `<p class="coupon-code">${e.receipt}</p><p>سانس · ${e.slot}</p>`)}
        ${panel(
          "جلسات و گواهی",
          `<ol class="timeline">${[1, 2, 3].map((n) => `<li class="${e.attendance.includes(n) ? "done" : ""}">جلسهٔ ${fa(n)} · ${e.attendance.includes(n) ? "حضور ثبت شد" : "در انتظار ثبت حضور مربی"}</li>`).join("")}</ol>
          ${e.attendance.length === 3 ? b("certificate", "دریافت گواهی آزمایشی", "btn primary", "trophy", id) : notice("گواهی پس از تأیید حضور در هر سه جلسه آماده می‌شود.")}`,
        )}</div>`,
        { back: "academy/mine", parent: "دوره‌های من", symbol: "school" },
      );
    }
    return page(
      "دوره‌های من",
      "سانس‌ها، رسید و حضور در دوره‌ها.",
      list(
        Object.values(state.enrollments).map((e) =>
          listing(
            "school",
            LEARNING.find((c) => c.id === e.id).title,
            e.slot,
            tag("ثبت‌نام قطعی آزمایشی"),
            "academy/mine/" + e.id,
          ),
        ),
        "هنوز در دوره‌ای ثبت‌نام نکرده‌اید.",
      ) + a("academy", "دیدن دوره‌ها", "btn primary"),
      { back: "academy", parent: "آکادمی مهارت", symbol: "school" },
    );
  }
  if (sub === "checkout" || sub === "scholarships") {
    const course = LEARNING.find((c) => c.id === id);
    if (sub === "scholarships" && !id)
      return page(
        "بورسیهٔ آموزش",
        "در صورت نیاز، برای یک دوره درخواست کمک‌هزینهٔ آزمایشی ثبت کنید.",
        list(
          LEARNING.map((c) =>
            listing(
              "school",
              c.title,
              "ظرفیت پیشنهادی دوره · " + fa(c.capacity),
              tag("شرایط و درخواست"),
              "academy/scholarships/" + c.id,
            ),
          ),
          "",
        ),
        { back: "academy", parent: "آکادمی مهارت", symbol: "school" },
      );
    if (!course) return unknown();
    const scholarship = sub === "scholarships";
    const blocked =
      state.profile.role === "guest"
        ? a("auth", "ورود برای ثبت‌نام", "btn primary")
        : consentNeeded(state, course.minAge) && !state.profile.consent
          ? notice("ثبت‌نام به رضایت سرپرست نیاز دارد.", "warning") +
            a("profile", "تنظیم رضایت در پروفایل")
          : "";
    const content = scholarship
      ? state.scholarships[course.id]
        ? notice("درخواست ثبت شد · " + state.scholarships[course.id].id)
        : form(
            "scholarship",
            course.id,
            textarea(
              "text",
              "دلیل درخواست و زمان مناسب",
              "",
              "بدون درج مدارک و اطلاعات حساس",
            ),
            "ثبت درخواست نمونه",
          )
      : state.enrollments[course.id]
        ? a("academy/mine/" + course.id, "مشاهدهٔ رسید و جلسات", "btn primary")
        : form(
            "enroll",
            course.id,
            select(
              "slot",
              "انتخاب سانس",
              course.slots.map((x) => [x, x]),
            ),
            "تأیید ثبت‌نام آزمایشی",
          );
    return page(
      scholarship ? "درخواست بورسیه" : "تکمیل ثبت‌نام",
      course.title,
      panel("مشخصات ثبت‌نام", blocked || content),
      { back: "academy/" + course.id, parent: "جزئیات دوره", symbol: "school" },
    );
  }
  if (sub) {
    const c = LEARNING.find((course) => course.id === sub);
    if (!c) return unknown();
    return page(
      c.title,
      "آموزش حضوری در پاتوق پیشنهادی هم‌دیار.",
      `<div class="split">
      ${panel("مشخصات دوره", `<p>مربی نمونه · ${c.teacher}</p><p>گروه سنی · از ${fa(c.minAge)} سال</p><p>ظرفیت · ${fa(c.capacity)} نفر</p><p>سانس‌ها · ${c.slots.join("، ")}</p>`)}
      ${panel(
        "ثبت‌نام",
        `${a(state.enrollments[c.id] ? "academy/mine/" + c.id : "academy/checkout/" + c.id, state.enrollments[c.id] ? "دیدن ثبت‌نام من" : "انتخاب سانس و ثبت‌نام", "btn primary", "school")}
      ${a("academy/scholarships/" + c.id, "درخواست بورسیه")}`,
      )}</div>`,
      {
        image: c.img,
        back: "academy",
        parent: "آکادمی مهارت",
        symbol: "school",
      },
    );
  }
  return page(
    "آکادمی مهارت",
    "مهارت‌های دیجیتال، هنری و عملی را با مربی و هم‌محله‌ای‌ها تمرین کنید.",
    `<div class="row">${a("academy/mine", "دوره‌های من", "btn primary", "school")}${a("academy/scholarships", "بورسیهٔ آموزش", "btn", "gift")}</div>
    <div class="after-home"><div class="grid">${LEARNING.map((c) =>
      card(c.title, c.teacher + " · " + fa(c.capacity) + " نفر", {
        image: c.img,
        buttons: a("academy/" + c.id, "جزئیات دوره"),
      }),
    ).join("")}</div></div>`,
    { image: "skills.jpg", symbol: "school" },
  );
}
function community(tab, sub) {
  if (tab === "market")
    return page(
      "بازارچهٔ محله",
      "محصولات دست‌ساز، فرهنگی و سفارش‌های آزمایشی پاتوق.",
      `<div class="world-market-entry">${card("ویترین جهان زیرو", "کتاب تصویری، فیگور و برچسب‌های شخصیت‌ها", { image: "zero-collectibles.webp", buttons: a("zero/store", "باز کردن ویترین زیرو", "btn primary", "gift") })}</div>
      <div class="grid">${MARKET.map((x) => card(x.title, "محصول نمونهٔ پاتوق", { image: x.img, buttons: a("cafe/products/" + x.id, "دیدن محصول") })).join("")}</div>`,
      { image: "skills.jpg", symbol: "cart" },
    );
  if (tab === "events") {
    if (sub) {
      const e = CALENDAR.find((item) => item.id === sub);
      if (!e) return unknown();
      const ticket = state.bookings[e.id];
      return page(
        e.title,
        e.description,
        panel(
          "جزئیات برنامه",
          `<p>زمان پیشنهادی · ${e.when}</p><p>مکان نمونه · ${e.where}</p><p>ظرفیت نمونه · ${fa(e.capacity)} نفر</p>
        ${ticket ? notice("رزرو شد · " + ticket.receipt) : state.profile.role === "guest" ? a("auth", "ورود برای رزرو", "btn primary") : b("book", "رزرو آزمایشی", "btn primary", "calendar", e.id)}`,
        ),
        {
          back: "events",
          parent: "رویدادها",
          image: "workshop.jpg",
          symbol: "calendar",
        },
      );
    }
    return page(
      "رویدادهای محله",
      "دورهمی‌ها و کارگاه‌های پیشنهادی بوستان و پاتوق هم‌دیار.",
      `<div class="grid">${CALENDAR.map((e) => card(e.title, e.when + " · " + e.where, { symbol: "calendar", tone: "coral", buttons: a("events/" + e.id, state.bookings[e.id] ? "مشاهدهٔ رزرو" : "جزئیات و رزرو") })).join("")}</div>`,
      { image: "workshop.jpg", symbol: "calendar" },
    );
  }
  if (tab === "teams") {
    if (sub) {
      const t = TEAMS.find((team) => team.id === sub);
      if (!t) return unknown();
      const joined = state.teams.includes(sub);
      return page(
        t.title,
        t.description,
        panel(
          "مشارکت در تیم",
          notice(
            "فعالیت‌های حضوری در روز، به‌صورت گروهی و با همراهی مربی برگزار می‌شوند.",
          ) +
            (state.profile.role === "guest"
              ? a("auth", "ورود برای عضویت", "btn primary")
              : b(
                  joined ? "leave-team" : "join-team",
                  joined ? "خروج از تیم" : "عضویت در تیم",
                  "btn primary",
                  "team",
                  t.id,
                )) +
            a("missions", "دیدن مأموریت‌های گروهی"),
        ),
        { back: "teams", parent: "تیم‌های محله", symbol: "team" },
      );
    }
    return page(
      "تیم‌های محله",
      "برای یک هدف مشترک به همسایه‌ها بپیوندید.",
      `<div class="grid">${TEAMS.map((t) => card(t.title, t.description, { symbol: "team", tone: "violet", meta: state.teams.includes(t.id) ? tag("عضو تیم", "status-current") : "", buttons: a("teams/" + t.id, "دیدن تیم") })).join("")}</div>`,
      { symbol: "team" },
    );
  }
  if (tab === "impact") {
    if (sub) {
      const x = PROJECTS.find((item) => item.id === sub);
      if (!x) return unknown();
      return page(
        x.title,
        x.result,
        `<div class="split">${panel("قبل و بعد در سناریوی نمونه", `<div class="gallery"><div>${img(x.before, "نمای قبل")}<p class="small">قبل</p></div><div>${img(x.after, "نمای پیشنهادی بعد")}<p class="small">بعد · تصویرسازی</p></div></div>${tag(x.status)}`)}
        ${panel(
          "نظر شما",
          `<p>${x.area}</p>${state.projectOpinions[x.id] ? notice("آخرین نظر · " + clean(state.projectOpinions[x.id].text)) : ""}
        ${state.profile.role === "guest" ? a("auth", "ورود برای مشارکت") : b("opinion", "ثبت نظر", "btn primary", "voice", x.id)}${b("share", "اشتراک نشانی", "btn", "next", url("impact/" + x.id))}`,
        )}</div>`,
        { back: "impact", parent: "تغییرات محله", symbol: "leaf" },
      );
    }
    return page(
      "تغییرات محله",
      "وضعیت طرح‌ها و مقایسهٔ تصویری قبل و بعد را در سناریوی پایلوت دنبال کنید.",
      `<div class="grid">${PROJECTS.map((x) => card(x.title, x.result, { image: x.after, meta: tag(x.status), buttons: a("impact/" + x.id, "دیدن قبل و بعد") })).join("")}</div>`,
      { image: "alley-after.jpg", symbol: "leaf" },
    );
  }
  return unknown();
}
function mapPage() {
  const points = [
    ["cafe", "کافه", 24, 46, "coffee"],
    ["academy", "آکادمی", 70, 29, "school"],
    ["voice", "میز خدمت", 49, 67, "voice"],
    ["missions/waste-drop", "تحویل پسماند", 82, 68, "recycle"],
  ];
  return page(
    "نقشهٔ محله",
    "نمای شماتیک خدمات پایلوت منطقهٔ ۱۸ و پاتوق پیشنهادی در بوستان قائم.",
    `
    <div class="split"><div class="map-layout">${img("neighborhood.webp", "نمای شماتیک بوستان و پاتوق")}${points.map(([route, label, x, y, symbol]) => `<button class="btn" style="--x:${x}%;--y:${y}%" data-action="navigate" data-id="${route}">${icon(symbol)}${label}</button>`).join("")}</div>
    ${panel(
      "مقصدهای پاتوق",
      list(
        points.map(([route, label, , , symbol]) =>
          listing(
            symbol,
            label,
            "بوستان قائم · جانمایی پیشنهادی",
            icon("next"),
            route,
          ),
        ),
        "",
      ),
    )}</div>`,
    { symbol: "map" },
  );
}
function league() {
  const alleys = ALLEYS.map((x) => ({
    ...x,
    points:
      x.points +
      (x.id === currentAlley().id ? approvedCount(state) * 20 : 0) +
      (state.votes[x.id] ? 1 : 0),
  })).sort((x, y) => y.points - x.points);
  return page(
    "لیگ کوچه‌ها",
    "هر کوچه هدف جمعی خودش را دنبال می‌کند. رسیدگی به خدمات پایه و ایمنی مستقل از این امتیازهاست.",
    `<div class="grid">${alleys
      .map((x) =>
        panel(
          x.name,
          `<p class="muted">${x.area} · ${x.goal.title}</p>${bar((x.points * 100) / x.goal.target, "پیشرفت هدف کوچه")}
      <p class="small">${fa(x.points)} از ${fa(x.goal.target)} امتیاز</p>${state.approvedAlley[x.id] ? notice("تعهد آزمایشی · " + clean(state.approvedAlley[x.id].note)) : ""}
      ${state.votes[x.id] ? tag("حمایت ثبت شد", "status-current") : b("vote", "حمایت از هدف کوچه", "btn", "leaf", x.id)}`,
        ),
      )
      .join("")}</div>`,
    { symbol: "trophy" },
  );
}

function profile(sub) {
  const p = state.profile;
  if (p.role === "guest")
    return page(
      "پروفایل",
      "برای ثبت و مشاهدهٔ سوابق، حساب آزمایشی خود را باز کنید.",
      a("auth", "ورود آزمایشی", "btn primary", "user"),
      { symbol: "user" },
    );
  if (sub === "achievements") {
    const badges = [
      ["flag", "اولین قدم", "یک مأموریت تأییدشده", approvedCount(state) >= 1],
      ["recycle", "دوست زمین", "سه کیلوگرم پسماند خشک", state.wasteKg >= 3],
      [
        "voice",
        "صدای کوچه",
        "پاسخ به نظرسنجی روشنایی",
        state.submissions["poll-light"]?.status === "approved",
      ],
      [
        "map",
        "چشم محله",
        "یک گزارش تأییدشده",
        state.reports.some((r) => r.step >= 1),
      ],
      ["team", "همراه تیم", "عضویت در یک تیم", state.teams.length > 0],
      ["trophy", "همیار محله", "۶۰۰ امتیاز تجربه", state.xp >= 600],
    ];
    return page(
      "نشان‌ها و مسیر رشد",
      "نشان‌ها با کارهای داوطلبانه و یادگیری باز می‌شوند.",
      `<div class="split">${progress()}
      ${panel(
        "سطح‌های هم‌دیار",
        list(
          LEVELS.map((l) =>
            listing(
              "star",
              l.name,
              fa(l.xp) + " امتیاز" + (l.note ? " · " + l.note : ""),
              l.name === level(state).name
                ? tag("سطح کنونی", "status-current")
                : "",
            ),
          ),
          "",
        ),
      )}</div>
      <div class="grid after-home">${badges.map(([symbol, title, detail, on]) => card(title, detail, { symbol, tone: on ? "sun" : "violet", meta: tag(on ? "باز شده" : "در مسیر", on ? "status-current" : "") })).join("")}</div>`,
      { back: "profile", parent: "پروفایل", symbol: "trophy" },
    );
  }
  if (sub === "settings") {
    return page(
      "تنظیمات پروفایل",
      "ترجیحات و اطلاعات آزمایشی در همین دستگاه ذخیره می‌شوند.",
      `<div class="split">${panel(
        "اطلاعات نمایشی",
        form(
          "profile",
          "",
          field("name", "نام نمایشی", { value: p.name, length: 42 }) +
            areaSelect() +
            field("age", "سن", {
              type: "number",
              min: 12,
              max: 110,
              value: p.age,
            }) +
            check(
              "consent",
              "رضایت آزمایشی سرپرست برای مسیر نوجوانان",
              p.consent,
            ) +
            check("large", "نمایش متن درشت‌تر", p.large),
          "ذخیرهٔ تغییرات",
        ),
      )}
        ${panel(
          "داده‌ها و حریم خصوصی",
          `<p>برای این نسخه از نام نمایشی استفاده کنید. اطلاعات واقعی نوجوان یا دادهٔ حساس وارد نکنید.</p>
          ${b("download-data", "دریافت سوابق آزمایشی", "btn", "book")}${b("clear-data", "پاک‌کردن داده‌های این دستگاه", "btn", "tool")}`,
        )}</div>`,
      { back: "profile", parent: "پروفایل", symbol: "user" },
    );
  }
  if (sub === "activity") {
    const sections = [
      [
        "missions/mine",
        "مأموریت‌ها",
        Object.keys(state.submissions).length,
        "flag",
      ],
      ["voice", "گزارش‌ها", state.reports.length, "pin"],
      [
        "academy/mine",
        "دوره‌ها",
        Object.keys(state.enrollments).length,
        "school",
      ],
      ["cafe/orders", "سفارش‌ها", state.orders.length, "cart"],
      ["rewards/wallet", "کوپن‌ها", state.coupons.length, "gift"],
    ];
    return page(
      "فعالیت‌های من",
      "مأموریت‌ها، گزارش‌ها، دوره‌ها، سفارش‌ها و مزایای ذخیره‌شده.",
      `${list(
        sections.map(([route, title, count, symbol]) =>
          listing(symbol, title, fa(count) + " مورد", icon("next"), route),
        ),
        "",
      )}
      <div class="after-home">${panel(
        "رزروهای رویداد",
        list(
          Object.entries(state.bookings).map(([id, e]) =>
            listing(
              "calendar",
              CALENDAR.find((x) => x.id === id).title,
              e.receipt,
              tag("رزرو آزمایشی"),
              "events/" + id,
            ),
          ),
          "هنوز رویدادی رزرو نشده است.",
        ),
      )}</div>`,
      { back: "profile", parent: "پروفایل", symbol: "book" },
    );
  }
  if (sub) return unknown();
  return page(
    clean(p.name),
    "پروفایل آزمایشی شما در " + clean(p.area),
    `
    ${stats([
      [fa(state.xp), "امتیاز"],
      [fa(state.coupons.length), "کوپن‌ها"],
      [fa(approvedCount(state)), "مأموریت تأییدشده"],
    ])}
    <div class="split">${panel(
      "پروفایل و مسیر من",
      list(
        [
          listing(
            "trophy",
            "نشان‌ها و پیشرفت",
            level(state).name,
            icon("next"),
            "profile/achievements",
          ),
          listing(
            "book",
            "فعالیت‌های من",
            "سوابق و رسیدها",
            icon("next"),
            "profile/activity",
          ),
          listing(
            "wallet",
            "کیف پول",
            "اعتبارها، کوپن‌ها و تراکنش‌ها",
            icon("next"),
            "rewards/wallet",
          ),
          listing(
            "user",
            "ویرایش پروفایل",
            "محله، سن، رضایت و اندازهٔ متن",
            icon("next"),
            "profile/settings",
          ),
        ],
        "",
      ),
    )}
    ${panel(
      "نمای نقش آزمایشی",
      `<p>نقش فعلی · <b>${ROLES[p.role]}</b></p>
      ${form("role", "", select("role", "آزمودن جریان یک نقش", Object.entries(ROLES), p.role), "تغییر نقش نمونه")}
      ${a(cityAccess() ? "dashboard/city" : "dashboard", cityAccess() ? "ورود به پنل شهرداری" : "داشبوردها", "btn", "chart")}${b("logout", "خروج از نمای عضویت", "btn", "user")}`,
    )}
    ${panel(
      "حالت تست",
      form(
        "test-mode",
        "",
        check("enabled", "فعال‌کردن حالت تست مأموریت", p.testMode) +
          select(
            "actor",
            "هویت نمونه برای پسند و نظر",
            Object.entries(demoActors),
            actor(state),
          ) +
          notice(
            "در حالت تست، در صفحهٔ مأموریت دکمهٔ انجام آزمایشی ظاهر می‌شود. نتیجهٔ تمرین به امتیازها و فید اضافه نمی‌شود.",
          ),
        "ذخیرهٔ حالت تست",
      ) + a("missions", "رفتن به مأموریت‌ها", "btn", "flag"),
    )}</div>${companionTip(state)}`,
    { symbol: "user" },
  );
}
function auth(sub) {
  if (sub === "code")
    return page(
      "کد ورود آزمایشی",
      "برای آزمودن تجربهٔ ورود، از کد ۱۲۳۴۵۶ استفاده کنید.",
      panel(
        "",
        form(
          "login",
          "",
          field("code", "کد شش رقمی", {
            length: 6,
            inputmode: "numeric",
            placeholder: "۱۲۳۴۵۶",
          }),
          "ورود به حساب آزمایشی",
        ),
      ),
      { back: "auth", parent: "عضویت", symbol: "user" },
    );
  return page(
    "عضویت هم‌دیار",
    "از حساب آزمایشی استفاده کنید یا پیش از عضویت، خدمات محله را ببینید.",
    panel(
      "ورود آزمایشی",
      notice("این نسخه پیامک یا ایمیل ارسال نمی‌کند.") +
        a("auth/code", "نمایش و ورود کد آزمایشی", "btn primary", "user") +
        a("", "بازگشت به خانه"),
    ),
    { symbol: "user" },
  );
}
const dashboards = [
  ["review", "بررسی مأموریت‌ها", "تأیید، اصلاح و یادداشت اولیه", "flag"],
  ["reports", "پیگیری شهری", "تغییر وضعیت گزارش و روند اقدام", "voice"],
  ["attendance", "پنل مربی", "حضور در کلاس و شرایط گواهی", "school"],
  ["pos", "میز خدمت پاتوق و کافه", "بررسی کوپن و رسید پسماند", "coffee"],
  ["city", "داشبورد شهرداری", "نقشهٔ مسائل، رضایت و صف اولویت", "chart"],
];

const citySections = [
  ["city", "نمای کلی", "شاخص و خروجی تجمیعی", "chart", "blue"],
  ["missions", "مأموریت‌ها", "ثبت، ویرایش و برداشتن از فهرست", "flag", ""],
  [
    "review",
    "تأیید فعالیت‌ها",
    "بررسی مراحل و نتیجهٔ مأموریت",
    "check",
    "violet",
  ],
  ["reports", "رسیدگی به گزارش", "پیگیری، رد و بازگشایی", "pin", "coral"],
  ["comments", "مدیریت نظرها", "پنهان‌سازی و بازگردانی نظر", "voice", "violet"],
  ["map", "نقشهٔ مسائل", "نمای شماتیک گزارش‌ها بر اساس محله", "map", "sun"],
  ["audit", "تاریخچهٔ تغییرات", "سوابق اقدامات پنل", "book", "blue"],
];
function cityNav() {
  return `<nav class="city-nav" aria-label="بخش‌های پنل شهرداری">${citySections
    .map(([id, title, text, symbol, tone]) =>
      quick(["dashboard/" + id, title, text, symbol, tone]),
    )
    .join("")}</nav>`;
}
function cityPage(sub, id) {
  const section = citySections.find(([key]) => key === sub);
  const opts = {
    back: "dashboard/city",
    parent: "پنل شهرداری",
    symbol: section[3],
  };
  if (!cityAccess())
    return page(
      "پنل شهرداری",
      "این بخش برای نقش شهرداری است.",
      a("profile", "انتخاب نقش در پروفایل", "btn primary", "user"),
      { symbol: "chart" },
    );
  if (sub === "missions" && id) {
    const entry =
      id === "new" ? null : missionCatalog(state).find((m) => m.id === id);
    if (!entry && id !== "new") return unknown();
    const fields =
      field("title", "عنوان مأموریت", { value: entry?.title, length: 95 }) +
      textarea(
        "goal",
        "شرح فعالیت",
        entry?.goal,
        "شهروند باید چه کاری انجام دهد؟",
      ) +
      field("cat", "دسته", {
        value: entry?.cat,
        length: 45,
        placeholder: "مثلاً محیط‌زیست",
      }) +
      field("min", "مدت به دقیقه", {
        type: "number",
        min: 1,
        max: 480,
        value: entry?.min ?? 15,
      }) +
      field("xp", "امتیاز پس از تأیید", {
        type: "number",
        min: 0,
        max: 500,
        value: entry?.xp ?? 30,
      }) +
      field("safety", "شرایط ایمنی", {
        value: entry?.safety,
        required: false,
      }) +
      field("ends", "مهلت پایان (اختیاری)", {
        type: "date",
        value: entry?.ends,
        required: false,
      });
    return page(
      entry ? "ویرایش مأموریت" : "ثبت مأموریت",
      entry
        ? missionTitle(entry)
        : "این مأموریت پس از ثبت در فهرست عمومی دیده می‌شود.",
      panel(
        "",
        form("city-mission", entry?.id || "", fields, "ذخیرهٔ مأموریت"),
      ),
      { ...opts, back: "dashboard/missions", parent: "مدیریت مأموریت‌ها" },
    );
  }
  if (sub === "missions") {
    const rows = missionCatalog(state).map(
      (m) => `<article class="list-item city-row">
      ${tile("flag")}<div><b>${missionTitle(m)}</b><small>${clean(m.cat)} · ${pointsLabel(m.xp)}</small></div>
      <div class="row end">${m.archived ? tag("حذف‌شده", "status-rejected") : campaignClosed(m) ? tag("پایان‌یافته") : tag("فعال", "status-current")}
        ${a("dashboard/missions/" + m.id, "ویرایش", "btn", "tool")}
        ${b(m.archived ? "restore-mission" : "archive-mission", m.archived ? "بازگردانی" : "حذف از فهرست", "btn", m.archived ? "check" : "trash", m.id)}
      </div></article>`,
    );
    return page(
      "مدیریت مأموریت‌ها",
      "مأموریت‌های عمومی را ثبت و ویرایش کنید. سوابق مشارکت پس از حذف از فهرست باقی می‌مانند.",
      cityNav() +
        a("dashboard/missions/new", "ثبت مأموریت جدید", "btn primary", "plus") +
        `<div class="after-home">${list(rows, "هنوز مأموریتی ثبت نشده است.")}</div>`,
      opts,
    );
  }
  if (sub === "comments") {
    const keys = [
      ...communityPosts(state).map((p) => [
        "post:" + p.id,
        p.title,
        "feed/" + p.id,
      ]),
      ...allReports(state).map((r) => [
        "report:" + r.id,
        r.text,
        "voice/" + r.id,
      ]),
    ];
    const items = keys.flatMap(([key, title, route]) =>
      discussion(state, key).comments.map(
        (entry) =>
          `<article class="list-item city-row">${tile("voice", "violet")}<div><b>${clean(entry.author)}</b><p>${clean(entry.text)}</p><small>${a(route, clean(title), "comment-source")}</small></div>
        <div class="row end">${entry.hidden ? tag("پنهان‌شده", "status-rejected") : ""}
        ${b("moderate-comment", entry.hidden ? "بازگردانی نظر" : "پنهان‌کردن نظر", "btn", entry.hidden ? "check" : "trash", key + "|" + entry.id)}</div></article>`,
      ),
    );
    return page(
      "مدیریت نظرها",
      "نظرهای پست‌ها و گزارش‌ها را در یک جا بررسی کنید.",
      cityNav() + list(items, "هنوز نظری ثبت نشده است."),
      opts,
    );
  }
  if (sub === "map") {
    const areas = AREAS.map((area) => {
      const reports = allReports(state).filter((entry) => entry.area === area);
      return panel(
        clean(area),
        `<div class="row">${tag(fa(reports.length) + " گزارش")}</div>${list(
          reports.map((r) =>
            listing(
              "pin",
              clean(r.text),
              reportStatus(r),
              icon("next"),
              "voice/" + r.id,
            ),
          ),
          "گزارشی در این محدوده نیست.",
        )}`,
      );
    });
    return page(
      "نقشهٔ مسائل محله",
      "نمای شماتیک منطقهٔ ۱۸ بر اساس محدودهٔ گزارش‌ها.",
      cityNav() +
        `<div class="municipal-map">${img("neighborhood.webp", "نمای شماتیک منطقهٔ ۱۸")}<div class="grid">${areas.join("")}</div></div>`,
      opts,
    );
  }
  return page(
    "تاریخچهٔ تغییرات شهرداری",
    "اقدام‌های ثبت‌شده در پنل آزمایشی.",
    cityNav() +
      list(
        state.audit.map((entry) =>
          listing(
            "book",
            clean(entry.action),
            dateLabel(entry.at) + " · " + clean(entry.target),
            tag(ROLES[entry.role]),
          ),
        ),
        "هنوز تغییری در پنل ثبت نشده است.",
      ),
    opts,
  );
}
function dashboard(sub, id) {
  if (["missions", "comments", "map", "audit"].includes(sub))
    return cityPage(sub, id);
  if (!sub)
    return page(
      "داشبوردها",
      "پنل‌های پاتوق، مربی، مدیر و شهرداری را با نقش آزمایشی مربوط بررسی کنید.",
      `<div class="grid">${dashboards.map(([id, title, desc, symbol]) => card(title, desc, { symbol, meta: tag(rolesAllowed[id].includes(state.profile.role) ? "دسترسی نقش فعلی" : "نقش ویژه"), buttons: a("dashboard/" + id, "باز کردن پنل") })).join("")}</div>`,
      { symbol: "chart" },
    );
  const d = dashboards.find((x) => x[0] === sub);
  if (!d) return unknown();
  const [, title, desc, symbol] = d;
  const opts = { back: "dashboard", parent: "داشبوردها", symbol };
  if (!rolesAllowed[sub].includes(state.profile.role))
    return page(
      title,
      desc,
      panel(
        "دسترسی ویژه",
        `<p>نقش‌های آزمایشی دارای دسترسی · ${rolesAllowed[sub].map((x) => ROLES[x]).join("، ")}</p>${a(state.profile.role === "guest" ? "auth" : "profile", "انتخاب نقش آزمایشی", "btn primary", "user")}`,
      ),
      opts,
    );
  if (sub === "review") {
    const queue = Object.values(state.submissions).filter(
      (e) => e.status === "pending",
    );
    return page(
      title,
      desc,
      (cityAccess() ? cityNav() : "") +
        list(
          queue.map((entry) => {
            const m = missionCatalog(state).find((x) => x.id === entry.mission);
            return listing(
              "flag",
              missionTitle(m),
              clean(entry.proof) +
                " · " +
                fa(entry.steps?.length ?? 3) +
                " از ۳ مرحله",
              b("review", "بررسی", "btn", "check", m.id),
            );
          }),
          "مأموریتی در صف بررسی نیست.",
        ),
      opts,
    );
  }
  if (sub === "reports")
    return page(
      title,
      desc,
      (cityAccess() ? cityNav() : "") +
        list(
          (cityAccess() ? allReports(state) : state.reports).map((r) =>
            listing(
              "pin",
              clean(r.text),
              reportStatus(r) + " · " + r.id,
              cityAccess()
                ? a("voice/" + r.id, "بررسی گزارش", "btn", "next")
                : r.step >= 4
                  ? tag("پایان رسیدگی", "status-current")
                  : b("advance-report", "ثبت گام بعد", "btn", "check", r.id),
            ),
          ),
          "هنوز گزارش تازه‌ای ثبت نشده است.",
        ),
      opts,
    );
  if (sub === "attendance")
    return page(
      title,
      desc,
      list(
        Object.values(state.enrollments).map((e) =>
          listing(
            "school",
            LEARNING.find((c) => c.id === e.id).title,
            fa(e.attendance.length) + " جلسه از ۳ · " + e.slot,
            b("attendance", "ثبت حضور", "btn", "check", e.id),
          ),
        ),
        "هنوز ثبت‌نام آزمایشی در صف وجود ندارد.",
      ),
      opts,
    );
  if (sub === "pos")
    return page(
      title,
      desc,
      `<div class="split">
    ${panel("مصرف کوپن", form("use-coupon", "", field("code", "کد کوپن", { placeholder: "HD-…" }) + notice("کد را از کوپن آزمایشی در کیف پول وارد کنید. کوپن فقط یک‌بار مصرف می‌شود."), "بررسی و مصرف کوپن"))}
    ${panel(
      "رسید پسماند خشک",
      form(
        "waste",
        "",
        select(
          "kind",
          "نوع پسماند",
          WASTE_RATES.map((x) => [x.id, x.name]),
        ) +
          field("weight", "وزن به کیلوگرم", {
            type: "number",
            min: 0.01,
            max: 50,
            step: "0.01",
          }) +
          notice(
            "برای میز خدمت حضوری، رسید و اعتبار بر اساس وزن در سوابق ثبت می‌شود.",
          ),
        "ثبت تحویل و دریافت رسید",
      ),
    )}</div>`,
      opts,
    );
  const visible = allReports(state).filter(
    (r) => !dashboardArea || r.area === dashboardArea,
  );
  const queue = REQUESTS.filter(
    (r) =>
      !dashboardArea ||
      ALLEYS.find((a) => a.id === r.alley)?.area === dashboardArea,
  );
  return page(
    title,
    "شاخص‌های تجمیعی و فرضی پایلوت برای بررسی مسیر تصمیم‌گیری.",
    `${cityNav()}<div class="row between"><label class="row">محله <select class="btn" id="city-area"><option value="">همهٔ محله‌ها</option>
      ${AREAS.map((x) => `<option value="${x}" ${x === dashboardArea ? "selected" : ""}>${x}</option>`).join("")}</select></label>${b("csv", "دریافت گزارش CSV", "btn primary", "book")}</div>
    <div class="after-home">${stats([
      [fa(visible.length), "گزارش موجود"],
      [
        fa(visible.filter((r) => r.step === 4 && !r.rejection).length),
        "پایان رسیدگی",
      ],
      [fa(65) + "٪", "رضایت هدف سناریو"],
    ])}</div>
    <div class="split">${panel(
      "روند فرضی رضایت",
      `<div class="chart" role="img" aria-label="روند فرضی رضایت از ۵۵ تا ۶۵ درصد">
      ${SATISFACTION.map((n, i) => `<span style="--h:${(n - 42) * 4}%" title="${MONTHS[i]} · ${fa(n)}٪">${fa(n)}</span>`).join("")}</div>
      ${notice("پایش نمایشی و هدف پایان سال · مقادیر فرضی طرح پایلوت")}&nbsp;${a("dashboard/map", "نقشهٔ مسائل", "btn", "map")}`,
    )}
      ${panel(
        "صف اولویت و تعهد اجرای محله",
        list(
          queue.map((r) => {
            const alley = ALLEYS.find((a) => a.id === r.alley);
            return listing(
              "flag",
              r.title,
              alley.name + " · " + fa(r.votes) + " امتیاز",
              b(
                "alley",
                state.approvedAlley[r.alley] ? "ویرایش تعهد" : "ثبت تعهد",
                "btn",
                "check",
                r.alley,
              ),
            );
          }),
          "در این محله موردی در صف نیست.",
        ),
      )}</div>`,
    opts,
  );
}
function support(sub) {
  if (sub === "privacy")
    return page(
      "حریم خصوصی",
      "این نسخه برای آزمودن تجربهٔ هم‌دیار طراحی شده است.",
      panel(
        "داده‌های این دستگاه",
        `<p>نام نمایشی، محله، سوابق مأموریت و سایر انتخاب‌ها در حافظهٔ مرورگر یا برنامهٔ اندروید ذخیره می‌شوند. پاک‌کردن دادهٔ اپ یا مرورگر این سوابق را حذف می‌کند.</p>
      <p>برای گزارش و درخواست پشتیبانی از دادهٔ نمونه استفاده کنید.</p>${a("profile/settings", "تنظیمات داده")}`,
      ),
      { back: "help", parent: "راهنما", symbol: "shield" },
    );
  if (sub === "about")
    return page(
      "دربارهٔ هم‌دیار",
      "مرکز محله‌ای پیشنهادی در منطقهٔ ۱۸ تهران با پاتوق حضوری و بازوی دیجیتال.",
      panel(
        "مشارکت، آموزش و پیگیری",
        `<p>طرح پایلوت بوستان قائم، یادگیری نوجوانان، دورهمی خانواده‌ها و ثبت نیازهای محله را در یک مسیر جمع می‌کند.</p>
      ${b("teaser", "تماشای تیزر", "btn primary", "play")}${a("impact", "دیدن سناریوهای تغییر")}`,
      ),
      { back: "help", parent: "راهنما", symbol: "home" },
    );
  if (sub === "rules")
    return page(
      "قواعد مشارکت",
      "هم‌دیار در کنار پاتوق و تجربهٔ حضوری شکل می‌گیرد.",
      panel(
        "مشارکت داوطلبانه و ایمن",
        `<ul><li>مأموریت حضوری نوجوان با رضایت سرپرست، در روز و با حضور مربی است.</li><li>گزارش‌ها برای تأیید و ارجاع باید مستقل بررسی شوند.</li><li>امتیاز برای مسیر پیشرفت و کوپن برای استفاده از مزیت‌هاست.</li></ul>${a("missions", "دیدن شرایط مأموریت‌ها")}`,
      ),
      { back: "help", parent: "راهنما", symbol: "shield" },
    );
  if (sub === "accessibility")
    return page(
      "دسترس‌پذیری",
      "برای متن درشت‌تر این تنظیم را در همین دستگاه فعال کنید.",
      panel(
        "",
        form(
          "text-size",
          "",
          check("large", "نمایش متن درشت‌تر", state.profile.large),
          "ذخیرهٔ ترجیح",
        ),
      ),
      { back: "help", parent: "راهنما", symbol: "user" },
    );
  if (sub === "tickets")
    return page(
      "پیگیری درخواست‌ها",
      "درخواست‌های ثبت‌شدهٔ آزمایشی در این دستگاه.",
      list(
        state.tickets.map((t) =>
          listing("voice", clean(t.text), t.id, tag(dateLabel(t.at))),
        ),
        "هنوز درخواستی ثبت نشده است.",
      ) + a("help", "بازگشت به راهنما"),
      { back: "help", parent: "راهنما", symbol: "voice" },
    );
  return page(
    "راهنما و پشتیبانی",
    "پرسش یا درخواست خود را ثبت کنید و در همین نسخه پیگیری کنید.",
    `<div class="split">${panel(
      "راهنمای هم‌دیار",
      list(
        [
          listing("home", "دربارهٔ طرح", "پاتوق و مشارکت", "", "help/about"),
          listing(
            "shield",
            "قواعد مشارکت",
            "نوجوانان، ایمنی و امتیاز",
            "",
            "help/rules",
          ),
          listing(
            "shield",
            "حریم خصوصی",
            "داده‌های آزمایشی و دستگاه",
            "",
            "help/privacy",
          ),
          listing(
            "user",
            "دسترس‌پذیری",
            "تنظیم اندازهٔ متن",
            "",
            "help/accessibility",
          ),
        ],
        "",
      ),
    )}${panel("ثبت درخواست آزمایشی", form("ticket", "", textarea("text", "متن درخواست"), "ثبت درخواست") + a("help/tickets", "سوابق درخواست‌ها"))}</div>`,
    { symbol: "voice" },
  );
}
function servicesPage() {
  return page(
    "همهٔ خدمات",
    "از تجربه‌های محله تا خدمات پاتوق و پنل‌های نقش‌محور.",
    `<div class="grid">${[
      ...tabs.map(({ route, label, icon: symbol }) => [
        route,
        label,
        "",
        symbol,
        "",
      ]),
      ...services.slice(0, 3),
      ...other,
      ["rewards/wheel", "گردونهٔ فرهنگی", "چرخش روزانه", "sparkle", "sun"],
      ["voice/new", "ثبت حادثه", "عکس، ویس، ویدیو و موقعیت", "pin", "coral"],
      ...(cityAccess()
        ? citySections.map(([id, title, text, symbol, tone]) => [
            "dashboard/" + id,
            title,
            text,
            symbol,
            tone,
          ])
        : []),
    ]
      .map(quick)
      .join("")}</div>`,
    { symbol: "grid" },
  );
}

function zeroCard(chapter, index, progress) {
  const played = progress[chapter.id];
  const unlocked = zeroUnlocked(progress, index);
  return `<article class="zero-chapter ${chapter.tone} ${unlocked ? "" : "locked"}">
    <div class="zero-chapter-art">${img(chapter.image)}
      <span class="chapter-index">${fa(index + 1)}</span>
      <span class="chapter-state">${icon(played ? "check" : unlocked ? "flag" : "lock")}${played ? "تمام شد" : unlocked ? "آمادهٔ بازی" : "قفل است"}</span>
    </div>
    <div class="zero-chapter-body"><div><span class="chapter-place">${icon("pin")}${chapter.place}</span><h2>${chapter.title}</h2></div>
      ${starRow(played?.best || 0)}
      ${unlocked ? a("zero/" + chapter.id, played ? "دوباره بازی کن" : "بازی فصل", "btn game-gold", "play") : '<span class="chapter-lock">با پایان فصل قبل باز می‌شود</span>'}
    </div></article>`;
}
function zeroPage(id) {
  const progress = zeroProgress(state);
  const breadcrumb = `<div class="breadcrumb">${a("", "خانه", "")}${icon("next")}${id ? a("zero", "سرزمین زیرو", "") : "<span>سرزمین زیرو</span>"}</div>`;
  if (!id) {
    const completed = ZERO_CHAPTERS.filter(
      (chapter) => progress[chapter.id],
    ).length;
    return `<div class="page game-page">${breadcrumb}
      <section class="zero-cover">
        ${img("zero-team.webp", "گروه زیرو، سه نوجوان و ربات همراه")}
        <div class="zero-cover-copy"><span class="game-chapter-label">${icon("map")} نقشهٔ محله</span>
          <h1>سرزمین زیرو</h1><p>سه گوشهٔ محله را با گروه زیرو کشف کن. در هر فصل انتخاب کن و ستاره بگیر.</p>
          <div class="zero-hud"><span>${icon("star")} <b>${fa(storyStars())} از ${fa(ZERO_CHAPTERS.length * 3)}</b> ستاره</span><span>${icon("flag")} <b>${fa(completed)} از ${fa(ZERO_CHAPTERS.length)}</b> فصل</span></div>
        </div>
      </section>
      <section aria-label="مسیر فصل‌های زیرو" class="zero-map">${ZERO_CHAPTERS.map((chapter, index) => zeroCard(chapter, index, progress)).join("")}</section>
      ${worldPortals(state)}
    </div>`;
  }
  const index = ZERO_CHAPTERS.findIndex((chapter) => chapter.id === id);
  const chapter = ZERO_CHAPTERS[index];
  if (!chapter) return unknown();
  if (!zeroUnlocked(progress, index)) {
    return page(
      chapter.title,
      "این فصل پس از پایان فصل قبلی باز می‌شود.",
      a("zero", "بازگشت به نقشهٔ زیرو", "btn primary", "map"),
      { back: "zero", parent: "سرزمین زیرو", symbol: "lock" },
    );
  }
  const record = progress[id];
  const result = chapter.choices.find((choice) => choice.id === record?.choice);
  const next = ZERO_CHAPTERS[index + 1];
  return `<div class="page game-page">${breadcrumb}
    <section class="zero-cover zero-scene ${chapter.tone}">
      ${img(chapter.image)}
      <div class="zero-cover-copy"><span class="game-chapter-label">${icon("pin")} ${chapter.place}</span>
      <h1>${chapter.title}</h1><div class="zero-hud"><span>فصل ${fa(index + 1)} از ${fa(ZERO_CHAPTERS.length)}</span>${starRow(record?.best || 0)}</div></div>
    </section>
    <div class="zero-play">
      <aside class="zero-guide">${companionPortrait(companionFor(state))}<div><h2>${companionFor(state).title}</h2><p>${chapter.text}</p></div></aside>
      <section class="zero-options"><h2>چه کار می‌کنی؟</h2><div class="stack">
        ${chapter.choices.map((choice) => `<button type="button" class="zero-choice" data-action="zero-choice" data-id="${chapter.id}:${choice.id}" aria-pressed="${choice.id === record?.choice}">${tile(choice.icon, "sun")}<span>${choice.label}</span>${choice.id === record?.choice ? icon("check") : ""}</button>`).join("")}</div>
        ${
          result
            ? `<div class="zero-result" role="status" tabindex="-1"><div class="row between"><b>نتیجهٔ انتخاب</b>${starRow(result.stars)}</div>
          <p>${result.result}</p><small>بهترین نتیجهٔ این فصل · ${fa(record.best)} ستاره</small></div>`
            : ""
        }
        <div class="row zero-next">${record && next ? a("zero/" + next.id, "فصل بعدی", "btn game-gold", "play") : ""}
          ${record ? a("missions/" + chapter.mission, "مأموریت مرتبط در محله", "btn", "flag") : ""}${a("zero", "نقشهٔ فصل‌ها", "btn", "map")}</div>
      </section>
    </div>
  </div>`;
}
function route() {
  const [tab, sub, id, extra] = current();
  if (extra) return unknown();
  switch (tab) {
    case "":
      return home();
    case "missions":
      return missionIndex(sub);
    case "voice":
      return voice(sub);
    case "feed":
      return feedPage(sub);
    case "rewards":
      return rewards(sub, id);
    case "cafe":
      return cafe(sub, id);
    case "academy":
      return academy(sub, id);
    case "profile":
      return profile(sub);
    case "auth":
      return auth(sub);
    case "dashboard":
      return dashboard(sub, id);
    case "events":
    case "teams":
    case "impact":
    case "market":
      return community(tab, sub);
    case "neighborhood":
      return mapPage();
    case "league":
      return league();
    case "help":
      return support(sub);
    case "services":
      return servicesPage();
    case "zero":
      return isWorldSection(sub) ? world.view(sub, id, state) : zeroPage(sub);
    default:
      return unknown();
  }
}
function render({ keepScroll = true } = {}) {
  state = read();
  world.sync(path());
  const tab = current()[0];
  const p = state.profile;
  const nav = (cls) =>
    tabs
      .map(
        ({ route, label, icon: symbol }) =>
          `<a class="${cls} ${tab === route ? "active" : ""}" ${tab === route ? 'aria-current="page"' : ""} href="${url(route)}">${icon(symbol)}<span>${label}</span></a>`,
      )
      .join("");
  $("#header").innerHTML = `<div class="header-inner container">
    <a class="brand" href="${url()}" aria-label="هم‌دیار، خانه"><img src="./assets/mark.svg" alt=""><span><b>هم‌دیار</b><small>محلهٔ ما، قصهٔ ما</small></span></a>
    <nav class="top-nav" aria-label="منوی اصلی">${nav("nav-link")}${b("teaser", "تماشای تیزر", "nav-link teaser", "play")}
      <button type="button" class="nav-link top-tutorial" data-action="tutorial" aria-haspopup="dialog" aria-label="راهنمای خانه">${icon("book")}<span>راهنما</span></button></nav>
    <div class="header-actions">${a(p.role === "guest" ? "auth" : "profile", ROLES[p.role] + (p.testMode && p.role !== "guest" ? " · تست" : ""), "role-indicator", "user")}
      <button type="button" class="icon-button mobile-tutorial" data-action="tutorial" aria-haspopup="dialog" aria-label="راهنمای خانه">${icon("book")}<span>راهنما</span></button>
      ${ib("search", "جست‌وجو", "search")}${ib("notifications", "اعلان‌ها", "bell", state.notices.length < SAMPLE_NOTICES.length ? '<span class="notification-dot"></span>' : "")}
      <a class="avatar" href="${url(p.role === "guest" ? "auth" : "profile")}" aria-label="${p.role === "guest" ? "ورود" : "پروفایل"}">${p.role === "guest" ? icon("user") : clean(p.name.trim()[0] || "ه")}</a></div>
  </div>`;
  $("#mobile-nav").innerHTML = nav("mobile-link");
  $("#footer").innerHTML =
    `<div class="row"><b>هم‌دیار</b><span>محلهٔ ما، قصهٔ ما</span></div><div class="row">${a("help/about", "دربارهٔ طرح", "btn quiet")}${a("help/privacy", "حریم خصوصی", "btn quiet")}${a("help", "راهنما", "btn quiet")}${b("area", "تغییر محله", "btn quiet", "pin")}
      <a class="btn quiet" href="https://t.me/share/url?url=${encodeURIComponent(new URL(url(), location.href).href)}&amp;text=${encodeURIComponent("هم‌دیار · محلهٔ ما، قصهٔ ما")}" target="_blank" rel="noopener noreferrer">اشتراک در تلگرام</a>
      <a class="btn quiet" href="https://wa.me/?text=${encodeURIComponent("هم‌دیار · محلهٔ ما، قصهٔ ما " + new URL(url(), location.href).href)}" target="_blank" rel="noopener noreferrer">اشتراک در واتس‌اپ</a></div>`;
  document.body.classList.toggle("large-text", p.large);
  stopVoiceRecording();
  mediaUrls.forEach((url) => URL.revokeObjectURL(url));
  mediaUrls = [];
  shell.innerHTML = route();
  void hydrateAttachments();
  document.title =
    (shell.querySelector("h1")?.textContent || "محلهٔ من") + " | هم‌دیار";
  if (!keepScroll) {
    window.scrollTo({ top: 0, behavior: "instant" });
    shell.focus({ preventScroll: true });
  }
}

function showDialog(title, body) {
  modal.innerHTML = `<div class="dialog-head"><h2 id="dialog-title">${title}</h2><button class="icon-button" type="button" data-action="close" aria-label="بستن">×</button></div><div class="dialog-body">${body}</div>`;
  if (!modal.open) modal.showModal();
  modal
    .querySelector(
      "input:not([type=radio]):not([type=checkbox]),textarea,select",
    )
    ?.focus();
}
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove("visible"), 3400);
}
function openTeaser() {
  if (modal.open) modal.close();
  if (!teaser.open) teaser.showModal();
  $("#video-error").hidden = true;
  video.play().catch((error) => {
    if (error.name !== "AbortError" && error.name !== "NotAllowedError")
      $("#video-error").hidden = false;
  });
}
function startMission(id) {
  const m = missionCatalog(state).find((x) => x.id === id);
  if (!m) return;
  const choiceForm = ["poll", "quiz"].includes(m.type);
  const questions = m.type === "poll" ? POLL.questions : QUIZ;
  const questionFields = questions
    .map(
      (x, i) =>
        `<fieldset><legend>${x.q}</legend><div class="option-grid">${x.opts.map((opt, j) => `<label><input type="radio" name="q${i}" value="${j}" required> ${opt}</label>`).join("")}</div></fieldset>`,
    )
    .join("");
  let proof = "";
  if (m.type === "confirm") {
    const candidates = allReports(state).filter(
      (r) => r.step < 2 && !state.reports.some((own) => own.id === r.id),
    );
    proof =
      select(
        "proof",
        "گزارش همسایه",
        candidates.map((r) => [r.id, r.text]),
      ) + textarea("note", "آنچه بررسی کردید");
  } else if (m.type === "invite") {
    proof =
      notice(
        "از اطلاعات تماس واقعی استفاده نکنید. تأیید عضویت خانوار در پنل پاتوق شبیه‌سازی می‌شود.",
      ) + field("text", "کد آزمایشی دعوت", { placeholder: "مثال HD-FAMILY" });
  } else {
    proof =
      notice(m.safety) +
      textarea("text", "شرح کار انجام‌شده", "", "جزئیات لازم برای بررسی مربی");
  }
  showDialog(
    missionTitle(m),
    form(
      choiceForm ? "questions" : "mission",
      id,
      choiceForm ? questionFields : proof,
      choiceForm ? "ثبت پاسخ‌ها" : "ارسال برای بررسی",
    ),
  );
}
function searchResults(query) {
  const normalized = (value) =>
    value
      .trim()
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/‌/g, " ")
      .replace(/\s+/g, " ");
  const needle = normalized(query);
  const hits = [
    ...tabs.map((x) => [x.route, x.label, "بخش اصلی", x.icon]),
    ...services,
    ...other,
    ...ARCADE_GAMES.map((game) => [
      "zero/games/" + game.id,
      game.title,
      game.description,
      game.icon,
    ]),
    ["services", "همهٔ بخش‌ها", "فهرست کامل بخش‌ها", "grid"],
    ["voice/new", "ثبت گزارش یا حادثه", "موقعیت، عکس، ویس و ویدیو", "pin"],
    ["rewards/wheel", "گردونهٔ فرهنگی", "چرخش روزانه", "sparkle"],
    ...(cityAccess()
      ? citySections.map(([id, label, desc, symbol]) => [
          "dashboard/" + id,
          label,
          "شهرداری · " + desc,
          symbol,
        ])
      : []),
    ...communityPosts(state).map((entry) => [
      "feed/" + entry.id,
      entry.title,
      "فید محله",
      "heart",
    ]),
    ...allReports(state).map((entry) => [
      "voice/" + entry.id,
      entry.text,
      entry.area,
      "pin",
    ]),
    ...activeMissions()
      .filter((m) => audience(state, m))
      .map((m) => [
        "missions/" + m.id,
        m.edited ? m.title : MISSION_ART[m.id]?.title || m.title,
        m.cat,
        "flag",
        m.title,
        m.goal,
      ]),
    ...LEARNING.map((c) => ["academy/" + c.id, c.title, "دوره", "school"]),
    ...CALENDAR.map((e) => ["events/" + e.id, e.title, "رویداد", "calendar"]),
    ...PRIZES.filter((r) => audience(state, r)).map((r) => [
      "rewards/" + r.id,
      r.title,
      r.fund,
      "gift",
    ]),
    ...PRODUCTS.map((p) => ["cafe/products/" + p.id, p.title, p.cat, "coffee"]),
    ...PROJECTS.map((p) => [
      "impact/" + p.id,
      p.title,
      p.result,
      "leaf",
      p.area,
    ]),
  ];
  return list(
    hits
      .filter((x) =>
        needle
          ? normalized(x.join(" ")).includes(needle)
          : !x[0].includes("/") ||
            x[0] === "voice/new" ||
            x[0] === "rewards/wheel",
      )
      .slice(0, 10)
      .map(([route, title, desc, symbol]) =>
        listing(symbol, clean(title), clean(desc), icon("next"), route),
      ),
    needle
      ? "موردی پیدا نشد."
      : "نام یک مأموریت، خدمت، دوره یا جایزه را بنویسید.",
  );
}
function download(filename, text, type) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}
function refresh(message = "") {
  if (modal.open) modal.close();
  render();
  if (message) toast(message);
}
function requireMember() {
  if (state.profile.role === "guest") {
    go("auth");
    return false;
  }
  return true;
}
function clipboard(value, message) {
  const clipboardApi = navigator.clipboard;
  if (clipboardApi)
    clipboardApi
      .writeText(value)
      .then(() => toast(message))
      .catch(() => clipboardDialog(value));
  else clipboardDialog(value);
}
function clipboardDialog(value) {
  showDialog(
    "برای کپی انتخاب کنید",
    `<input class="search-input" readonly value="${clean(value)}" aria-label="متن برای کپی">`,
  );
  modal.querySelector("input").select();
}

const tutorialItems = [
  [
    "home",
    "خانه و منوی اصلی",
    "خانه به صفحهٔ آغاز برمی‌گردد. «شروع ماجراجویی» نقشهٔ بازی زیرو را باز می‌کند. مأموریت‌ها، محله، جوایز و پروفایل در منوی اصلی هستند.",
    "",
  ],
  [
    "play",
    "تماشای تیزر",
    "تیزر پروژه را در یک پنجرهٔ داخل اپ باز می‌کند. نوار ویدیو برای پخش، توقف و جابه‌جایی در زمان است.",
  ],
  [
    "flag",
    "شروع مأموریت",
    "شرایط ایمنی را بخوانید، مرحله‌ها را به‌ترتیب علامت بزنید و نتیجه را برای تأیید بفرستید.",
    "missions",
  ],
  [
    "leaf",
    "پیوستن به کمپین",
    "کمپین پارک قائم تا مهلت درج‌شده فعال است. دکمهٔ پیوستن جزئیات و مراحل را باز می‌کند.",
    "missions/clean-ghaem",
  ],
  [
    "heart",
    "فید محله",
    "پست مأموریت‌ها و وضعیت گزارش‌ها را ببینید. زیر هرکدام می‌توانید پسند یا نظر ثبت کنید.",
    "feed",
  ],
  [
    "pin",
    "صدای محله",
    "حادثه را همراه موقعیت دستگاه یا نشانی دستی، عکس، ویس و ویدیو ثبت کنید.",
    "voice",
  ],
  [
    "school",
    "آکادمی، رویدادها و پاتوق",
    "آکادمی فهرست دوره‌ها را نشان می‌دهد. رویدادها برای رزرو دورهمی و نشان پاتوق روی تصویر برای دیدن نقشه است.",
    "academy",
  ],
  [
    "gift",
    "جوایز، گردونه و مسیر پیشرفت",
    "جوایز، کوپن و گردونه را باز می‌کند. کارت پیشرفت و دکمهٔ نشان‌ها، امتیاز و سابقهٔ مأموریت را نشان می‌دهند.",
    "rewards",
  ],
  [
    "search",
    "جست‌وجو، اعلان‌ها و همهٔ خدمات",
    "با ذره‌بین از هر صفحه مقصد را پیدا کنید. زنگوله اعلان‌ها را باز می‌کند و همهٔ خدمات فهرست کامل بخش‌هاست.",
    "services",
  ],
  [
    "user",
    "نقش فعلی و پروفایل",
    "برچسب بالای صفحه نقش فعلی را نشان می‌دهد. برای تغییر نقش، روشن‌کردن حالت تست و تنظیمات به پروفایل بروید.",
    "profile",
  ],
  [
    "trophy",
    "هدف کوچه",
    "کارت هدف جمعی نشان می‌دهد کوچه چقدر به هدفش نزدیک شده است. از همان کارت لیگ کوچه‌ها را باز کنید.",
    "league",
  ],
];
function showTutorial(step = 0) {
  tutorialStep = Math.min(tutorialItems.length - 1, Math.max(0, step));
  const [symbol, title, description, route] = tutorialItems[tutorialStep];
  showDialog(
    "راهنمای خانه",
    `<section class="tutorial-step zero-tutorial"><span class="tag">گام ${fa(tutorialStep + 1)} از ${fa(tutorialItems.length)}</span>
    <div class="tutorial-guide-line">${tile(symbol, "violet")}<h3>${title}</h3>${companionPortrait(companionFor(state))}</div><p>${description}</p>
    ${bar((100 * (tutorialStep + 1)) / tutorialItems.length, "پیشرفت راهنما")}</section>
    <div class="row between">${tutorialStep ? b("tutorial-prev", "قبلی") : ""}${route !== undefined ? a(route, "باز کردن بخش", "btn quiet") : ""}
    ${tutorialStep === tutorialItems.length - 1 ? b("close", "پایان راهنما", "btn primary") : b("tutorial-next", "بعدی", "btn primary")}</div>`,
  );
  modal
    .querySelector('[data-action="tutorial-next"],[data-action="close"].btn')
    ?.focus();
}
const reportForm = () => shell.querySelector('[data-form="report"]');
function stopVoiceRecording() {
  if (recording?.recorder.state === "recording") recording.recorder.stop();
}
async function toggleVoiceRecording() {
  const form = reportForm();
  const button = form?.querySelector('[data-action="record-voice"]');
  const status = form?.querySelector("#record-status");
  if (!button || !status) return;
  if (recording) {
    stopVoiceRecording();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder)
    throw new Error(
      "ضبط در این دستگاه در دسترس نیست. فایل صوتی را انتخاب کنید.",
    );
  button.disabled = true;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    throw new Error(
      "دسترسی میکروفون داده نشد. می‌توانید فایل صوتی انتخاب کنید.",
    );
  } finally {
    button.disabled = false;
  }
  if (!form.isConnected) {
    stream.getTracks().forEach((track) => track.stop());
    return;
  }
  let recorder;
  try {
    recorder = new MediaRecorder(stream);
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    throw error;
  }
  const chunks = [];
  recorder.ondataavailable = ({ data }) => {
    if (data.size) chunks.push(data);
  };
  let stopped = false;
  const finish = () => {
    if (stopped) return;
    stopped = true;
    clearTimeout(recording?.timer);
    stream.getTracks().forEach((track) => track.stop());
    recording = null;
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    if (!form.isConnected) return;
    if (blob.size) {
      const ext = blob.type.includes("mp4")
        ? "m4a"
        : blob.type.includes("ogg")
          ? "ogg"
          : "webm";
      recordedFiles.set(
        form,
        new File([blob], "voice-report." + ext, { type: blob.type }),
      );
      form.elements.audio.value = "";
      status.textContent = "ویس آمادهٔ پیوست است.";
      form.querySelector('[data-action="discard-voice"]').hidden = false;
    } else status.textContent = "ضبط ویس انجام نشد. دوباره تلاش کنید.";
    button.innerHTML = icon("mic") + "ضبط ویس";
  };
  recorder.onstop = finish;
  recorder.onerror = finish;
  try {
    recorder.start();
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    throw error;
  }
  recording = { recorder, timer: setTimeout(stopVoiceRecording, 90000) };
  button.innerHTML = icon("check") + "پایان ضبط";
  status.textContent = "در حال ضبط · حداکثر ۹۰ ثانیه";
}
function persistReportDraft(target) {
  api.draft(
    Object.fromEntries(
      ["cat", "area", "location", "lat", "lon", "text"].map((name) => [
        name,
        target.elements[name].value,
      ]),
    ),
  );
}
const actions = {
  close: () => modal.close(),
  teaser: openTeaser,
  tutorial: () => showTutorial(0),
  "zero-world": (action) => world.handle(action),
  "zero-choice": (target) => {
    const [chapter, choice] = target.split(":");
    api.chooseZero(chapter, choice);
    render();
    $(".zero-result")?.focus();
  },
  "tutorial-next": () => showTutorial(tutorialStep + 1),
  "tutorial-prev": () => showTutorial(tutorialStep - 1),
  "new-personal": () => {
    if (requireMember())
      showDialog(
        "مأموریت شخصی",
        form(
          "personal-task",
          "",
          field("title", "نام مأموریت", { length: 95 }) +
            textarea("goal", "شرح کاری که می‌خواهید انجام دهید"),
          "ساخت مأموریت",
        ),
      );
  },
  "complete-personal": (id) => {
    api.completePersonal(id);
    refresh("مأموریت شخصی انجام شد.");
  },
  practice: (id) => {
    api.practiceMission(id);
    refresh("انجام آزمایشی ثبت شد.");
  },
  "publish-mission": (id) =>
    showDialog(
      "انتشار در فید محله",
      form(
        "publish-mission",
        id,
        textarea("text", "تجربه‌تان را بنویسید"),
        "انتشار پست",
      ),
    ),
  like: (key) => {
    if (requireMember()) {
      api.react(key, "likes");
      render();
    }
  },
  "flag-report": (key) => {
    if (requireMember()) {
      api.react(key, "flags");
      render();
      toast("وضعیت پیشنهاد شما به‌روز شد.");
    }
  },
  comment: (key) => {
    if (requireMember())
      showDialog(
        "نظر همسایه",
        form("social-comment", key, textarea("text", "نظر شما"), "ثبت نظر"),
      );
  },
  "moderate-comment": (value) => {
    const [key, id] = value.split("|");
    const entry = discussion(state, key).comments.find((c) => c.id === id);
    api.moderateComment(key, id, !entry.hidden);
    refresh(entry.hidden ? "نظر بازگردانده شد." : "نظر پنهان شد.");
  },
  "archive-mission": (id) =>
    showDialog(
      "حذف مأموریت از فهرست",
      form(
        "archive-mission",
        id,
        notice(
          "همسایه‌ها این مأموریت را در فهرست عمومی نمی‌بینند. سوابق قبلی باقی می‌ماند.",
        ),
        "تأیید حذف",
      ),
    ),
  "restore-mission": (id) => {
    api.archiveMission(id, false);
    refresh("مأموریت بازگردانده شد.");
  },
  "report-decision": (id) => {
    const r = allReports(state).find((x) => x.id === id);
    showDialog(
      r.rejection ? "بازگشایی گزارش" : "رد گزارش",
      form(
        "report-decision",
        id,
        r.rejection
          ? notice("گزارش دوباره وارد روند رسیدگی می‌شود.")
          : textarea("reason", "دلیل رد گزارش"),
        r.rejection ? "بازگشایی" : "ثبت رد گزارش",
      ),
    );
  },
  "copy-coordinates": (id) => {
    const point = allReports(state).find((x) => x.id === id)?.coordinates;
    if (point) clipboard(point.lat + ", " + point.lon, "مختصات کپی شد.");
  },
  "report-location": async () => {
    const target = reportForm();
    if (!target) return;
    const line = target.querySelector("#position-status");
    const button = target.querySelector('[data-action="report-location"]');
    button.disabled = true;
    line.textContent = "در حال دریافت موقعیت…";
    try {
      const { lat, lon } = await requestPosition();
      if (!target.isConnected) return;
      target.elements.lat.value = lat;
      target.elements.lon.value = lon;
      target.querySelector("details").open = true;
      persistReportDraft(target);
      line.textContent = "مختصات ثبت شد و در جزئیات گزارش دیده می‌شود.";
    } catch (error) {
      line.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  },
  "record-voice": toggleVoiceRecording,
  "discard-voice": () => {
    const target = reportForm();
    if (!target) return;
    recordedFiles.delete(target);
    target.querySelector("#record-status").textContent = "";
    target.querySelector('[data-action="discard-voice"]').hidden = true;
  },
  "close-teaser": () => teaser.close(),
  navigate: go,
  area: () =>
    showDialog("انتخاب محله", form("area", "", areaSelect(), "تأیید محله")),
  search: () =>
    showDialog(
      "جست‌وجوی هم‌دیار",
      `<input class="search-input" id="site-search" type="search" placeholder="مثلاً آموزش، روشنایی یا کافه" aria-label="عبارت جست‌وجو"><div id="search-results">${searchResults("")}</div>`,
    ),
  notifications: () =>
    showDialog(
      "اعلان‌ها",
      list(
        SAMPLE_NOTICES.map(([title, target], index) =>
          b(
            "notice",
            tile("bell") +
              `<span><b>${title}</b><small>${state.notices.includes(index) ? "خوانده‌شده" : "اعلان نمونه"}</small></span>`,
            "list-item",
            "",
            String(index),
          ),
        ),
        "",
      ),
    ),
  notice: (index) => {
    api.notice(Number(index));
    go(SAMPLE_NOTICES[Number(index)][1]);
  },
  filter: (id) => {
    listFilter = id;
    render();
    $(".filters .active")?.focus();
  },
  "start-mission": startMission,
  feedback: (id) =>
    showDialog(
      "بازخورد گزارش",
      form("feedback", id, textarea("text", "بازخورد شما"), "ثبت بازخورد"),
    ),
  opinion: (id) =>
    showDialog(
      "نظر دربارهٔ پروژه",
      form("opinion", id, textarea("text", "نظر شما"), "ثبت نظر"),
    ),
  share: (id) =>
    clipboard(new URL(id, location.href).href, "نشانی پروژه کپی شد."),
  copy: (id) => clipboard(id, "کد کوپن کپی شد."),
  redeem: (id) => {
    const reward = PRIZES.find((x) => x.id === id);
    showDialog(
      "تأیید دریافت جایزه",
      form(
        "redeem",
        id,
        `<p>${reward.title}</p><p>کوپن یک‌بارمصرف در کیف پول ثبت می‌شود.</p>`,
        "تأیید و دریافت کوپن",
      ),
    );
  },
  spin: () => {
    if (!requireMember()) return;
    const entry = api.spin();
    const wheel = $("#wheel");
    wheel.style.setProperty(
      "--rotation",
      `${1080 - (entry.result * 60 + 30)}deg`,
    );
    wheel.classList.add("spun");
    const result = $("#wheel-result");
    result.innerHTML = notice("گردونه در حال چرخش است…");
    setTimeout(
      () => {
        if (result.isConnected) result.innerHTML = wheelResult(entry);
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900,
    );
  },
  "cart-add": (id) => {
    api.cart(id, 1);
    refresh();
  },
  "cart-remove": (id) => {
    api.cart(id, -1);
    refresh();
  },
  book: (id) => {
    api.book(id);
    refresh("ظرفیت آزمایشی رزرو شد.");
  },
  "join-team": (id) => {
    api.team(id, true);
    refresh("عضویت در تیم ثبت شد.");
  },
  "leave-team": (id) => {
    api.team(id, false);
    refresh("از تیم خارج شدید.");
  },
  vote: (id) => {
    if (requireMember()) {
      api.vote(id);
      refresh("حمایت از هدف کوچه ثبت شد.");
    }
  },
  logout: () => {
    api.role("guest");
    go("");
    toast("به نمای مهمان برگشتید.");
  },
  "download-data": () =>
    download(
      "hamdiyar-demo.json",
      JSON.stringify(state, null, 2),
      "application/json",
    ),
  "clear-data": () =>
    showDialog(
      "پاک کردن داده‌ها",
      form(
        "clear",
        "",
        notice("همهٔ سوابق آزمایشی همین دستگاه پاک می‌شوند.", "warning"),
        "تأیید پاک کردن",
      ),
    ),
  review: (id) => {
    const senior = state.profile.role === "senior";
    const note = textarea(
      "note",
      senior ? "یادداشت بررسی اولیه" : "بازخورد یا دلیل درخواست اصلاح",
    );
    showDialog(
      "بررسی مأموریت",
      form(
        "review",
        id,
        (senior
          ? ""
          : select("decision", "نتیجه", [
              ["approve", "تأیید و ثبت پاداش"],
              ["reject", "نیاز به اصلاح"],
            ])) + note,
        "ثبت نتیجه",
      ),
    );
  },
  "advance-report": (id) =>
    showDialog(
      "ثبت پیشرفت رسیدگی",
      form(
        "advance-report",
        id,
        textarea("note", "توضیح رسیدگی"),
        "ثبت مرحلهٔ بعد",
      ),
    ),
  attendance: (id) =>
    showDialog(
      "حضور در جلسه",
      form(
        "attendance",
        id,
        select(
          "session",
          "شمارهٔ جلسه",
          [1, 2, 3].map((n) => [String(n), "جلسهٔ " + fa(n)]),
        ),
        "ثبت حضور",
      ),
    ),
  certificate: (id) => {
    const entry = state.enrollments[id];
    if (entry?.attendance.length !== 3) return;
    const title = LEARNING.find((c) => c.id === id).title;
    const html = `<!doctype html><meta charset="utf-8"><html lang="fa" dir="rtl"><title>گواهی آزمایشی هم‌دیار</title>
      <style>body{font:20px/1.9 sans-serif;background:#eaffec;color:#134533;padding:4rem}article{max-width:660px;margin:auto;padding:3rem;border:4px double #12634c;text-align:center;background:white}h1{margin:0}</style>
      <article><h1>گواهی آزمایشی هم‌دیار</h1><p>گواهی می‌شود ${clean(state.profile.name)} سه جلسهٔ دورهٔ «${title}» را گذرانده است.</p>
      <p>شناسهٔ ثبت‌نام <bdi>${entry.receipt}</bdi></p><p>نمونهٔ پایلوت هم‌دیار · منطقهٔ ۱۸</p></article></html>`;
    download("hamdiyar-certificate.html", html, "text/html;charset=utf-8");
  },
  alley: (id) =>
    showDialog(
      "تعهد پیشنهادی محله",
      form(
        "alley",
        id,
        textarea(
          "note",
          "اقدام و زمان پیشنهادی",
          state.approvedAlley[id]?.note,
        ),
        "ثبت در لیگ کوچه‌ها",
      ),
    ),
  csv: () => {
    if (!rolesAllowed.city.includes(state.profile.role)) return;
    const reports = allReports(state).filter(
      (r) => !dashboardArea || r.area === dashboardArea,
    );
    const rows = [
      "محله,مرحله,تعداد,نوع داده",
      ...AREAS.filter(
        (area) => !dashboardArea || area === dashboardArea,
      ).flatMap((area) =>
        [...REPORT_STEPS, "رد شده توسط شهرداری"].map((label) =>
          [
            area,
            label,
            reports.filter((r) => r.area === area && reportStatus(r) === label)
              .length,
            "آزمایشی",
          ].join(","),
        ),
      ),
    ];
    download(
      "hamdiyar-city-summary.csv",
      "\ufeff" + rows.join("\r\n"),
      "text/csv;charset=utf-8",
    );
  },
};
const submissions = {
  "city-mission": (data, id) => {
    api.saveMission(id, Object.fromEntries(data));
    go("dashboard/missions");
    toast("مأموریت ذخیره شد.");
  },
  "archive-mission": (_, id) => {
    api.archiveMission(id, true);
    refresh("مأموریت از فهرست برداشته شد.");
  },
  "test-mode": (data) => {
    api.testMode(data.has("enabled"), data.get("actor"));
    refresh(data.has("enabled") ? "حالت تست روشن شد." : "حالت تست خاموش شد.");
  },
  "personal-task": (data) => {
    api.personalTask(data.get("title"), data.get("goal"));
    go("missions/mine");
    toast("مأموریت شخصی ساخته شد.");
  },
  "publish-mission": (data, id) => {
    const post = api.publishMission(id, data.get("text"));
    go("feed/" + post.id);
    toast("پست در فید محله ثبت شد.");
  },
  "social-comment": (data, key) => {
    api.comment(key, data.get("text"));
    refresh("نظر ثبت شد.");
  },
  "report-decision": (data, id) => {
    api.resolveReport(id, data.has("reason"), data.get("reason") || "");
    refresh(data.has("reason") ? "رد گزارش ثبت شد." : "گزارش بازگشایی شد.");
  },
  area: (data) => {
    api.area(data.get("area"));
    refresh("محلهٔ انتخابی ذخیره شد.");
  },
  profile: (data) => {
    api.profile({
      name: data.get("name"),
      area: data.get("area"),
      age: Number(data.get("age")),
      consent: data.has("consent"),
      large: data.has("large"),
    });
    go("profile");
    toast("پروفایل ذخیره شد.");
  },
  "text-size": (data) => {
    api.profile({ ...state.profile, large: data.has("large") });
    refresh("اندازهٔ متن ذخیره شد.");
  },
  role: (data) => {
    const role = data.get("role");
    api.role(role);
    if (role === "city") go("dashboard/city");
    else refresh();
    toast("نقش به «" + ROLES[role] + "» تغییر کرد.");
  },
  login: (data) => {
    if (normalizeDigits(data.get("code")) !== "123456")
      throw new Error("کد نمونه ۱۲۳۴۵۶ را وارد کنید.");
    api.role("member");
    go("profile");
    toast("ورود آزمایشی انجام شد.");
  },
  clear: async () => {
    await clearReportFiles();
    api.clear();
    go("");
    toast("سوابق آزمایشی پاک شد.");
  },
  questions: (data, id) => {
    const quiz = id === "quiz-waste";
    const questions = quiz ? QUIZ : POLL.questions;
    const choices = questions.map((_, i) => Number(data.get("q" + i)));
    if (quiz && choices.some((choice, i) => choice !== questions[i].a))
      throw new Error(
        "یک یا چند پاسخ نیاز به بازبینی دارد. بطری و قوطی شسته خشک‌اند. پوست میوه و کارتن روغنی در مخزن خشک نمی‌روند.",
      );
    api.joinMission(id, choices, true);
    refresh("آفرین! امتیاز مأموریت ثبت شد.");
  },
  mission: (data, id) => {
    api.joinMission(
      id,
      data.has("proof")
        ? data.get("proof") + " · " + data.get("note")
        : data.get("text"),
    );
    refresh("مأموریت برای بررسی ثبت شد.");
  },
  report: async (data, _, target) => {
    if (recording) throw new Error("برای ثبت گزارش، ابتدا ضبط را پایان دهید.");
    const { cat, area, text, location, lat, lon } = Object.fromEntries(data);
    if ((lat === "") !== (lon === ""))
      throw new Error("هر دو مختصات را وارد کنید یا نشانی تقریبی بنویسید.");
    const coordinates = lat !== "" && lon !== "" ? { lat, lon } : null;
    const files = [
      data.get("image"),
      recordedFiles.get(target) || data.get("audio"),
      data.get("video"),
    ].filter((file) => file?.size);
    const attachments = await storeReportFiles(files, uid);
    let r;
    try {
      r = api.report({ cat, area, text, location, coordinates, attachments });
    } catch (error) {
      await removeReportFiles(attachments).catch(() => {});
      throw error;
    }
    go("voice/" + r.id);
    toast("گزارش ثبت شد.");
  },
  feedback: (data, id) => {
    api.feedback(id, data.get("text"));
    refresh("بازخورد ثبت شد.");
  },
  opinion: (data, id) => {
    api.opinion(id, data.get("text"));
    refresh("نظر شما ثبت شد.");
  },
  redeem: (_, id) => {
    const code = api.redeem(id);
    go("rewards/coupon/" + code);
    toast("کوپن در کیف پول ثبت شد.");
  },
  order: () => {
    const order = api.order();
    go("cafe/order/" + order.id);
    toast("سفارش آزمایشی ثبت شد.");
  },
  "add-product": (data, id) => {
    api.cart(id, Number(data.get("quantity")));
    go("cafe/cart");
    toast("محصول به سبد اضافه شد.");
  },
  enroll: (data, id) => {
    api.enroll(id, data.get("slot"));
    go("academy/mine/" + id);
    toast("رسید ثبت‌نام آماده است.");
  },
  scholarship: (data, id) => {
    api.scholarship(id, data.get("text"));
    refresh("درخواست بورسیه ثبت شد.");
  },
  ticket: (data) => {
    api.ticket(data.get("text"));
    go("help/tickets");
    toast("درخواست آزمایشی ثبت شد.");
  },
  review: (data, id) => {
    if (state.profile.role === "senior") api.preliminary(id, data.get("note"));
    else api.review(id, data.get("decision") === "approve", data.get("note"));
    refresh("نتیجهٔ بررسی ثبت شد.");
  },
  "advance-report": (data, id) => {
    api.advanceReport(id, data.get("note"));
    refresh("مرحلهٔ رسیدگی ثبت شد.");
  },
  attendance: (data, id) => {
    api.attendance(id, Number(data.get("session")));
    refresh("حضور ثبت شد.");
  },
  "use-coupon": (data) => {
    const c = api.useCoupon(data.get("code"));
    refresh("کوپن " + c.title + " مصرف شد.");
  },
  waste: (data) => {
    const id = api.waste(data.get("kind"), Number(data.get("weight")));
    render();
    showDialog(
      "رسید تحویل پسماند",
      `<p class="coupon-code">${id}</p><p>وزن و اعتبار آزمایشی در سوابق ثبت شد.</p>${a("rewards/wallet", "کیف پول و سوابق", "btn", "wallet")}`,
    );
  },
  alley: (data, id) => {
    api.alley(id, data.get("note"));
    refresh("تعهد پیشنهادی ثبت شد.");
  },
};
document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (action) {
    const handler = actions[action.dataset.action];
    if (handler) {
      try {
        const result = handler(action.dataset.id);
        if (result?.catch) result.catch((error) => toast(error.message));
      } catch (error) {
        toast(error.message);
      }
      return;
    }
  }
  const link = event.target.closest('a[href^="#/"]');
  if (link && modal.open) modal.close();
});
document.addEventListener("submit", async (event) => {
  const target = event.target.closest("[data-form]");
  if (!target) return;
  event.preventDefault();
  const problem = target.querySelector(".field-error");
  const submit = target.querySelector('[type="submit"]');
  if (submit.disabled) return;
  submit.disabled = true;
  problem.hidden = true;
  try {
    await submissions[target.dataset.form]?.(
      new FormData(target),
      target.dataset.id,
      target,
    );
  } catch (error) {
    problem.textContent = error.message;
    problem.hidden = false;
  } finally {
    submit.disabled = false;
  }
});
document.addEventListener("input", (event) => {
  if (event.target.id === "site-search")
    $("#search-results").innerHTML = searchResults(event.target.value);
  const target = event.target.closest('[data-form="report"]');
  if (target) {
    try {
      persistReportDraft(target);
    } catch {
      /* The report form will display storage errors on submit. */
    }
  }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[data-mission-stage]")) {
    const { id, missionStage } = event.target.dataset;
    try {
      api.setMissionStage(id, Number(missionStage), event.target.checked);
      render();
      shell
        .querySelector('[data-mission-stage="' + missionStage + '"]')
        ?.focus();
    } catch (error) {
      toast(error.message);
      render();
    }
    return;
  }
  if (
    event.target.name === "audio" &&
    event.target.form?.dataset.form === "report" &&
    event.target.files.length
  )
    actions["discard-voice"]();
  if (event.target.id !== "city-area") return;
  dashboardArea = event.target.value;
  render();
  $("#city-area")?.focus();
});
window.addEventListener("hashchange", () => {
  if (modal.open) modal.close();
  if (teaser.open) teaser.close();
  listFilter = "";
  dashboardArea = "";
  render({ keepScroll: false });
});
modal.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && event.target.id === "site-search") {
    event.preventDefault();
    modal.close();
  }
});
window.addEventListener("storage", () => {
  if (!reportForm()) render();
});
window.addEventListener("keydown", (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k" &&
    !teaser.open
  ) {
    event.preventDefault();
    actions.search();
  }
});
video.addEventListener("error", () => {
  $("#video-error").hidden = false;
});
teaser.addEventListener("close", () => video.pause());
render();
if (
  "serviceWorker" in navigator &&
  !window.Capacitor?.isNativePlatform() &&
  location.protocol.startsWith("http")
) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("./sw.js").catch(() => {}),
  );
}
