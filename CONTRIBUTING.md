# Contributing

Pull requests, bug reports, and feature suggestions are very welcome!

## Local Development

1. **Fork** this repository and clone your fork:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/antigravity-context-window.git
   cd antigravity-context-window
   npm install
   ```
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
3. After editing `ui/app.js` or `ui/styles.css`, rebuild the single-file MCP App bundle:
   ```bash
   npm run build:ui
   ```
4. Test locally in Antigravity (`~/.gemini/config/plugins/context-window`). For changes in `server/`, restart the `context-window` MCP server from Antigravity **MCP Servers** settings.
5. Commit and open a **Pull Request**:
   ```bash
   git add .
   git commit -m "feat: clear description"
   git push origin feat/your-feature
   ```

## Guidelines
- Never hardcode personal file paths, usernames, or API keys (always use `os.homedir()`).
- Add both `en` and `tr` strings in `ui/app.js` (`I18N`) for any new UI labels.
- If you modify `ui/`, include the rebuilt `server/app.html` (`npm run build:ui`) in your PR.
