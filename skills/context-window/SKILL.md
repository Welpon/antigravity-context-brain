---
name: context-window
description: Monitor live Antigravity context window usage, token breakdown, cache hit rate, heaviest steps, and manage reusable Context Packs (notes and local files). Use when the user asks about token usage, context window capacity, why context is filling up, or wants to create/attach reusable context packs.
---

# Context Window Plugin Skill

This plugin provides an interactive MCP App UI (openable in the side pane, sidebar, or inline) and MCP tools to inspect real Antigravity conversation token telemetry and manage reusable Context Packs.

## Available Tools

All tools are exposed by the `context-window` MCP server (namespaced as `context-window_context-window`):

1. `open_context_window` — Opens the interactive Context Window UI panel (Monitor + Context Packs). Call this when the user asks to view, open, or inspect the context window panel visually.
   - Optional args: `conversation_id`, `tab` (`"monitor"` or `"packs"`), `context_limit`.
2. `get_context_usage` — Returns structured telemetry for the active (most recent) or specified conversation: real `input_tokens + cache_read_tokens`, cache hit rate, utilization percentage, category breakdown, turn-by-turn growth, and top 10 heaviest steps.
3. `list_conversations` — Lists recent Antigravity conversations with their latest token utilization.
4. `list_context_packs` — Lists saved Context Packs and their estimated token cost.
5. `save_context_pack` — Creates or updates a Context Pack (`name`, `description`, `notes`, `files`, `tags`, optional `id`).
6. `delete_context_pack` — Deletes a Context Pack by `id`.
7. `resolve_context_pack` — Reads a Context Pack's notes and current local file contents as ready-to-use context.
8. `list_vault` / `search_vault` / `read_vault_note` / `delete_vault_note` — Browse, search, read, and manage portable Markdown notes in `~/Antigravity-Beyin`.
9. `save_handoff` — Save session summary, open items, and next step to `oturumlar/` so a new session can pick up seamlessly.
10. `save_decision` — Record decisions and rationale in `kararlar/`.
11. `capture_resource` — Quick-capture a video, article, file, or note into `gelen-kutusu/`.
12. `save_task` / `toggle_task` — Create and complete cross-session tasks in `gorevler/`.

## Memory Vault Workflows

- **Tanışma / Profil ("Beni tanı"):** Ask the user 3–4 brief questions about their role, preferences, and active projects, then save their answers to the vault via `save_decision` or `save_handoff` so future sessions remember them.
- **Yakalananları İşle ("Yakalananları işle"):** List `gelen-kutusu/` items via `list_vault(kind="inbox")`, read them with `read_vault_note`, and propose turning them into structured decisions or tasks (only write after user confirmation).
- **Hafıza Kontrolü ("Hafızamı kontrol et"):** Audit open tasks and older notes via `list_vault`, flag anything potentially outdated, and never overwrite or delete without explicit user approval.

## Workflow Guidelines

- When the user asks "context ne durumda?", "kaç token kullandık?", or "context window'u aç", call `open_context_window` so they get both the concise summary and the live interactive side-pane UI.
- If utilization is above 75%, proactively mention the heaviest steps and recommend running `/compact`.
- When the user wants to reuse project rules or key files across conversations, create a pack with `save_context_pack` so they can attach it in one click from the **Bağlam Paketleri** tab.
