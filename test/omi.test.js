import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify, truncate } from "../src/omi/text.js";

test("slugify", () => {
  assert.equal(slugify("Xin chào Thế Giới!"), "xin-chao-the-gioi");
});

test("truncate returns text unchanged when within max", () => {
  assert.equal(truncate("abc", 3), "abc");
  assert.equal(truncate("", 1), "");
});

test("truncate cuts to max-1 code points plus ellipsis", () => {
  assert.equal(truncate("abcdef", 4), "abc…");
  assert.equal(truncate("abcdef", 1), "…");
});

test("truncate counts code points and never splits surrogate pairs", () => {
  assert.equal(truncate("😀😀😀", 3), "😀😀😀");
  assert.equal(truncate("😀😀😀😀", 3), "😀😀…");
  assert.equal(Array.from(truncate("😀😀😀😀", 3)).length, 3);
});

test("truncate throws RangeError for invalid max", () => {
  for (const m of [0, -1, 1.5, NaN, Infinity, "3", undefined]) {
    assert.throws(() => truncate("abc", m), RangeError);
  }
});
