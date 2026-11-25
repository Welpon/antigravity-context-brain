import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { estimateTokens } from './transcript.mjs';

const MAX_FILE_READ_BYTES = 256 * 1024; // 256 KiB per file preview/inject safeguard

export class ContextPackStore {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.filePath = path.join(dataDir, 'context-packs.json');
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      this._writeStore({ version: 1, packs: [] });
    }
  }

  _readStore() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.packs)) {
        return parsed;
      }
    } catch {
      // Fallback to empty store if corrupted
    }
    return { version: 1, packs: [] };
  }

  _writeStore(data) {
    const tmpPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, this.filePath);
  }

  _inspectFile(filePath) {
    const normalized = String(filePath || '').trim();
    if (!normalized) return null;
    try {
      const stat = fs.statSync(normalized);
      if (!stat.isFile()) {
        return { path: normalized, exists: false, error: 'Dizin, dosya değil', bytes: 0, tokens: 0 };
      }
      const truncated = stat.size > MAX_FILE_READ_BYTES;
      const bytesToRead = Math.min(stat.size, MAX_FILE_READ_BYTES);
      const fd = fs.openSync(normalized, 'r');
      const buf = Buffer.alloc(bytesToRead);
      try {
        fs.readSync(fd, buf, 0, bytesToRead, 0);
      } finally {
        fs.closeSync(fd);
      }
      const text = buf.toString('utf8');
      const lines = text.split(/\r?\n/).length;
      return {
        path: normalized,
        name: path.basename(normalized),
        exists: true,
        bytes: stat.size,
        lines,
        tokens: estimateTokens(text),
        truncated,
      };
    } catch {
      return { path: normalized, name: path.basename(normalized), exists: false, error: 'Dosya bulunamadı', bytes: 0, tokens: 0 };
    }
  }

  _enrichPack(pack) {
    const notesTokens = estimateTokens(pack.notes || '');
    const fileInfos = (pack.files || [])
      .map((f) => this._inspectFile(f))
      .filter(Boolean);
    const filesTokens = fileInfos.reduce((sum, f) => sum + (f.tokens || 0), 0);
    return {
      ...pack,
      notesTokens,
      fileInfos,
      filesTokens,
      totalTokens: notesTokens + filesTokens,
    };
  }

  list() {
    const store = this._readStore();
    return store.packs.map((p) => this._enrichPack(p));
  }

  get(id) {
    const store = this._readStore();
    const pack = store.packs.find((p) => p.id === id);
    return pack ? this._enrichPack(pack) : null;
  }

  save({ id, name, description = '', notes = '', files = [], tags = [] }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) {
      throw new Error('Bağlam paketi adı boş olamaz.');
    }

    const cleanFiles = Array.isArray(files)
      ? files.map((f) => String(f).trim()).filter(Boolean)
      : [];
    const cleanTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const store = this._readStore();
    const now = new Date().toISOString();

    if (id) {
      const idx = store.packs.findIndex((p) => p.id === id);
      if (idx !== -1) {
        store.packs[idx] = {
          ...store.packs[idx],
          name: cleanName,
          description: String(description || '').trim(),
          notes: String(notes || ''),
          files: cleanFiles,
          tags: cleanTags,
          updatedAt: now,
        };
        this._writeStore(store);
        return this._enrichPack(store.packs[idx]);
      }
    }

    const newPack = {
      id: id || crypto.randomUUID().slice(0, 8),
      name: cleanName,
      description: String(description || '').trim(),
      notes: String(notes || ''),
      files: cleanFiles,
      tags: cleanTags,
      createdAt: now,
      updatedAt: now,
    };
    store.packs.unshift(newPack);
    this._writeStore(store);
    return this._enrichPack(newPack);
  }

  delete(id) {
    const store = this._readStore();
    const before = store.packs.length;
    store.packs = store.packs.filter((p) => p.id !== id);
    if (store.packs.length === before) {
      return false;
    }
    this._writeStore(store);
    return true;
  }

  resolve(id) {
    const store = this._readStore();
    const pack = store.packs.find((p) => p.id === id);
    if (!pack) return null;

    const sections = [];
    sections.push(`# Context Pack: ${pack.name}`);
    if (pack.description) {
      sections.push(`> ${pack.description}`);
    }
    if (pack.notes && pack.notes.trim()) {
      sections.push(`\n## Notlar & Kurallar\n${pack.notes.trim()}`);
    }

    const resolvedFiles = [];
    for (const filePath of pack.files || []) {
      const normalized = String(filePath || '').trim();
      if (!normalized) continue;
      try {
        const stat = fs.statSync(normalized);
        if (!stat.isFile()) continue;
        const truncated = stat.size > MAX_FILE_READ_BYTES;
        const bytesToRead = Math.min(stat.size, MAX_FILE_READ_BYTES);
        const fd = fs.openSync(normalized, 'r');
        const buf = Buffer.alloc(bytesToRead);
        try {
          fs.readSync(fd, buf, 0, bytesToRead, 0);
        } finally {
          fs.closeSync(fd);
        }
        const content = buf.toString('utf8');
        resolvedFiles.push({
          path: normalized,
          tokens: estimateTokens(content),
          truncated,
        });
        sections.push(
          `\n## Dosya: ${normalized}${truncated ? ' (ilk 256 KiB)' : ''}\n\`\`\`\n${content}\n\`\`\``
        );
      } catch {
        resolvedFiles.push({ path: normalized, missing: true, tokens: 0 });
      }
    }

    const assembledText = sections.join('\n');
    return {
      pack: this._enrichPack(pack),
      assembledText,
      estimatedTokens: estimateTokens(assembledText),
      resolvedFiles,
    };
  }
}
