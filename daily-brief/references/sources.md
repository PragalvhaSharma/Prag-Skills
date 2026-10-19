# Daily Brief sources

Each source in `scripts/collect.mjs` runs on its own with a timeout. When one fails, the
collector records `status: "unavailable"` with an `error` and a `fix`, and the brief
reports it under Data health.

| Source | Where it comes from | Needs |
|---|---|---|
| calendar | Google Calendar `primary`, today through the next 2 days, via `gws calendar` | `gws` signed in |
| school | Ivey Canvas calendar feed (.ics), next 14 days: classes, deadlines, exams | Feed link saved in `~/.config/daily-brief/canvas-ics-url` |
| gmail | Unread from the last 2 days, excluding Promotions, Social and Forums, via `gws gmail +triage` | `gws` signed in |
| imessage | `imsg chats` and `imsg history` for chats active in the window | Full Disk Access for the host app |
| whatsapp | `wacli sync --once` then `wacli messages list` | WhatsApp linked to `wacli` |
| whoop | Syncs 14 days into `~/.local/share/whoop-daily`, then the stats from `whoop-analysis.mjs` | WHOOP tokens in that directory |
| portfolio | Latest Wealthsimple holdings CSV in PragsFinances, priced with live Yahoo quotes | A recent holdings export |

## One-time setup and fixes

**Canvas feed.** In Canvas (ivey.instructure.com) open Calendar, click *Calendar Feed*, copy
the link, and save it:

    mkdir -p ~/.config/daily-brief && pbpaste > ~/.config/daily-brief/canvas-ics-url && chmod 600 ~/.config/daily-brief/canvas-ics-url

The link carries a private key, so it lives outside this skill and outside git. Western's
Brightspace courses (CS3307) are not in this feed.

**iMessage.** macOS protects `~/Library/Messages/chat.db`. Grant Full Disk Access to
whatever runs the brief: *ChatGPT.app* for Codex, your terminal app for Claude Code
(System Settings > Privacy & Security > Full Disk Access), then restart that app.

**WhatsApp.** Run `wacli auth` and scan the QR code from WhatsApp > Linked devices, then
`wacli sync --once`. The collector only reads (`--read-only`) after a quiet sync.

**WHOOP.** Tokens rotate on every refresh and have exactly one home,
`~/.local/share/whoop-daily/whoop-tokens.json`. If the sync fails with an auth error, run
`npm run whoop:auth` in `~/Documents/ChatGPT/PragsFinances`. A one-off HTTP 500 from
WHOOP is usually transient; the brief still uses the last synced data and marks it stale
after 2 days.

**Portfolio.** Quantities come from the newest `wealthsimple-holdings-*.csv` in
`~/Documents/ChatGPT/PragsFinances/imports/raw/wealthsimple/`. Prices are live, so daily
moves are right for positions he still holds, but buys and sells since the export are
missing. The collector marks the source stale when the export is older than 14 days.
Totals are per currency and never converted.

## Optional config

`~/.config/daily-brief/config.json` can override paths:

    { "whoopRuntime": "...", "whoopContext": "...", "finances": "..." }

