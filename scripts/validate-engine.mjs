import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../private/chess-copilot.html", import.meta.url), "utf8");
const start = html.indexOf("<script>");
const end = html.indexOf("</script>", start);

if (start < 0 || end < 0) throw new Error("Inline engine script not found");

const source = html.slice(start + "<script>".length, end);
new Function(source);
console.log("Chess engine inline JavaScript syntax: OK");
