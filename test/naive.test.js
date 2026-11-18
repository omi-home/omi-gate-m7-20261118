import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/naive/text.js";

test("slugify", () => {
  assert.equal(slugify("Xin chào Thế Giới!"), "xin-chao-the-gioi");
});
