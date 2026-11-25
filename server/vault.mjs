import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { estimateTokens } from './transcript.mjs';

export const DEFAULT_VAULT_DIR = path.join(os.homedir(), 'Antigravity-Beyin');

const SUBDIRS = {
  handoff: 'oturumlar',
  decision: 'kararlar',
  inbox: 'gelen-kutusu',
  task: 'gorevler',
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

const AGENTS_TR_CONTENT = `# Antigravity Beyin — Hafıza Sekmesi Rehberi

Bu klasör (\`~/Antigravity-Beyin\`), tüm notlarını, kararlarını, görevlerini ve kaynaklarını düz Markdown (\`.md\`) dosyaları olarak saklayan **taşınabilir hafıza kasandır**. Antigravity dışında **Claude Code, Codex, Cursor, Obsidian** veya herhangi bir metin editörüyle de doğrudan açıp kullanabilirsin.

---

## Hafıza Sekmesindeki Tüm İşlevler

### 1. 💾 Oturum Kaydet (\`oturumlar/\`)
- **Ne işe yarar?** Uzun bir çalışmayı bitirirken veya yeni bir sohbet açmadan önce **kaldığın yerden devam edebilmeni** sağlar.
- **Neler kaydedilir?** Başlık, **Son İşin Sonucu**, **Açık Konular** ve **Sonraki Adım**.
- **Nasıl kullanılır?** Yeni bir sohbet açtığında oturum kartındaki **\`📎 Bağlama Ekle\`** veya **\`↗ Gönder\`** butonuna bas; asistan bıraktığın yerden anında devam eder.

### 2. ✅ Görev Ekle (\`gorevler/\`)
- **Ne işe yarar?** Sohbetler ve günler arasında unutmak istemediğin yapılacak işleri takip eder.
- **Neler kaydedilir?** Görev başlığı, öncelik (\`Yüksek / Normal / Düşük\`) ve detay notları.
- **Nasıl kullanılır?** İşini bitirdiğinde **\`☐ Tamamla\`** butonuna basarak **\`☑ Tamamlandı\`** durumuna geçirebilirsin.

### 3. 🧭 Karar Ekle (\`kararlar/\`)
- **Ne işe yarar?** *"Neden bu aracı / dili / tasarımı seçmiştik?"* sorusunu haftalar sonra bile kaynağından bulabilmeni sağlar.
- **Neler kaydedilir?** Karar başlığı, **Alınan Karar**, **Gerekçe** ve aranabilir etiketler.

### 4. ⚡ Yakala (\`gelen-kutusu/\`)
- **Ne işe yarar?** Karşına çıkan bir **video, makale, dosya veya fikri** kaybetmeden gelen kutuna almanı sağlar.
- **İpucu:** Biriken kaynakları düzenlemek istediğinde sohbete ***"Yakalananları işle"*** yazabilirsin.

### 5. 📦 Paket Ekle (Çoklu Dosya & Kural Paketleri)
- **Ne işe yarar?** Bilgisayarındaki **birden fazla mevcut proje dosyasını** ve sabit kurallarını tek şablonda gruplar; her kullandığında dosyaların güncel halini okuyup tek tıkla sohbete yükler.

### 6. 🔍 Akıllı Arama & Kart İşlemleri
- **Akıllı Arama:** *"Projede hangi dili seçmiştik neden?"* gibi doğal Türkçe/İngilizce sorulardan dolgu kelimelerini ayıklayıp en alakalı notu en üste getirir.
- **\`📂 Dosyayı Aç\`:** İlgili \`.md\` dosyasını doğrudan Antigravity yan panelinde açar.
- **\`📎 Bağlama Ekle\`:** Notu veya paketi bir sonraki mesajının arkasına gizli bağlam olarak iliştirir.
- **\`↗ Gönder\`:** Notu veya paketi anında sohbete referans mesajı olarak gönderir.

## Sohbetten Kullanabileceğin Komutlar
- ***"Beni tanı"*** — Çalışma tarzını öğrenip hafızana kaydeder.
- ***"Bu oturumu hafızaya kaydet"*** — Sonucu, açık konuları ve sonraki adımı \`oturumlar/\` altına yazar.
- ***"Yakalananları işle"*** — \`gelen-kutusu/\` kayıtlarını özetleyip düzenlemene yardım eder.
- ***"Hafızamı kontrol et"*** — Eski notları ve açık görevleri onayınla gözden geçirir.

## Yedekleme
Bu klasörü doğrudan kopyalayabilir, Google Drive / OneDrive ile eşitleyebilir veya özel bir Git deposuna yedekleyebilirsin.
`;

const AGENTS_EN_CONTENT = `# Antigravity Brain — Memory Tab Guide

This folder (\`~/Antigravity-Beyin\`) is your **portable memory vault**, storing all notes, decisions, tasks, and captured resources as plain Markdown (\`.md\`) files. You can open and share it directly with **Claude Code, Codex, Cursor, Obsidian**, or any text editor.

---

## Memory Tab Features

### 1. 💾 Save Handoff (\`oturumlar/\`)
- **What it does:** Lets you **pick up right where you left off** in a brand-new conversation.
- **What it saves:** Title, **Outcome / Summary**, **Open Items**, and **Next Step**.
- **How to use:** In a new chat, click **\`📎 Attach Context\`** or **\`↗ Send\`** on the handoff card so the assistant immediately continues your work.

### 2. ✅ Add Task (\`gorevler/\`)
- **What it does:** Tracks to-dos across sessions and days.
- **What it saves:** Task title, priority (\`High / Normal / Low\`), and notes.
- **How to use:** Click **\`☐ Mark Done\`** on a task card to toggle it to **\`☑ Done\`** (updates the Markdown checkbox to \`[x]\`).

### 3. 🧭 Decision (\`kararlar/\`)
- **What it does:** Records *why* you chose a specific tool, language, or design so you can find the exact source weeks later.
- **What it saves:** Decision title, **Decision**, **Rationale**, and searchable tags.

### 4. ⚡ Capture (\`gelen-kutusu/\`)
- **What it does:** Quickly saves a **video, article, file, or idea** into your inbox without losing focus.
- **Tip:** Say ***"Process my inbox"*** in chat to turn captured items into structured decisions or tasks.

### 5. 📦 Add Pack (Multi-File & Rule Bundles)
- **What it does:** Groups **multiple local project files** and reusable rules into one pack; reads live file contents and calculates token cost before attaching in one click.

### 6. 🔍 Smart Search & Card Actions
- **Smart Search:** Strips natural question filler words (in both English and Turkish) and ranks matching notes by relevance.
- **\`📂 Open File\`:** Opens the exact \`.md\` file directly in Antigravity's side pane.
- **\`📎 Attach Context\`:** Attaches the note or pack as pending context to your next message.
- **\`↗ Send\`:** Sends the note or pack directly into the current chat.

## Useful Chat Prompts
- ***"Get to know me"*** — Asks a few short questions and saves your preferences to memory.
- ***"Save this session to memory"*** — Summarizes outcome, open items, and next step into \`oturumlar/\`.
- ***"Process my inbox"*** — Reviews items in \`gelen-kutusu/\` and helps organize them.
- ***"Audit my memory"*** — Reviews open tasks and older notes (never modifies without your approval).

## Backup
Copy this folder anywhere, sync it via Google Drive / OneDrive, or back it up to a private Git repository.
`;

export class MemoryVault {
  constructor(vaultDir = process.env.ANTIGRAVITY_VAULT_DIR || DEFAULT_VAULT_DIR) {
    this.vaultDir = vaultDir;
    this.ensureStructure();
  }

  ensureStructure() {
    fs.mkdirSync(this.vaultDir, { recursive: true });
    for (const sub of Object.values(SUBDIRS)) {
      fs.mkdirSync(path.join(this.vaultDir, sub), { recursive: true });
    }
    const agentsPath = path.join(this.vaultDir, 'AGENTS.md');
    if (!fs.existsSync(agentsPath)) {
      fs.writeFileSync(agentsPath, AGENTS_TR_CONTENT, 'utf8');
    }
    const agentsEnPath = path.join(this.vaultDir, 'AGENTS.en.md');
    if (!fs.existsSync(agentsEnPath)) {
      fs.writeFileSync(agentsEnPath, AGENTS_EN_CONTENT, 'utf8');
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
        entry.name.toUpperCase() !== 'AGENTS.EN.MD'
      ) {
        acc.push(full);
      }
    }
    return acc;
  }

  _inferKind(filePath) {
    const rel = path.relative(this.vaultDir, filePath).replace(/\\/g, '/');
    if (rel.startsWith(`${SUBDIRS.handoff}/`)) return 'handoff';
    if (rel.startsWith(`${SUBDIRS.decision}/`)) return 'decision';
    if (rel.startsWith(`${SUBDIRS.inbox}/`)) return 'inbox';
    if (rel.startsWith(`${SUBDIRS.task}/`)) return 'task';
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

    return {
      path: filePath,
      fileUri: toFileUri(filePath),
      relativePath: path.relative(this.vaultDir, filePath).replace(/\\/g, '/'),
      name: path.basename(filePath),
      kind,
      status: meta.status || (kind === 'task' ? 'open' : ''),
      priority: meta.priority || '',
      sourceType: meta.source_type || '',
      sourceUrl: meta.source_url || '',
      title,
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
      agentsEnFileUri: toFileUri(path.join(this.vaultDir, 'AGENTS.en.md')),
      counts,
      items: filtered.slice(0, limit).map(({ mtimeMs, ...rest }) => rest),
    };
  }

  saveHandoff({ title, summary = '', openItems = '', nextStep = '', tags = [] }) {
    this.ensureStructure();
    const cleanTitle = String(title || '').trim() || `Oturum Notu ${dateStamp()}`;
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
      '## Son İşin Sonucu',
      summary.trim() || '-',
      '',
      '## Açık Konular',
      openItems.trim() || '-',
      '',
      '## Sonraki Adım',
      nextStep.trim() || '-',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    return this._readItem(filePath);
  }

  saveDecision({ title, decision = '', rationale = '', tags = [] }) {
    this.ensureStructure();
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) throw new Error('Karar başlığı boş olamaz.');
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
      '## Alınan Karar',
      decision.trim() || '-',
      '',
      '## Gerekçe / Bağlam',
      rationale.trim() || '-',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    return this._readItem(filePath);
  }

  captureResource({ title, sourceType = 'not', urlOrPath = '', notes = '', tags = [] }) {
    this.ensureStructure();
    const cleanTitle = String(title || '').trim() || `Yakalanan Kaynak ${dateStamp()}`;
    const filename = `${dateStamp()}-${timeStamp()}-${slugify(cleanTitle)}.md`;
    const filePath = path.join(this.vaultDir, SUBDIRS.inbox, filename);
    const tagStr = Array.isArray(tags) ? tags.join(', ') : String(tags || '');

    const content = [
      '---',
      `type: inbox`,
      `source_type: "${String(sourceType || 'not').trim()}"`,
      ...(urlOrPath ? [`source_url: "${String(urlOrPath).trim().replace(/"/g, '\\"')}"`] : []),
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${new Date().toISOString()}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      ...(urlOrPath ? [`**Kaynak (${sourceType}):** ${urlOrPath.trim()}`, ''] : []),
      '## Notlar',
      notes.trim() || '-',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    return this._readItem(filePath);
  }

  saveTask({ title, notes = '', priority = 'normal', status = 'open', tags = [] }) {
    this.ensureStructure();
    const cleanTitle = String(title || '').trim();
    if (!cleanTitle) throw new Error('Görev başlığı boş olamaz.');
    const filename = `${dateStamp()}-${timeStamp()}-${slugify(cleanTitle)}.md`;
    const filePath = path.join(this.vaultDir, SUBDIRS.task, filename);
    const tagStr = Array.isArray(tags) ? tags.join(', ') : String(tags || '');
    const cleanStatus = status === 'done' ? 'done' : 'open';

    const content = [
      '---',
      `type: task`,
      `status: "${cleanStatus}"`,
      `priority: "${String(priority || 'normal').trim()}"`,
      `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
      `created_at: "${new Date().toISOString()}"`,
      ...(tagStr ? [`tags: "${tagStr}"`] : []),
      '---',
      '',
      `# ${cleanTitle}`,
      '',
      `- [${cleanStatus === 'done' ? 'x' : ' '}] ${cleanTitle}`,
      '',
      ...(notes.trim() ? ['## Notlar', notes.trim(), ''] : []),
    ].join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    return this._readItem(filePath);
  }

  toggleTask(filePath) {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved) || !fs.existsSync(resolved)) {
      throw new Error('Görev dosyası bulunamadı.');
    }
    let raw = fs.readFileSync(resolved, 'utf8');
    const isCurrentlyDone = /^status:\s*["']?done["']?/m.test(raw);
    const nextStatus = isCurrentlyDone ? 'open' : 'done';

    if (/^status:\s*.+$/m.test(raw)) {
      raw = raw.replace(/^status:\s*.+$/m, `status: "${nextStatus}"`);
    } else {
      raw = raw.replace(/^---\r?\n/, `---\nstatus: "${nextStatus}"\n`);
    }
    raw = isCurrentlyDone
      ? raw.replace(/- \[x\] /i, '- [ ] ')
      : raw.replace(/- \[ \] /, '- [x] ');

    fs.writeFileSync(resolved, raw, 'utf8');
    return this._readItem(resolved);
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
      throw new Error('Yalnızca hafıza kasası içindeki dosyalar okunabilir.');
    }
    if (!fs.existsSync(resolved)) {
      throw new Error('Dosya bulunamadı.');
    }
    const raw = fs.readFileSync(resolved, 'utf8');
    const item = this._readItem(resolved);
    return { ...item, content: raw };
  }

  deleteNote(filePath) {
    const resolved = path.resolve(String(filePath || ''));
    const vaultResolved = path.resolve(this.vaultDir);
    if (!resolved.startsWith(vaultResolved)) {
      throw new Error('Yalnızca hafıza kasası içindeki dosyalar silinebilir.');
    }
    if (!fs.existsSync(resolved)) return false;
    fs.unlinkSync(resolved);
    return true;
  }
}
