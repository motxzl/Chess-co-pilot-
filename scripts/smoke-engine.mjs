import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const html = readFileSync(new URL("../private/chess-copilot.html", import.meta.url), "utf8");
const server = createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
});
await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelectorAll("#bd .sq").length === 64);
  await page.waitForFunction(() => /^Engine:/.test(document.querySelector("#st")?.textContent || "") && /Stockfish/.test(document.querySelector("#st")?.textContent || ""), { timeout: 30000 });

  await page.locator("#openBot").click();
  await page.locator("#botColor").selectOption("b");
  await page.locator("#botDifficulty").selectOption("beginner");
  await page.locator("#startBot").click();
  await page.waitForFunction(() => document.querySelectorAll("#hs .ch").length === 1, { timeout: 15000 });
  assert.equal(await page.locator("#bd .sq").count(), 64, "board must retain 64 squares");

  await page.locator("#mv").fill("e7e5");
  await page.locator("#mg").click();
  await page.waitForFunction(() => document.querySelectorAll("#hs .ch").length >= 3, { timeout: 15000 });
  await page.locator("#un").click();
  await page.waitForFunction(() => document.querySelectorAll("#hs .ch").length === 1, { timeout: 5000 });

  await page.locator("details.card summary").first().click();
  await page.locator('[data-side="both"]').click();
  await page.locator("#nw").click();
  await page.waitForFunction(() => document.querySelectorAll("#hs .ch").length === 0);

  await page.locator("#in").fill("7k/P7/8/8/8/8/8/7K w - - 0 1");
  await page.locator("#ld").click();
  await page.locator('[data-s="a7"]').click();
  await page.locator('[data-s="a8"]').click();
  await page.locator('#pm [data-p="q"]').click();
  assert.equal(await page.locator("#hs .ch").count(), 1, "promotion should be recorded");

  await page.locator("#in").fill("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
  await page.locator("#ld").click();
  await page.locator('[data-s="e1"]').click();
  await page.locator('[data-s="g1"]').click();
  assert.equal(await page.locator("#hs .ch").count(), 1, "castling should be recorded");

  await page.locator("#in").fill("8/8/8/3pP3/8/8/8/K6k w - d6 0 1");
  await page.locator("#ld").click();
  await page.locator('[data-s="e5"]').click();
  await page.locator('[data-s="d6"]').click();
  assert.equal(await page.locator("#hs .ch").count(), 1, "en passant should be recorded");

  assert.deepEqual(pageErrors, [], "browser should not report uncaught page errors");
  console.log("Browser smoke tests passed: board, Stockfish bot, undo, restart, promotion, castling, en passant.");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
