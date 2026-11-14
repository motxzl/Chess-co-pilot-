import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../private/chess-copilot.html", import.meta.url), "utf8");
const inlineScripts = [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)]
  .map((match) => match[1].trim())
  .filter(Boolean);

if (inlineScripts.length !== 1) {
  throw new Error(`Expected exactly one inline engine script, found ${inlineScripts.length}`);
}

new Function(inlineScripts[0]);
console.log("Chess engine inline JavaScript syntax: OK");
