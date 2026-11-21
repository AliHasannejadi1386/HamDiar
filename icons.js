const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  flag: '<path d="M5 22V3m0 1c4-4 9 3 15-1v12c-6 4-11-3-15 1"/>',
  coffee:
    '<path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zm14 1h2a3 3 0 0 1 0 6h-2M3 22h17M8 2v3m5-3v3"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13m0-13H8a2.5 2.5 0 1 1 2-4c1 1 2 4 2 4Zm0 0h4a2.5 2.5 0 1 0-2-4c-1 1-2 4-2 4Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z" fill="currentColor" stroke="none"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  pin: '<path d="M20 9c0 5-8 12-8 12S4 14 4 9a8 8 0 0 1 16 0Z"/><circle cx="12" cy="9" r="2.5"/>',
  leaf: '<path d="M5 19c0-9 11-10 15-15 2 8-1 14-8 15H5Zm-2 3c3-5 6-8 10-10"/>',
  school: '<path d="m2 9 10-5 10 5-10 5zM6 11v6c3 3 9 3 12 0v-6m4-2v7"/>',
  voice: '<path d="M3 5h18v12H9l-6 4Zm4 5h10m-10 3h6"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  next: '<path d="m14 6-6 6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="m12 2 8 3v7c0 5-4 8-8 10-4-2-8-5-8-10V5zm-4 10 3 3 5-6"/>',
  bulb: '<path d="M8 18h8m-7 3h6m-7-6c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7zm4-8v4"/>',
  recycle:
    '<path d="M8 6 10 2l4 1 4 7m-5 0h5V5m3 9 1 4-3 3h-8m3-4-3 4 3 2m-7-2H3l-1-4 4-7m2 5-2-5-4 2"/>',
  book: '<path d="M12 6C8 3 5 4 2 5v14c4-1 7-1 10 2 3-3 6-3 10-2V5c-3-1-6-2-10 1Zm0 0v15"/>',
  chart: '<path d="M3 3v18h18M8 16v-5m5 5V7m5 9v-7"/>',
  wallet:
    '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M21 10h-6a3 3 0 1 0 0 6h6m-5-3h.01"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  trophy:
    '<path d="M7 3h10v7a5 5 0 0 1-10 0Zm0 2H3v2a5 5 0 0 0 5 5m9-7h4v2a5 5 0 0 1-5 5m-4 3v5m-4 1h8"/>',
  team: '<circle cx="9" cy="7" r="3"/><path d="M2 20v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2m0-16a3 3 0 0 1 0 6m2 4a4 4 0 0 1 4 4v2"/>',
  cart: '<path d="M2 3h3l3 13h11l3-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
  tool: '<path d="M13 6a5 5 0 0 1 7-3l-3 3 1 3 3 1 2-3a5 5 0 0 1-7 6l-8 8a3 3 0 0 1-4-4l8-8a5 5 0 0 1 1-3Z"/>',
  map: '<path d="m3 5 6-2 6 3 6-2v16l-6 2-6-3-6 2Zm6-2v16m6-13v16"/>',
  sparkle:
    '<path d="M12 2c0 6 4 10 10 10-6 0-10 4-10 10 0-6-4-10-10-10 6 0 10-4 10-10Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  heart:
    '<path d="M20.8 8.6c0 4.4-8.8 9.7-8.8 9.7S3.2 13 3.2 8.6a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9Z"/>',
  plus: '<path d="M12 5v14m-7-7h14"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1m-7 8v3m-4 0h8"/>',
  trash: '<path d="M4 7h16m-10-3h4l1 3m3 0-1 13H7L6 7m4 3v7m4-7v7"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
};
export const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
