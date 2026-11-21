export const COMPANIONS = [
  {
    id: "robot",
    title: "ربات راهنما",
    role: "سرنخ‌ها را یادآوری می‌کند",
    icon: "sparkle",
    tip: "برای شروع، یک بازی کوتاه یا یک فصل داستان انتخاب کن.",
    mission: "مراحل را یکی‌یکی جلو برو و نتیجه را برای بررسی بفرست.",
    sort: "اول به جنس هر چیز نگاه کن. خشک و آلی دو دستهٔ این بازی‌اند.",
    lantern: "نشانهٔ هر چراغ را هم به خاطر بسپار، کنار رنگش.",
    match: "اگر حرکت بعدی را پیدا نکردی، روی «راهنمای حرکت» بزن.",
    pipes: "مسیر روشن را از پرچم دنبال کن. اولین قطعهٔ قطع‌شده را بچرخان.",
  },
  {
    id: "scout",
    title: "کاشف محله",
    role: "دوست مسیرها و نقشه‌ها",
    icon: "map",
    tip: "هر مسیر از یک انتخاب شروع می‌شود. نقشهٔ داستان آماده است.",
    mission: "قبل از شروع، مسیر و توضیح مأموریت را مرور کن.",
    sort: "مثل وقت نقشه‌خوانی دنبال نشانه بگرد. بطری خالی و پوست میوه مسیرهای متفاوت دارند.",
    lantern: "ترتیب را مثل یک مسیر ببین. اول، دوم، سوم.",
    match: "اگر یک هدف کامل شده، دنبال ردیف‌های دستهٔ دیگر بگرد.",
    pipes: "جهت خروجی هر قطعه باید به ورودی قطعهٔ بعدی برسد.",
  },
  {
    id: "storyteller",
    title: "قصه‌گوی گروه",
    role: "قصهٔ کارهای گروه را تعریف می‌کند",
    icon: "book",
    tip: "اگر دنبال قصه‌ای، پخش آزمایشی را باز کن یا چند صفحه بخوان.",
    mission: "وقتی کار تمام شد، یک توضیح کوتاه برای هم‌گروهی‌ها ثبت کن.",
    sort: "برای هر چیز یک داستان کوتاه بساز: این بطری قبلاً چه بوده و حالا کجا می‌رود؟",
    lantern:
      "اسم نشانه‌ها را پشت سر هم در ذهن بگو، انگار یک جملهٔ کوتاه می‌سازی.",
    match: "هم ردیف افقی حساب می‌شود، هم ردیف عمودی.",
    pipes: "می‌توانی مسیر را از سمت مخزن هم دنبال کنی.",
  },
  {
    id: "teammate",
    title: "هم‌تیمی سبز",
    role: "کار گروهی را ساده می‌کند",
    icon: "leaf",
    tip: "بیا اول سراغ بازی تفکیک برویم و بعد نگاهی به مأموریت پاک‌سازی بیندازیم.",
    mission:
      "کار را به قدم‌های کوچک تقسیم کن. وقتی یک مرحله تمام شد علامتش بزن.",
    sort: "چیزهای آلی مثل پوست میوه با کاغذ و فلز تمیز فرق دارند.",
    lantern:
      "هر بار فقط یک چراغ را دنبال کن و وقتی نوبت تو رسید از اول شروع کن.",
    match: "جابه‌جایی بدون ردیف، هیچ حرکتی از تو کم نمی‌کند.",
    pipes: "برای ادامه دادن، همان مسیر روشن از پاتوق کافی است.",
  },
];

export const ARCADE_GAMES = [
  {
    id: "match",
    title: "ردیف بازیافت",
    description: "پسماندها را ردیف کن و هدف‌های تر و خشک هر مرحله را پر کن.",
    image: "zero-cleanup.webp",
    icon: "recycle",
    rounds: 3,
    badge: "ردیف‌ساز سبز",
    target: 3,
  },
  {
    id: "pipes",
    title: "مسیر بازیافت",
    description: "قطعه‌ها را بچرخان و در سه مرحله راه پاتوق تا مخزن را بساز.",
    image: "neighborhood.webp",
    icon: "map",
    rounds: 3,
    badge: "مسیرساز محله",
    target: 3,
  },
  {
    id: "sort",
    title: "تفکیک در بوستان",
    description: "۶ چیز را در مخزن مناسب بگذار.",
    image: "zero-cleanup.webp",
    icon: "recycle",
    companion: "teammate",
    rounds: 6,
    badge: "یار بوستان",
    target: 5,
  },
  {
    id: "lantern",
    title: "حافظهٔ چراغ‌ها",
    description: "ترتیب چراغ‌های حیاط را در ۴ دور تکرار کن.",
    image: "zero-lanterns.webp",
    icon: "bulb",
    companion: "scout",
    rounds: 4,
    badge: "نگهبان چراغ‌ها",
    target: 3,
  },
];

export const SORT_ITEMS = [
  {
    label: "بطری پلاستیکی خالی",
    art: "🧴",
    bin: "dry",
    hint: "بطری پلاستیکی خالی در دستهٔ خشک است.",
  },
  {
    label: "پوست موز",
    art: "🍌",
    bin: "organic",
    hint: "پوست موز پسماند آلی است.",
  },
  {
    label: "روزنامهٔ خشک",
    art: "📰",
    bin: "dry",
    hint: "روزنامهٔ خشک در مخزن خشک قرار می‌گیرد.",
  },
  {
    label: "برگ خشک باغچه",
    art: "🍂",
    bin: "organic",
    hint: "برگ باغچه از مواد آلی است.",
  },
  {
    label: "قوطی فلزی تمیز",
    art: "🥫",
    bin: "dry",
    hint: "قوطی فلزی تمیز در دستهٔ خشک است.",
  },
  {
    label: "پوست پرتقال",
    art: "🍊",
    bin: "organic",
    hint: "پوست پرتقال پسماند آلی است.",
  },
];

export const LANTERN_PADS = [
  { id: "leaf", label: "برگ", icon: "leaf", color: "teal" },
  { id: "star", label: "ستاره", icon: "star", color: "amber" },
  { id: "sparkle", label: "درخشش", icon: "sparkle", color: "purple" },
  { id: "heart", label: "دل", icon: "heart", color: "coral" },
];

export const ZERO_EPISODE = [
  {
    image: "zero-team.webp",
    title: "قرارِ کنار فواره",
    speaker: "scout",
    text: "بچه‌ها، روی نقشه یک نقطه چشمک می‌زند. بیایید با هم ببینیم کجاست.",
  },
  {
    image: "zero-lanterns.webp",
    title: "چراغ‌هایی که حرف می‌زنند",
    speaker: "robot",
    text: "اول برگ، بعد ستاره! اگر ترتیب را یادمان بماند، راه باز می‌شود.",
  },
  {
    image: "zero-cleanup.webp",
    title: "نوبتِ تیم",
    speaker: "teammate",
    text: "من بطری‌ها را جمع می‌کنم. شما کمک کنید کاغذ و پوست میوه جدا بمانند.",
  },
  {
    image: "zero-team.webp",
    title: "حالا قصه‌اش را بگو",
    speaker: "storyteller",
    text: "قصهٔ امروز را کنار فواره تعریف می‌کنیم. شاید فردا یک نفر دیگر هم با ما بیاید.",
  },
];

export const ZERO_BOOK = [
  {
    image: "zero-team.webp",
    title: "نقشه‌ای زیر نیمکت",
    text: "کنار فواره، گوشهٔ یک کاغذ از زیر نیمکت بیرون زده بود. کاشف کاغذ را برداشت. روی آن چهار نشانه بود: برگ، ستاره، درخشش و دل.",
  },
  {
    image: "zero-lanterns.webp",
    title: "چهار نشانه، چهار چراغ",
    text: "با غروب آفتاب، چهار چراغ روشن شدند. ربات گفت: «اگر ترتیبشان را یاد بگیریم، می‌فهمیم کجای بوستان باید کنار هم جمع شویم.»",
  },
  {
    image: "zero-cleanup.webp",
    title: "گنجی که جا می‌ماند",
    text: "آخر مسیر صندوقی نبود. باغچه‌ای بود که به کمک نیاز داشت. گروه بطری‌ها و کاغذها را جدا کرد و در راه برگشت قصهٔ کارشان را برای همسایه‌ها گفت.",
  },
];

export const ZERO_PRODUCTS = [
  {
    id: "book",
    title: "کتاب تصویری «نقشه‌ای زیر نیمکت»",
    kind: "کتاب",
    description: "سه صفحهٔ نمونه با تصویر و متن داستان.",
    action: "خواندن نمونه",
    path: "zero/book",
    position: "book",
    icon: "book",
  },
  {
    id: "figure",
    title: "اکشن‌فیگور ربات راهنما",
    kind: "فیگور",
    description: "طرح مفهومی یک فیگور رومیزی با سر قابل حرکت و پایهٔ گرد.",
    action: "دیدن فیگور",
    path: "zero/store/figure",
    position: "figure",
    icon: "sparkle",
  },
  {
    id: "stickers",
    title: "برچسب‌های گروه زیرو",
    kind: "محصول جانبی",
    description:
      "نمونهٔ مجموعهٔ برچسب‌های چهار شخصیت؛ همراه با تصویر قابل دریافت.",
    action: "دیدن مجموعه",
    path: "zero/store/stickers",
    position: "stickers",
    icon: "gift",
  },
];

export const gameStars = (id, score) => {
  if (id === "match" || id === "pipes") return Math.max(0, Math.min(3, score));
  if (id === "sort")
    return score >= 6 ? 3 : score >= 4 ? 2 : score >= 2 ? 1 : 0;
  return score >= 4 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0;
};
