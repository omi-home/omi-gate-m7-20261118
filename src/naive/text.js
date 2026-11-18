/** Lowercase, ASCII-only, words joined by "-". */
export function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate to `max` code points (incl. the "…"), never splitting surrogate pairs. */
export function truncate(text, max) {
  if (!Number.isInteger(max) || max < 1) throw new RangeError("max must be an integer >= 1");
  const cps = Array.from(text);
  return cps.length <= max ? text : cps.slice(0, max - 1).join("") + "…";
}
