# Context Brain for Antigravity

A **Live Context Window Monitor** and **Portable Markdown Memory Vault** (MCP App plugin) for Google Antigravity.

- **Zero extra cost (0 tokens / 0 external APIs):** All token telemetry, charts, smart search, and UI localization run 100% locally.
- **Side Pane + Sidebar + Inline:** Openable anywhere inside Antigravity.
- **Bilingual UI (EN / TR):** English by default, with persistent one-click Turkish (`TR`) switching — including bilingual vault guides (`AGENTS.md` / `AGENTS.tr.md`).

---

## Features

### 1. Monitor
- **Real Token Telemetry:** Reads actual `input_tokens`, `cache_read_tokens`, and `output_tokens` directly from Antigravity conversation transcripts.
- **Cache / Uncached Progress Bar:** Live utilization percentage, inline context limit selector (`128K`–`2M`), cache hit rate, and remaining free tokens.
- **Dual-Line Timeline:** Green line for total context growth, blue line/area for cached tokens so cache misses stand out immediately.
- **Top Spikes (Interactive):** Real turn-to-turn context deltas (`+15.1K`) attributed to the exact tools and files; click any spike row to expand all tools executed in that turn.
- **Heaviest Steps & Category Breakdown:** Top 10 heaviest steps with clean plain-language summaries plus System / Tools / User / Model / Thinking breakdown.

### 2. Memory
All notes are stored as plain `.md` files in `~/Antigravity-Brain` (automatically created on first run; compatible with Claude Code, Codex, Cursor, Obsidian, and Git):
- **💾 Save Handoff (`sessions/`):** Save session outcome, open items, and next step to pick up seamlessly in a new conversation.
- **✅ Add Task (`tasks/`):** Cross-session to-do tracking with one-click completion toggle.
- **🧭 Decision (`decisions/`):** Record decisions and rationale so you can trace *why* later.
- **⚡ Capture (`inbox/`):** Quick-capture videos, articles, files, or notes into your inbox.
- **📦 Add Pack:** Bundle multiple local project files + reusable rules and attach their live contents to chat in one click (`📎 Attach Context` / `↗ Send`).
- **🔍 Smart Search & Open File:** Strips English/Turkish question filler words, ranks matches by relevance, and opens `.md` files directly in Antigravity's side pane.

### 3. Local Web App (Kanban Board & Cockpit)
Launch a full-screen local web dashboard (`127.0.0.1`, auto-closes after 30 min idle) with one click from the **`🌐 Web`** button inside Context Brain, or from your terminal even when Antigravity is closed:
```bash
npm run web
```
- **5-Column Kanban Board:** `INBOX` · `ACTIVE` · `WAITING` · `DONE` · `CANCELLED` (`GELEN` · `AKTİF` · `BEKLİYOR` · `BİTTİ` · `İPTAL`) with drag-and-drop and dropdown status switching.
- **Project / Conversation Filter:** Filter and create tasks per project or Antigravity conversation.
- **Cockpit, Memory & Smart Search:** View live token usage, browse Markdown notes, and search across your entire vault from the browser.

---

## Installation

**Requirement:** Node.js 18+

### Windows (PowerShell)
```powershell
git clone https://github.com/Welpon/antigravity-context-brain.git "$env:USERPROFILE\.gemini\config\plugins\context-brain"
cd "$env:USERPROFILE\.gemini\config\plugins\context-brain"
npm install
```

### macOS / Linux
```bash
git clone https://github.com/Welpon/antigravity-context-brain.git ~/.gemini/config/plugins/context-brain
cd ~/.gemini/config/plugins/context-brain && npm install
```

### Without Git (ZIP Download)
1. Click **Code → Download ZIP** on GitHub.
2. Extract into `~/.gemini/config/plugins/context-brain`.
3. Open a terminal in that folder and run `npm install`.

Antigravity discovers the plugin automatically. Open it from the **Side Pane (`+` → Context Brain)** or **Sidebar (Plugins → Context Brain)**.

### Custom Vault Location (Optional)
On first launch, the plugin automatically creates `~/Antigravity-Brain` (`sessions/`, `tasks/`, `decisions/`, `inbox/`, `AGENTS.md`, `AGENTS.tr.md`). Set the `ANTIGRAVITY_VAULT_DIR` environment variable to use a custom directory.

---

## Contributing
Pull requests and issues are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development and PR instructions.

## License
[MIT](LICENSE)
