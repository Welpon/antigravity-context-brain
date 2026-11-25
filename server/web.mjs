import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeConversation, listConversations } from './transcript.mjs';
import { ContextPackStore } from './packs.mjs';
import { MemoryVault } from './vault.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

function readBodyJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk.toString('utf8');
      if (raw.length > 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

export function startWebServer({
  port = Number(process.env.CONTEXT_BRAIN_WEB_PORT) || 3847,
  dataDir = path.join(PLUGIN_ROOT, 'data'),
  idleMinutes = 30,
  onClose = null,
} = {}) {
  const packStore = new ContextPackStore(dataDir);
  const vault = new MemoryVault();
  const prefsPath = path.join(dataDir, 'prefs.json');

  function readPrefs() {
    try {
      if (fs.existsSync(prefsPath)) {
        const p = JSON.parse(fs.readFileSync(prefsPath, 'utf8'));
        return { lang: p?.lang === 'tr' ? 'tr' : 'en' };
      }
    } catch {
      // default
    }
    return { lang: 'en' };
  }

  function writePrefs(patch = {}) {
    const next = {
      ...readPrefs(),
      ...(patch.lang === 'tr' || patch.lang === 'en' ? { lang: patch.lang } : {}),
    };
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(prefsPath, JSON.stringify(next, null, 2), 'utf8');
    return next;
  }

  function buildProjectsList(vaultItems, conversations) {
    const map = new Map();
    for (const item of vaultItems) {
      if (item.project) {
        const key = item.project.trim();
        if (key && !map.has(key)) {
          map.set(key, { id: key, label: key, source: 'project' });
        }
      }
    }
    for (const conv of conversations) {
      const label = conv.title || conv.id.slice(0, 8);
      if (!map.has(label)) {
        map.set(label, { id: label, label, convId: conv.id, source: 'conversation' });
      }
    }
    return [...map.values()];
  }

  let idleTimer = null;
  let server = null;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (idleMinutes > 0) {
      idleTimer = setTimeout(() => {
        shutdown();
      }, idleMinutes * 60 * 1000);
      idleTimer.unref?.();
    }
  }

  function shutdown() {
    clearTimeout(idleTimer);
    if (server) {
      const s = server;
      server = null;
      s.close(() => {
        if (typeof onClose === 'function') onClose();
      });
    }
  }

  server = http.createServer(async (req, res) => {
    resetIdleTimer();
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = url.pathname;

    try {
      if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
        const htmlPath = path.join(__dirname, 'web.html');
        const html = fs.readFileSync(htmlPath, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        res.end(html);
        return;
      }

      if (req.method === 'GET' && pathname === '/api/state') {
        const convId = url.searchParams.get('conv') || undefined;
        const customLimit = Number(url.searchParams.get('limit')) || undefined;
        const analysis = analyzeConversation(convId, customLimit);
        const conversations = listConversations(30);
        const vaultData = vault.list('all', 200);
        const packs = packStore.list();
        const projects = buildProjectsList(vaultData.items, conversations);
        sendJson(res, 200, {
          prefs: readPrefs(),
          analysis,
          conversations,
          vault: vaultData,
          packs,
          projects,
          idleMinutes,
        });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/prefs') {
        const body = await readBodyJson(req);
        sendJson(res, 200, writePrefs(body));
        return;
      }

      if (req.method === 'POST' && pathname === '/api/tasks') {
        const body = await readBodyJson(req);
        const item = vault.saveTask(body);
        sendJson(res, 200, { item, vault: vault.list('all', 200) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/tasks/status') {
        const body = await readBodyJson(req);
        const item = vault.updateTaskStatus(body.path, body.status);
        sendJson(res, 200, { item, vault: vault.list('all', 200) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/handoff') {
        const body = await readBodyJson(req);
        const item = vault.saveHandoff(body);
        sendJson(res, 200, { item, vault: vault.list('all', 200) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/decision') {
        const body = await readBodyJson(req);
        const item = vault.saveDecision(body);
        sendJson(res, 200, { item, vault: vault.list('all', 200) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/capture') {
        const body = await readBodyJson(req);
        const item = vault.captureResource(body);
        sendJson(res, 200, { item, vault: vault.list('all', 200) });
        return;
      }

      if (req.method === 'GET' && pathname === '/api/search') {
        const q = url.searchParams.get('q') || '';
        sendJson(res, 200, vault.search(q, 50));
        return;
      }

      if (req.method === 'GET' && pathname === '/api/note') {
        const filePath = url.searchParams.get('path') || '';
        sendJson(res, 200, vault.readNote(filePath));
        return;
      }

      if (req.method === 'POST' && pathname === '/api/note/delete') {
        const body = await readBodyJson(req);
        const deleted = vault.deleteNote(body.path);
        sendJson(res, 200, { deleted, vault: vault.list('all', 200) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/shutdown') {
        sendJson(res, 200, { ok: true });
        setTimeout(shutdown, 150);
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      sendJson(res, 400, { error: err?.message || String(err) });
    }
  });

  return new Promise((resolve, reject) => {
    let attemptPort = port;
    const tryListen = () => {
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && attemptPort < port + 20) {
          attemptPort += 1;
          tryListen();
        } else {
          reject(err);
        }
      });
      server.listen(attemptPort, '127.0.0.1', () => {
        resetIdleTimer();
        resolve({
          port: attemptPort,
          url: `http://127.0.0.1:${attemptPort}`,
          close: shutdown,
        });
      });
    };
    tryListen();
  });
}

// Direct CLI launch: `node server/web.mjs` or `npm run web`
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const portArg = process.argv.find((a) => a.startsWith('--port='));
  const port = portArg ? Number(portArg.slice('--port='.length)) : undefined;
  startWebServer({
    port,
    onClose: () => {
      console.log('Context Brain Web stopped.');
      process.exit(0);
    },
  })
    .then(({ url }) => {
      console.log(`Context Brain Web running at ${url} (127.0.0.1 only, auto-closes after 30 min idle)`);
    })
    .catch((err) => {
      console.error('Failed to start Context Brain Web:', err.message);
      process.exit(1);
    });
}
