import {
  AREAS,
  LEVELS,
  MISSIONS,
  EXTRA_MISSIONS,
  PRIZES,
  SEED_REPORTS,
  LEARNING,
  CALENDAR,
  PRODUCTS,
  MARKET,
  WASTE_RATES,
  ROLES,
  REPORT_CATS,
  REPORT_STEPS,
  CLEAN_PARK,
  CULTURAL_PRIZES,
  POLL,
  QUIZ,
} from "./data.js";
import { ZERO_CHAPTERS } from "./zero.js";
import {
  ARCADE_GAMES,
  COMPANIONS,
  ZERO_PRODUCTS,
} from "./zero-world-data.js?v=1.4.0";

const KEY = "hamdiyar.demo.v1";
export const missions = [...MISSIONS, ...EXTRA_MISSIONS, CLEAN_PARK];
export const MONTHLY_CAP = 100000;
export const rolesAllowed = {
  review: ["city", "admin", "patok", "senior"],
  reports: ["city", "admin", "patok", "senior"],
  attendance: ["coach", "admin"],
  pos: ["cafe", "patok", "admin"],
  city: ["city", "admin"],
  join: ["member", "teen", "guardian", "senior", "admin"],
};
const initial = () => ({
  profile: {
    name: "همیار محله",
    area: AREAS[1],
    role: "member",
    age: 23,
    consent: false,
    large: false,
    testMode: false,
    actor: "neighbor",
  },
  xp: 120,
  credit: 45000,
  cafeCredit: 0,
  submissions: {},
  reports: [],
  enrollments: {},
  bookings: {},
  teams: [],
  transactions: [],
  feedback: [],
  coupons: [],
  cart: {},
  orders: [],
  tickets: [],
  scholarships: {},
  spins: {},
  approvedAlley: {},
  votes: {},
  notices: [],
  wasteKg: 0,
  invites: [],
  draftReport: {},
  projectOpinions: {},
  missionEdits: {},
  personalTasks: [],
  testSubmissions: {},
  missionProgress: {},
  zeroStory: {},
  zeroWorld: {},
  activityPosts: [],
  community: {},
  reportEdits: {},
  audit: [],
});
export function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.profile)
      return {
        ...initial(),
        ...saved,
        profile: { ...initial().profile, ...saved.profile },
      };
  } catch {
    /* A fresh demo is available when stored data is unreadable. */
  }
  return initial();
}
const fail = (message) => {
  throw new Error(message);
};
const find = (items, id) =>
  items.find((item) => item.id === id) || fail("این مورد پیدا نشد.");
const allowed = (state, name) => {
  if (!rolesAllowed[name].includes(state.profile.role))
    fail("برای این عملیات، نقش آزمایشی مناسب را از پروفایل انتخاب کنید.");
};
const write = (operation) => {
  const state = read();
  const result = operation(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    fail(
      "فضای ذخیره‌سازی این دستگاه در دسترس نیست. کمی فضا آزاد کنید و دوباره تلاش کنید.",
    );
  }
  return result;
};
export const uid = (prefix) =>
  prefix +
  "-" +
  Array.from(crypto.getRandomValues(new Uint8Array(5)), (x) =>
    x.toString(16).padStart(2, "0"),
  )
    .join("")
    .toUpperCase();
const now = () => new Date().toISOString();
export const actor = (state) => state.profile.actor || "neighbor";
const storyActor = (state) =>
  state.profile.role === "guest" ? "guest" : actor(state);
const emptyWorld = () => ({
  companion: "robot",
  scores: {},
  viewed: {},
  saved: [],
});
export const zeroWorldProgress = (state) => ({
  ...emptyWorld(),
  ...state.zeroWorld[storyActor(state)],
});
const worldRecord = (state) =>
  (state.zeroWorld[storyActor(state)] ||= emptyWorld());
export const zeroProgress = (state) => state.zeroStory[storyActor(state)] || {};
export const zeroUnlocked = (progress, index) =>
  index === 0 ||
  Boolean(ZERO_CHAPTERS[index - 1] && progress[ZERO_CHAPTERS[index - 1].id]);
export const missionStages = [
  "شرح و شرایط ایمنی را خواندم",
  "فعالیت مأموریت را انجام دادم",
  "نتیجه برای ثبت آماده است",
];
export const missionProgress = (state, id) =>
  state.missionProgress[actor(state) + ":" + id] || [];
export const demoActors = {
  neighbor: "همسایهٔ اول",
  second: "همسایهٔ دوم",
  third: "همسایهٔ سوم",
};
export const missionCatalog = (state) => [
  ...missions.map((entry) => ({ ...entry, ...state.missionEdits[entry.id] })),
  ...Object.values(state.missionEdits).filter((entry) => entry.created),
];
export const campaignClosed = (mission) =>
  Boolean(
    mission.ends && Date.now() >= Date.parse(mission.ends + "T20:30:00Z"),
  );
const audit = (state, action, target) => {
  state.audit.unshift({ action, target, at: now(), role: state.profile.role });
  state.audit = state.audit.slice(0, 80);
};
export const fa = (value) => new Intl.NumberFormat("fa-IR").format(value);
export const month = (date = new Date()) =>
  new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
    year: "numeric",
    month: "2-digit",
  }).format(date instanceof Date ? date : new Date(date));
export const today = (date = new Date()) =>
  new Intl.DateTimeFormat("fa-IR-u-nu-latn", { dateStyle: "short" }).format(
    date instanceof Date ? date : new Date(date),
  );
export const wheelDay = (date = new Date()) =>
  new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
    dateStyle: "short",
    timeZone: "Asia/Tehran",
  }).format(date);
export const dateLabel = (date) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(
    new Date(date),
  );
export const normalizeDigits = (s) =>
  String(s ?? "").replace(/[۰-۹٠-٩]/g, (digit) =>
    String("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩".indexOf(digit) % 10),
  );
export const balanceEarned = (state) =>
  state.transactions
    .filter(
      (t) => t.wallet === "credit" && t.amount > 0 && month(t.at) === month(),
    )
    .reduce((total, t) => total + t.amount, 0);
export const approvedCount = (state) =>
  Object.values(state.submissions).filter(
    (entry) => entry.status === "approved",
  ).length;
export const level = (state) =>
  [...LEVELS]
    .reverse()
    .find(
      (item) =>
        state.xp >= item.xp &&
        (!item.note ||
          (item.xp === 1500
            ? state.profile.seniorApproved
            : state.profile.advancedApproved)),
    ) || LEVELS[0];
export const audience = ({ profile }, entry) =>
  !entry.teen ||
  profile.role === "teen" ||
  profile.role === "guardian" ||
  profile.role === "admin" ||
  profile.role === "city";
export const consentNeeded = ({ profile }, min = 12) =>
  profile.role === "teen" ||
  profile.role === "guardian" ||
  (profile.age >= min && profile.age < 18);
const guardTeen = (state, minAge = 12) => {
  if (
    state.profile.age &&
    state.profile.age < minAge &&
    state.profile.role !== "guardian"
  )
    fail("شرط سنی این فعالیت تکمیل نشده است.");
  if (consentNeeded(state, minAge) && !state.profile.consent)
    fail(
      "پیش از ثبت‌نام یا پذیرش، رضایت آزمایشی سرپرست را در پروفایل ثبت کنید.",
    );
};
function tx(state, wallet, amount, title, source) {
  if (
    !amount ||
    state.transactions.some((t) => t.wallet === wallet && t.source === source)
  )
    return 0;
  const granted =
    wallet === "credit" && amount > 0
      ? Math.max(0, Math.min(amount, MONTHLY_CAP - balanceEarned(state)))
      : amount;
  if (state[wallet] + granted < 0) fail("موجودی برای این عملیات کافی نیست.");
  if (!granted) return 0;
  state[wallet] += granted;
  state.transactions.unshift({
    id: uid("HD"),
    wallet,
    amount: granted,
    title,
    source,
    at: now(),
  });
  return granted;
}
function approve(state, entry, mission) {
  if (entry.status === "approved") fail("این مأموریت پیش‌تر تأیید شده است.");
  entry.status = "approved";
  entry.reviewed = now();
  tx(
    state,
    "xp",
    entry.xpReward ?? mission.xp,
    entry.missionTitle || mission.title,
    entry.id,
  );
  tx(
    state,
    "credit",
    entry.creditReward ?? mission.credit,
    entry.missionTitle || mission.title,
    entry.id,
  );
}
const extraReports = [
  {
    id: "p6",
    cat: "green",
    text: "نیاز به رسیدگی به باغچهٔ کنار پاتوق",
    area: AREAS[0],
    step: 1,
  },
  {
    id: "p7",
    cat: "walk",
    text: "مانع در مسیر پیاده‌رو ایستگاه",
    area: AREAS[4],
    step: 3,
  },
  {
    id: "p8",
    cat: "light",
    text: "روشنایی کم در مسیر بوستان",
    area: AREAS[2],
    step: 2,
  },
];
export const allReports = (state) =>
  [...state.reports, ...SEED_REPORTS, ...extraReports].map((entry) => ({
    ...entry,
    ...state.reportEdits[entry.id],
  }));
export const reportStatus = (entry) =>
  entry.rejection ? "رد شده توسط شهرداری" : REPORT_STEPS[entry.step];

const samplePosts = [
  {
    id: "seed-green",
    author: "گروه یاران سبز",
    title: "محلهٔ پاک، زمین سبز",
    text: "آموزش تفکیک زباله را انجام دادیم و دور بعد بطری‌ها را جدا تحویل می‌دهیم.",
    image: "recycle.jpg",
    steps: 3,
  },
  {
    id: "seed-meet",
    author: "همراهان محله",
    title: "دورهمی همسایه‌ها",
    text: "در پاتوق دربارهٔ روشنایی مسیر بوستان گفت‌وگو کردیم.",
    image: "workshop.jpg",
    steps: 3,
  },
  {
    id: "seed-park",
    author: "گروه یاران سبز",
    title: "پاک‌سازی بوستان قائم",
    text: "مسیر ورودی پاک شد و دور بوستان برای نوبت بعدی باقی مانده است.",
    image: "kiosk.jpg",
    steps: 2,
  },
  {
    id: "seed-light",
    author: "همسایه‌های کوچهٔ یاس",
    title: "بررسی روشنایی مسیر بوستان",
    text: "مسیر پیشنهادی را انتخاب کردیم. بازدید روزانه و ثبت نتیجه مانده است.",
    image: "alley-before.jpg",
    steps: 1,
  },
];
export const communityPosts = (state) => [
  ...state.activityPosts,
  ...samplePosts,
];
const sampleComments = {
  "post:seed-green": [
    "بطری‌ها را در پاتوق می‌شود تحویل داد؟",
    "بله، میز پسماند کنار ورودی است.",
  ],
  "post:seed-meet": ["برای نشست بعدی، مسیر مدرسه را هم بررسی کنیم."],
  "post:seed-park": [
    "برای نوبت بعد کیسهٔ تفکیک همراه می‌آوریم.",
    "مسیر کنار نیمکت‌ها را هم اضافه کنیم.",
  ],
  "post:seed-light": ["کنار ورودی دوم هم به بررسی نیاز دارد."],
  "report:p1": ["این بخش از مسیر مدرسه است.", "تیر نزدیک ورودی کوچه روشن است."],
  "report:p8": ["این نقطه نزدیک ورودی دوم بوستان است."],
};
export const discussion = (state, key) =>
  state.community[key] || {
    likes: sampleComments[key] ? ["sample-first", "sample-second"] : [],
    flags: key === "report:p8" ? ["sample-second"] : [],
    comments: (sampleComments[key] || []).map((text, i) => ({
      id: "sample-note-" + i,
      author: i % 2 ? "همراه پاتوق" : "همسایهٔ محله",
      at: "2026-11-20T09:00:00Z",
      text,
    })),
  };
const validateThread = (state, key) => {
  const found = key.startsWith("report:")
    ? allReports(state).some((entry) => "report:" + entry.id === key)
    : communityPosts(state).some((entry) => "post:" + entry.id === key);
  if (!found) fail("این پست یا گزارش پیدا نشد.");
};
const signedIn = (state) => {
  if (state.profile.role === "guest")
    fail("برای مشارکت وارد حساب آزمایشی شوید.");
};
export const productById = (id) =>
  [...PRODUCTS, ...MARKET].find((p) => p.id === id);
export const cartTotal = (state) =>
  Object.entries(state.cart).reduce(
    (sum, [id, count]) => sum + (productById(id)?.price || 0) * count,
    0,
  );

export const api = {
  chooseCompanion(id) {
    return write((state) => {
      find(COMPANIONS, id);
      worldRecord(state).companion = id;
    });
  },
  scoreZeroGame(id, score) {
    return write((state) => {
      const game = find(ARCADE_GAMES, id);
      if (!Number.isInteger(score) || score < 0 || score > game.rounds)
        fail("نتیجهٔ بازی معتبر نیست.");
      const scores = worldRecord(state).scores;
      scores[id] = Math.max(scores[id] || 0, score);
      return scores[id];
    });
  },
  finishZeroSample(id) {
    return write((state) => {
      if (!["episode", "book"].includes(id)) fail("این پیش‌نمایش پیدا نشد.");
      worldRecord(state).viewed[id] = true;
    });
  },
  saveZeroProduct(id) {
    return write((state) => {
      find(ZERO_PRODUCTS, id);
      const world = worldRecord(state);
      const existing = world.saved.includes(id);
      world.saved = existing
        ? world.saved.filter((entry) => entry !== id)
        : [...world.saved, id];
      return !existing;
    });
  },
  chooseZero(chapterId, choiceId) {
    return write((state) => {
      const index = ZERO_CHAPTERS.findIndex(
        (chapter) => chapter.id === chapterId,
      );
      const chapter = ZERO_CHAPTERS[index];
      if (!chapter || !zeroUnlocked(zeroProgress(state), index))
        fail("برای باز شدن این فصل، فصل قبلی را تمام کنید.");
      const choice = find(chapter.choices, choiceId);
      const progress = (state.zeroStory[storyActor(state)] ||= {});
      progress[chapterId] = {
        choice: choice.id,
        best: Math.max(progress[chapterId]?.best || 0, choice.stars),
      };
      return progress[chapterId];
    });
  },
  profile(input) {
    return write((state) => {
      const { name, area, age, consent, large } = input;
      if (name.trim().length < 2) fail("نام نمایشی باید دست‌کم دو نویسه باشد.");
      if (
        !AREAS.includes(area) ||
        !Number.isInteger(age) ||
        age < 12 ||
        age > 110
      )
        fail("محله و سن معتبر را انتخاب کنید.");
      state.profile = {
        ...state.profile,
        name: name.trim(),
        area,
        age,
        consent,
        large,
        role:
          state.profile.role === "member" && age < 18
            ? "teen"
            : state.profile.role,
      };
    });
  },
  role(role) {
    return write((state) => {
      if (!Object.hasOwn(ROLES, role)) fail("نقش نامعتبر است.");
      if (role === "teen" && state.profile.role !== "teen")
        state.profile.age = 16;
      if (["member", "guardian"].includes(role) && state.profile.age < 18)
        state.profile.age = 23;
      state.profile.role = role;
    });
  },
  area(area) {
    return write((state) => {
      if (!AREAS.includes(area)) fail("محلهٔ معتبر را انتخاب کنید.");
      state.profile.area = area;
    });
  },
  testMode(enabled, identity) {
    return write((state) => {
      signedIn(state);
      if (!Object.hasOwn(demoActors, identity))
        fail("همسایهٔ نمونه را انتخاب کنید.");
      state.profile.testMode = Boolean(enabled);
      state.profile.actor = enabled ? identity : "neighbor";
    });
  },
  saveMission(id, input) {
    return write((state) => {
      allowed(state, "city");
      const existing = id ? find(missionCatalog(state), id) : null;
      const title = input.title.trim();
      const goal = input.goal.trim();
      const min = Number(input.min);
      const xp = Number(input.xp);
      const cat = input.cat.trim();
      if (
        title.length < 3 ||
        title.length > 95 ||
        goal.length < 8 ||
        goal.length > 550 ||
        !cat ||
        cat.length > 45
      )
        fail("عنوان، دسته و شرح مأموریت را کامل کنید.");
      if (
        !Number.isInteger(min) ||
        min < 1 ||
        min > 480 ||
        !Number.isInteger(xp) ||
        xp < 0 ||
        xp > 500
      )
        fail("مدت بین ۱ تا ۴۸۰ دقیقه و امتیاز بین ۰ تا ۵۰۰ باشد.");
      if (
        input.ends &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(input.ends) ||
          !Number.isFinite(Date.parse(input.ends)))
      )
        fail("تاریخ پایان معتبر نیست.");
      const key = existing?.id || uid("city");
      const entry = {
        ...existing,
        id: key,
        title,
        goal,
        cat,
        min,
        xp,
        ends: input.ends || "",
        type: existing?.type || "checkin",
        credit: existing?.credit || 0,
        safety: input.safety.trim() || "در فضای عمومی و در روشنایی روز",
        verify: existing?.verify || "تأیید پنل شهرداری",
        edited: true,
        created: existing ? Boolean(existing.created) : true,
      };
      state.missionEdits[key] = entry;
      audit(state, existing ? "ویرایش مأموریت" : "ثبت مأموریت", key);
      return entry;
    });
  },
  archiveMission(id, archived) {
    return write((state) => {
      allowed(state, "city");
      const mission = find(missionCatalog(state), id);
      state.missionEdits[id] = { ...mission, archived };
      audit(
        state,
        archived ? "حذف از فهرست مأموریت‌ها" : "بازگردانی مأموریت",
        id,
      );
    });
  },
  practiceMission(id) {
    return write((state) => {
      signedIn(state);
      if (!state.profile.testMode) fail("حالت تست را از پروفایل روشن کنید.");
      const mission = find(missionCatalog(state), id);
      if (mission.archived) fail("این مأموریت از فهرست حذف شده است.");
      const account = (state.testSubmissions[actor(state)] ||= {});
      account[id] ||= { id: uid("TEST"), status: "approved", at: now() };
      return account[id];
    });
  },
  setMissionStage(id, step, on) {
    return write((state) => {
      allowed(state, "join");
      const mission = find(missionCatalog(state), id);
      if (
        mission.archived ||
        campaignClosed(mission) ||
        !audience(state, mission)
      )
        fail("این مأموریت برای ثبت فعال نیست.");
      if (!Number.isInteger(step) || step < 0 || step >= missionStages.length)
        fail("مرحله معتبر نیست.");
      const existing = missionProgress(state, id);
      if (on && step > existing.length)
        fail("ابتدا مرحلهٔ قبلی را تکمیل کنید.");
      state.missionProgress[actor(state) + ":" + id] = on
        ? missionStages.slice(0, Math.max(existing.length, step + 1))
        : existing.slice(0, step);
    });
  },
  personalTask(title, goal) {
    return write((state) => {
      signedIn(state);
      if (
        title.trim().length < 3 ||
        title.length > 95 ||
        goal.trim().length < 5 ||
        goal.length > 550
      )
        fail("نام و توضیح کوتاه مأموریت شخصی را کامل کنید.");
      const entry = {
        id: uid("personal"),
        owner: actor(state),
        title: title.trim(),
        goal: goal.trim(),
        at: now(),
      };
      state.personalTasks.unshift(entry);
      return entry;
    });
  },
  completePersonal(id) {
    return write((state) => {
      signedIn(state);
      const entry = find(
        state.personalTasks.filter((task) => task.owner === actor(state)),
        id,
      );
      entry.completedAt ||= now();
    });
  },
  publishMission(id, message) {
    return write((state) => {
      signedIn(state);
      const owner = actor(state);
      const personal = state.personalTasks.find(
        (entry) =>
          entry.owner === owner && entry.id === id && entry.completedAt,
      );
      const submission = state.submissions[id];
      const verified =
        submission?.status === "approved" &&
        (submission.actor || "neighbor") === owner;
      const mission = personal || (verified && find(missionCatalog(state), id));
      if (!mission) fail("ابتدا مأموریت را تکمیل کنید.");
      if (
        state.activityPosts.some(
          (post) => post.owner === owner && post.mission === id,
        )
      )
        fail("پست این مأموریت قبلاً منتشر شده است.");
      if (message.trim().length < 4 || message.length > 550)
        fail("متن پست را کامل کنید.");
      const post = {
        id: uid("post"),
        owner,
        author: state.profile.testMode ? demoActors[owner] : state.profile.name,
        title: mission.title,
        text: message.trim(),
        mission: id,
        at: now(),
      };
      state.activityPosts.unshift(post);
      return post;
    });
  },
  react(key, kind) {
    return write((state) => {
      signedIn(state);
      validateThread(state, key);
      if (kind !== "likes" && !(kind === "flags" && key.startsWith("report:")))
        fail("این واکنش در این بخش قابل ثبت نیست.");
      const reactions = (state.community[key] ||= discussion(state, key));
      const current = actor(state);
      reactions[kind] = reactions[kind].includes(current)
        ? reactions[kind].filter((id) => id !== current)
        : [...reactions[kind], current];
    });
  },
  comment(key, value) {
    return write((state) => {
      signedIn(state);
      validateThread(state, key);
      const text = value.trim();
      if (text.length < 2 || text.length > 550)
        fail("نظر باید بین ۲ تا ۵۵۰ نویسه باشد.");
      const thread = (state.community[key] ||= discussion(state, key));
      thread.comments.push({
        id: uid("comment"),
        role: state.profile.role,
        author: state.profile.testMode
          ? demoActors[actor(state)]
          : state.profile.name,
        text,
        at: now(),
      });
    });
  },
  moderateComment(key, id, hidden) {
    return write((state) => {
      allowed(state, "city");
      validateThread(state, key);
      const thread = (state.community[key] ||= discussion(state, key));
      const entry = find(thread.comments, id);
      entry.hidden = hidden;
      audit(state, hidden ? "پنهان‌کردن نظر" : "بازگردانی نظر", id);
    });
  },
  resolveReport(id, reject, reason) {
    return write((state) => {
      allowed(state, "city");
      find(allReports(state), id);
      if (reject && (reason.trim().length < 4 || reason.length > 550))
        fail("دلیل رد گزارش را بنویسید.");
      state.reportEdits[id] = {
        ...state.reportEdits[id],
        rejection: reject ? { reason: reason.trim(), at: now() } : null,
      };
      audit(state, reject ? "رد گزارش" : "بازگشایی گزارش", id);
    });
  },
  joinMission(id, proof, automatic = false) {
    return write((state) => {
      allowed(state, "join");
      const mission = find(missionCatalog(state), id);
      if (mission.archived || campaignClosed(mission))
        fail("ثبت این مأموریت بسته شده است.");
      if (!audience(state, mission))
        fail("این مأموریت برای نوجوانان سفیر است.");
      if (mission.teen || mission.type === "checkin") guardTeen(state);
      if (["approved", "pending"].includes(state.submissions[id]?.status))
        fail("این مأموریت قبلاً ثبت شده است.");
      if (!proof || (typeof proof === "string" && proof.trim().length < 5))
        fail("جزئیات فعالیت را کامل کنید.");
      if (automatic && !["quiz", "poll"].includes(mission.type))
        fail("این مأموریت به تأیید نیاز دارد.");
      const steps = automatic ? [...missionStages] : missionProgress(state, id);
      if (steps.length !== missionStages.length)
        fail("پیش از ثبت نتیجه، هر سه مرحلهٔ مأموریت را تکمیل کنید.");
      if (automatic) {
        const questions = mission.type === "quiz" ? QUIZ : POLL.questions;
        if (
          !Array.isArray(proof) ||
          proof.length !== questions.length ||
          proof.some(
            (answer, index) =>
              !Number.isInteger(answer) ||
              !questions[index].opts[answer] ||
              (mission.type === "quiz" && questions[index].a !== answer),
          )
        )
          fail("پاسخ‌های مأموریت کامل یا معتبر نیست.");
      }
      const entry = {
        id: uid("M"),
        mission: id,
        actor: actor(state),
        proof,
        steps,
        xpReward: mission.xp,
        creditReward: mission.credit,
        missionTitle: mission.title,
        status: "pending",
        at: now(),
      };
      state.submissions[id] = entry;
      if (automatic) approve(state, entry, mission);
      return entry;
    });
  },
  review(id, approved, note) {
    return write((state) => {
      allowed(state, "review");
      if (state.profile.role === "senior")
        fail("عضو ارشد می‌تواند بررسی اولیه را ثبت کند.");
      const entry = state.submissions[id];
      if (entry?.status !== "pending") fail("این مأموریت در صف بررسی نیست.");
      if (
        approved &&
        entry.steps &&
        entry.steps.length !== missionStages.length
      )
        fail("همهٔ مراحل مأموریت باید تکمیل شده باشد.");
      entry.note = note.trim();
      if (approved) {
        approve(state, entry, find(missionCatalog(state), id));
      } else {
        if (entry.note.length < 4) fail("دلیل رد را بنویسید.");
        entry.status = "rejected";
      }
      if (rolesAllowed.city.includes(state.profile.role))
        audit(
          state,
          approved ? "تأیید مأموریت" : "ارجاع مأموریت برای اصلاح",
          id,
        );
    });
  },
  preliminary(id, note) {
    return write((state) => {
      allowed(state, "review");
      const entry = state.submissions[id];
      if (entry?.status !== "pending" || note.trim().length < 4)
        fail("مأموریت در صف و یادداشت معتبر را انتخاب کنید.");
      entry.preliminary = note.trim();
    });
  },
  draft(input) {
    return write((state) => {
      state.draftReport = input;
    });
  },
  report(input) {
    return write((state) => {
      allowed(state, "join");
      const {
        cat,
        area,
        text,
        location,
        coordinates,
        attachments = [],
      } = input;
      const point = coordinates && {
        lat: Number(coordinates.lat),
        lon: Number(coordinates.lon),
      };
      if (
        point &&
        (!Number.isFinite(point.lat) ||
          !Number.isFinite(point.lon) ||
          Math.abs(point.lat) > 90 ||
          Math.abs(point.lon) > 180)
      )
        fail("مختصات موقعیت معتبر نیست.");
      if (
        !REPORT_CATS.some((category) => category.id === cat) ||
        !AREAS.includes(area) ||
        text.trim().length < 12 ||
        text.length > 550 ||
        (!point && location.trim().length < 4)
      )
        fail("محله، مکان تقریبی و شرح روشن مشکل لازم است.");
      if (
        state.reports.filter(
          (r) =>
            (r.actor || "neighbor") === actor(state) && today(r.at) === today(),
        ).length >= 3
      )
        fail("سقف ثبت سه گزارش در روز است.");
      if (
        state.reports.some(
          (r) => r.text.trim() === text.trim() && r.area === area && r.step < 4,
        )
      )
        fail("این گزارش قبلاً ثبت شده است.");
      const entry = {
        id: uid("R"),
        cat,
        area,
        text: text.trim(),
        location: location.trim(),
        coordinates: point
          ? {
              lat: Number(point.lat.toFixed(4)),
              lon: Number(point.lon.toFixed(4)),
            }
          : null,
        attachments,
        actor: actor(state),
        step: 0,
        at: now(),
        history: [{ step: 0, at: now(), note: "گزارش آزمایشی دریافت شد." }],
      };
      state.reports.unshift(entry);
      state.draftReport = {};
      return entry;
    });
  },
  advanceReport(id, note) {
    return write((state) => {
      allowed(state, "reports");
      const entry = find(
        rolesAllowed.city.includes(state.profile.role)
          ? allReports(state)
          : state.reports,
        id,
      );
      if (state.reportEdits[id]?.rejection)
        fail("ابتدا گزارش را بازگشایی کنید.");
      if (entry.step >= 4) fail("رسیدگی پیش‌تر پایان یافته است.");
      if (state.profile.role === "senior" && entry.step !== 0)
        fail("عضو ارشد فقط می‌تواند تأیید اولیه را ثبت کند.");
      const step = entry.step + 1;
      const history = [
        ...(entry.history || []),
        { step, at: now(), note: note.trim() },
      ];
      const live = state.reports.find((r) => r.id === id);
      if (live) Object.assign(live, { step, history });
      else state.reportEdits[id] = { ...state.reportEdits[id], step, history };
      if (rolesAllowed.city.includes(state.profile.role))
        audit(state, "به‌روزرسانی گزارش", id);
      const mission = find(missionCatalog(state), "report-issue");
      if (live && step === 1 && !state.submissions[mission.id]) {
        const submission = {
          id: entry.id,
          mission: mission.id,
          actor: entry.actor || "neighbor",
          proof: entry.id,
          status: "pending",
          at: entry.at,
        };
        state.submissions[mission.id] = submission;
        approve(state, submission, mission);
      }
    });
  },
  feedback(id, text) {
    return write((state) => {
      allowed(state, "join");
      find(state.reports, id);
      if (text.trim().length < 4) fail("متن بازخورد را کامل کنید.");
      state.feedback.unshift({
        id: uid("F"),
        report: id,
        text: text.trim(),
        at: now(),
      });
    });
  },
  redeem(id) {
    return write((state) => {
      allowed(state, "join");
      const reward = find(PRIZES, id);
      if (!audience(state, reward)) fail("این پاداش برای اعضای نوجوان است.");
      if (
        state.coupons.some(
          (c) => c.reward === id && !c.used && c.until > Date.now(),
        )
      )
        fail("یک کوپن معتبر از این جایزه دارید.");
      const code = uid("HD");
      state.coupons.unshift({
        code,
        reward: id,
        title: reward.title,
        at: now(),
        until: Date.now() + 30 * 86400000,
      });
      return code;
    });
  },
  useCoupon(code) {
    return write((state) => {
      allowed(state, "pos");
      const coupon = state.coupons.find(
        (c) => c.code === code.trim().toUpperCase(),
      );
      if (!coupon || coupon.used || coupon.until <= Date.now())
        fail("کوپن معتبر نیست یا قبلاً مصرف شده است.");
      coupon.used = now();
      return coupon;
    });
  },
  spin() {
    return write((state) => {
      allowed(state, "join");
      const day = wheelDay();
      const key = actor(state) + ":" + day;
      if (state.spins[key]) fail("نوبت امروز استفاده شده است.");
      const result =
        crypto.getRandomValues(new Uint32Array(1))[0] % CULTURAL_PRIZES.length;
      const prize = CULTURAL_PRIZES[result];
      const receipt = uid("G");
      const coupon = prize.empty ? null : uid("HD");
      if (coupon)
        state.coupons.unshift({
          code: coupon,
          reward: "wheel-" + prize.id,
          title: prize.title,
          at: now(),
          until: Date.now() + 30 * 86400000,
        });
      const spin = { at: now(), result, title: prize.title, coupon, receipt };
      state.spins[key] = spin;
      return spin;
    });
  },
  enroll(id, slot) {
    return write((state) => {
      allowed(state, "join");
      const course = find(LEARNING, id);
      guardTeen(state, course.minAge);
      if (!course.slots.includes(slot)) fail("سانس معتبر را انتخاب کنید.");
      if (state.enrollments[id]) fail("برای این دوره قبلاً ثبت‌نام کرده‌اید.");
      const receipt = uid("A");
      const record = {
        id,
        slot,
        receipt,
        at: now(),
        attendance: [],
      };
      state.enrollments[id] = record;
      return record;
    });
  },
  attendance(id, session) {
    return write((state) => {
      allowed(state, "attendance");
      const entry = state.enrollments[id];
      if (!entry || ![1, 2, 3].includes(session))
        fail("ثبت‌نام و جلسه را بررسی کنید.");
      if (!entry.attendance.includes(session)) entry.attendance.push(session);
    });
  },
  scholarship(id, text) {
    return write((state) => {
      allowed(state, "join");
      find(LEARNING, id);
      if (text.trim().length < 8) fail("توضیح کوتاهی دربارهٔ درخواست بنویسید.");
      state.scholarships[id] = { id: uid("S"), text: text.trim(), at: now() };
      return state.scholarships[id];
    });
  },
  cart(id, delta) {
    return write((state) => {
      if (!productById(id)) fail("محصول یافت نشد.");
      const quantity = Math.min(9, Math.max(0, (state.cart[id] || 0) + delta));
      if (quantity) state.cart[id] = quantity;
      else delete state.cart[id];
    });
  },
  order() {
    return write((state) => {
      allowed(state, "join");
      if (!Object.keys(state.cart).length) fail("سبد خرید خالی است.");
      const id = uid("C");
      const entry = {
        id,
        items: state.cart,
        at: now(),
      };
      state.orders.unshift(entry);
      state.cart = {};
      return entry;
    });
  },
  book(id) {
    return write((state) => {
      allowed(state, "join");
      find(CALENDAR, id);
      if (state.bookings[id]) fail("این برنامه پیش‌تر رزرو شده است.");
      state.bookings[id] = { receipt: uid("E"), at: now() };
      return state.bookings[id];
    });
  },
  team(id, on) {
    return write((state) => {
      allowed(state, "join");
      if (on) guardTeen(state);
      state.teams = on
        ? [...new Set([...state.teams, id])]
        : state.teams.filter((key) => key !== id);
    });
  },
  ticket(text) {
    return write((state) => {
      if (text.trim().length < 8)
        fail("لطفاً درخواست را با جزئیات بیشتری بنویسید.");
      const entry = { id: uid("T"), text: text.trim(), at: now() };
      state.tickets.unshift(entry);
      return entry;
    });
  },
  waste(id, kg) {
    return write((state) => {
      allowed(state, "pos");
      const item = find(WASTE_RATES, id);
      if (!Number.isFinite(kg) || kg <= 0 || kg > 50)
        fail("وزن معتبر بین صفر و ۵۰ کیلوگرم وارد کنید.");
      const code = uid("W");
      state.wasteKg += kg;
      tx(state, "xp", Math.floor(item.xp * kg), "تحویل " + item.name, code);
      tx(
        state,
        "credit",
        Math.floor(item.rate * kg),
        "تحویل " + item.name,
        code,
      );
      return code;
    });
  },
  vote(id) {
    return write((state) => {
      allowed(state, "join");
      if (state.votes[id]) fail("پیشنهاد شما قبلاً ثبت شده است.");
      state.votes[id] = true;
    });
  },
  alley(id, note) {
    return write((state) => {
      allowed(state, "city");
      state.approvedAlley[id] = { note: note.trim(), at: now() };
    });
  },
  opinion(id, text) {
    return write((state) => {
      allowed(state, "join");
      if (text.trim().length < 5) fail("نظر خود را کامل کنید.");
      state.projectOpinions[id] = { text: text.trim(), at: now() };
    });
  },
  notice(id) {
    return write((state) => {
      state.notices = [...new Set([...state.notices, id])];
    });
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
