// Calendar days are counted in Indian time, whatever timezone the server runs in.
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

// "2026-10-05"
export const istDay = (d = new Date()) => new Date(d.getTime() + IST_OFFSET).toISOString().slice(0, 10);

// The last `n` days ending today, oldest first.
export const lastDays = (n, from = new Date()) =>
  Array.from({ length: n }, (_, i) => istDay(new Date(from.getTime() - (n - 1 - i) * 86400000)));

export const startOfIstDay = (day) => new Date(`${day}T00:00:00+05:30`);
export const endOfIstDay = (day) => new Date(`${day}T23:59:59.999+05:30`);
