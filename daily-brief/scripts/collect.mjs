#!/usr/bin/env node
// Daily Brief collector. Pulls every source the brief needs and prints one JSON
// document. Each source is isolated: a failure becomes {status:"unavailable", error, fix}
// and never stops the others. Numbers are computed here so the model writing the brief
// only interprets them.
//
// Usage: node collect.mjs [--out FILE] [--only a,b] [--hours 24]
// Sources: calendar, school, gmail, imessage, whatsapp, whoop, portfolio
//
// Optional overrides live in ~/.config/daily-brief/config.json (see references/sources.md).

import { execFile } from "node:child_process";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HOME = homedir();
const CONFIG_DIR = path.join(HOME, ".config", "daily-brief");
const TZ = "America/Toronto";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf("--" + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const HOURS = Number(flag("hours", 24));
const ONLY = flag("only", "") ? flag("only", "").split(",") : null;
const OUT = flag("out", "");

let config = {};
try { config = JSON.parse(await readFile(path.join(CONFIG_DIR, "config.json"), "utf8")); } catch {}

const paths = {
  whoopRuntime: config.whoopRuntime ?? path.join(HOME, ".local/share/whoop-daily"),
  whoopContext: config.whoopContext ?? path.join(HOME, "Documents/ChatGPT/PragsFinances/config/whoop-context.md"),
  finances: config.finances ?? path.join(HOME, "Documents/ChatGPT/PragsFinances"),
  canvasFeedFile: path.join(CONFIG_DIR, "canvas-ics-url"),
};

const now = new Date();
const since = new Date(now.getTime() - HOURS * 3600e3);
const localDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
const localTime = (d) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(d);
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

function run(cmd, cmdArgs, { timeout = 60e3, cwd, env } = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, cmdArgs, { timeout, cwd, env: { ...process.env, ...env }, maxBuffer: 64 << 20 }, (err, stdout, stderr) => {
      if (err) {
        const full = (stderr || stdout || err.message).toString().trim();
        const msg = full.split("\n").slice(-6).join("\n");
        return reject(Object.assign(new Error(msg), { stdout, stderr, full }));
      }
      resolve(stdout.toString());
    });
  });
}
const json = (text) => JSON.parse(text.slice(text.search(/[[{]/)));
// imsg --json prints one JSON object per line. Always return a list, even for a
// single line, and fall back to one pretty-printed document if no line parses.
const jsonLines = (text) => {
  const out = [];
  for (const line of text.split("\n")) {
    const l = line.trim();
    if (!/^[[{]/.test(l)) continue;
    try { const v = JSON.parse(l); Array.isArray(v) ? out.push(...v) : out.push(v); } catch {}
  }
  if (out.length || !text.trim()) return out;
  const v = JSON.parse(text.slice(Math.max(0, text.search(/[[{]/))));
  return Array.isArray(v) ? v : v.chats ?? v.messages ?? [v];
};
const unavailable = (error, fix) => ({ status: "unavailable", error: String(error).slice(0, 600), fix });

// ---------------------------------------------------------------- calendar
async function calendar() {
  const start = new Date(localDay(now) + "T00:00:00");
  const end = new Date(start.getTime() + 3 * 864e5);
  const out = await run("gws", ["calendar", "events", "list", "--params", JSON.stringify({
    calendarId: "primary", timeMin: start.toISOString(), timeMax: end.toISOString(),
    singleEvents: true, orderBy: "startTime", maxResults: 100,
  })]);
  const items = (json(out).items ?? []).filter((e) => e.status !== "cancelled").map((e) => ({
    title: e.summary ?? "(no title)",
    start: e.start?.dateTime ?? e.start?.date,
    end: e.end?.dateTime ?? e.end?.date,
    allDay: !e.start?.dateTime,
    location: e.location,
  }));
  return { status: "ok", today: localDay(now), events: items };
}

// ---------------------------------------------------------------- school (Canvas feed)
function parseIcs(text) {
  const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") cur = {};
    else if (line === "END:VEVENT") { if (cur) events.push(cur); cur = null; }
    else if (cur) {
      const m = line.match(/^([A-Z-]+)((?:;[^:]*)?):(.*)$/);
      if (m) cur[m[1]] = { params: m[2], value: m[3].replace(/\\([,;\\])/g, "$1").replace(/\\n/gi, "\n") };
    }
  }
  return events;
}
function icsDate(field) {
  const v = field?.value ?? "";
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?$/);
  if (!m) return null;
  if (!m[4]) return { date: new Date(m[1] + "-" + m[2] + "-" + m[3] + "T23:59:00"), allDay: true };
  const iso = m[1] + "-" + m[2] + "-" + m[3] + "T" + m[4] + ":" + m[5] + ":" + m[6] + (m[7] ? "Z" : "");
  return { date: new Date(iso), allDay: false };
}
async function school() {
  let url;
  try { url = (await readFile(paths.canvasFeedFile, "utf8")).trim(); }
  catch { return unavailable("No Canvas feed link saved", "In Canvas open Calendar > Calendar Feed, copy the link, and save it to ~/.config/daily-brief/canvas-ics-url (chmod 600)."); }
  const res = await fetch(url, { signal: AbortSignal.timeout(30e3) });
  if (!res.ok) return unavailable("Canvas feed HTTP " + res.status, "The feed link may have been reset. Copy a fresh one from Canvas > Calendar > Calendar Feed.");
  const horizon = now.getTime() + 14 * 864e5;
  const items = [];
  for (const e of parseIcs(await res.text())) {
    const d = icsDate(e.DTSTART);
    if (!d || d.date.getTime() < now.getTime() - 6 * 3600e3 || d.date.getTime() > horizon) continue;
    const title = e.SUMMARY?.value ?? "";
    const course = (title.match(/\[([^\]]+)\]\s*$/) ?? [])[1] ?? "";
    const isClass = /\(Session \d+\)/.test(title);
    const isRoom = /^Breakout Room/i.test(title);
    items.push({
      kind: isClass ? "class" : isRoom ? "room-booking" : /deadline/i.test(title) ? "deadline" : /exam|midterm|final/i.test(title) ? "exam" : "deadline",
      title: title.replace(/\s*\[[^\]]+\]\s*$/, ""),
      course,
      when: d.allDay ? localDay(d.date) + " (all day / end of day)" : localTime(d.date),
      dueIso: d.date.toISOString(),
      daysAway: Math.round((d.date.getTime() - now.getTime()) / 864e5 * 10) / 10,
      url: e.URL?.value,
    });
  }
  items.sort((a, b) => a.dueIso.localeCompare(b.dueIso));
  return {
    status: "ok",
    source: "Canvas (Ivey) calendar feed, next 14 days",
    gaps: ["Western courses on Brightspace (e.g. CS3307) are not in this feed; check Gmail and the School repo for those."],
    items,
  };
}

// ---------------------------------------------------------------- gmail
async function gmail() {
  const query = "is:unread newer_than:2d -category:promotions -category:social -category:forums";
  const out = await run("gws", ["gmail", "+triage", "--query", query, "--max", "40", "--labels", "--format", "json"]);
  const data = json(out);
  const msgs = (Array.isArray(data) ? data : data.messages ?? []).map((m) => ({
    from: m.from, subject: m.subject, date: m.date, labels: m.labels, id: m.id,
  }));
  return { status: "ok", query, unreadCount: msgs.length, messages: msgs };
}

// ---------------------------------------------------------------- iMessage
async function imessage() {
  let chats;
  try { chats = jsonLines(await run("imsg", ["chats", "--limit", "40", "--json"])); }
  catch (e) {
    if (/Full Disk Access|authorization denied/i.test(e.full ?? e.message))
      return unavailable("macOS blocked access to the Messages database", "System Settings > Privacy & Security > Full Disk Access: enable it for the app running this brief (ChatGPT.app for Codex, your terminal for Claude Code), then restart that app.");
    throw e;
  }
  const list = Array.isArray(chats) ? chats : chats.chats ?? [];
  const recent = list.filter((c) => {
    const t = Date.parse(c.lastMessageAt ?? c.last_message_at ?? c.lastMessageDate ?? c.date ?? 0);
    return !Number.isFinite(t) || t >= since.getTime();
  }).slice(0, 25);
  const threads = [];
  for (const c of recent) {
    const id = c.id ?? c.rowid ?? c.chatId ?? c.chat_id;
    if (id == null) continue;
    try {
      const h = jsonLines(await run("imsg", ["history", "--chat-id", String(id), "--start", since.toISOString(), "--limit", "25", "--json"], { timeout: 20e3 }));
      const msgs = (Array.isArray(h) ? h : h.messages ?? []).map((m) => ({
        fromMe: m.isFromMe ?? m.is_from_me ?? m.fromMe, sender: m.sender ?? m.handle, text: (m.text ?? "").slice(0, 400), at: m.date ?? m.createdAt ?? m.created_at,
      }));
      if (msgs.length) threads.push({ chat: c.displayName ?? c.name ?? c.identifier ?? String(id), isGroup: c.isGroup ?? c.is_group, unread: c.unreadCount ?? c.unread_count, messages: msgs });
    } catch {}
  }
  return { status: "ok", windowHours: HOURS, threads };
}

// ---------------------------------------------------------------- WhatsApp
async function whatsapp() {
  const doctor = await run("wacli", ["doctor"], { timeout: 20e3 }).catch((e) => e.stdout?.toString() ?? e.message);
  if (/AUTHENTICATED\s+false/.test(doctor))
    return unavailable("WhatsApp is not linked to wacli on this Mac", "Run: wacli auth  (scan the QR in WhatsApp > Linked devices), then wacli sync --once.");
  await run("wacli", ["sync", "--once", "--idle-exit", "20s", "--presence-mode", "quiet"], { timeout: 120e3 }).catch(() => {});
  const data = json(await run("wacli", ["messages", "list", "--after", since.toISOString(), "--limit", "300", "--json", "--read-only"]));
  const list = Array.isArray(data) ? data : data.messages ?? [];
  const byChat = {};
  for (const m of list) {
    const chat = m.chatName ?? m.chat_name ?? m.chat ?? m.chatJid ?? "unknown";
    (byChat[chat] ??= []).push({ fromMe: m.fromMe ?? m.from_me, sender: m.senderName ?? m.sender_name ?? m.sender, text: (m.text ?? m.body ?? "").slice(0, 400), at: m.timestamp ?? m.time });
  }
  return { status: "ok", windowHours: HOURS, threads: Object.entries(byChat).map(([chat, messages]) => ({ chat, messages: messages.slice(0, 25) })) };
}

// ---------------------------------------------------------------- WHOOP
async function whoop() {
  let syncError = null;
  try {
    await run("node", ["scripts/sync-whoop.mjs", "--days", "14"], { cwd: paths.whoopRuntime, env: { WHOOP_MIRROR_DIR: "" }, timeout: 90e3 });
  } catch (e) { syncError = e.message; }
  const { buildBrief } = await import(pathToFileURL(path.join(paths.whoopRuntime, "scripts/whoop-analysis.mjs")).href);
  const data = JSON.parse(await readFile(path.join(paths.whoopRuntime, "data/whoop.json"), "utf8"));
  const brief = buildBrief(data);
  const newest = brief.mostRecentDay?.date;
  const staleDays = newest ? daysBetween(newest, localDay(now)) : null;
  return {
    status: staleDays != null && staleDays > 2 ? "stale" : "ok",
    syncError,
    fix: syncError ? "Re-authorise WHOOP: cd ~/Documents/ChatGPT/PragsFinances && npm run whoop:auth (tokens live in ~/.local/share/whoop-daily)." : undefined,
    newestDay: newest,
    staleDays,
    personalContextFile: paths.whoopContext,
    brief,
  };
}

// ---------------------------------------------------------------- portfolio
function parseCsv(text) {
  const rows = []; let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') q = false; else field += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
async function portfolio() {
  const dir = path.join(paths.finances, "imports/raw/wealthsimple");
  const files = (await readdir(dir)).filter((n) => /^wealthsimple-holdings-.*\.csv$/i.test(n)).sort();
  if (!files.length) return unavailable("No Wealthsimple holdings export found", "Export holdings from Wealthsimple into " + dir);
  const file = files.at(-1);
  const holdingsDate = (file.match(/(\d{4}-\d{2}-\d{2})/) ?? [])[1];
  const rows = parseCsv(await readFile(path.join(dir, file), "utf8")).filter((r) => r["Security Type"] !== "CURRENCY" && Number(r.Quantity) > 0);

  let symbolMap = {};
  try {
    const pj = JSON.parse(await readFile(path.join(paths.finances, "public/data/market/portfolio.json"), "utf8"));
    for (const q of pj.quotes ?? []) symbolMap[q.sourceSymbol] = q.yahooSymbol;
  } catch {}
  const suffix = { TSX: ".TO", TSXV: ".V", NEO: ".NE", CBOE: ".NE" };
  const yahoo = (r) => symbolMap[r.Symbol] ?? r.Symbol.replace(/\./g, "-") + (suffix[r.Exchange] ?? "");

  const positions = [];
  await Promise.all(rows.map(async (r) => {
    const sym = yahoo(r);
    const qty = Number(r.Quantity);
    try {
      const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(sym) + "?range=5d&interval=1d", {
        headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20e3),
      });
      const meta = (await res.json()).chart?.result?.[0]?.meta;
      if (!meta?.regularMarketPrice) throw new Error("no quote");
      const price = meta.regularMarketPrice, prev = meta.chartPreviousClose ?? meta.previousClose;
      const bookMarket = Number(r["Book Value (Market)"]) || null;
      positions.push({
        account: r["Account Name"], symbol: r.Symbol, name: r.Name, currency: meta.currency ?? r["Market Value Currency"], quantity: qty,
        price, prevClose: prev,
        dayChangePct: prev ? +(((price - prev) / prev) * 100).toFixed(2) : null,
        dayChangeValue: prev ? +((price - prev) * qty).toFixed(2) : null,
        marketValue: +(price * qty).toFixed(2),
        unrealizedPct: bookMarket ? +(((price * qty - bookMarket) / bookMarket) * 100).toFixed(1) : null,
        quoteTime: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
      });
    } catch (e) { positions.push({ account: r["Account Name"], symbol: r.Symbol, error: "quote failed (" + sym + "): " + e.message }); }
  }));

  const totals = {};
  for (const p of positions.filter((p) => p.marketValue != null)) {
    const t = (totals[p.currency] ??= { marketValue: 0, dayChangeValue: 0 });
    t.marketValue += p.marketValue; t.dayChangeValue += p.dayChangeValue ?? 0;
  }
  for (const t of Object.values(totals)) {
    t.dayChangePct = +((t.dayChangeValue / (t.marketValue - t.dayChangeValue)) * 100).toFixed(2);
    t.marketValue = +t.marketValue.toFixed(2); t.dayChangeValue = +t.dayChangeValue.toFixed(2);
  }
  const holdingsAgeDays = holdingsDate ? daysBetween(holdingsDate, localDay(now)) : null;
  const movers = positions.filter((p) => p.dayChangePct != null).sort((a, b) => Math.abs(b.dayChangePct) - Math.abs(a.dayChangePct));
  return {
    status: holdingsAgeDays > 14 ? "stale" : "ok",
    note: "Quantities come from the Wealthsimple export dated " + holdingsDate + " (" + holdingsAgeDays + " days old); prices are live Yahoo quotes, possibly delayed. Totals are per currency, never converted.",
    fix: holdingsAgeDays > 14 ? "Holdings export is old. Export a fresh holdings CSV from Wealthsimple into " + dir + " so new buys and sells are counted." : undefined,
    holdingsDate, holdingsAgeDays, totalsByCurrency: totals,
    biggestMovers: movers.slice(0, 5).map(({ symbol, name, dayChangePct, dayChangeValue, currency }) => ({ symbol, name, dayChangePct, dayChangeValue, currency })),
    positions,
  };
}

// ---------------------------------------------------------------- run
const SOURCES = { calendar, school, gmail, imessage, whatsapp, whoop, portfolio };
const selected = Object.keys(SOURCES).filter((k) => !ONLY || ONLY.includes(k));
const results = {};
await Promise.all(selected.map(async (name) => {
  const t0 = Date.now();
  try { results[name] = await SOURCES[name](); }
  catch (e) { results[name] = unavailable(e.message, "See references/sources.md for setup of " + name + "."); }
  results[name].ms = Date.now() - t0;
}));

const doc = {
  generatedAt: now.toISOString(),
  localNow: localTime(now),
  today: localDay(now),
  timezone: TZ,
  windowHours: HOURS,
  health: Object.fromEntries(selected.map((k) => [k, results[k].status])),
  sources: Object.fromEntries(selected.map((k) => [k, results[k]])),
};
const text = JSON.stringify(doc, null, 1);
if (OUT) { await writeFile(OUT, text); console.log("wrote " + OUT + "  " + JSON.stringify(doc.health)); }
else console.log(text);
