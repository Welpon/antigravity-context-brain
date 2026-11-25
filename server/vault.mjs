import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { estimateTokens } from './transcript.mjs';

export const DEFAULT_VAULT_DIR = path.join(os.homedir(), 'Antigravity-Brain');

export const TASK_STATUSES = ['inbox', 'active', 'waiting', 'done', 'cancelled'];

function normalizeTaskStatus(raw) {
  const s = String(raw || '').trim().toLowerCase();
  if (s === 'open' || s === 'gelen') return 'inbox';
  if (s === 'aktif') return 'active';
  if (s === 'bekliyor') return 'waiting';
  if (s === 'bitti') return 'done';
  if (s === 'iptal' || s === 'canceled') return 'cancelled';
  if (TASK_STATUSES.includes(s)) return s;
  return 'inbox';
}

const SUBDIRS = {
  handoff: 'sessions',
  decision: 'decisions',
  inbox: 'inbox',
  task: 'tasks',
};

const SEARCH_FILLERS = new Set([
  // Turkish question & filler words
  'ne', 'nedir', 'neden', 'niçin', 'nicin', 'nasıl', 'nasil', 'hangi', 'kim', 'nerede',
  'mi', 'mı', 'mu', 'mü', 'mıyız', 'miyiz', 've', 'veya', 'ile', 'için', 'icin', 'gibi',
  'bir', 'bu', 'şu', 'su', 'o', 'da', 'de', 'ki', 'ama', 'fakat', 'daha', 'en', 'çok',
  'cok', 'az', 'var', 'yok', 'mıydı', 'miydi', 'acaba', 'lütfen', 'lutfen', 'bana', 'benim',
  'bizim', 'göster', 'goster', 'bul', 'ara', 'hatırla', 'hatirla', 'seçmiştik', 'secmistik',
  // English question & filler words
  'what', 'why', 'how', 'which', 'who', 'where', 'when', 'is', 'are', 'was', 'were',
  'do', 'does', 'did', 'the', 'a', 'an', 'and', 'or', 'for', 'of', 'to', 'in', 'on',
  'with', 'about', 'we', 'our', 'my', 'show', 'find', 'search',
]);

function extractSearchTerms(query) {
  const cleaned = String(query || '')
    .toLowerCase()
    .replace(/[?!.,;:"'()[\]{}]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !SEARCH_FILLERS.has(w));
  return [...new Set(cleaned)];
}

function slugify(str) {
  const trMap = {
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
    Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
  };
  return String(str || 'not')
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => trMap[ch] || ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'not';
}

function dateStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timeStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function toFileUri(absPath) {
  const normalized = absPath.replace(/\\/g, '/');
  return normalized.startsWith('/') ? `file://${normalized}` : `file:///${normalized}`;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    meta[key] = val;
  }
  return { meta, body: match[2].trim() };
}

const AGENTS_TR_CONTENT = `# Context Brain — Kullanım Rehberi

Bu klasör (\`~/Antigravity-Brain\`), tüm oturum notlarını, görevlerini, kararlarını, yakalanan kaynaklarını ve aktivite geçmişini düz Markdown (\`.md\`) dosyaları olarak saklayan **taşınabilir hafıza kasandır**. Antigravity dışında **Claude Code, Codex, Cursor, Obsidian** veya herhangi bir metin editörüyle de doğrudan açıp kullanabilirsin.

---

## 3 Ana Sekme (Antigravity Paneli & Web)

### 1. 📊 İzleyici (Monitor / Genel Bakış)
- **Canlı Token & Önbellek Takibi:** Konuşmanın gerçek doluluk yüzdesini, önbellek (Cache) / önbelleksiz ayrımını ve kalan token alanını gösterir.
- **Çift Çizgili Zaman Çizelgesi:** Yeşil çizgi toplam bağlam büyümesini, mavi çizgi/alan önbellekten okunan kısmı ve olası önbellek ıskalarını gösterir.
- **En Büyük Sıçramalar:** Gerçek tur farklarını (\`+15.1B\`) gösterir; satıra tıklayınca o turda çalışan tüm araçları listeler.
- **En Ağır Adımlar & Kategori Dağılımı:** En çok yer kaplayan 10 adımı sade cümlelerle ve Sistem / Araçlar / Kullanıcı / Model / Düşünme dağılımıyla sunar.

### 2. 🧠 Hafıza (Memory)
- **💾 Oturum Kaydet (\`sessions/\`):** Son işin sonucu, açık konular ve sonraki adımı kaydedip yeni oturumda tek tıkla devam etmeni sağlar.
- **✅ Görev Ekle (\`tasks/\`):** 5 durumlu (**\`GELEN · AKTİF · BEKLİYOR · BİTTİ · İPTAL\`**) görev takibi; proje/sohbet bazlı filtreleme, kısa açıklama ve satır içi düzenleme (\`✎\`) destekler.
- **🧭 Karar Ekle (\`decisions/\`):** Alınan kararları ve gerekçelerini aranabilir şekilde saklar.
- **⚡ Yakala (\`inbox/\`):** Video, makale, dosya veya notları tek seferde gelen kutusuna alır.
- **📦 Paket Ekle:** Birden fazla yerel proje dosyasını ve kuralı gruplayıp tek tıkla sohbete yükler.
- **🔍 Akıllı Arama & Kart İşlemleri:** Türkçe/İngilizce soru kalıplarını ayıklayarak arama yapar; **\`📂 Dosyayı Aç\`** dosyayı yan panelde açar, **\`📎 Bağlama Ekle\`** sonraki mesaja iliştirir, **\`↗ Gönder\`** doğrudan sohbete yollar.

### 3. 🕒 Log (Aktivite Geçmişi — \`.activity-log.jsonl\`)
- Eklediğin, düzenlediğin, durumunu değiştirdiğin ve sildiğin her işlemi **gün bazlı (\`Bugün / Dün / Tarih\`)**, **saat + kaç dakika önce** ve **kaynak etiketi (\`Web / Antigravity / AI Ajan\`)** ile kaydeder.
- Herhangi bir log satırına tıkladığında değişen alanların **öncesi → sonrası** farkını (başlık, durum, açıklama, proje, dosya yolu) ayrıntılı olarak görebilirsin.

---

## 🌐 Yerel Web Arayüzü (Kanban Panosu)
- Panelin sağ üstündeki **\`🌐 Web\`** butonuna tıklayarak (veya Antigravity kapalıyken terminalden \`npm run web\` çalıştırarak) tarayıcıda tam ekran **5 sütunlu sürükle-bırak Kanban panosunu**, Genel Bakış'ı, Notlar & Kasa + Arama'yı ve Aktivite Logu'nu açabilirsin.
- Yalnızca kendi bilgisayarında (\`127.0.0.1\`) çalışır ve 30 dakika kullanılmazsa otomatik kapanır.

## Sohbetten Kullanabileceğin Komutlar
- ***"Beni tanı"*** — Çalışma tarzını öğrenip hafızana kaydeder.
- ***"Bu oturumu hafızaya kaydet"*** — Sonucu, açık konuları ve sonraki adımı \`sessions/\` altına yazar.
- ***"Bunun için görev oluştur"*** — \`tasks/\` altına yeni görev ekler.
- ***"Yakalananları işle"*** — \`inbox/\` kayıtlarını özetleyip düzenlemene yardım eder.
- ***"Hafızamı kontrol et"*** — Eski notları ve açık görevleri onayınla gözden geçirir.

## Dil & Yedekleme
- Üst bardaki **\`EN / TR\`** seçimi kalıcı olarak kaydedilir; hem panelde hem web arayüzünde senkron çalışır.
- \`~/Antigravity-Brain\` klasörünü doğrudan kopyalayabilir, Google Drive / OneDrive ile eşitleyebilir veya özel bir Git deposuna yedekleyebilirsin.
`;

const AGENTS_EN_CONTENT = `# Context Brain — User Guide

This folder (\`~/Antigravity-Brain\`) is your **portable memory vault**, storing all session handoffs, tasks, decisions, captured resources, and activity logs as plain Markdown (\`.md\`) and JSONL files. You can open and share it directly with **Claude Code, Codex, Cursor, Obsidian**, or any text editor.

---

## 3 Core Tabs (Antigravity Panel & Web)

### 1. 📊 Monitor / Overview
- **Live Token & Cache Telemetry:** Displays real context utilization, Cache vs. Uncached split, cache hit rate, and remaining free tokens.
- **Dual-Line Timeline:** Green line for total context growth, blue line/area for cached tokens so cache misses are immediately visible.
- **Top Spikes (Interactive):** Real turn-to-turn context deltas (\`+15.1K\`); click any row to inspect all tools executed in that turn.
- **Heaviest Steps & Category Breakdown:** Top 10 heaviest steps with plain-language summaries plus System / Tools / User / Model / Thinking breakdown.

### 2. 🧠 Memory
- **💾 Save Handoff (\`sessions/\`):** Save outcome, open items, and next step to pick up seamlessly in a new conversation.
- **✅ Add Task (\`tasks/\`):** 5-stage task tracking (**\`INBOX · ACTIVE · WAITING · DONE · CANCELLED\`**) with project/chat filtering, optional descriptions, and inline editing (\`✎\`).
- **🧭 Decision (\`decisions/\`):** Record decisions and rationale so you can trace *why* later.
- **⚡ Capture (\`inbox/\`):** Quick-capture videos, articles, files, or notes into your inbox.
- **📦 Add Pack:** Bundle multiple local project files + reusable rules and attach live contents to chat in one click.
- **🔍 Smart Search & Card Actions:** Strips English/Turkish question filler words; **\`📂 Open File\`** opens the \`.md\` file in Antigravity's side pane, **\`📎 Attach Context\`** attaches it to your next message, and **\`↗ Send\`** sends it directly to chat.

### 3. 🕒 Log (Activity History — \`.activity-log.jsonl\`)
- Automatically records every creation, edit, status move, and deletion grouped by day (**\`Today / Yesterday / Date\`**) with exact time, relative time, and source badge (**\`Web / Antigravity / AI Agent\`**).
- Click any log row to expand exact **before → after** field diffs (title, status, description, project, file path).

---

## 🌐 Local Web UI (Kanban Board)
- Click **\`🌐 Web\`** in the top-right header (or run \`npm run web\` even when Antigravity is closed) to launch a full-screen **5-column drag-and-drop Kanban board**, Overview, Notes & Vault + Smart Search, and Activity Log in your browser.
- Runs strictly on \`127.0.0.1\` and auto-closes after 30 minutes of inactivity.

## Useful Chat Prompts
- ***"Get to know me"*** — Learns your preferences and saves them to memory.
- ***"Save this session to memory"*** — Summarizes outcome, open items, and next step into \`sessions/\`.
- ***"Create a task for this"*** — Adds a task under \`tasks/\`.
- ***"Process my inbox"*** — Reviews items in \`inbox/\` and helps organize them.
- ***"Audit my memory"*** — Reviews open tasks and older notes (never modifies without your approval).

## Language & Backup
- Your **\`EN / TR\`** language choice persists across both Antigravity and the Web UI.
- Copy \`~/Antigravity-Brain\` anywhere, sync via Google Drive / OneDrive, or back it up to a private Git repository.
`;

export class MemoryVault {
  constructor(vaultDir = process.env.ANTIGRAVITY_VAULT_DIR || DEFAULT_VAULT_DIR) {
    this.vaultDir = vaultDir;
    this.logPath = path.join(this.vaultDir, '.activity-log.jsonl');
    this.ensureStructure();
  }

  appendLog({
    action,
    entity = '',
    source = 'ai',
    title = '',
    detail = '',
    project = '',
    relativePath = '',
    fromStatus = '',
    toStatus = '',
    changes = [],
  }) {
    try {
      this.ensureStructure();
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        action: String(action || 'event'),
        entity: String(entity || ''),
        source: String(source || 'ai'),
        title: String(title || ''),
        detail: String(detail || ''),
        project: String(project || ''),
        relativePath: String(relativePath || ''),
        fromStatus: String(fromStatus || ''),
        toStatus: String(toStatus || ''),
        changes: Array.isArray(changes) ? changes : [],
      };
      fs.appendFileSync(this.logPath, `${JSON.stringify(entry)}\n`, 'utf8');
      return entry;
    } catch {
      return null;
    }
  }

  listLogs(limit = 150) {
    this.ensureStructure();
    if (!fs.existsSync(this.logPath)) return [];
    const raw = fs.readFileSync(this.logPath, 'utf8');
    const items = [];
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        items.push(JSON.parse(trimmed));
      } catch {
        // skip malformed line
      }
    }
    items.reverse();
    return items.slice(0, limit);
  }

  clearLogs() {
    if (fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, '', 'utf8');
    }
    return true;
  }

  ensureStructure() {
    fs.mkdirSync(this.vaultDir, { recursive: true });
    for (const sub of Object.values(SUBDIRS)) {
      fs.mkdirSync(path.join(this.vaultDir, sub), { recursive: true });
    }
    const agentsPath = path.join(this.vaultDir, 'AGENTS.md');
    if (!fs.existsSync(agentsPath)) {
      fs.writeFileSync(agentsPath, AGENTS_EN_CONTENT, 'utf8');
    }
    const agentsTrPath = path.join(this.vaultDir, 'AGENTS.tr.md');
    if (!fs.existsSync(agentsTrPath)) {
      fs.writeFileSync(agentsTrPath, AGENTS_TR_CONTENT, 'utf8');
    }
  }

  _collectMarkdownFiles(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this._collectMarkdownFiles(full, acc);
      } else if (
        entry.isFile() &&
        /\.md$/i.test(entry.name) &&
        entry.name.toUpperCase() !== 'AGENTS.MD' &&
        entry.name.toUpperCase() !== 'AGENTS.TR.MD' &&
        entry.name.toUpperCase() !== 'AGENTS.EN.MD'
      ) {
        acc.push(full);
      }
    }
    return acc;
  }

  _inferKind(filePath) {
    const rel = path.relative(this.vaultDir, filePath).replace(/\\/g, '/');
    if (rel.startsWith(`${SUBDIRS.handoff}/`) || rel.startsWith('oturumlar/')) return 'handoff';
    if (rel.startsWith(`${SUBDIRS.decision}/`) || rel.startsWith('kararlar/')) return 'decision';
    if (rel.startsWith(`${SUBDIRS.inbox}/`) || rel.startsWith('gelen-kutusu/')) return 'inbox';
    if (rel.startsWith(`${SUBDIRS.task}/`) || rel.startsWith('gorevler/')) return 'task';
    return 'note';
  }

  _readItem(filePath) {
    const stat = fs.statSync(filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const headingMatch = body.match(/^#\s+(.+)$/m);
    const title = meta.title || (headingMatch ? headingMatch[1].trim() : path.basename(filePath, '.md'));
    const kind = meta.type || this._inferKind(filePath);
    const preview = body
      .replace(/^#.*$/gm, '')
      .replace(/[#*`>_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 140);

    const notesMatch = body.match(/^##\s+(?:Notlar|Notes)\r?\n([\s\S]*)$/m);
    const notes = notesMatch ? notesMatch[1].trim() : '';

    return {
      path: filePath,
      fileUri: toFileUri(filePath),
      relativePath: path.relative(this.vaultDir, filePath).replace(/\\/g, '/'),
      name: path.basename(filePath),
      kind,
      status: kind === 'task' ? normalizeTaskStatus(meta.status) : (meta.status || ''),
      priority: meta.priority || '',
      project: meta.project || '',
      sourceType: meta.source_type || '',
      sourceUrl: meta.source_url || '',
      title,
      notes,
      tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      preview,
      tokens: estimateTokens(raw),
      updatedAt: stat.mtime.toISOString(),
      mtimeMs: stat.mtimeMs,
    };
  }

  list(kindFilter = 'all', limit = 40) {
    this.ensureStructure();
    const files = this._collectMarkdownFiles(this.vaultDir);
    const items = [];
    for (const f of files) {
      try {
        items.push(this._readItem(f));
      } catch {
        // Ignore unreadable files
      }
    }
    items.sort((a, b) => b.mtimeMs - a.mtimeMs);

    const counts = {
      all: items.length,
      handoff: items.filter((i) => i.kind === 'handoff').length,
      decision: items.filter((i) => i.kind === 'decision').length,
      task: items.filter((i) => i.kind === 'task').length,
      openTasks: items.filter((i) => i.kind === 'task' && i.status !== 'done').length,
      inbox: items.filter((i) => i.kind === 'inbox').length,
    };

    const filtered =
      kindFilter && kindFilter !== 'all'
        ? items.filter((i) => i.kind === kindFilter)
        : items;

    return {
      vaultDir: this.vaultDir,
      agentsFileUri: toFileUri(path.join(this.vaultDir, 'AGENTS.md')),
      agentsTrFileUri: toFileUri(path.join(this.vaultDir, 'AGENTS.tr.md')),
      counts,
      items: filtered.slice(0, limit).map(({ mtimeMs, ...rest }) => rest),
    };
  }

  saveHandoff({ title, summary = '', openItems = '', nextStep = '', tags = [], lang = 'en', source = 'ai' }) {
    this.ensureStructure();
    const isTr = lang === 'tr';
    const cleanTitle = String(title || '').trim() || `${isTr ? 'Oturum Notu' : 'Session Handoff'} ${dateStamp()}`;
    const filename = `${dateStamp()}-${timeStamp()}-${slugify(cleanTitle)}.md`;
    const filePath = path.join(this.vaultDir, SUBDIRS.handoff, filename);
    const tagStr = Array.isArray(tags) ? tags.join(', ') : String(tags || '');

    const content = [
      '---',
      `type: handoff`,
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${new Date().toISOString()}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      isTr ? '## Son İşin Sonucu' : '## Outcome / Summary',
      summary.trim() || '-',
      '',
      isTr ? '## Açık Konular' : '## Open Items',
      openItems.trim() || '-',
      '',
      isTr ? '## Sonraki Adım' : '## Next Step',
      nextStep.trim() || '-',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    const item = this._readItem(filePath);
    const changes = [];
    if (summary.trim()) changes.push({ field: 'summary', next: summary.trim() });
    if (openItems.trim()) changes.push({ field: 'openItems', next: openItems.trim() });
    if (nextStep.trim()) changes.push({ field: 'nextStep', next: nextStep.trim() });
    changes.push({ field: 'file', next: item.relativePath });
    this.appendLog({
      action: 'handoff_saved',
      entity: 'handoff',
      source,
      title: item.title,
      detail: nextStep.trim() || summary.trim(),
      relativePath: item.relativePath,
      changes,
    });
    return item;
  }

  saveDecision({ title, decision = '', rationale = '', tags = [], lang = 'en', source = 'ai' }) {
    this.ensureStructure();
    const isTr = lang === 'tr';
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) throw new Error('Decision title cannot be empty.');
    const filename = `${dateStamp()}-${timeStamp()}-${slugify(cleanTitle)}.md`;
    const filePath = path.join(this.vaultDir, SUBDIRS.decision, filename);
    const tagStr = Array.isArray(tags) ? tags.join(', ') : String(tags || '');

    const content = [
      '---',
      `type: decision`,
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${new Date().toISOString()}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      isTr ? '## Alınan Karar' : '## Decision',
      decision.trim() || '-',
      '',
      isTr ? '## Gerekçe / Bağlam' : '## Rationale / Context',
      rationale.trim() || '-',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    const item = this._readItem(filePath);
    const changes = [];
    if (decision.trim()) changes.push({ field: 'decision', next: decision.trim() });
    if (rationale.trim()) changes.push({ field: 'rationale', next: rationale.trim() });
    changes.push({ field: 'file', next: item.relativePath });
    this.appendLog({
      action: 'decision_saved',
      entity: 'decision',
      source,
      title: item.title,
      detail: decision.trim(),
      relativePath: item.relativePath,
      changes,
    });
    return item;
  }

  captureResource({ title, sourceType = 'note', urlOrPath = '', notes = '', tags = [], lang = 'en', source = 'ai' }) {
    this.ensureStructure();
    const isTr = lang === 'tr';
    const cleanTitle = String(title || '').trim() || `${isTr ? 'Yakalanan Kaynak' : 'Captured Resource'} ${dateStamp()}`;
    const filename = `${dateStamp()}-${timeStamp()}-${slugify(cleanTitle)}.md`;
    const filePath = path.join(this.vaultDir, SUBDIRS.inbox, filename);
    const tagStr = Array.isArray(tags) ? tags.join(', ') : String(tags || '');
    const normType = String(sourceType || 'note').trim().toLowerCase();

    const content = [
      '---',
      `type: inbox`,
      `source_type: "${normType}"`,
      ...(urlOrPath ? [`source_url: "${String(urlOrPath).trim().replace(/"/g, '\\"')}"`] : []),
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${new Date().toISOString()}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      ...(urlOrPath ? [`**${isTr ? 'Kaynak' : 'Source'} (${normType}):** ${urlOrPath.trim()}`, ''] : []),
      isTr ? '## Notlar' : '## Notes',
      notes.trim() || '-',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    const item = this._readItem(filePath);
    const changes = [{ field: 'source', next: urlOrPath.trim() || normType }];
    if (notes.trim()) changes.push({ field: 'notes', next: notes.trim() });
    changes.push({ field: 'file', next: item.relativePath });
    this.appendLog({
      action: 'resource_captured',
      entity: 'inbox',
      source,
      title: item.title,
      detail: urlOrPath.trim() || notes.trim(),
      relativePath: item.relativePath,
      changes,
    });
    return item;
  }

  saveTask({ title, notes = '', priority = 'normal', status = 'inbox', project = '', tags = [], lang = 'en', source = 'ai' }) {
    this.ensureStructure();
    const isTr = lang === 'tr';
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) throw new Error('Task title cannot be empty.');
    const filename = `${dateStamp()}-${timeStamp()}-${slugify(cleanTitle)}.md`;
    const filePath = path.join(this.vaultDir, SUBDIRS.task, filename);
    const tagStr = Array.isArray(tags) ? tags.join(', ') : String(tags || '');
    const cleanStatus = normalizeTaskStatus(status);
    const cleanProject = String(project || '').trim();

    const content = [
      '---',
      `type: task`,
      `status: "${cleanStatus}"`,
      `priority: "${String(priority || 'normal').trim()}"`,
      ...(cleanProject ? [`project: "${cleanProject.replace(/"/g, '\\"')}"`] : []),
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${new Date().toISOString()}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      `- [${cleanStatus === 'done' ? 'x' : ' '}] ${cleanTitle}`,
      '',
      ...(notes.trim() ? [isTr ? '## Notlar' : '## Notes', notes.trim(), ''] : []),
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    const item = this._readItem(filePath);
    const changes = [{ field: 'status', next: cleanStatus }];
    if (cleanProject) changes.push({ field: 'project', next: cleanProject });
    if (notes.trim()) changes.push({ field: 'notes', next: notes.trim() });
    changes.push({ field: 'file', next: item.relativePath });
    this.appendLog({
      action: 'task_created',
      entity: 'task',
      source,
      title: item.title,
      detail: notes.trim(),
      project: cleanProject,
      relativePath: item.relativePath,
      toStatus: cleanStatus,
      changes,
    });
    return item;
  }

  updateTask({ path: filePath, title, notes, project, priority, status, lang = 'en', source = 'ai' }) {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved) || !fs.existsSync(resolved)) {
      throw new Error('Task file not found.');
    }
    const existingRaw = fs.readFileSync(resolved, 'utf8');
    const { meta } = parseFrontmatter(existingRaw);
    const existingItem = this._readItem(resolved);

    const isTr = lang === 'tr';
    const cleanTitle = String(title ?? existingItem.title).trim();
    if (!cleanTitle) throw new Error('Task title cannot be empty.');
    const cleanStatus = normalizeTaskStatus(status ?? existingItem.status);
    const cleanPriority = String(priority ?? existingItem.priority ?? 'normal').trim();
    const cleanProject = String(project ?? existingItem.project ?? '').trim();
    const cleanNotes = String(notes ?? existingItem.notes ?? '').trim();
    const createdAt = meta.created_at || new Date().toISOString();
    const tagStr = meta.tags || '';

    const content = [
      '---',
      `type: task`,
      `status: "${cleanStatus}"`,
      `priority: "${cleanPriority}"`,
      ...(cleanProject ? [`project: "${cleanProject.replace(/"/g, '\\"')}"`] : []),
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${createdAt}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      `- [${cleanStatus === 'done' ? 'x' : ' '}] ${cleanTitle}`,
      '',
      ...(cleanNotes ? [isTr ? '## Notlar' : '## Notes', cleanNotes, ''] : []),
    ].join('\n');

    fs.writeFileSync(resolved, content, 'utf8');
    const item = this._readItem(resolved);
    const changes = [];
    if (existingItem.title !== cleanTitle) changes.push({ field: 'title', old: existingItem.title, next: cleanTitle });
    if (existingItem.status !== cleanStatus) changes.push({ field: 'status', old: existingItem.status, next: cleanStatus });
    if ((existingItem.project || '') !== cleanProject) changes.push({ field: 'project', old: existingItem.project || '-', next: cleanProject || '-' });
    if ((existingItem.priority || 'normal') !== cleanPriority) changes.push({ field: 'priority', old: existingItem.priority || 'normal', next: cleanPriority });
    if ((existingItem.notes || '') !== cleanNotes) changes.push({ field: 'notes', old: existingItem.notes || '', next: cleanNotes || '-' });
    changes.push({ field: 'file', next: item.relativePath });
    this.appendLog({
      action: 'task_edited',
      entity: 'task',
      source,
      title: item.title,
      detail: cleanNotes,
      project: cleanProject,
      relativePath: item.relativePath,
      fromStatus: existingItem.status,
      toStatus: cleanStatus,
      changes,
    });
    return item;
  }

  updateTaskStatus(filePath, nextStatusRaw, source = 'ai') {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved) || !fs.existsSync(resolved)) {
      throw new Error('Task file not found.');
    }
    const prevItem = this._readItem(resolved);
    const nextStatus = normalizeTaskStatus(nextStatusRaw);
    let raw = fs.readFileSync(resolved, 'utf8');

    if (/^status:\s*.+$/m.test(raw)) {
      raw = raw.replace(/^status:\s*.+$/m, `status: "${nextStatus}"`);
    } else {
      raw = raw.replace(/^---\r?\n/, `---\nstatus: "${nextStatus}"\n`);
    }
    raw =
      nextStatus === 'done'
        ? raw.replace(/- \[ \] /, '- [x] ')
        : raw.replace(/- \[x\] /i, '- [ ] ');

    fs.writeFileSync(resolved, raw, 'utf8');
    const item = this._readItem(resolved);
    this.appendLog({
      action: 'task_moved',
      entity: 'task',
      source,
      title: item.title,
      project: item.project,
      relativePath: item.relativePath,
      fromStatus: prevItem.status,
      toStatus: nextStatus,
      changes: [
        { field: 'status', old: prevItem.status, next: nextStatus },
        { field: 'file', next: item.relativePath },
      ],
    });
    return item;
  }

  toggleTask(filePath) {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved) || !fs.existsSync(resolved)) {
      throw new Error('Task file not found.');
    }
    const raw = fs.readFileSync(resolved, 'utf8');
    const isCurrentlyDone = /^status:\s*["']?done["']?/m.test(raw);
    return this.updateTaskStatus(resolved, isCurrentlyDone ? 'inbox' : 'done');
  }

  search(query, limit = 20) {
    this.ensureStructure();
    const rawQ = String(query || '').trim();
    if (!rawQ) return this.list('all', limit);

    const terms = extractSearchTerms(rawQ);
    const fallbackTerms = terms.length > 0 ? terms : [rawQ.toLowerCase()];

    const files = this._collectMarkdownFiles(this.vaultDir);
    const matches = [];

    for (const f of files) {
      try {
        const raw = fs.readFileSync(f, 'utf8');
        const lowerRaw = raw.toLowerCase();
        const item = this._readItem(f);
        const lowerTitle = item.title.toLowerCase();
        const lowerTags = item.tags.join(' ').toLowerCase();
        const lowerName = item.name.toLowerCase();

        let score = 0;
        let firstHitIdx = -1;

        if (lowerRaw.includes(rawQ.toLowerCase())) {
          score += 5;
          firstHitIdx = lowerRaw.indexOf(rawQ.toLowerCase());
        }

        for (const term of fallbackTerms) {
          if (lowerTitle.includes(term) || lowerName.includes(term)) score += 3;
          if (lowerTags.includes(term)) score += 2;
          const idx = lowerRaw.indexOf(term);
          if (idx !== -1) {
            score += 1;
            if (firstHitIdx === -1) firstHitIdx = idx;
          }
        }

        if (score === 0) continue;

        let snippet = item.preview;
        if (firstHitIdx !== -1) {
          const start = Math.max(0, firstHitIdx - 45);
          const end = Math.min(raw.length, firstHitIdx + 100);
          snippet = raw.slice(start, end).replace(/\s+/g, ' ').trim();
          if (start > 0) snippet = `…${snippet}`;
          if (end < raw.length) snippet = `${snippet}…`;
        }
        matches.push({ ...item, score, snippet });
      } catch {
        // Ignore unreadable
      }
    }

    matches.sort((a, b) => b.score - a.score || b.mtimeMs - a.mtimeMs);
    return {
      vaultDir: this.vaultDir,
      query: rawQ,
      terms: fallbackTerms,
      items: matches.slice(0, limit).map(({ mtimeMs, ...rest }) => rest),
    };
  }

  readNote(filePath) {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved)) {
      throw new Error('Only files inside the memory vault can be read.');
    }
    if (!fs.existsSync(resolved)) {
      throw new Error('File not found.');
    }
    const raw = fs.readFileSync(resolved, 'utf8');
    const item = this._readItem(resolved);
    return { ...item, content: raw };
  }

  deleteNote(filePath, source = 'ai') {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved)) {
      throw new Error('Only files inside the memory vault can be deleted.');
    }
    if (!fs.existsSync(resolved)) return false;
    let info = null;
    try {
      info = this._readItem(resolved);
    } catch {
      // ignore
    }
    fs.unlinkSync(resolved);
    if (info) {
      this.appendLog({
        action: 'note_deleted',
        entity: info.kind,
        source,
        title: info.title,
        project: info.project,
        relativePath: info.relativePath,
        changes: [{ field: 'file', next: info.relativePath }],
      });
    }
    return true;
  }
}
