import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify, truncate } from "../src/naive/text.js";

test("slugify", () => {
  assert.equal(slugify("Xin chào Thế Giới!"), "xin-chao-the-gioi");
});

test("truncate: short text returned unchanged", () => {
  assert.equal(truncate("abc", 3), "abc");
  assert.equal(truncate("abc", 10), "abc");
  assert.equal(truncate("", 1), "");
});

test("truncate: long text -> max-1 code points + ellipsis, exactly max", () => {
  assert.equal(truncate("abcdef", 4), "abc…");
  assert.equal(truncate("abc", 1), "…");
  assert.equal(Array.from(truncate("abcdef", 4)).length, 4);
});

test("truncate: counts code points, never splits surrogate pairs", () => {
  assert.equal(truncate("😀😀😀", 3), "😀😀😀");
  assert.equal(truncate("😀😀😀😀", 3), "😀😀…");
  assert.equal(truncate("a😀b😀c", 3), "a😀…");
  assert.equal(Array.from(truncate("😀😀😀😀", 3)).length, 3);
});

test("truncate: invalid max throws RangeError", () => {
  for (const bad of [0, -1, 1.5, NaN, Infinity, "3", null, undefined]) {
    assert.throws(() => truncate("abc", bad), RangeError);
  }
});
