const STORE = "attachments";
const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  gif: "image/gif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  aac: "audio/aac",
  opus: "audio/ogg",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  "3gp": "video/3gpp",
};
const LIMIT_MB = { image: 12, audio: 15, video: 40 };
let opening;
const openStore = () =>
  (opening ||= new Promise((resolve, reject) => {
    const request = indexedDB.open("hamdiyar-report-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      opening = null;
      reject(new Error("فضای ذخیرهٔ پیوست‌ها در دسترس نیست."));
    };
  }));
async function transact(mode, operation) {
  const db = await openStore();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    let request;
    tx.oncomplete = () => resolve(request?.result);
    tx.onerror = tx.onabort = () =>
      reject(new Error("ذخیرهٔ پیوست ممکن نشد. فایل کوچک‌تری انتخاب کنید."));
    request = operation(tx.objectStore(STORE));
  });
}

export async function storeReportFiles(files, idFor) {
  if (!files.length) return [];
  if (files.length > 3)
    throw new Error("برای هر گزارش حداکثر ۳ فایل انتخاب کنید.");
  if (files.reduce((sum, file) => sum + file.size, 0) > 55 * 1024 * 1024)
    throw new Error("حجم مجموع پیوست‌ها باید کمتر از ۵۵ مگابایت باشد.");
  const records = files.map((file) => {
    const type =
      file.type.split(";")[0] || MIME[file.name.split(".").pop().toLowerCase()];
    const kind = type?.split("/")[0];
    if (
      !Object.hasOwn(LIMIT_MB, kind) ||
      type === "image/svg+xml" ||
      !file.size
    )
      throw new Error("پیوست باید عکس، فایل صوتی یا ویدیو باشد.");
    if (file.size > LIMIT_MB[kind] * 1024 * 1024)
      throw new Error(
        "حجم یکی از فایل‌ها از سقف مجاز بیشتر است. عکس ۱۲، صدا ۱۵ و ویدیو ۴۰ مگابایت.",
      );
    return {
      id: idFor("media"),
      kind,
      name: file.name.slice(0, 100),
      blob: type === file.type ? file : file.slice(0, file.size, type),
    };
  });
  await transact("readwrite", (store) =>
    records.forEach(({ id, blob }) => store.add(blob, id)),
  );
  return records.map(({ blob, ...file }) => file);
}
export const readReportFile = (id) =>
  transact("readonly", (store) => store.get(id));
export const removeReportFiles = (entries) =>
  entries.length
    ? transact("readwrite", (store) =>
        entries.forEach(({ id }) => store.delete(id)),
      )
    : Promise.resolve();
export const clearReportFiles = () =>
  transact("readwrite", (store) => store.clear());

export const requestPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "موقعیت دستگاه در دسترس نیست. محل یا مختصات را دستی وارد کنید.",
        ),
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          lat: coords.latitude.toFixed(4),
          lon: coords.longitude.toFixed(4),
        });
      },
      (error) => {
        reject(
          new Error(
            error.code === 1
              ? "مجوز موقعیت داده نشد. محل یا مختصات را دستی وارد کنید."
              : "موقعیت پیدا نشد. محل یا مختصات را دستی وارد کنید.",
          ),
        );
      },
      { timeout: 10000, maximumAge: 20000, enableHighAccuracy: false },
    );
  });
