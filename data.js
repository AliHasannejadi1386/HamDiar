// داده‌های نمایشی هم‌دیار — همه اعداد «نمونه/فرض» هستند، نه آمار واقعی.

export const LEVELS = [
  { name: "آشنای محله", xp: 0, icon: "🌱" },
  { name: "همراه محله", xp: 200, icon: "🤝" },
  { name: "همیار محله", xp: 600, icon: "⭐" },
  { name: "سفیر محله", xp: 1500, icon: "🏅", note: "به‌علاوه تأیید مربی" },
  { name: "راهبر محله", xp: 3000, icon: "👑", note: "به‌علاوه دوره پیشرفته" },
];

export const AREAS = [
  "میدان معلم",
  "ولیعصر شمالی",
  "ولیعصر جنوبی",
  "یافت‌آباد",
  "تختی",
];

export const ALLEYS = [
  {
    id: "yas",
    name: "کوچه یاس",
    area: "ولیعصر شمالی",
    points: 1640,
    goal: {
      title: "روشنایی بیشتر",
      desc: "نصب چراغ‌های جدید و رفع نقاط تاریک",
      target: 2500,
    },
  },
  {
    id: "maryam",
    name: "کوچه مریم",
    area: "ولیعصر جنوبی",
    points: 2210,
    goal: {
      title: "نیمکت و سایه‌بان",
      desc: "نیمکت برای سالمندان سر کوچه",
      target: 2500,
    },
  },
  {
    id: "laleh",
    name: "کوچه لاله",
    area: "یافت‌آباد",
    points: 1180,
    goal: { title: "مخزن تفکیک", desc: "دو مخزن خشک و تر مجزا", target: 2000 },
  },
  {
    id: "baran",
    name: "کوچه باران",
    area: "میدان معلم",
    points: 1960,
    goal: {
      title: "پیاده‌رو امن",
      desc: "ترمیم پیاده‌رو مسیر مدرسه",
      target: 3000,
    },
  },
  {
    id: "takhti7",
    name: "کوچه تختی ۷",
    area: "تختی",
    points: 870,
    goal: {
      title: "دیوارنگاره",
      desc: "دیوارنگاره با نوجوانان محله",
      target: 1800,
    },
  },
  {
    id: "golha",
    name: "کوچه گل‌ها",
    area: "ولیعصر شمالی",
    points: 1420,
    goal: { title: "سبزکاری", desc: "باغچه و درخت‌کاری کوچه", target: 2200 },
  },
];

// type: نوع تعامل؛ teen: فقط پنل نوجوان؛ verify: روش تأیید؛ credit به تومان (از بودجه سقف‌دار)
export const MISSIONS = [
  {
    id: "poll-light",
    type: "poll",
    cat: "نظرسنجی",
    icon: "💡",
    title: "نظرسنجی یک‌دقیقه‌ای روشنایی",
    min: 1,
    xp: 20,
    credit: 2000,
    goal: "بفهمیم کدام نقطه کوچه تاریک‌تر است.",
    verify: "خودکار",
    safety: "بدون خطر",
    fund: "قرارداد پایش شهرداری",
  },
  {
    id: "quiz-waste",
    type: "quiz",
    cat: "یادگیری",
    icon: "♻️",
    title: "آموزش ۳ دقیقه‌ای تفکیک از مبدأ",
    min: 3,
    xp: 50,
    credit: 0,
    goal: "یاد بگیریم چه چیزی خشک است و چه چیزی تر.",
    verify: "پاسخ درست به پرسش‌ها",
    safety: "بدون خطر",
  },
  {
    id: "report-issue",
    type: "report",
    cat: "گزارش",
    icon: "📍",
    title: "گزارش یک مشکل در مسیر",
    min: 3,
    xp: 40,
    credit: 0,
    goal: "مشکل را دقیق ثبت کنیم تا به شهرداری برسد.",
    verify: "تأیید مستقل همسایه یا مربی",
    safety: "از پیاده‌رو، در روز",
    note: "امتیاز بعد از تأیید داده می‌شود؛ برای تعداد شکایت امتیاز نمی‌دهیم.",
  },
  {
    id: "confirm-issue",
    type: "confirm",
    cat: "گزارش",
    icon: "🔎",
    title: "تأیید مستقل گزارش همسایه",
    min: 2,
    xp: 30,
    credit: 0,
    goal: "جلوی گزارش تکراری و ساختگی را بگیریم.",
    verify: "نمونه‌برداری تصادفی پاتوق",
    safety: "فقط نزدیک خانه خودتان",
  },
  {
    id: "waste-drop",
    type: "waste",
    cat: "محیط‌زیست",
    icon: "🛍️",
    title: "تحویل پسماند خشک در پاتوق",
    min: 10,
    xp: 0,
    credit: 0,
    xpNote: "بر اساس وزن",
    goal: "پسماند خشک کمتر به دفن برسد.",
    verify: "توزین در پاتوق بوستان قائم",
    safety: "بدون خطر",
    fund: "فروش مواد بازیافتی",
  },
  {
    id: "invite-family",
    type: "invite",
    cat: "کمک اجتماعی",
    icon: "👪",
    title: "دعوت یک خانوار با کد دعوت",
    min: 5,
    xp: 60,
    credit: 0,
    goal: "هر نوجوان فعال، ده خانوار.",
    verify: "ثبت‌نام و نخستین ماموریت خانوار",
    safety: "فقط آشنایان",
  },
  {
    id: "event-meet",
    type: "checkin",
    cat: "رویداد حضوری",
    icon: "🗣️",
    title: "حضور در جلسه هم‌اندیشی کوچه",
    min: 60,
    xp: 80,
    credit: 0,
    goal: "خواسته‌های کوچه را با هم اولویت‌بندی کنیم.",
    verify: "ثبت حضور در میز خدمت",
    safety: "در پاتوق",
  },
  {
    id: "teen-map",
    type: "checkin",
    teen: true,
    team: true,
    cat: "محیط‌زیست",
    icon: "🗺️",
    title: "نقشه‌برداری نیمکت و چراغ‌های بوستان قائم",
    min: 40,
    xp: 120,
    credit: 40000,
    goal: "وضعیت امکانات عمومی را ثبت کنیم.",
    verify: "مربی در محل",
    safety: "گروهی، روز، با مربی",
    fund: "اعتبار آموزشی پاتوق",
  },
  {
    id: "teen-elder",
    type: "checkin",
    teen: true,
    team: true,
    cat: "کمک اجتماعی",
    icon: "👵",
    title: "گفت‌وگو با یک سالمند در میز خدمت",
    min: 30,
    xp: 100,
    credit: 30000,
    goal: "صدای کسانی که گوشی ندارند هم شنیده شود.",
    verify: "مربی و فرم کاغذی",
    safety: "فقط در پاتوق، با مربی",
    fund: "قرارداد پایش شهرداری",
  },
  {
    id: "teen-water",
    type: "checkin",
    teen: true,
    team: true,
    cat: "محیط‌زیست",
    icon: "💧",
    title: "پایش شیرهای آب بوستان",
    min: 30,
    xp: 90,
    credit: 25000,
    goal: "نشتی‌ها زود پیدا شوند.",
    verify: "عکس و تأیید مربی",
    safety: "گروهی، روز، با مربی",
    fund: "صرفه‌جویی نگهداشت",
  },
];

export const POLL = {
  id: "poll-light",
  questions: [
    {
      q: "شب‌ها در کوچه چقدر احساس امنیت می‌کنید؟",
      opts: ["خیلی کم", "کم", "متوسط", "خوب", "عالی"],
    },
    {
      q: "کدام نقطه تاریک‌تر است؟",
      opts: ["سر کوچه", "وسط کوچه", "انتهای کوچه", "نزدیک پارک"],
    },
    {
      q: "از رسیدگی شهرداری به روشنایی راضی هستید؟",
      opts: ["ناراضی", "تا حدی", "راضی"],
    },
  ],
};

export const QUIZ = [
  { q: "بطری نوشابه پلاستیکی کدام است؟", opts: ["خشک", "تر"], a: 0 },
  { q: "پوست میوه کدام است؟", opts: ["خشک", "تر"], a: 1 },
  {
    q: "کارتن پیتزا آلوده به روغن؟",
    opts: ["خشک (کاغذ)", "تر / زباله عادی"],
    a: 1,
  },
  { q: "قوطی کنسرو شسته‌شده؟", opts: ["خشک", "تر"], a: 0 },
];

export const REPORT_CATS = [
  { id: "incident", icon: "⚠️", name: "حادثه و خطر شهری" },
  { id: "light", icon: "💡", name: "روشنایی" },
  { id: "waste", icon: "🗑️", name: "پسماند و مخزن" },
  { id: "walk", icon: "🚶", name: "پیاده‌رو" },
  { id: "green", icon: "🌳", name: "فضای سبز" },
  { id: "safety", icon: "⚠️", name: "ایمنی" },
  { id: "other", icon: "📝", name: "سایر" },
];

export const CLEAN_PARK = {
  id: "clean-ghaem",
  title: "جمع‌کردن زباله در پارک قائم",
  goal: "با گروه محله، زباله‌های معمولی را در مسیرهای بوستان قائم جمع و تفکیک کنید.",
  cat: "محیط‌زیست",
  type: "checkin",
  min: 30,
  xp: 80,
  credit: 0,
  safety: "در روشنایی روز و همراه گروه. به اشیای تیز یا ناشناخته دست نزنید.",
  verify: "بررسی شرح فعالیت در پنل شهرداری یا پاتوق",
  ends: "2026-12-04",
};

export const CULTURAL_PRIZES = [
  { id: "tea", label: "چای", title: "یک چای مهمان کافهٔ فرهنگی" },
  { id: "workshop", label: "تخفیف", title: "تخفیف یک کارگاه فرهنگی" },
  { id: "game", label: "بازی", title: "یک نوبت بازی رومیزی در پاتوق" },
  { id: "empty-1", label: "پوچ", title: "این بار پوچ شد", empty: true },
  { id: "book", label: "کتاب", title: "یک نوبت امانت کتاب یا بازی فکری" },
  { id: "empty-2", label: "پوچ", title: "این بار پوچ شد", empty: true },
];

export const REPORT_STEPS = [
  "ثبت شد",
  "تأیید مستقل",
  "ارجاع به شهرداری",
  "در حال اقدام",
  "انجام شد",
];

// پاداش‌ها: هر کدام منبع درآمد مشخص دارند (قانون طرح: بدون پاداش بی‌پشتوانه)
export const REWARDS = [
  {
    id: "cafe",
    icon: "☕",
    title: "۲۰٪ تخفیف کافه پاتوق",
    cost: 15000,
    fund: "درآمد کافه پاتوق",
  },
  {
    id: "course",
    icon: "💻",
    title: "تخفیف دوره برنامه‌نویسی",
    cost: 400000,
    fund: "درآمد آموزش مرکز",
    teen: true,
  },
  {
    id: "bakery",
    icon: "🥖",
    title: "تخفیف نانوایی برکت",
    cost: 20000,
    fund: "حامی محلی",
  },
  {
    id: "book",
    icon: "📚",
    title: "کتاب یا بازی فکری",
    cost: 60000,
    fund: "فروش محصولات فرهنگی",
  },
  {
    id: "family",
    icon: "🎡",
    title: "بلیت برنامه خانوادگی جمعه",
    cost: 50000,
    fund: "حامی کمپین",
  },
];

export const COURSES = [
  {
    id: "py",
    title: "برنامه‌نویسی پایتون",
    price: 2000000,
    tag: "تخفیف‌دار",
    icon: "🐍",
  },
  {
    id: "design",
    title: "طراحی و تصویرسازی",
    price: 1500000,
    tag: "یارانه‌ای",
    icon: "🎨",
  },
  {
    id: "tech",
    title: "مهارت‌های فنی و تعمیرات",
    price: 1200000,
    tag: "یارانه‌ای",
    icon: "🔧",
  },
  {
    id: "survey",
    title: "پرسشگری و نقشه‌برداری محله",
    price: 0,
    tag: "رایگان",
    icon: "📋",
    required: true,
  },
];

export const EVENTS = [
  {
    title: "شب بازی فکری خانوادگی",
    when: "پنج‌شنبه ۱۸:۰۰",
    where: "پاتوق بوستان قائم",
    icon: "🎲",
  },
  {
    title: "جلسه هم‌اندیشی کوچه یاس",
    when: "شنبه ۱۷:۳۰",
    where: "میز خدمت محله",
    icon: "🗣️",
  },
  {
    title: "جشن پایان فصل لیگ کوچه‌ها",
    when: "جمعه آخر آذر",
    where: "بوستان قائم",
    icon: "🏆",
  },
];

export const REQUESTS = [
  {
    id: "r1",
    alley: "maryam",
    title: "نیمکت و سایه‌بان سر کوچه",
    votes: 2210,
    status: "committed",
  },
  {
    id: "r2",
    alley: "baran",
    title: "ترمیم پیاده‌رو مسیر مدرسه",
    votes: 1960,
    status: "queue",
  },
  {
    id: "r3",
    alley: "yas",
    title: "نصب ۶ چراغ جدید",
    votes: 1640,
    status: "queue",
  },
  {
    id: "r4",
    alley: "golha",
    title: "باغچه و درخت‌کاری",
    votes: 1420,
    status: "queue",
  },
  {
    id: "r5",
    alley: "laleh",
    title: "دو مخزن تفکیک",
    votes: 1180,
    status: "queue",
  },
  {
    id: "r6",
    alley: "takhti7",
    title: "دیوارنگاره با نوجوانان",
    votes: 870,
    status: "queue",
  },
];

export const SEED_REPORTS = [
  {
    id: "p1",
    cat: "light",
    text: "دو تیر برق انتهای کوچه خاموش است",
    area: "ولیعصر شمالی",
    step: 3,
    days: 6,
    mine: false,
  },
  {
    id: "p2",
    cat: "waste",
    text: "مخزن سر خیابان هر شب سرریز می‌شود",
    area: "یافت‌آباد",
    step: 2,
    days: 4,
    mine: false,
  },
  {
    id: "p3",
    cat: "walk",
    text: "چاله بزرگ در پیاده‌رو مسیر مدرسه",
    area: "میدان معلم",
    step: 1,
    days: 2,
    mine: false,
  },
  {
    id: "p4",
    cat: "green",
    text: "شیر آب بوستان نشتی دارد",
    area: "ولیعصر جنوبی",
    step: 4,
    days: 12,
    mine: false,
  },
  {
    id: "p5",
    cat: "safety",
    text: "درپوش جوی آب شکسته است",
    area: "تختی",
    step: 0,
    days: 1,
    mine: false,
  },
];

// نرخ نمونه اعتبار پسماند خشک (تومان/کیلو) — از محل فروش مواد بازیافتی؛ باید با قرارداد واقعی تنظیم شود
export const WASTE_RATES = [
  { id: "paper", name: "کاغذ و مقوا", icon: "📦", rate: 3000, xp: 8 },
  { id: "plastic", name: "پلاستیک و بطری", icon: "🧴", rate: 5000, xp: 10 },
  { id: "metal", name: "فلز و قوطی", icon: "🥫", rate: 8000, xp: 12 },
  { id: "glass", name: "شیشه", icon: "🍾", rate: 1500, xp: 6 },
];

// روند رضایت (درصد) — سناریوی پیشنهادی ۵۵ → ۶۵ در سال اول؛ ماه‌های اول «سنجیده‌شده نمایشی»
export const SATISFACTION = [
  55, 55.5, 56.4, 57.1, 58.0, 58.8, 59.9, 60.8, 61.9, 62.9, 64.0, 65.0,
];
export const MONTHS = [
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
];

export const BADGES = [
  { id: "first", icon: "🚀", name: "اولین قدم", test: (s) => s.doneCount >= 1 },
  { id: "green", icon: "♻️", name: "دوست زمین", test: (s) => s.wasteKg >= 3 },
  { id: "eye", icon: "👁️", name: "چشم محله", test: (s) => s.reports >= 1 },
  { id: "voice", icon: "📣", name: "صدای کوچه", test: (s) => s.polls >= 1 },
  {
    id: "five",
    icon: "🔥",
    name: "پنج ماموریت",
    test: (s) => s.doneCount >= 5,
  },
  { id: "helper", icon: "🤝", name: "همیار", test: (s) => s.xp >= 600 },
];

export const MISSION_ART = {
  "quiz-waste": {
    icon: "recycle",
    img: "zero-cleanup.webp",
    title: "محلهٔ پاک، زمین سبز",
  },
  "poll-light": {
    icon: "bulb",
    tone: "sun",
    img: "alley-after.jpg",
    title: "چراغ‌های کوچه",
  },
  "event-meet": {
    icon: "team",
    img: "workshop.jpg",
    title: "دورهمی همسایه‌ها",
  },
  "clean-ghaem": { icon: "recycle", tone: "sun", img: "zero-cleanup.webp" },
  "waste-drop": { icon: "recycle", tone: "blue", title: "تحویل پسماند خشک" },
  "confirm-issue": { icon: "check", tone: "violet" },
  "report-issue": { icon: "pin", tone: "coral", title: "گزارش یک مشکل" },
  "invite-family": { icon: "team", tone: "sun", title: "یک همسایهٔ تازه" },
  "teen-map": { icon: "map", tone: "blue" },
  "teen-elder": { icon: "voice", tone: "violet" },
  "teen-water": { icon: "leaf", tone: "blue" },
  plant: { icon: "leaf", tone: "sun" },
  library: { icon: "book", tone: "violet" },
};
export const EXTRA_MISSIONS = [
  {
    id: "plant",
    type: "checkin",
    cat: "محیط‌زیست",
    title: "رسیدگی به باغچهٔ کوچه",
    goal: "در یک نوبت گروهی، وضعیت باغچه‌های عمومی را ثبت کنید.",
    verify: "تأیید تسهیلگر",
    safety: "در روز، در فضای عمومی",
    min: 25,
    xp: 45,
    credit: 0,
  },
  {
    id: "library",
    type: "checkin",
    cat: "کمک اجتماعی",
    title: "یک کتاب برای قفسهٔ محله",
    goal: "کتاب مناسب را به قفسهٔ اشتراکی پاتوق بسپارید.",
    verify: "تأیید مسئول پاتوق",
    safety: "در پاتوق و ساعات فعالیت",
    min: 15,
    xp: 35,
    credit: 0,
  },
];
const expand = (items, prefix) =>
  items.map(([title, price, cat], index) => ({
    id: prefix + (index + 1),
    title,
    price,
    cat,
  }));
export const PRODUCTS = expand(
  [
    ["چای تازه‌دم", 32000, "نوشیدنی گرم"],
    ["دمنوش به‌لیمو", 48000, "نوشیدنی گرم"],
    ["قهوهٔ دمی", 75000, "نوشیدنی گرم"],
    ["لاته", 85000, "نوشیدنی گرم"],
    ["شیرکاکائو", 56000, "نوشیدنی گرم"],
    ["شربت بیدمشک", 48000, "نوشیدنی سرد"],
    ["آب‌لیموی تازه", 55000, "نوشیدنی سرد"],
    ["آیس‌لاته", 92000, "نوشیدنی سرد"],
    ["شربت خاکشیر", 47000, "نوشیدنی سرد"],
    ["کیک هویج", 64000, "خوراکی"],
    ["کلوچهٔ گردویی", 29000, "خوراکی"],
    ["ساندویچ پنیر و سبزی", 79000, "خوراکی"],
    ["بشقاب عصرانه", 115000, "خوراکی"],
    ["کوکی شکلاتی", 35000, "خوراکی"],
    ["کیک شکلاتی", 72000, "خوراکی"],
  ],
  "c",
);
export const LEARNING = [
  ...COURSES,
  ...expand(
    [
      ["ساخت بازی ساده", 1750000, "فناوری"],
      ["عکاسی با موبایل", 950000, "هنر"],
      ["ساخت وسایل با چوب", 1300000, "مهارت عملی"],
      ["سواد دیجیتال خانواده", 590000, "فناوری"],
    ],
    "a",
  ),
].map((item, i) => ({
  ...item,
  teacher: ["نازنین نوری", "کیان رستمی", "مریم زمانی", "سارا احمدی"][i % 4],
  capacity: [12, 10, 14, 16][i % 4],
  img: i % 2 ? "workshop.jpg" : "skills.jpg",
  minAge: item.required ? 12 : 14,
  slots: ["شنبه ۱۶:۰۰", "چهارشنبه ۱۷:۰۰"],
}));
export const PRIZES = [
  ...REWARDS,
  ...[
    ["game", "بازی رومیزی در پاتوق", 12000, "درآمد کافه پاتوق"],
    ["tea", "چای مهمان پاتوق", 9000, "درآمد کافه پاتوق"],
    ["work", "تخفیف کارگاه هنر", 85000, "درآمد آموزش مرکز"],
    ["plant", "گلدان محله", 35000, "حامی محلی"],
    ["notebook", "دفتر طراحی", 40000, "بازارچه محلی"],
  ].map(([id, title, cost, fund]) => ({ id, title, cost, fund })),
];
export const CALENDAR = [
  ...EVENTS,
  { title: "جمعهٔ باغچه‌کاری", when: "جمعه ۱۰:۳۰", where: "بوستان قائم" },
  {
    title: "کارگاه والد و نوجوان",
    when: "دوشنبه ۱۷:۰۰",
    where: "پاتوق هم‌دیار",
  },
  { title: "عصر کتاب و قصه", when: "چهارشنبه ۱۶:۳۰", where: "کافه فرهنگی" },
].map((item, i) => ({
  ...item,
  id: "e" + (i + 1),
  capacity: 12 + i * 3,
  description: [
    "دورهمی خانوادگی با بازی‌های همکاری و رقابت دوستانه.",
    "دربارهٔ اولویت‌های کوچه گفت‌وگو می‌کنیم و پیشنهادها را ثبت می‌کنیم.",
    "نتیجهٔ کار گروهی محله را مرور می‌کنیم.",
    "کاشت فصلی و رسیدگی به فضای عمومی با همراهی مسئول پاتوق.",
    "آشنایی خانواده‌ها با مسیر ایمن مهارت و مشارکت نوجوان.",
    "یک ساعت قصه‌خوانی و تبادل کتاب برای خانواده‌ها.",
  ][i],
}));
export const PROJECTS = [
  {
    id: "light",
    title: "چراغ‌های کوچهٔ یاس",
    area: "ولیعصر شمالی",
    result: "روشنایی و مسیر پیادهٔ امن‌تر",
    before: "alley-before.jpg",
    after: "alley-after.jpg",
    status: "در مسیر اجرا",
  },
  {
    id: "field",
    title: "پاتوق فرهنگی بوستان قائم",
    area: "میدان معلم",
    result: "دورهمی و یادگیری گروهی در بوستان",
    before: "kiosk.jpg",
    after: "cafe.jpg",
    status: "پیشنهاد پایلوت",
  },
  {
    id: "bins",
    title: "تفکیک از خانه تا پاتوق",
    area: "یافت‌آباد",
    result: "ایستگاه تفکیک و آموزش خانوارها",
    before: "kiosk.jpg",
    after: "recycle.jpg",
    status: "در حال بررسی",
  },
  {
    id: "skills",
    title: "کارگاه مهارت نوجوانان",
    area: "ولیعصر جنوبی",
    result: "تمرین مهارت کنار مربی و استادکار",
    before: "skills.jpg",
    after: "workshop.jpg",
    status: "سناریوی آموزشی",
  },
  {
    id: "walk",
    title: "پیاده‌روی مسیر مدرسه",
    area: "تختی",
    result: "شناسایی و اولویت‌بندی موانع پیاده‌رو",
    before: "alley-before.jpg",
    after: "alley-after.jpg",
    status: "در صف بررسی",
  },
];
export const TEAMS = [
  ["green", "یاران سبز", "محیط‌زیست و تفکیک پسماند"],
  ["voice", "صدای کوچه", "گزارش مسئولانهٔ نیازهای محله"],
  ["art", "پنجرهٔ هنر", "کارهای هنری گروهی"],
  ["skill", "همراهان مهارت", "یادگیری با همراهی مربی"],
].map(([id, title, description]) => ({ id, title, description }));
export const MARKET = [
  { id: "m1", title: "دفتر دست‌ساز", price: 72000, img: "skills.jpg" },
  { id: "m2", title: "گلدان کوچک محله", price: 95000, img: "kiosk.jpg" },
  {
    id: "m3",
    title: "بستهٔ بازی خانوادگی",
    price: 145000,
    img: "workshop.jpg",
  },
];
export const ROLES = {
  guest: "مهمان",
  member: "شهروند",
  teen: "نوجوان سفیر",
  guardian: "سرپرست",
  senior: "عضو ارشد",
  coach: "مربی",
  cafe: "کارمند کافه",
  patok: "اپراتور پاتوق",
  admin: "مدیر مرکز",
  city: "شهرداری",
};
export const SAMPLE_NOTICES = [
  ["یک مأموریت کوتاه برای امروز", "missions"],
  ["نظرسنجی روشنایی کوچه", "missions/poll-light"],
  ["خبرهای کوچهٔ یاس", "neighborhood"],
  ["آموزش تفکیک پسماند", "missions/quiz-waste"],
  ["کارگاه مهارت نوجوانان", "academy"],
  ["رویدادهای پاتوق", "events"],
  ["پاداش‌های کافه فرهنگی", "cafe/offers"],
  ["چالش یاران سبز", "teams/green"],
  ["تغییرات واقعی محله", "impact"],
  ["وضعیت گزارش‌های شهری", "voice"],
  ["همسایه‌های تازه در لیگ کوچه‌ها", "league"],
  ["راهنمای اعتبار پاداش", "rewards/wallet"],
  ["دورهمی بازی خانوادگی", "events/e1"],
  ["محصولات محلی", "market"],
  ["دوره‌های شما", "academy/mine"],
  ["نشان‌های مشارکت", "profile/achievements"],
  ["دورهٔ پرسشگری محله", "academy/survey"],
  ["بازدید گرافیکی از پاتوق", "neighborhood"],
  ["جلسه هم‌اندیشی همسایه‌ها", "events/e2"],
  ["کمک هر خانوار به محلهٔ پاک", "missions/waste-drop"],
];
