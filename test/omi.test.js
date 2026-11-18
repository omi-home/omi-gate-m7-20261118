import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/omi/text.js";

test("slugify", () => {
  assert.equal(slugify("Xin chào Thế Giới!"), "xin-chao-the-gioi");
});
