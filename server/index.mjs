import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { analyzeConversation, listConversations } from './transcript.mjs';
import { ContextPackStore } from './packs.mjs';
import { MemoryVault } from './vault.mjs';
import { startWebServer } from './web.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const APP_URI = 'ui://context-brain/app.html';
const APP_MIME = 'text/html;profile=mcp-app';

function parseDataDir(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--data-dir=')) {
      return arg.slice('--data-dir='.length);
    }
    if (arg === '--data-dir' && argv[i + 1]) {
      return argv[i + 1];
    }
  }
  return path.join(PLUGIN_ROOT, 'data');
}

const dataDir = parseDataDir(process.argv.slice(2));
const packStore = new ContextPackStore(dataDir);
const memoryVault = new MemoryVault();
const prefsPath = path.join(dataDir, 'prefs.json');
let activeWebServer = null;

function readPrefs() {
  try {
    if (fs.existsSync(prefsPath)) {
      const parsed = JSON.parse(fs.readFileSync(prefsPath, 'utf8'));
      return { lang: parsed?.lang === 'tr' ? 'tr' : 'en' };
    }
  } catch {
    // Fallback to default
  }
  return { lang: 'en' };
}

function writePrefs(patch = {}) {
  const current = readPrefs();
  const next = {
    ...current,
    ...(patch.lang === 'tr' || patch.lang === 'en' ? { lang: patch.lang } : {}),
  };
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(prefsPath, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function readAppHtml() {
  const htmlPath = process.env.CONTEXT_WINDOW_APP_HTML || path.join(__dirname, 'app.html');
  if (!fs.existsSync(htmlPath)) {
    return '<!doctype html><html><body><p>Context Window UI henüz derlenmedi. Lütfen <code>npm run build:ui</code> çalıştırın.</p></body></html>';
  }
  return fs.readFileSync(htmlPath, 'utf8');
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString('en-US');
}

function buildUsageSummaryText(analysis) {
  if (!analysis.found) {
    return analysis.error || 'Konuşma verisi bulunamadı.';
  }
  const lines = [
    `Context Window — ${analysis.title}`,
    `Model: ${analysis.model} | Kullanım: ${formatNumber(analysis.latestContextTokens)} / ${formatNumber(analysis.contextLimit)} token (%${analysis.utilizationPct})`,
    `Cache Hit: %${analysis.latestCacheHitPct} (Genel: %${analysis.cumulative.cacheHitPct}) | Tur: ${analysis.turns} | Araç Çağrısı: ${analysis.totalToolCalls}`,
    `Durum: ${analysis.health.toUpperCase()} — ${analysis.recommendation}`,
  ];
  return lines.join('\n');
}

const TOOLS = [
  {
    name: 'open_context_window',
    title: 'Context Brain',
    description:
      'Open the Context Brain Monitor & Memory Vault UI. Shows real token usage, cache hit rate, top spikes, heaviest steps, and your portable Markdown memory vault.',
    inputSchema: {
      type: 'object',
      properties: {
        conversation_id: {
          type: 'string',
          description: 'Optional conversation ID. Defaults to the most recent active conversation.',
        },
        tab: {
          type: 'string',
          enum: ['monitor', 'packs', 'memory'],
          description: 'Optional initial tab: "monitor" or "memory".',
        },
        context_limit: {
          type: 'number',
          description: 'Optional custom context window token limit.',
        },
      },
    },
    _meta: {
      ui: {
        resourceUri: APP_URI,
      },
      'com.google.antigravity/ui': {
        entrypoints: [
          { type: 'aux_pane', title: 'Context Brain' },
          { type: 'global', title: 'Context Brain' },
        ],
      },
    },
  },
  {
    name: 'get_context_usage',
    title: 'Get Context Usage',
    description:
      'Aktif veya belirtilen Antigravity konuşmasının gerçek context window token kullanımını, cache verimliliğini, kategori dağılımını ve en çok yer kaplayan adımları döndürür.',
    inputSchema: {
      type: 'object',
      properties: {
        conversation_id: {
          type: 'string',
          description: 'İsteğe bağlı konuşma ID\'si. Boş bırakılırsa en güncel konuşma analiz edilir.',
        },
        context_limit: {
          type: 'number',
          description: 'İsteğe bağlı özel token limiti.',
        },
      },
    },
    _meta: {
      ui: {
        visibility: ['model', 'app'],
      },
    },
  },
  {
    name: 'list_conversations',
    title: 'List Conversations',
    description: 'Son Antigravity konuşmalarını ve güncel context doluluk oranlarını listeler.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Döndürülecek maksimum konuşma sayısı (varsayılan 20).',
        },
      },
    },
    _meta: {
      ui: {
        visibility: ['model', 'app'],
      },
    },
  },
  {
    name: 'list_context_packs',
    title: 'List Context Packs',
    description: 'Kayıtlı tüm bağlam paketlerini (context packs) ve tahmini token maliyetlerini listeler.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    _meta: {
      ui: {
        visibility: ['model', 'app'],
      },
    },
  },
  {
    name: 'save_context_pack',
    title: 'Save Context Pack',
    description: 'Yeni bir bağlam paketi oluşturur veya mevcut bir paketi günceller (notlar, dosya yolları ve etiketler).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Güncelleme için mevcut paket ID\'si (yeni paket için boş bırakın).' },
        name: { type: 'string', description: 'Paket adı.' },
        description: { type: 'string', description: 'Kısa açıklama.' },
        notes: { type: 'string', description: 'Pakete eklenecek kurallar, talimatlar veya notlar.' },
        files: {
          type: 'array',
          items: { type: 'string' },
          description: 'Pakete dahil edilecek yerel dosya yolları.',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'İsteğe bağlı etiketler.',
        },
      },
      required: ['name'],
    },
    _meta: {
      ui: {
        visibility: ['model', 'app'],
      },
    },
  },
  {
    name: 'delete_context_pack',
    title: 'Delete Context Pack',
    description: 'Belirtilen ID\'ye sahip bağlam paketini siler.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Silinecek bağlam paketinin ID\'si.' },
      },
      required: ['id'],
    },
    _meta: {
      ui: {
        visibility: ['model', 'app'],
      },
    },
  },
  {
    name: 'resolve_context_pack',
    title: 'Resolve Context Pack',
    description: 'Bir bağlam paketinin notlarını ve içindeki yerel dosyaların güncel içeriğini birleştirip sohbete eklenmeye hazır metin olarak döndürür.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Çözümlenecek bağlam paketinin ID\'si.' },
      },
      required: ['id'],
    },
    _meta: {
      ui: {
        visibility: ['model', 'app'],
      },
    },
  },
  {
    name: 'list_vault',
    title: 'List Memory Vault',
    description: 'Taşınabilir Markdown hafıza kasasındaki (~/Antigravity-Brain) oturum notlarını, kararları, görevleri ve yakalanan kaynakları listeler.',
    inputSchema: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['all', 'handoff', 'decision', 'task', 'inbox'] },
        limit: { type: 'number' },
      },
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'save_handoff',
    title: 'Save Session Handoff',
    description: 'Yeni oturumda kaldığın yerden devam etmek için son işin sonucunu, açık konuları ve sonraki adımı Markdown notu olarak kaydeder.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Oturum başlığı.' },
        summary: { type: 'string', description: 'Son işin sonucu / özeti.' },
        openItems: { type: 'string', description: 'Açık kalan konular.' },
        nextStep: { type: 'string', description: 'Bir sonraki oturumda ilk yapılacak adım.' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['title'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'save_decision',
    title: 'Save Decision',
    description: 'Alınan bir kararı ve gerekçesini aranabilir Markdown dosyası olarak hafıza kasasına kaydeder.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Karar başlığı.' },
        decision: { type: 'string', description: 'Alınan karar.' },
        rationale: { type: 'string', description: 'Kararın gerekçesi / bağlamı.' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['title'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'capture_resource',
    title: 'Quick Capture Resource',
    description: 'Video, makale, dosya veya notu Yakala ile gelen kutusuna (inbox/) Markdown olarak kaydeder.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Kaynak başlığı.' },
        sourceType: { type: 'string', enum: ['video', 'article', 'file', 'note', 'makale', 'dosya', 'not'] },
        urlOrPath: { type: 'string', description: 'URL or local file path.' },
        notes: { type: 'string', description: 'Short notes.' },
        tags: { type: 'array', items: { type: 'string' } },
        lang: { type: 'string', enum: ['en', 'tr'] },
      },
      required: ['title'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'save_task',
    title: 'Save Task',
    description: 'Create a cross-session task in tasks/ with optional project and Kanban status.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title.' },
        notes: { type: 'string', description: 'Task details.' },
        project: { type: 'string', description: 'Optional project or conversation name.' },
        status: { type: 'string', enum: ['inbox', 'active', 'waiting', 'done', 'cancelled'] },
        priority: { type: 'string', enum: ['high', 'normal', 'low', 'yuksek', 'dusuk'] },
        tags: { type: 'array', items: { type: 'string' } },
        lang: { type: 'string', enum: ['en', 'tr'] },
      },
      required: ['title'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'update_task_status',
    title: 'Update Task Status',
    description: 'Move a task to one of the 5 Kanban columns: inbox, active, waiting, done, or cancelled.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Full path of the task file.' },
        status: { type: 'string', enum: ['inbox', 'active', 'waiting', 'done', 'cancelled'] },
      },
      required: ['path', 'status'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'toggle_task',
    title: 'Toggle Task Status',
    description: 'Bir görevin durumunu açık/tamamlandı arasında değiştirir.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Görev dosyasının tam yolu.' },
      },
      required: ['path'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'search_vault',
    title: 'Search Memory Vault',
    description: 'Hafıza kasasındaki tüm notlarda, kararlarda ve oturumlarda tam metin arama yapar.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Aranacak kelime veya ifade.' },
        limit: { type: 'number' },
      },
      required: ['query'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'read_vault_note',
    title: 'Read Vault Note',
    description: 'Hafıza kasasındaki bir Markdown dosyasının tam içeriğini okur.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Dosyanın tam yolu.' },
      },
      required: ['path'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'delete_vault_note',
    title: 'Delete Vault Note',
    description: 'Delete a Markdown file from the memory vault.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Full path of the file to delete.' },
      },
      required: ['path'],
    },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
  {
    name: 'get_preferences',
    title: 'Get Preferences',
    description: 'Read persisted UI preferences such as selected language.',
    inputSchema: { type: 'object', properties: {} },
    _meta: { ui: { visibility: ['app'] } },
  },
  {
    name: 'set_preferences',
    title: 'Set Preferences',
    description: 'Persist UI preferences such as selected language (en or tr).',
    inputSchema: {
      type: 'object',
      properties: {
        lang: { type: 'string', enum: ['en', 'tr'] },
      },
    },
    _meta: { ui: { visibility: ['app'] } },
  },
  {
    name: 'open_web_ui',
    title: 'Open Local Web UI',
    description: 'Start (or reuse) the local 127.0.0.1 Context Brain Web Kanban & Cockpit server and return its URL.',
    inputSchema: { type: 'object', properties: {} },
    _meta: { ui: { visibility: ['model', 'app'] } },
  },
];

const server = new Server(
  {
    name: 'context-brain',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: APP_URI,
      name: 'Context Brain App',
      description: 'Interactive Context Brain Monitor and Memory Vault UI',
      mimeType: APP_MIME,
      _meta: {
        ui: {
          prefersBorder: false,
        },
      },
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri !== APP_URI) {
    throw new Error(`Unknown resource URI: ${request.params.uri}`);
  }
  return {
    contents: [
      {
        uri: APP_URI,
        mimeType: APP_MIME,
        text: readAppHtml(),
        _meta: {
          ui: {
            prefersBorder: false,
          },
        },
      },
    ],
  };
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    if (name === 'open_context_window') {
      const analysis = analyzeConversation(args.conversation_id, args.context_limit);
      const packs = packStore.list();
      const vault = memoryVault.list('all', 40);
      const prefs = readPrefs();
      const validTabs = new Set(['monitor', 'packs', 'memory']);
      const structured = {
        activeTab: validTabs.has(args.tab) ? args.tab : 'monitor',
        analysis,
        packs,
        vault,
        prefs,
      };
      return {
        content: [
          {
            type: 'text',
            text: `${buildUsageSummaryText(analysis)}\nContext packs: ${packs.length} | Vault notes: ${vault.counts.all}`,
          },
        ],
        structuredContent: structured,
      };
    }

    if (name === 'get_context_usage') {
      const analysis = analyzeConversation(args.conversation_id, args.context_limit);
      return {
        content: [{ type: 'text', text: buildUsageSummaryText(analysis) }],
        structuredContent: analysis,
      };
    }

    if (name === 'list_conversations') {
      const convs = listConversations(Number(args.limit) || 20);
      const summary =
        convs.length === 0
          ? 'Konuşma bulunamadı.'
          : convs
              .slice(0, 8)
              .map(
                (c) =>
                  `- ${c.title} (${c.id.slice(0, 8)}): ${formatNumber(c.latestContextTokens)}/${formatNumber(c.contextLimit)} (%${c.utilizationPct})`
              )
              .join('\n');
      return {
        content: [{ type: 'text', text: summary }],
        structuredContent: { conversations: convs },
      };
    }

    if (name === 'list_context_packs') {
      const packs = packStore.list();
      const summary =
        packs.length === 0
          ? 'Henüz kayıtlı bağlam paketi yok.'
          : packs
              .map(
                (p) =>
                  `- [${p.id}] ${p.name}: ~${formatNumber(p.totalTokens)} token (${p.fileInfos.length} dosya)`
              )
              .join('\n');
      return {
        content: [{ type: 'text', text: summary }],
        structuredContent: { packs },
      };
    }

    if (name === 'save_context_pack') {
      const saved = packStore.save(args);
      const packs = packStore.list();
      return {
        content: [
          {
            type: 'text',
            text: `Bağlam paketi kaydedildi: "${saved.name}" (ID: ${saved.id}, ~${formatNumber(saved.totalTokens)} token)`,
          },
        ],
        structuredContent: { pack: saved, packs },
      };
    }

    if (name === 'delete_context_pack') {
      const deleted = packStore.delete(args.id);
      const packs = packStore.list();
      return {
        content: [
          {
            type: 'text',
            text: deleted ? `Bağlam paketi silindi (${args.id}).` : `Paket bulunamadı (${args.id}).`,
          },
        ],
        structuredContent: { deleted, packs },
      };
    }

    if (name === 'resolve_context_pack') {
      const resolved = packStore.resolve(args.id);
      if (!resolved) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Bağlam paketi bulunamadı: ${args.id}` }],
        };
      }
      return {
        content: [{ type: 'text', text: resolved.assembledText }],
        structuredContent: resolved,
      };
    }

    if (name === 'list_vault') {
      const vault = memoryVault.list(args.kind || 'all', Number(args.limit) || 40);
      return {
        content: [
          {
            type: 'text',
            text: `Hafıza Kasası (${vault.vaultDir}): ${vault.counts.all} not (${vault.counts.handoff} oturum, ${vault.counts.decision} karar, ${vault.counts.inbox} gelen kutusu).`,
          },
        ],
        structuredContent: vault,
      };
    }

    if (name === 'save_handoff') {
      const item = memoryVault.saveHandoff(args);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: `Oturum notu kaydedildi: ${item.title} (${item.path})` }],
        structuredContent: { item, vault },
      };
    }

    if (name === 'save_decision') {
      const item = memoryVault.saveDecision(args);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: `Karar kaydedildi: ${item.title} (${item.path})` }],
        structuredContent: { item, vault },
      };
    }

    if (name === 'capture_resource') {
      const item = memoryVault.captureResource(args);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: `Kaynak gelen kutusuna yakalandı: ${item.title} (${item.path})` }],
        structuredContent: { item, vault },
      };
    }

    if (name === 'save_task') {
      const item = memoryVault.saveTask(args);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: `Görev oluşturuldu: ${item.title} (${item.path})` }],
        structuredContent: { item, vault },
      };
    }

    if (name === 'toggle_task') {
      const item = memoryVault.toggleTask(args.path);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: `Task status updated: ${item.title} -> ${item.status}` }],
        structuredContent: { item, vault },
      };
    }

    if (name === 'update_task_status') {
      const item = memoryVault.updateTaskStatus(args.path, args.status);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: `Task moved: ${item.title} -> ${item.status}` }],
        structuredContent: { item, vault },
      };
    }

    if (name === 'search_vault') {
      const res = memoryVault.search(args.query, Number(args.limit) || 20);
      const summary =
        res.items.length === 0
          ? `"${args.query}" için eşleşen not bulunamadı.`
          : res.items.map((i) => `- [${i.kind}] ${i.title}: ${i.relativePath}`).join('\n');
      return {
        content: [{ type: 'text', text: summary }],
        structuredContent: res,
      };
    }

    if (name === 'read_vault_note') {
      const note = memoryVault.readNote(args.path);
      return {
        content: [{ type: 'text', text: note.content }],
        structuredContent: note,
      };
    }

    if (name === 'delete_vault_note') {
      const deleted = memoryVault.deleteNote(args.path);
      const vault = memoryVault.list('all', 40);
      return {
        content: [{ type: 'text', text: deleted ? 'Note deleted.' : 'Note not found.' }],
        structuredContent: { deleted, vault },
      };
    }

    if (name === 'get_preferences') {
      const prefs = readPrefs();
      return {
        content: [{ type: 'text', text: JSON.stringify(prefs) }],
        structuredContent: prefs,
      };
    }

    if (name === 'set_preferences') {
      const prefs = writePrefs(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(prefs) }],
        structuredContent: prefs,
      };
    }

    if (name === 'open_web_ui') {
      if (!activeWebServer) {
        activeWebServer = await startWebServer({
          dataDir,
          onClose: () => {
            activeWebServer = null;
          },
        });
      }
      return {
        content: [
          {
            type: 'text',
            text: `Context Brain Web is running locally at ${activeWebServer.url} (auto-closes after 30 min idle).`,
          },
        ],
        structuredContent: { url: activeWebServer.url, port: activeWebServer.port },
      };
    }

    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Hata: ${err?.message || String(err)}` }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
