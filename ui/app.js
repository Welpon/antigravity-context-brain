import {
  App,
  applyDocumentTheme,
  applyHostStyleVariables,
} from '@modelcontextprotocol/ext-apps';
import { z } from 'zod';

const I18N = {
  tr: {
    tabMonitor: 'İzleyici',
    tabPacks: 'Paketler',
    tabMemory: 'Hafıza',
    tabLog: 'Log',
    live: 'Canlı',
    liveTitle: '2 dk otomatik yenile',
    refreshTitle: 'Yenile',
    refreshPacksTitle: 'Paketleri Yenile',
    langTitle: 'Dili değiştir (TR / EN)',
    webBtnTitle: 'Yerel Web Kanban Panosunu tarayıcıda aç',
    toastWebReady: (u) => `Web arayüzü hazır: ${u}`,
    selectConvTitle: 'Konuşma Seç',
    selectLimitTitle: 'Bağlam Limiti',
    loadingConv: 'Konuşma verisi yükleniyor...',
    cache: 'Önbellek',
    uncached: 'Önbelleksiz',
    free: 'Boş',
    cacheHit: 'Önbellek İsabeti',
    lastTurn: 'son tur',
    output: 'Çıktı',
    totalTokens: 'toplam token',
    activity: 'Aktivite',
    turnUnit: 'tur',
    turnsUnit: 'tur',
    toolsUnit: 'araç',
    msgsUnit: 'mesaj',
    timeline: 'Zaman Çizelgesi',
    noTurns: 'Henüz tur verisi yok.',
    topSpikes: 'En Büyük Sıçramalar',
    topLabel: 'ilk',
    noSpikes: 'Henüz belirgin artış yok.',
    heaviestSteps: 'En Ağır Adımlar',
    noSteps: 'Adım verisi yok.',
    breakdown: 'Kategori Dağılımı',
    catSystem: 'Sistem',
    catTools: 'Araçlar',
    catUser: 'Kullanıcı',
    catModel: 'Model',
    catThinking: 'Düşünme',
    totalLabel: 'Toplam',
    unitK: 'B',
    unitM: 'Mn',
    warnWarning: 'Bağlam dolmaya başlıyor (%65+). Yakında `/compact` kullanabilirsiniz.',
    warnCritical: 'Bağlam kritik seviyede (%85+). `/compact` çalıştırmanız önerilir.',
    savedPacks: 'kayıtlı paket',
    newPack: '+ Yeni Paket',
    editPackTitle: 'Paketi Düzenle',
    newPackTitle: 'Yeni Bağlam Paketi',
    packName: 'Paket Adı *',
    packNamePh: 'Örn: Mimari Kurallar',
    packDesc: 'Açıklama',
    packDescPh: 'Kısa özet...',
    packTags: 'Etiketler (virgülle ayırın)',
    packTagsPh: 'backend, api',
    packNotes: 'Notlar / Kurallar',
    packNotesPh: 'Bağlam notları...',
    packFiles: 'Yerel Dosya Yolları (her satıra bir yol)',
    cancel: 'İptal',
    save: 'Kaydet',
    attachedLabel: 'Ekli:',
    clear: 'Temizle',
    emptyPacks: 'Henüz kayıtlı bağlam paketi yok.<br/>Not ve dosyaları paketleyip tek tıkla sohbete ekleyebilirsiniz.',
    attachBtn: '📎 Bağlama Ekle',
    sendBtn: '↗ Gönder',
    editBtn: '✎ Düzenle',
    deleteBtn: 'Sil',
    missing: 'Eksik',
    justNow: 'az önce',
    secAgo: (n) => `${n}s önce`,
    minAgo: (n) => `${n}dk önce`,
    hrAgo: (n) => `${n}sa önce`,
    dayAgo: (n) => `${n}g önce`,
    toastLiveOn: 'Canlı izleme açık (2 dk)',
    toastLiveOff: 'Canlı izleme duraklatıldı',
    toastNeedName: 'Lütfen paket adı girin.',
    toastSaved: (n) => `"${n}" kaydedildi.`,
    toastDeleted: (n) => `"${n}" silindi.`,
    toastAttached: (n, tok) => `"${n}" (~${tok}) sonraki mesaja eklendi.`,
    toastCleared: 'Ekli bağlam temizlendi.',
    toastSent: (n) => `"${n}" sohbete gönderildi.`,
    toastNoAttach: 'Bu görünümde doğrudan bağlam ekleme desteklenmiyor.',
    toastNoSend: 'Bu görünümde sohbete doğrudan gönderim desteklenmiyor.',
    toastErrRefresh: (m) => `Yenileme hatası: ${m}`,
    toastErrPacks: (m) => `Paketler yüklenemedi: ${m}`,
    toastErrSave: (m) => `Kaydetme hatası: ${m}`,
    toastErrDelete: (m) => `Silme hatası: ${m}`,
    toastErrAttach: (m) => `Bağlam eklenemedi: ${m}`,
    toastErrClear: (m) => `Temizleme hatası: ${m}`,
    toastErrSend: (m) => `Gönderim hatası: ${m}`,
    sendPromptPrefix: 'Aşağıdaki bağlam paketini bu konuşma için referans olarak kullan:',
    initError: 'Başlatma hatası:',
    toolCountPill: (n) => `${n} araç`,
    vaultHint: 'Claude, Codex, Obsidian ve Git ile uyumlu düz Markdown kasası',
    openAgents: 'Rehber',
    btnHandoff: '💾 Oturum Kaydet',
    btnTask: '✅ Görev Ekle',
    btnCapture: '⚡ Yakala',
    btnDecision: '🧭 Karar Ekle',
    btnPack: '📦 Paket Ekle',
    searchPh: 'Doğal dille ara (örn: hangi dili seçtik)...',
    searchBtn: 'Ara',
    filterAll: 'Tümü',
    filterHandoff: 'Oturumlar',
    filterTask: 'Görevler',
    filterDecision: 'Kararlar',
    filterInbox: 'Gelen Kutusu',
    filterPack: 'Paketler',
    kindHandoff: 'Oturum',
    kindTask: 'Görev',
    kindDecision: 'Karar',
    kindInbox: 'Yakala',
    kindPack: 'Paket',
    kindNote: 'Not',
    taskFormTitle: 'Yeni Görev (Oturumlar Arası)',
    taskEditFormTitle: 'Görevi Düzenle',
    taskTitleLbl: 'Görev Başlığı *',
    taskTitlePh: 'Örn: İlk taslağı hazırla',
    taskProjectLbl: 'Proje / Sohbet',
    taskProjectPh: 'İsteğe bağlı proje veya sohbet adı',
    taskStatusLbl: 'Durum',
    taskPriorityLbl: 'Öncelik',
    taskNotesLbl: 'Notlar',
    taskNotesPh: 'Görev detayları...',
    allProjectsOpt: 'Tüm sohbetler ve projeler',
    colInbox: 'GELEN',
    colActive: 'AKTİF',
    colWaiting: 'BEKLİYOR',
    colDone: 'BİTTİ',
    colCancelled: 'İPTAL',
    taskToggleDone: '☑ Tamamlandı',
    taskToggleOpen: '☐ Tamamla',
    toastTaskSaved: 'Görev kasaya kaydedildi.',
    toastTaskToggled: 'Görev durumu güncellendi.',
    handoffFormTitle: 'Oturum Devir Notu (Kaldığın Yerden Devam)',
    handoffTitleLbl: 'Başlık *',
    handoffTitlePh: 'Örn: Context Window eklentisi v1.2',
    handoffSummaryLbl: 'Son İşin Sonucu',
    handoffSummaryPh: 'Bugün neler tamamlandı?',
    handoffOpenLbl: 'Açık Konular',
    handoffOpenPh: 'Henüz bitmeyen veya bekleyen işler...',
    handoffNextLbl: 'Sonraki Adım',
    handoffNextPh: 'Yeni oturumda ilk ne yapılacak?',
    captureFormTitle: 'Hızlı Yakala (Gelen Kutusu)',
    captureTypeLbl: 'Kaynak Türü',
    captureUrlLbl: 'Link veya Dosya Yolu',
    captureUrlPh: 'https://... veya C:\\dosya\\yolu',
    captureNotesLbl: 'Kısa Not',
    captureNotesPh: 'Bu kaynak neden önemli?',
    decisionFormTitle: 'Karar Kaydet',
    decisionTitleLbl: 'Karar Başlığı *',
    decisionTitlePh: 'Örn: Veritabanı olarak SQLite seçimi',
    decisionBodyLbl: 'Alınan Karar',
    decisionBodyPh: 'Neye karar verildi?',
    decisionWhyLbl: 'Gerekçe',
    decisionWhyPh: 'Neden bu karar alındı?',
    openFileBtn: '📂 Dosyayı Aç',
    continueBtn: '📎 Bağlama Ekle',
    emptyVault: 'Hafıza kasasında henüz not yok.<br/>Yukarıdan oturum notu kaydedebilir, karar ekleyebilir veya kaynak yakalayabilirsin.',
    toastHandoffSaved: 'Oturum notu kasaya kaydedildi.',
    toastDecisionSaved: 'Karar kasaya kaydedildi.',
    toastCaptured: 'Kaynak gelen kutusuna yakalandı.',
    toastNoteDeleted: 'Not silindi.',
    toastFileOpened: 'Dosya yan panelde açıldı.',
    toastFileOpenFail: 'Bu görünümde dosya yan panelde açılamadı.',
    toastNoteAttached: (n) => `"${n}" sonraki mesaja eklendi.`,
    toastNoteSent: (n) => `"${n}" sohbete gönderildi.`,
    logFilterPh: 'Loglarda ara...',
    logClearBtn: 'Temizle',
    logEmpty: 'Henüz kaydedilmiş bir aktivite yok.',
    toastLogsCleared: 'Log geçmişi temizlendi.',
    logActions: {
      task_created: 'Görev Eklendi',
      task_edited: 'Görev Düzenlendi',
      task_moved: 'Durum Değişti',
      handoff_saved: 'Oturum Kaydedildi',
      decision_saved: 'Karar Kaydedildi',
      resource_captured: 'Kaynak Yakalandı',
      note_deleted: 'Silindi',
      note_restored: 'Geri Alındı',
      note_pinned: 'Sabitlendi',
      note_unpinned: 'Sabit Kaldırıldı',
      vault_backup: 'Yedek Alındı',
      pack_saved: 'Paket Kaydedildi',
      pack_deleted: 'Paket Silindi',
      web_opened: 'Web Açıldı',
    },
    dueLbl: 'Hedef Tarih',
    pinLbl: 'Sabitle / Kaldır',
    overdueLbl: 'Gecikti',
    todayLbl: 'Bugün',
    backupBtn: '💾 Yedekle',
    snapshotBtn: '⚡ Sohbeti Kaydet',
    restoreBtn: '↩ Geri Al',
    toastBackup: (n) => `Yedek alındı (${n} dosya)!`,
    toastRestored: 'Çöp kutusundan geri alındı!',
  },
  en: {
    tabMonitor: 'Monitor',
    tabPacks: 'Packs',
    tabMemory: 'Memory',
    tabLog: 'Log',
    live: 'Live',
    liveTitle: 'Auto-refresh every 2 min',
    refreshTitle: 'Refresh',
    refreshPacksTitle: 'Refresh Packs',
    langTitle: 'Switch language (TR / EN)',
    webBtnTitle: 'Open local Web Kanban Board in browser',
    toastWebReady: (u) => `Web UI ready: ${u}`,
    selectConvTitle: 'Select Conversation',
    selectLimitTitle: 'Context Limit',
    loadingConv: 'Loading conversation data...',
    cache: 'Cache',
    uncached: 'Uncached',
    free: 'Free',
    cacheHit: 'Cache Hit',
    lastTurn: 'last turn',
    output: 'Output',
    totalTokens: 'total tokens',
    activity: 'Activity',
    turnUnit: 'turns',
    turnsUnit: 'turns',
    toolsUnit: 'tools',
    msgsUnit: 'msgs',
    timeline: 'Timeline',
    noTurns: 'No turn data yet.',
    topSpikes: 'Top Spikes',
    topLabel: 'top',
    noSpikes: 'No significant spikes yet.',
    heaviestSteps: 'Heaviest Steps',
    noSteps: 'No step data.',
    breakdown: 'Category Breakdown',
    catSystem: 'System',
    catTools: 'Tools',
    catUser: 'User',
    catModel: 'Model',
    catThinking: 'Thinking',
    totalLabel: 'Total',
    unitK: 'K',
    unitM: 'M',
    warnWarning: 'Context window is filling up (65%+). Consider running `/compact` soon.',
    warnCritical: 'Context window is critical (85%+). Running `/compact` is recommended.',
    savedPacks: 'saved packs',
    newPack: '+ New Pack',
    editPackTitle: 'Edit Context Pack',
    newPackTitle: 'New Context Pack',
    packName: 'Pack Name *',
    packNamePh: 'e.g. Architecture Rules',
    packDesc: 'Description',
    packDescPh: 'Short summary...',
    packTags: 'Tags (comma-separated)',
    packTagsPh: 'backend, api',
    packNotes: 'Notes / Instructions',
    packNotesPh: 'Context notes or rules...',
    packFiles: 'Local File Paths (one per line)',
    cancel: 'Cancel',
    save: 'Save',
    attachedLabel: 'Attached:',
    clear: 'Clear',
    emptyPacks: 'No saved context packs yet.<br/>Bundle notes and local files to attach them to chat in one click.',
    attachBtn: '📎 Attach Context',
    sendBtn: '↗ Send',
    editBtn: '✎ Edit',
    deleteBtn: 'Delete',
    missing: 'Missing',
    justNow: 'just now',
    secAgo: (n) => `${n}s ago`,
    minAgo: (n) => `${n}m ago`,
    hrAgo: (n) => `${n}h ago`,
    dayAgo: (n) => `${n}d ago`,
    toastLiveOn: 'Live refresh enabled (2 min)',
    toastLiveOff: 'Live refresh paused',
    toastNeedName: 'Please enter a pack name.',
    toastSaved: (n) => `Saved "${n}".`,
    toastDeleted: (n) => `Deleted "${n}".`,
    toastAttached: (n, tok) => `Attached "${n}" (~${tok}) to next message.`,
    toastCleared: 'Cleared attached context.',
    toastSent: (n) => `Sent "${n}" to chat.`,
    toastNoAttach: 'Attaching context is not supported on this surface.',
    toastNoSend: 'Sending messages is not supported on this surface.',
    toastErrRefresh: (m) => `Refresh error: ${m}`,
    toastErrPacks: (m) => `Failed to load packs: ${m}`,
    toastErrSave: (m) => `Save error: ${m}`,
    toastErrDelete: (m) => `Delete error: ${m}`,
    toastErrAttach: (m) => `Attach error: ${m}`,
    toastErrClear: (m) => `Clear error: ${m}`,
    toastErrSend: (m) => `Send error: ${m}`,
    sendPromptPrefix: 'Use the following context pack as reference for this conversation:',
    initError: 'Initialization error:',
    toolCountPill: (n) => `${n} tools`,
    vaultHint: 'Portable plain Markdown vault compatible with Claude, Codex, Obsidian & Git',
    openAgents: 'Guide',
    btnHandoff: '💾 Save Handoff',
    btnTask: '✅ Add Task',
    btnCapture: '⚡ Capture',
    btnDecision: '🧭 Decision',
    btnPack: '📦 Add Pack',
    searchPh: 'Search naturally (e.g. which language)...',
    searchBtn: 'Search',
    filterAll: 'All',
    filterHandoff: 'Sessions',
    filterTask: 'Tasks',
    filterDecision: 'Decisions',
    filterInbox: 'Inbox',
    filterPack: 'Packs',
    kindHandoff: 'Session',
    kindTask: 'Task',
    kindDecision: 'Decision',
    kindInbox: 'Inbox',
    kindPack: 'Pack',
    kindNote: 'Note',
    taskFormTitle: 'New Task (Cross-Session)',
    taskEditFormTitle: 'Edit Task',
    taskTitleLbl: 'Task Title *',
    taskTitlePh: 'e.g. Prepare initial draft',
    taskProjectLbl: 'Project / Chat',
    taskProjectPh: 'Optional project or conversation name',
    taskStatusLbl: 'Status',
    taskPriorityLbl: 'Priority',
    taskNotesLbl: 'Notes',
    taskNotesPh: 'Task details...',
    allProjectsOpt: 'All chats & projects',
    colInbox: 'INBOX',
    colActive: 'ACTIVE',
    colWaiting: 'WAITING',
    colDone: 'DONE',
    colCancelled: 'CANCELLED',
    taskToggleDone: '☑ Done',
    taskToggleOpen: '☐ Mark Done',
    toastTaskSaved: 'Task saved to vault.',
    toastTaskToggled: 'Task status updated.',
    handoffFormTitle: 'Session Handoff (Pick Up Where You Left Off)',
    handoffTitleLbl: 'Title *',
    handoffTitlePh: 'e.g. Context Window plugin v1.2',
    handoffSummaryLbl: 'Outcome / Summary',
    handoffSummaryPh: 'What was completed?',
    handoffOpenLbl: 'Open Items',
    handoffOpenPh: 'Pending or unresolved topics...',
    handoffNextLbl: 'Next Step',
    handoffNextPh: 'First thing to do in the next session...',
    captureFormTitle: 'Quick Capture (Inbox)',
    captureTypeLbl: 'Source Type',
    captureUrlLbl: 'URL or File Path',
    captureUrlPh: 'https://... or C:\\path\\to\\file',
    captureNotesLbl: 'Notes',
    captureNotesPh: 'Why save this resource?',
    decisionFormTitle: 'Save Decision',
    decisionTitleLbl: 'Decision Title *',
    decisionTitlePh: 'e.g. Use SQLite for local storage',
    decisionBodyLbl: 'Decision',
    decisionBodyPh: 'What was decided?',
    decisionWhyLbl: 'Rationale',
    decisionWhyPh: 'Why was this chosen?',
    openFileBtn: '📂 Open File',
    continueBtn: '📎 Attach Context',
    emptyVault: 'No notes in your memory vault yet.<br/>Save a session handoff, record a decision, or quick-capture a resource above.',
    toastHandoffSaved: 'Session handoff saved to vault.',
    toastDecisionSaved: 'Decision saved to vault.',
    toastCaptured: 'Resource captured to inbox.',
    toastNoteDeleted: 'Note deleted.',
    toastFileOpened: 'Opened file in side pane.',
    toastFileOpenFail: 'Cannot open file in side pane on this view.',
    toastNoteAttached: (n) => `Attached "${n}" to next message.`,
    toastNoteSent: (n) => `Sent "${n}" to chat.`,
    logFilterPh: 'Filter logs...',
    logClearBtn: 'Clear',
    logEmpty: 'No activity recorded yet.',
    toastLogsCleared: 'Activity log cleared.',
    logActions: {
      task_created: 'Task Created',
      task_edited: 'Task Edited',
      task_moved: 'Status Changed',
      handoff_saved: 'Handoff Saved',
      decision_saved: 'Decision Saved',
      resource_captured: 'Captured',
      note_deleted: 'Deleted',
      note_restored: 'Restored',
      note_pinned: 'Pinned',
      note_unpinned: 'Unpinned',
      vault_backup: 'Vault Backed Up',
      pack_saved: 'Pack Saved',
      pack_deleted: 'Pack Deleted',
      web_opened: 'Web Opened',
    },
    dueLbl: 'Due Date',
    pinLbl: 'Pin / Unpin',
    overdueLbl: 'Overdue',
    todayLbl: 'Today',
    backupBtn: '💾 Backup',
    snapshotBtn: '⚡ Snapshot',
    restoreBtn: '↩ Restore',
    toastBackup: (n) => `Backup saved (${n} files)!`,
    toastRestored: 'Restored from trash!',
  },
};

const state = {
  lang: 'en',
  activeTab: 'monitor',
  analysis: null,
  packs: [],
  vault: null,
  logs: [],
  logFilter: '',
  logCat: 'all',
  expandedLogs: new Set(),
  vaultFilter: 'all',
  taskProjectFilter: '__all__',
  vaultSearchQuery: '',
  vaultSearchResults: null,
  vaultForm: null, // 'handoff' | 'capture' | 'decision' | null
  selectedConvId: '',
  customLimit: 0,
  autoRefresh: true,
  autoRefreshTimer: null,
  clockTimer: null,
  heaviestOpen: true,
  breakdownOpen: true,
  expandedSpikes: new Set(),
  editingPackId: null,
  editingTaskPath: null,
  showPackForm: false,
  attachedPackName: null,
  loading: false,
  capabilities: {},
};

function t(key, ...args) {
  const dict = I18N[state.lang] || I18N.tr;
  const val = dict[key] ?? I18N.tr[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}

const TOOL_LABELS_TR = {
  read_file: 'Dosya Oku',
  write_file: 'Dosya Yaz',
  edit_file: 'Dosya Düzenle',
  run_command: 'Komut Çalıştır',
  search_web: 'Web Ara',
  search_marketplace: 'Mağaza Ara',
  ask_question: 'Soru Sor',
  manage_task: 'Görev Yönet',
  invoke_subagent: 'Alt Ajan',
  send_message: 'Mesaj Gönder',
  update_steps: 'Adım Güncelle',
  update_focus: 'Odak Güncelle',
  list_dir: 'Dizin Listele',
  grep_search: 'Metin Ara',
  find_by_name: 'Dosya Bul',
};

function localizeStepLabel(label) {
  if (!label) return '';
  let text = String(label);
  if (state.lang === 'en') {
    return text
      .replace(/^Model \+ Araçlar /, 'Model + Tools ')
      .replace(/^Kullanıcı Mesajı$/, 'User Message')
      .replace(/^Araç Çıktısı$/, 'Tool Output')
      .replace(/^Sistem Mesajı$/, 'System Message')
      .replace(/^Model Yanıtı$/, 'Model Response')
      .replace(/^Mesaj \/ Yanıt$/, 'Message / Response');
  }
  text = text.replace(/^user · /, 'Kullanıcı · ');
  for (const [raw, trName] of Object.entries(TOOL_LABELS_TR)) {
    text = text.replace(new RegExp(`\\b${raw}\\b`, 'g'), trName);
  }
  return text;
}

function cap100(text) {
  const clean = String(text || '').trim();
  return clean.length > 100 ? `${clean.slice(0, 99)}…` : clean;
}

function humanizePreview(preview) {
  if (!preview || preview === '__desc:empty') {
    return state.lang === 'tr' ? 'Boş adım çıktısı.' : 'Empty step output.';
  }
  const str = String(preview);
  if (!str.startsWith('__desc:')) {
    return cap100(str);
  }

  const parts = str.slice(7).split('|');
  const kind = parts[0];
  const isTr = state.lang === 'tr';

  if (kind === 'actions') {
    const rawItems = (parts[1] || '').split(';').filter(Boolean);
    const groups = new Map();
    for (const entry of rawItems) {
      const colonIdx = entry.indexOf(':');
      const tool = colonIdx === -1 ? entry : entry.slice(0, colonIdx);
      const target = colonIdx === -1 ? '' : entry.slice(colonIdx + 1);
      if (!groups.has(tool)) groups.set(tool, []);
      groups.get(tool).push(target);
    }

    const formatList = (arr) => {
      const uniq = [...new Set(arr.filter(Boolean))];
      if (uniq.length === 0) return '';
      if (uniq.length === 1) return uniq[0];
      const conj = isTr ? ' ve ' : ' and ';
      return `${uniq.slice(0, -1).join(', ')}${conj}${uniq[uniq.length - 1]}`;
    };

    const clauses = [];
    for (const [tool, targets] of groups.entries()) {
      const names = formatList(targets);
      const count = targets.length;

      if (tool === 'write_file') {
        const uniqLen = new Set(targets.filter(Boolean)).size;
        clauses.push(
          isTr
            ? names
              ? `${names} ${uniqLen > 1 ? 'dosyaları' : 'dosyası'} güncellendi`
              : `${count} dosya oluşturuldu`
            : names
              ? `Updated ${names}`
              : `Created ${count} file(s)`
        );
      } else if (tool === 'edit_file') {
        clauses.push(
          isTr
            ? names
              ? `${names} düzenlendi`
              : `${count} dosya düzenlendi`
            : names
              ? `Edited ${names}`
              : `Edited ${count} file(s)`
        );
      } else if (tool === 'read_file') {
        const uniqCount = new Set(targets.filter(Boolean)).size;
        clauses.push(
          isTr
            ? count > 1 && uniqCount === 1
              ? `${count} adet ${targets[0]} belgesi incelendi`
              : names
                ? `${names} incelendi`
                : `${count} belge incelendi`
            : count > 1 && uniqCount === 1
              ? `Reviewed ${count} ${targets[0]} files`
              : names
                ? `Reviewed ${names}`
                : `Reviewed ${count} file(s)`
        );
      } else if (tool === 'run_command') {
        clauses.push(isTr ? 'sistem kontrolü/derleme çalıştırıldı' : 'ran a build/check command');
      } else if (tool === 'ask_question') {
        clauses.push(isTr ? 'tercihleriniz için soru soruldu' : 'asked a clarifying question');
      } else if (tool === 'search_marketplace' || tool === 'search_web') {
        clauses.push(isTr ? 'ilgili eklenti ve kaynaklar arandı' : 'searched plugins and resources');
      } else if (tool === 'manage_task') {
        clauses.push(isTr ? 'arka plan görevi kontrol edildi' : 'checked background task');
      } else {
        clauses.push(isTr ? `${localizeStepLabel(tool)} işlemi yapıldı` : `ran ${tool}`);
      }
    }

    if (clauses.length === 0) {
      return isTr ? 'Planlanan adımlar tamamlandı.' : 'Completed planned actions.';
    }
    const sentence = clauses.join(', ');
    const capitalized = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    return cap100(capitalized);
  }

  if (kind === 'read_lines') {
    return cap100(
      isTr
        ? `Belgeden toplam ${parts[1]} satırlık içerik okunup incelendi.`
        : `Read and reviewed ${parts[1]} lines from a document.`
    );
  }
  if (kind === 'cmd_exit') {
    const ok = parts[1] === '0';
    return cap100(
      isTr
        ? ok
          ? 'Çalıştırılan işlem sorunsuz şekilde tamamlandı.'
          : 'Çalıştırılan işlem bir hata ile sonlandı.'
        : ok
          ? 'The command completed successfully.'
          : 'The command finished with an error.'
    );
  }
  if (kind === 'file_edit') {
    return cap100(
      isTr
        ? `${parts[2]} üzerinde ${parts[1]} düzenleme başarıyla uygulandı.`
        : `Successfully applied ${parts[1]} edit(s) to ${parts[2]}.`
    );
  }
  if (kind === 'file_created') {
    return isTr ? 'Yeni dosya başarıyla oluşturuldu.' : 'New file was created successfully.';
  }
  if (kind === 'bg_task') {
    return isTr ? 'İşlem arka planda çalışmaya başladı.' : 'Started running the task in the background.';
  }
  if (kind === 'user_choices') {
    return isTr ? 'Seçtiğiniz tercihler kaydedildi.' : 'Recorded your selected preferences.';
  }
  if (kind === 'search_results') {
    return isTr ? 'Arama sonuçları alınıp değerlendirildi.' : 'Retrieved and reviewed search results.';
  }
  if (kind === 'ok') {
    return isTr ? 'İşlem başarıyla onaylandı.' : 'Action confirmed successfully.';
  }
  if (kind === 'thinking') {
    return isTr ? 'Asistan bir sonraki adımı değerlendirdi.' : 'Assistant evaluated the next step.';
  }
  return cap100(str);
}

const app = new App({ name: 'Context Brain', version: '1.0.0' }, {});

function fmt(n) {
  return Number(n || 0).toLocaleString(state.lang === 'tr' ? 'tr-TR' : 'en-US');
}

function fmtCompact(n) {
  const num = Number(n || 0);
  const uM = t('unitM');
  const uK = t('unitK');
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}${uM}`;
  }
  if (num >= 100_000) return `${Math.round(num / 1_000)}${uK}`;
  if (num >= 10_000) return `${(num / 1_000).toFixed(1)}${uK}`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}${uK}`;
  return String(Math.round(num));
}

function fmtDateTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(state.lang === 'tr' ? 'tr-TR' : 'en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

function fmtRelativeTime(iso) {
  if (!iso) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 5) return t('justNow');
  if (diffSec < 60) return t('secAgo', diffSec);
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return t('minAgo', mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('hrAgo', hrs);
  return t('dayAgo', Math.floor(hrs / 24));
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

function applyThemeFromContext(ctx) {
  if (!ctx) return;
  if (ctx.theme) applyDocumentTheme(ctx.theme);
  if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
}

// Register handlers BEFORE connect()
app.ontoolinput = ({ arguments: args }) => {
  if (args?.tab === 'packs') {
    state.activeTab = 'memory';
    state.vaultFilter = 'pack';
  } else if (args?.tab === 'monitor' || args?.tab === 'memory' || args?.tab === 'logs') {
    state.activeTab = args.tab;
  }
  if (args?.conversation_id) state.selectedConvId = args.conversation_id;
  if (args?.context_limit) state.customLimit = Number(args.context_limit) || 0;
  state.loading = true;
  render();
};

app.ontoolresult = (result) => {
  state.loading = false;
  const sc = result?.structuredContent;
  if (sc) {
    if (sc.activeTab === 'packs') {
      state.activeTab = 'memory';
      state.vaultFilter = 'pack';
    } else if (sc.activeTab) {
      state.activeTab = sc.activeTab;
    }
    if (sc.analysis) {
      state.analysis = sc.analysis;
      if (sc.analysis.conversationId) state.selectedConvId = sc.analysis.conversationId;
    } else if (sc.found !== undefined) {
      state.analysis = sc;
      if (sc.conversationId) state.selectedConvId = sc.conversationId;
    }
    if (Array.isArray(sc.packs)) {
      state.packs = sc.packs;
    }
    if (sc.vault) {
      state.vault = sc.vault;
    }
    if (Array.isArray(sc.logs)) {
      state.logs = sc.logs;
    }
    if (sc.prefs?.lang === 'tr' || sc.prefs?.lang === 'en') {
      state.lang = sc.prefs.lang;
      document.documentElement.lang = state.lang;
    }
  }
  render();
};

app.onhostcontextchanged = (ctx) => {
  applyThemeFromContext(ctx);
};

async function callTool(name, args = {}) {
  const res = await app.callServerTool({ name, arguments: args });
  if (res?.isError) {
    const errText = res.content?.[0]?.text || 'Tool call failed.';
    throw new Error(errText);
  }
  return res?.structuredContent;
}

async function refreshMonitor(silent = false) {
  if (!silent) {
    state.loading = true;
    render();
  }
  try {
    const args = {};
    if (state.selectedConvId) args.conversation_id = state.selectedConvId;
    if (state.customLimit > 0) args.context_limit = state.customLimit;
    const data = await callTool('get_context_usage', args);
    if (data) {
      state.analysis = data;
      if (data.conversationId) state.selectedConvId = data.conversationId;
    }
  } catch (err) {
    if (!silent) showToast(t('toastErrRefresh', err.message));
  } finally {
    state.loading = false;
    render();
  }
}

async function refreshPacks() {
  try {
    const data = await callTool('list_context_packs', {});
    if (Array.isArray(data?.packs)) {
      state.packs = data.packs;
      render();
    }
  } catch (err) {
    showToast(t('toastErrPacks', err.message));
  }
}

async function refreshVault(kind = state.vaultFilter) {
  try {
    const data = await callTool('list_vault', { kind, limit: 40 });
    if (data) {
      state.vault = data;
      state.vaultSearchResults = null;
      render();
    }
  } catch (err) {
    showToast(err.message);
  }
}

async function refreshLogs() {
  try {
    const data = await callTool('list_activity_log', { limit: 150 });
    if (Array.isArray(data?.logs)) {
      state.logs = data.logs;
      render();
    }
  } catch (err) {
    showToast(err.message);
  }
}

async function handleClearLogs() {
  try {
    await callTool('clear_activity_log', {});
    state.logs = [];
    showToast(t('toastLogsCleared'));
    render();
  } catch (err) {
    showToast(err.message);
  }
}

async function handleSaveHandoff(e) {
  e.preventDefault();
  const form = e.target;
  const title = form.hoTitle.value.trim();
  const summary = form.hoSummary.value;
  const openItems = form.hoOpen.value;
  const nextStep = form.hoNext.value;
  if (!title) {
    showToast(t('toastNeedName'));
    return;
  }
  try {
    const res = await callTool('save_handoff', { title, summary, openItems, nextStep, lang: state.lang, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    state.vaultForm = null;
    state.vaultSearchResults = null;
    showToast(t('toastHandoffSaved'));
    render();
  } catch (err) {
    showToast(t('toastErrSave', err.message));
  }
}

async function handleSaveDecision(e) {
  e.preventDefault();
  const form = e.target;
  const title = form.decTitle.value.trim();
  const decision = form.decBody.value;
  const rationale = form.decWhy.value;
  const tags = form.decTags.value
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  if (!title) {
    showToast(t('toastNeedName'));
    return;
  }
  try {
    const res = await callTool('save_decision', { title, decision, rationale, tags, lang: state.lang, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    state.vaultForm = null;
    state.vaultSearchResults = null;
    showToast(t('toastDecisionSaved'));
    render();
  } catch (err) {
    showToast(t('toastErrSave', err.message));
  }
}

async function handleCaptureResource(e) {
  e.preventDefault();
  const form = e.target;
  const title = form.capTitle.value.trim();
  const sourceType = form.capType.value;
  const urlOrPath = form.capUrl.value.trim();
  const notes = form.capNotes.value;
  if (!title) {
    showToast(t('toastNeedName'));
    return;
  }
  try {
    const res = await callTool('capture_resource', { title, sourceType, urlOrPath, notes, lang: state.lang, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    state.vaultForm = null;
    state.vaultSearchResults = null;
    showToast(t('toastCaptured'));
    render();
  } catch (err) {
    showToast(t('toastErrSave', err.message));
  }
}

async function handleSaveTask(e) {
  e.preventDefault();
  const form = e.target;
  const title = form.taskTitle.value.trim();
  const project = (form.taskProject?.value || '').trim();
  const dueDate = form.taskDue?.value || '';
  const status = form.taskStatus?.value || 'inbox';
  const priority = form.taskPriority.value;
  const notes = form.taskNotes.value;
  if (!title) {
    showToast(t('toastNeedName'));
    return;
  }
  try {
    const res = state.editingTaskPath
      ? await callTool('update_task', {
          path: state.editingTaskPath,
          title,
          project,
          dueDate,
          status,
          priority,
          notes,
          lang: state.lang,
          source: 'antigravity',
        })
      : await callTool('save_task', { title, project, dueDate, status, priority, notes, lang: state.lang, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    state.vaultForm = null;
    state.editingTaskPath = null;
    state.vaultSearchResults = null;
    showToast(t('toastTaskSaved'));
    render();
  } catch (err) {
    showToast(t('toastErrSave', err.message));
  }
}

async function handleUpdateTaskStatus(filePath, status) {
  try {
    const res = await callTool('update_task_status', { path: filePath, status, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    if (state.vaultSearchQuery) {
      const sres = await callTool('search_vault', { query: state.vaultSearchQuery, limit: 25 });
      state.vaultSearchResults = sres?.items || [];
    }
    showToast(t('toastTaskToggled'));
    render();
  } catch (err) {
    showToast(err.message);
  }
}

async function handleSearchVault(e) {
  e.preventDefault();
  const q = (document.getElementById('vaultSearchInput')?.value || '').trim();
  state.vaultSearchQuery = q;
  if (!q) {
    state.vaultSearchResults = null;
    await refreshVault(state.vaultFilter);
    return;
  }
  try {
    const res = await callTool('search_vault', { query: q, limit: 25 });
    state.vaultSearchResults = res?.items || [];
    render();
  } catch (err) {
    showToast(err.message);
  }
}

async function handleOpenVaultFile(fileUri) {
  try {
    const result = await app.request(
      {
        method: 'com.google.antigravity/toggle-aux-pane',
        params: { tabType: 'fileView', uri: fileUri },
      },
      z.object({ isError: z.boolean().optional() }).passthrough()
    );
    if (result?.isError) {
      showToast(t('toastFileOpenFail'));
    } else {
      showToast(t('toastFileOpened'));
    }
  } catch {
    showToast(t('toastFileOpenFail'));
  }
}

async function handleAttachVaultNote(filePath, title) {
  if (!state.capabilities?.updateModelContext) {
    showToast(t('toastNoAttach'));
    return;
  }
  try {
    const note = await callTool('read_vault_note', { path: filePath });
    await app.updateModelContext({
      content: [{ type: 'text', text: note.content }],
    });
    state.attachedPackName = title;
    showToast(t('toastNoteAttached', title));
    render();
  } catch (err) {
    showToast(t('toastErrAttach', err.message));
  }
}

async function handleSendVaultNote(filePath, title) {
  if (!state.capabilities?.message) {
    showToast(t('toastNoSend'));
    return;
  }
  try {
    const note = await callTool('read_vault_note', { path: filePath });
    await app.sendMessage({
      role: 'user',
      content: [{ type: 'text', text: `${t('sendPromptPrefix')}\n\n${note.content}` }],
    });
    showToast(t('toastNoteSent', title));
  } catch (err) {
    showToast(t('toastErrSend', err.message));
  }
}

async function handleDeleteVaultNote(filePath) {
  try {
    const res = await callTool('delete_vault_note', { path: filePath, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    if (state.vaultSearchQuery) {
      const sres = await callTool('search_vault', { query: state.vaultSearchQuery, limit: 25 });
      state.vaultSearchResults = sres?.items || [];
    }
    showToast(t('toastNoteDeleted'));
    render();
  } catch (err) {
    showToast(t('toastErrDelete', err.message));
  }
}

async function handleRestoreVaultNote(trashPath, originalPath) {
  try {
    const res = await callTool('restore_vault_note', { trashPath, originalPath, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    if (Array.isArray(res?.logs)) state.logs = res.logs;
    showToast(t('toastRestored'));
    render();
  } catch (err) {
    showToast(err.message);
  }
}

async function handleTogglePin(filePath) {
  try {
    const res = await callTool('toggle_pin', { path: filePath, source: 'antigravity' });
    if (res?.vault) state.vault = res.vault;
    if (Array.isArray(res?.logs)) state.logs = res.logs;
    render();
  } catch (err) {
    showToast(err.message);
  }
}

async function handleBackupVault() {
  try {
    const res = await callTool('backup_vault', { source: 'antigravity' });
    if (Array.isArray(res?.logs)) state.logs = res.logs;
    showToast(t('toastBackup', res?.fileCount ?? 0));
    render();
  } catch (err) {
    showToast(err.message);
  }
}

async function handleSnapshotChat() {
  const a = state.analysis;
  if (!a || !a.found) return;
  const topLabels = (a.topSpikes || []).slice(0, 3).map((s) => localizeStepLabel(s.label)).join(', ');
  try {
    const res = await callTool('save_handoff', {
      title: a.title,
      summary: `${a.model} · ${a.turns} ${t('turnsUnit')} · ${fmtCompact(a.latestContextTokens)} (${a.utilizationPct}%).${topLabels ? ` ${topLabels}` : ''}`,
      openItems: '-',
      nextStep: state.lang === 'tr' ? 'Kaldığın yerden devam et.' : 'Continue where we left off.',
      lang: state.lang,
      source: 'antigravity',
    });
    if (res?.vault) state.vault = res.vault;
    showToast(t('toastHandoffSaved'));
    render();
  } catch (err) {
    showToast(err.message);
  }
}

function startTimers() {
  clearInterval(state.autoRefreshTimer);
  if (state.autoRefresh) {
    state.autoRefreshTimer = setInterval(() => {
      if (state.activeTab === 'monitor') refreshMonitor(true);
    }, 120000);
  }
  clearInterval(state.clockTimer);
  state.clockTimer = setInterval(() => {
    const el = document.getElementById('relTime');
    if (el && state.analysis?.updatedAt) {
      el.textContent = fmtRelativeTime(state.analysis.updatedAt);
    }
  }, 15000);
}

function toggleAutoRefresh() {
  state.autoRefresh = !state.autoRefresh;
  startTimers();
  showToast(state.autoRefresh ? t('toastLiveOn') : t('toastLiveOff'));
  render();
}

function toggleLanguage() {
  state.lang = state.lang === 'tr' ? 'en' : 'tr';
  document.documentElement.lang = state.lang;
  render();
  callTool('set_preferences', { lang: state.lang }).catch(() => {});
}

async function handleSavePack(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.packName.value.trim();
  const description = form.packDesc.value.trim();
  const tags = form.packTags.value
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  const notes = form.packNotes.value;
  const files = form.packFiles.value
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);

  if (!name) {
    showToast(t('toastNeedName'));
    return;
  }

  try {
    const payload = { name, description, notes, files, tags };
    if (state.editingPackId) payload.id = state.editingPackId;
    const res = await callTool('save_context_pack', payload);
    if (Array.isArray(res?.packs)) state.packs = res.packs;
    state.showPackForm = false;
    state.vaultForm = null;
    state.editingPackId = null;
    showToast(t('toastSaved', name));
    render();
  } catch (err) {
    showToast(t('toastErrSave', err.message));
  }
}

async function handleDeletePack(id, name) {
  try {
    const res = await callTool('delete_context_pack', { id });
    if (Array.isArray(res?.packs)) state.packs = res.packs;
    showToast(t('toastDeleted', name));
    render();
  } catch (err) {
    showToast(t('toastErrDelete', err.message));
  }
}

async function handleAttachPack(id, name) {
  if (!state.capabilities?.updateModelContext) {
    showToast(t('toastNoAttach'));
    return;
  }
  try {
    const resolved = await callTool('resolve_context_pack', { id });
    await app.updateModelContext({
      content: [{ type: 'text', text: resolved.assembledText }],
    });
    state.attachedPackName = name;
    showToast(t('toastAttached', name, fmtCompact(resolved.estimatedTokens)));
    render();
  } catch (err) {
    showToast(t('toastErrAttach', err.message));
  }
}

async function handleClearAttachedContext() {
  if (!state.capabilities?.updateModelContext) return;
  try {
    await app.updateModelContext({ content: [] });
    state.attachedPackName = null;
    showToast(t('toastCleared'));
    render();
  } catch (err) {
    showToast(t('toastErrClear', err.message));
  }
}

async function handleSendPack(id, name) {
  if (!state.capabilities?.message) {
    showToast(t('toastNoSend'));
    return;
  }
  try {
    const resolved = await callTool('resolve_context_pack', { id });
    await app.sendMessage({
      role: 'user',
      content: [
        {
          type: 'text',
          text: `${t('sendPromptPrefix')}\n\n${resolved.assembledText}`,
        },
      ],
    });
    showToast(t('toastSent', name));
  } catch (err) {
    showToast(t('toastErrSend', err.message));
  }
}

function renderAreaTimeline(timeline, firstStep, lastStep) {
  if (!timeline || timeline.length === 0) {
    return `<div class="empty">${esc(t('noTurns'))}</div>`;
  }

  const w = 360;
  const h = 140;
  const padL = 2;
  const padR = 6;
  const padT = 8;
  const padB = 4;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const maxTok = Math.max(...timeline.map((item) => item.contextTokens || 0), 1);
  const midTok = maxTok / 2;

  const pts = timeline.map((item, i) => {
    const x = timeline.length === 1 ? padL + plotW : padL + (i / (timeline.length - 1)) * plotW;
    const yTotal = padT + plotH - ((item.contextTokens || 0) / maxTok) * plotH;
    const yCache = padT + plotH - ((item.cacheReadTokens || 0) / maxTok) * plotH;
    return { x, yTotal, yCache, item };
  });

  const totalLineD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yTotal.toFixed(1)}`)
    .join(' ');
  const cacheLineD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yCache.toFixed(1)}`)
    .join(' ');
  const cacheAreaD = `${cacheLineD} L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const lastPt = pts[pts.length - 1];

  const dots = pts
    .map((p) => {
      const tip = `#${p.item.stepIndex} (T${p.item.turn}): ${t('totalLabel')} ${fmt(p.item.contextTokens)} · ${t('cache')} ${fmt(p.item.cacheReadTokens)} (${p.item.cacheHitPct}%)`;
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.yTotal.toFixed(1)}" r="4.5" fill="transparent" stroke="none"><title>${esc(tip)}</title></circle>`;
    })
    .join('');

  const yTop = padT;
  const yMid = padT + plotH / 2;
  const yBot = padT + plotH;

  return `
    <div class="timeline-box">
      <div class="timeline-main">
        <svg class="area-chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cwCacheGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4f8cff" stop-opacity="0.34"/>
              <stop offset="100%" stop-color="#4f8cff" stop-opacity="0.03"/>
            </linearGradient>
          </defs>
          <line x1="${padL}" y1="${yTop}" x2="${padL + plotW}" y2="${yTop}" stroke="currentColor" stroke-opacity="0.09" stroke-dasharray="2,3" vector-effect="non-scaling-stroke" />
          <line x1="${padL}" y1="${yMid}" x2="${padL + plotW}" y2="${yMid}" stroke="currentColor" stroke-opacity="0.09" stroke-dasharray="2,3" vector-effect="non-scaling-stroke" />
          <line x1="${padL}" y1="${yBot}" x2="${padL + plotW}" y2="${yBot}" stroke="currentColor" stroke-opacity="0.16" vector-effect="non-scaling-stroke" />

          <path d="${cacheAreaD}" fill="url(#cwCacheGrad)" />
          <path d="${cacheLineD}" fill="none" stroke="#4f8cff" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
          <path d="${totalLineD}" fill="none" stroke="#22c55e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
          ${dots}
          <ellipse cx="${lastPt.x.toFixed(1)}" cy="${lastPt.yTotal.toFixed(1)}" rx="2.6" ry="3.2" fill="#22c55e" />
        </svg>
        <div class="timeline-yaxis">
          <span>${esc(fmtCompact(maxTok))}</span>
          <span>${esc(fmtCompact(midTok))}</span>
          <span>0</span>
        </div>
      </div>
      <div class="timeline-xaxis">
        <span>#${firstStep}</span>
        <span class="timeline-leg">
          <span class="leg-item"><span class="dot dot-uncached"></span>${esc(t('totalLabel'))}</span>
          <span class="leg-item"><span class="dot dot-cache"></span>${esc(t('cache'))}</span>
        </span>
        <span>#${lastStep}</span>
      </div>
    </div>
  `;
}

function formatSpikeToolDetail(toolObj) {
  const isTr = state.lang === 'tr';
  const rawName = toolObj?.name || 'tool';
  const displayName = isTr ? (TOOL_LABELS_TR[rawName] || rawName) : rawName;
  let target = toolObj?.target || '';
  if (!target) {
    if (rawName === 'update_steps') target = isTr ? 'görev listesi' : 'task checklist';
    else if (rawName === 'update_focus') target = isTr ? 'durum özeti' : 'status focus';
  }
  return { displayName, target };
}

function renderMonitor() {
  const a = state.analysis;
  const convs = a?.conversations || [];

  const convOptions = convs
    .map(
      (c) =>
        `<option value="${esc(c.id)}" ${c.id === state.selectedConvId ? 'selected' : ''}>${esc(c.title)}</option>`
    )
    .join('');

  if (!a || !a.found) {
    return `<div class="card"><div class="empty">${esc(a?.error || t('loadingConv'))}</div></div>`;
  }

  const limitVal = state.customLimit > 0 ? state.customLimit : a.contextLimit;
  const presetLimits = [128000, 200000, 500000, 1000000, 2000000];
  if (!presetLimits.includes(limitVal)) presetLimits.push(limitVal);
  presetLimits.sort((x, y) => x - y);

  const limitOptions = presetLimits
    .map((val) => `<option value="${val}" ${val === limitVal ? 'selected' : ''}>${fmtCompact(val)}</option>`)
    .join('');

  const cachePct = a.contextLimit > 0 ? Math.min(100, (a.latestCacheReadTokens / a.contextLimit) * 100) : 0;
  const uncachedPct = a.contextLimit > 0 ? Math.min(100 - cachePct, (a.latestInputTokens / a.contextLimit) * 100) : 0;

  const pctWhole = Math.floor(a.utilizationPct);
  const pctDec = (a.utilizationPct % 1).toFixed(1).slice(1);

  const spikesHtml = (a.topSpikes || [])
    .map((s) => {
      const hasTools = Array.isArray(s.tools) && s.tools.length > 0;
      const isOpen = hasTools && state.expandedSpikes.has(s.stepIndex);
      const detailsHtml = isOpen
        ? `<div class="spike-details">${s.tools
            .map((toolObj) => {
              const { displayName, target } = formatSpikeToolDetail(toolObj);
              return `
                <div class="spike-tool-line">
                  <span class="spike-tool-bullet">•</span>
                  <span class="spike-tool-name">${esc(displayName)}</span>
                  ${target ? `<span class="spike-tool-target" title="${esc(target)}">· ${esc(target)}</span>` : ''}
                </div>
              `;
            })
            .join('')}</div>`
        : '';

      return `
        <div class="spike-item">
          <div class="spike-row ${hasTools ? 'clickable' : ''}" ${hasTools ? `data-spike-step="${s.stepIndex}"` : ''}>
            <div class="spike-left">
              <span class="spike-step">#${s.stepIndex}</span>
              ${
                s.toolCount > 1
                  ? `<span class="spike-tools-pill">${esc(t('toolCountPill', s.toolCount))} ${isOpen ? '▴' : '▾'}</span>`
                  : hasTools
                    ? `<span class="spike-tools-pill">${isOpen ? '▴' : '▾'}</span>`
                    : ''
              }
              <span class="spike-label" title="${esc(localizeStepLabel(s.label))}">${esc(localizeStepLabel(s.label))}</span>
            </div>
            <span class="spike-delta">+${fmtCompact(s.deltaTokens)}</span>
          </div>
          ${detailsHtml}
        </div>
      `;
    })
    .join('');

  const heaviestHtml = (a.heaviestSteps || [])
    .map((s) => {
      const desc = humanizePreview(s.preview);
      return `
      <div class="heavy-row">
        <div class="heavy-info">
          <div class="heavy-head">
            <span class="spike-step">#${s.stepIndex}</span>
            <span class="spike-label">${esc(localizeStepLabel(s.label))}</span>
          </div>
          <div class="heavy-preview" title="${esc(desc)}">${esc(desc)}</div>
        </div>
        <span class="heavy-tok">~${fmtCompact(s.tokens)}</span>
      </div>
    `;
    })
    .join('');

  const b = a.breakdown || {};
  const bTotal =
    (b.systemOverhead || 0) +
    (b.userMessages || 0) +
    (b.toolOutputs || 0) +
    (b.modelResponses || 0) +
    (b.thinking || 0);
  const bPct = (v) => (bTotal > 0 ? ((v / bTotal) * 100).toFixed(0) : '0');

  const warnHtml =
    a.health === 'critical'
      ? `<div class="warn-banner critical"><span>⚠️ ${esc(t('warnCritical'))}</span></div>`
      : a.health === 'warning'
        ? `<div class="warn-banner warning"><span>⚠️ ${esc(t('warnWarning'))}</span></div>`
        : '';

  return `
    <div class="conv-block">
      <div class="conv-select-wrap">
        <span class="conv-dot"></span>
        <select id="convSelect" class="conv-select" title="${esc(t('selectConvTitle'))}">
          ${convOptions}
        </select>
      </div>
      <div class="conv-meta">
        ${esc(a.model)} · <span id="relTime">${esc(fmtRelativeTime(a.updatedAt))}</span>
      </div>
    </div>

    <div class="hero-section">
      <div class="hero-top">
        <div class="hero-pct">${pctWhole}<small>${pctDec}%</small></div>
        <div class="hero-ratio">
          <span>${fmtCompact(a.latestContextTokens)}</span>
          <span class="hero-slash">/</span>
          <select id="limitSelect" class="limit-inline" title="${esc(t('selectLimitTitle'))}">
            ${limitOptions}
          </select>
        </div>
      </div>

      <div class="dual-track" title="${esc(t('cache'))}: ${fmt(a.latestCacheReadTokens)} · ${esc(t('uncached'))}: ${fmt(a.latestInputTokens)}">
        <div class="dual-cache" style="width:${cachePct.toFixed(2)}%"></div>
        <div class="dual-uncached" style="width:${uncachedPct.toFixed(2)}%"></div>
      </div>

      <div class="dual-legend">
        <div class="dual-legend-left">
          <span class="leg-item"><span class="dot dot-cache"></span>${esc(t('cache'))} <strong>${fmtCompact(a.latestCacheReadTokens)}</strong></span>
          <span class="leg-item"><span class="dot dot-uncached"></span>${esc(t('uncached'))} <strong>${fmtCompact(a.latestInputTokens)}</strong></span>
        </div>
        <span class="leg-item">${esc(t('free'))} <strong>${fmtCompact(a.remainingTokens)}</strong></span>
      </div>
    </div>

    ${warnHtml}

    <div class="kpi-strip">
      <div class="kpi-cell">
        <span class="kpi-k">${esc(t('cacheHit'))}</span>
        <span class="kpi-v">${a.latestCacheHitPct}<small>%</small></span>
        <span class="kpi-sub">${esc(t('lastTurn'))}</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-k">${esc(t('output'))}</span>
        <span class="kpi-v">${fmtCompact(a.cumulative?.outputTokens)}</span>
        <span class="kpi-sub">${esc(t('totalTokens'))}</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-k">${esc(t('activity'))}</span>
        <span class="kpi-v">${a.turns} <small>${esc(t('turnUnit'))}</small></span>
        <span class="kpi-sub">${a.totalToolCalls} ${esc(t('toolsUnit'))} · ${a.userMessageCount} ${esc(t('msgsUnit'))}</span>
      </div>
    </div>

    <div class="sec">
      <div class="sec-head">
        <h3 class="sec-title">${esc(t('timeline'))}</h3>
        <span class="sec-meta">${a.turns} ${esc(t('turnsUnit'))}</span>
      </div>
      ${renderAreaTimeline(a.turnTimeline, a.firstStepIndex ?? 1, a.lastStepIndex ?? a.stepCount)}
    </div>

    <div class="sec">
      <div class="sec-head">
        <h3 class="sec-title">${esc(t('topSpikes'))}</h3>
        <span class="sec-meta">${esc(t('topLabel'))} ${a.topSpikes?.length || 0}</span>
      </div>
      <div class="spike-list">
        ${spikesHtml || `<div class="empty">${esc(t('noSpikes'))}</div>`}
      </div>
    </div>

    <details id="detailsHeaviest" class="details-box" ${state.heaviestOpen ? 'open' : ''}>
      <summary>
        <span>${esc(t('heaviestSteps'))}</span>
        <span class="sec-meta">${esc(t('topLabel'))} ${a.heaviestSteps?.length || 0} ▾</span>
      </summary>
      <div class="details-body">
        <div class="heavy-list">
          ${heaviestHtml || `<div class="empty">${esc(t('noSteps'))}</div>`}
        </div>
      </div>
    </details>

    <details id="detailsBreakdown" class="details-box" ${state.breakdownOpen ? 'open' : ''}>
      <summary>
        <span>${esc(t('breakdown'))}</span>
        <span>▾</span>
      </summary>
      <div class="details-body">
        <div class="stacked-bar">
          <div class="seg seg-sys" style="width:${bPct(b.systemOverhead)}%"></div>
          <div class="seg seg-tool" style="width:${bPct(b.toolOutputs)}%"></div>
          <div class="seg seg-user" style="width:${bPct(b.userMessages)}%"></div>
          <div class="seg seg-model" style="width:${bPct(b.modelResponses)}%"></div>
          <div class="seg seg-think" style="width:${bPct(b.thinking)}%"></div>
        </div>
        <div class="legend-grid">
          <div class="legend-item"><span><span class="dot seg-sys"></span> ${esc(t('catSystem'))}</span><strong>${fmtCompact(b.systemOverhead)} (${bPct(b.systemOverhead)}%)</strong></div>
          <div class="legend-item"><span><span class="dot seg-tool"></span> ${esc(t('catTools'))}</span><strong>${fmtCompact(b.toolOutputs)} (${bPct(b.toolOutputs)}%)</strong></div>
          <div class="legend-item"><span><span class="dot seg-user"></span> ${esc(t('catUser'))}</span><strong>${fmtCompact(b.userMessages)} (${bPct(b.userMessages)}%)</strong></div>
          <div class="legend-item"><span><span class="dot seg-model"></span> ${esc(t('catModel'))}</span><strong>${fmtCompact(b.modelResponses)} (${bPct(b.modelResponses)}%)</strong></div>
          <div class="legend-item"><span><span class="dot seg-think"></span> ${esc(t('catThinking'))}</span><strong>${fmtCompact(b.thinking)} (${bPct(b.thinking)}%)</strong></div>
        </div>
      </div>
    </details>
  `;
}

function renderPacks() {
  const editing = state.editingPackId
    ? state.packs.find((p) => p.id === state.editingPackId)
    : null;

  const canAttach = Boolean(state.capabilities?.updateModelContext);
  const canMessage = Boolean(state.capabilities?.message);

  const formHtml = state.showPackForm
    ? `
      <div class="card">
        <div class="sec-head">
          <h3 class="sec-title">${esc(editing ? t('editPackTitle') : t('newPackTitle'))}</h3>
        </div>
        <form id="packForm" class="form-grid">
          <div class="field">
            <label for="packName">${esc(t('packName'))}</label>
            <input id="packName" name="packName" class="input" required placeholder="${esc(t('packNamePh'))}" value="${esc(editing?.name || '')}" />
          </div>
          <div class="field">
            <label for="packDesc">${esc(t('packDesc'))}</label>
            <input id="packDesc" name="packDesc" class="input" placeholder="${esc(t('packDescPh'))}" value="${esc(editing?.description || '')}" />
          </div>
          <div class="field">
            <label for="packTags">${esc(t('packTags'))}</label>
            <input id="packTags" name="packTags" class="input" placeholder="${esc(t('packTagsPh'))}" value="${esc((editing?.tags || []).join(', '))}" />
          </div>
          <div class="field">
            <label for="packNotes">${esc(t('packNotes'))}</label>
            <textarea id="packNotes" name="packNotes" class="textarea" placeholder="${esc(t('packNotesPh'))}">${esc(editing?.notes || '')}</textarea>
          </div>
          <div class="field">
            <label for="packFiles">${esc(t('packFiles'))}</label>
            <textarea id="packFiles" name="packFiles" class="textarea" placeholder="C:\\project\\README.md">${esc((editing?.files || []).join('\n'))}</textarea>
          </div>
          <div class="form-actions">
            <button type="button" id="btnCancelForm" class="btn">${esc(t('cancel'))}</button>
            <button type="submit" class="btn btn-primary">${esc(t('save'))}</button>
          </div>
        </form>
      </div>
    `
    : '';

  const attachedBanner = state.attachedPackName
    ? `
      <div class="attached-bar">
        <span>📎 ${esc(t('attachedLabel'))} <strong>${esc(state.attachedPackName)}</strong></span>
        <button id="btnClearCtx" class="btn btn-sm">${esc(t('clear'))}</button>
      </div>
    `
    : '';

  const listHtml =
    state.packs.length === 0
      ? `<div class="card"><div class="empty">${t('emptyPacks')}</div></div>`
      : `<div class="pack-list">${state.packs
          .map((p) => {
            const filesHtml = (p.fileInfos || [])
              .map(
                (f) => `
                <div class="file-chip ${f.exists ? '' : 'missing'}">
                  <span class="file-path" title="${esc(f.path)}">${f.exists ? '📄' : '⚠️'} ${esc(f.name || f.path)}</span>
                  <span>${f.exists ? `~${fmtCompact(f.tokens)}` : esc(t('missing'))}</span>
                </div>
              `
              )
              .join('');

            const tagsHtml = (p.tags || [])
              .map((tag) => `<span class="tag">#${esc(tag)}</span>`)
              .join('');

            return `
              <div class="card">
                <div class="pack-head">
                  <div>
                    <h4 class="pack-name">${esc(p.name)}</h4>
                    ${p.description ? `<p class="pack-desc">${esc(p.description)}</p>` : ''}
                  </div>
                  <span class="badge">~${fmtCompact(p.totalTokens)}</span>
                </div>
                ${tagsHtml ? `<div class="pack-tags">${tagsHtml}</div>` : ''}
                ${filesHtml ? `<div class="file-chip-list">${filesHtml}</div>` : ''}
                <div class="pack-actions">
                  ${
                    canAttach
                      ? `<button class="btn btn-primary btn-sm" data-action="attach" data-id="${esc(p.id)}" data-name="${esc(p.name)}">${esc(t('attachBtn'))}</button>`
                      : ''
                  }
                  ${
                    canMessage
                      ? `<button class="btn btn-sm" data-action="send" data-id="${esc(p.id)}" data-name="${esc(p.name)}">${esc(t('sendBtn'))}</button>`
                      : ''
                  }
                  <button class="btn btn-sm" data-action="edit" data-id="${esc(p.id)}">${esc(t('editBtn'))}</button>
                  <button class="btn btn-danger btn-sm" data-action="delete" data-id="${esc(p.id)}" data-name="${esc(p.name)}">${esc(t('deleteBtn'))}</button>
                </div>
              </div>
            `;
          })
          .join('')}</div>`;

  return `
    <div class="sec-head">
      <span class="sec-meta">${state.packs.length} ${esc(t('savedPacks'))}</span>
      <button id="btnNewPack" class="btn btn-primary btn-sm">${esc(t('newPack'))}</button>
    </div>
    ${attachedBanner}
    ${formHtml}
    ${listHtml}
  `;
}

function renderPackCard(p, canAttach, canMessage) {
  const filesHtml = (p.fileInfos || [])
    .map(
      (f) => `
      <div class="file-chip ${f.exists ? '' : 'missing'}">
        <span class="file-path" title="${esc(f.path)}">${f.exists ? '📄' : '⚠️'} ${esc(f.name || f.path)}</span>
        <span>${f.exists ? `~${fmtCompact(f.tokens)}` : esc(t('missing'))}</span>
      </div>
    `
    )
    .join('');

  const tagsHtml = (p.tags || [])
    .map((tag) => `<span class="tag">#${esc(tag)}</span>`)
    .join('');

  return `
    <div class="card">
      <div class="pack-head">
        <div style="min-width:0;flex:1;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
            <span class="kind-badge kind-pack">${esc(t('kindPack'))}</span>
            <h4 class="pack-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(p.name)}</h4>
          </div>
          ${p.description ? `<p class="pack-desc">${esc(p.description)}</p>` : ''}
        </div>
        <span class="badge">~${fmtCompact(p.totalTokens)}</span>
      </div>
      ${tagsHtml ? `<div class="pack-tags">${tagsHtml}</div>` : ''}
      ${filesHtml ? `<div class="file-chip-list">${filesHtml}</div>` : ''}
      <div class="pack-actions">
        ${
          canAttach
            ? `<button class="btn btn-primary btn-sm" data-action="attach" data-id="${esc(p.id)}" data-name="${esc(p.name)}">${esc(t('attachBtn'))}</button>`
            : ''
        }
        ${
          canMessage
            ? `<button class="btn btn-sm" data-action="send" data-id="${esc(p.id)}" data-name="${esc(p.name)}">${esc(t('sendBtn'))}</button>`
            : ''
        }
        <button class="btn btn-sm" data-action="edit" data-id="${esc(p.id)}">${esc(t('editBtn'))}</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${esc(p.id)}" data-name="${esc(p.name)}">${esc(t('deleteBtn'))}</button>
      </div>
    </div>
  `;
}

function renderMemory() {
  const v = state.vault;
  const counts = v?.counts || { all: 0, handoff: 0, decision: 0, task: 0, inbox: 0 };
  const canAttach = Boolean(state.capabilities?.updateModelContext);
  const canMessage = Boolean(state.capabilities?.message);
  const totalAll = counts.all + state.packs.length;

  const isSearching = state.vaultSearchResults !== null;
  const searchLower = state.vaultSearchQuery.toLowerCase();

  const matchingPacks = isSearching
    ? state.packs.filter((p) =>
        `${p.name} ${p.description} ${p.notes} ${(p.tags || []).join(' ')} ${(p.files || []).join(' ')}`
          .toLowerCase()
          .includes(searchLower)
      )
    : state.vaultFilter === 'all' || state.vaultFilter === 'pack'
      ? state.packs
      : [];

  const vaultItems = isSearching
    ? state.vaultSearchResults
    : state.vaultFilter === 'pack'
      ? []
      : (v?.items || []).filter((i) => state.vaultFilter === 'all' || i.kind === state.vaultFilter);

  const localizeSourceType = (raw) => {
    const k = String(raw || '').toLowerCase();
    const isTr = state.lang === 'tr';
    if (k === 'video') return 'Video';
    if (k === 'article' || k === 'makale') return isTr ? 'Makale' : 'Article';
    if (k === 'file' || k === 'dosya') return isTr ? 'Dosya' : 'File';
    if (k === 'note' || k === 'not') return isTr ? 'Not' : 'Note';
    return raw;
  };

  const kindLabel = (k) => {
    if (k === 'handoff') return t('kindHandoff');
    if (k === 'decision') return t('kindDecision');
    if (k === 'task') return t('kindTask');
    if (k === 'inbox') return t('kindInbox');
    return t('kindNote');
  };

  const TASK_COLS = [
    { id: 'inbox', label: t('colInbox') },
    { id: 'active', label: t('colActive') },
    { id: 'waiting', label: t('colWaiting') },
    { id: 'done', label: t('colDone') },
    { id: 'cancelled', label: t('colCancelled') },
  ];

  const allProjectsSet = new Set();
  for (const item of v?.items || []) {
    if (item.project) allProjectsSet.add(item.project);
  }
  for (const conv of state.analysis?.conversations || []) {
    if (conv.title) allProjectsSet.add(conv.title);
  }
  const projectList = [...allProjectsSet];
  const defaultTaskProj =
    state.taskProjectFilter !== '__all__'
      ? state.taskProjectFilter
      : state.analysis?.title || '';

  const editingPack = state.editingPackId
    ? state.packs.find((p) => p.id === state.editingPackId)
    : null;

  let formHtml = '';
  if (state.vaultForm === 'pack') {
    formHtml = `
      <div class="card">
        <div class="sec-head">
          <h3 class="sec-title">${esc(editingPack ? t('editPackTitle') : t('newPackTitle'))}</h3>
        </div>
        <form id="packForm" class="form-grid">
          <div class="field">
            <label for="packName">${esc(t('packName'))}</label>
            <input id="packName" name="packName" class="input" required placeholder="${esc(t('packNamePh'))}" value="${esc(editingPack?.name || '')}" />
          </div>
          <div class="field">
            <label for="packDesc">${esc(t('packDesc'))}</label>
            <input id="packDesc" name="packDesc" class="input" placeholder="${esc(t('packDescPh'))}" value="${esc(editingPack?.description || '')}" />
          </div>
          <div class="field">
            <label for="packTags">${esc(t('packTags'))}</label>
            <input id="packTags" name="packTags" class="input" placeholder="${esc(t('packTagsPh'))}" value="${esc((editingPack?.tags || []).join(', '))}" />
          </div>
          <div class="field">
            <label for="packNotes">${esc(t('packNotes'))}</label>
            <textarea id="packNotes" name="packNotes" class="textarea" placeholder="${esc(t('packNotesPh'))}">${esc(editingPack?.notes || '')}</textarea>
          </div>
          <div class="field">
            <label for="packFiles">${esc(t('packFiles'))}</label>
            <textarea id="packFiles" name="packFiles" class="textarea" placeholder="C:\\project\\README.md">${esc((editingPack?.files || []).join('\n'))}</textarea>
          </div>
          <div class="form-actions">
            <button type="button" id="btnCancelVaultForm" class="btn">${esc(t('cancel'))}</button>
            <button type="submit" class="btn btn-primary">${esc(t('save'))}</button>
          </div>
        </form>
      </div>
    `;
  } else if (state.vaultForm === 'handoff') {
    formHtml = `
      <div class="card">
        <div class="sec-head"><h3 class="sec-title">${esc(t('handoffFormTitle'))}</h3></div>
        <form id="handoffForm" class="form-grid">
          <div class="field">
            <label for="hoTitle">${esc(t('handoffTitleLbl'))}</label>
            <input id="hoTitle" name="hoTitle" class="input" required placeholder="${esc(t('handoffTitlePh'))}" />
          </div>
          <div class="field">
            <label for="hoSummary">${esc(t('handoffSummaryLbl'))}</label>
            <textarea id="hoSummary" name="hoSummary" class="textarea" placeholder="${esc(t('handoffSummaryPh'))}"></textarea>
          </div>
          <div class="field">
            <label for="hoOpen">${esc(t('handoffOpenLbl'))}</label>
            <textarea id="hoOpen" name="hoOpen" class="textarea" placeholder="${esc(t('handoffOpenPh'))}"></textarea>
          </div>
          <div class="field">
            <label for="hoNext">${esc(t('handoffNextLbl'))}</label>
            <input id="hoNext" name="hoNext" class="input" placeholder="${esc(t('handoffNextPh'))}" />
          </div>
          <div class="form-actions">
            <button type="button" id="btnCancelVaultForm" class="btn">${esc(t('cancel'))}</button>
            <button type="submit" class="btn btn-primary">${esc(t('save'))}</button>
          </div>
        </form>
      </div>
    `;
  } else if (state.vaultForm === 'capture') {
    formHtml = `
      <div class="card">
        <div class="sec-head"><h3 class="sec-title">${esc(t('captureFormTitle'))}</h3></div>
        <form id="captureForm" class="form-grid">
          <div class="field">
            <label for="capType">${esc(t('captureTypeLbl'))}</label>
            <select id="capType" name="capType" class="input">
              <option value="video">Video</option>
              <option value="article">${state.lang === 'tr' ? 'Makale' : 'Article'}</option>
              <option value="file">${state.lang === 'tr' ? 'Dosya' : 'File'}</option>
              <option value="note">${state.lang === 'tr' ? 'Not' : 'Note'}</option>
            </select>
          </div>
          <div class="field">
            <label for="capTitle">${esc(t('handoffTitleLbl'))}</label>
            <input id="capTitle" name="capTitle" class="input" required placeholder="${esc(t('handoffTitlePh'))}" />
          </div>
          <div class="field">
            <label for="capUrl">${esc(t('captureUrlLbl'))}</label>
            <input id="capUrl" name="capUrl" class="input" placeholder="${esc(t('captureUrlPh'))}" />
          </div>
          <div class="field">
            <label for="capNotes">${esc(t('captureNotesLbl'))}</label>
            <textarea id="capNotes" name="capNotes" class="textarea" placeholder="${esc(t('captureNotesPh'))}"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" id="btnCancelVaultForm" class="btn">${esc(t('cancel'))}</button>
            <button type="submit" class="btn btn-primary">${esc(t('save'))}</button>
          </div>
        </form>
      </div>
    `;
  } else if (state.vaultForm === 'task') {
    const editingTask = state.editingTaskPath
      ? (v?.items || []).find((i) => i.path === state.editingTaskPath)
      : null;
    formHtml = `
      <div class="card">
        <div class="sec-head"><h3 class="sec-title">${esc(editingTask ? t('taskEditFormTitle') : t('taskFormTitle'))}</h3></div>
        <form id="taskForm" class="form-grid">
          <div class="field">
            <label for="taskTitle">${esc(t('taskTitleLbl'))}</label>
            <input id="taskTitle" name="taskTitle" class="input" required placeholder="${esc(t('taskTitlePh'))}" value="${esc(editingTask?.title || '')}" />
          </div>
          <div class="field">
            <label for="taskProject">${esc(t('taskProjectLbl'))}</label>
            <input id="taskProject" name="taskProject" list="taskProjList" class="input" placeholder="${esc(t('taskProjectPh'))}" value="${esc(editingTask ? editingTask.project || '' : defaultTaskProj)}" />
            <datalist id="taskProjList">
              ${projectList.map((p) => `<option value="${esc(p)}"></option>`).join('')}
            </datalist>
          </div>
          <div class="field">
            <label for="taskDue">${esc(t('dueLbl'))}</label>
            <input id="taskDue" name="taskDue" type="date" class="input" value="${esc(editingTask?.dueDate || '')}" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <div class="field">
              <label for="taskStatus">${esc(t('taskStatusLbl'))}</label>
              <select id="taskStatus" name="taskStatus" class="input">
                ${TASK_COLS.map((c) => `<option value="${c.id}" ${(editingTask?.status || 'inbox') === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label for="taskPriority">${esc(t('taskPriorityLbl'))}</label>
              <select id="taskPriority" name="taskPriority" class="input">
                <option value="normal" ${(editingTask?.priority || 'normal') === 'normal' ? 'selected' : ''}>${state.lang === 'tr' ? 'Normal' : 'Normal'}</option>
                <option value="high" ${editingTask?.priority === 'high' ? 'selected' : ''}>${state.lang === 'tr' ? 'Yüksek' : 'High'}</option>
                <option value="low" ${editingTask?.priority === 'low' ? 'selected' : ''}>${state.lang === 'tr' ? 'Düşük' : 'Low'}</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="taskNotes">${esc(t('taskNotesLbl'))}</label>
            <textarea id="taskNotes" name="taskNotes" class="textarea" placeholder="${esc(t('taskNotesPh'))}">${esc(editingTask?.notes || '')}</textarea>
          </div>
          <div class="form-actions">
            <button type="button" id="btnCancelVaultForm" class="btn">${esc(t('cancel'))}</button>
            <button type="submit" class="btn btn-primary">${esc(t('save'))}</button>
          </div>
        </form>
      </div>
    `;
  } else if (state.vaultForm === 'decision') {
    formHtml = `
      <div class="card">
        <div class="sec-head"><h3 class="sec-title">${esc(t('decisionFormTitle'))}</h3></div>
        <form id="decisionForm" class="form-grid">
          <div class="field">
            <label for="decTitle">${esc(t('decisionTitleLbl'))}</label>
            <input id="decTitle" name="decTitle" class="input" required placeholder="${esc(t('decisionTitlePh'))}" />
          </div>
          <div class="field">
            <label for="decBody">${esc(t('decisionBodyLbl'))}</label>
            <textarea id="decBody" name="decBody" class="textarea" placeholder="${esc(t('decisionBodyPh'))}"></textarea>
          </div>
          <div class="field">
            <label for="decWhy">${esc(t('decisionWhyLbl'))}</label>
            <textarea id="decWhy" name="decWhy" class="textarea" placeholder="${esc(t('decisionWhyPh'))}"></textarea>
          </div>
          <div class="field">
            <label for="decTags">${esc(t('packTags'))}</label>
            <input id="decTags" name="decTags" class="input" placeholder="${esc(t('packTagsPh'))}" />
          </div>
          <div class="form-actions">
            <button type="button" id="btnCancelVaultForm" class="btn">${esc(t('cancel'))}</button>
            <button type="submit" class="btn btn-primary">${esc(t('save'))}</button>
          </div>
        </form>
      </div>
    `;
  }

  const attachedBanner = state.attachedPackName
    ? `
      <div class="attached-bar">
        <span>📎 ${esc(t('attachedLabel'))} <strong>${esc(state.attachedPackName)}</strong></span>
        <button id="btnClearCtx" class="btn btn-sm">${esc(t('clear'))}</button>
      </div>
    `
    : '';

  const formatDueChip = (dueDate, status) => {
    if (!dueDate) return '';
    const closed = status === 'done' || status === 'cancelled';
    const today = new Date().toISOString().slice(0, 10);
    let cls = 'due-chip';
    let extra = '';
    if (!closed) {
      if (dueDate < today) { cls += ' due-overdue'; extra = ` · ${t('overdueLbl')}`; }
      else if (dueDate === today) { cls += ' due-soon'; extra = ` · ${t('todayLbl')}`; }
    }
    return `<span class="${cls}">📅 ${esc(dueDate)}${esc(extra)}</span>`;
  };

  const renderVaultItemCard = (item) => {
    const isTaskDone = item.kind === 'task' && (item.status === 'done' || item.status === 'cancelled');
    const taskStatusSelect =
      item.kind === 'task'
        ? `<select class="status-select-sm" data-task-status-path="${esc(item.path)}">${TASK_COLS.map(
            (c) => `<option value="${c.id}" ${(item.status || 'inbox') === c.id ? 'selected' : ''}>${esc(c.label)}</option>`
          ).join('')}</select>`
        : '';

    return `
          <div class="card">
            <div class="pack-head">
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                  <span class="kind-badge kind-${esc(item.kind)}">${esc(item.sourceType ? localizeSourceType(item.sourceType) : kindLabel(item.kind))}</span>
                  <h4 class="pack-name ${isTaskDone ? 'task-done' : ''}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.pinned ? '📌 ' : ''}${esc(item.title)}</h4>
                </div>
                <div class="note-meta">
                  ${item.project ? `<span>#${esc(item.project)}</span> · ` : ''}${formatDueChip(item.dueDate, item.status)} <span>${esc(fmtRelativeTime(item.updatedAt))}</span>
                </div>
              </div>
              <span class="badge">~${fmtCompact(item.tokens)}</span>
            </div>
            ${item.kind === 'task' && item.notes ? `<div class="note-preview">${esc(item.notes)}</div>` : item.snippet || item.preview ? `<div class="note-preview">${esc(item.snippet || item.preview)}</div>` : ''}
            <div class="pack-actions">
              ${taskStatusSelect}
              <button class="btn btn-sm" data-vaction="pin" data-path="${esc(item.path)}" title="${esc(t('pinLbl'))}">${item.pinned ? '📌' : '📍'}</button>
              ${item.kind === 'task' ? `<button class="btn btn-sm" data-vaction="editTask" data-path="${esc(item.path)}">${esc(t('editBtn'))}</button>` : ''}
              <button class="btn btn-sm" data-vaction="open" data-uri="${esc(item.fileUri)}">${esc(t('openFileBtn'))}</button>
              ${
                canAttach
                  ? `<button class="btn btn-primary btn-sm" data-vaction="attach" data-path="${esc(item.path)}" data-title="${esc(item.title)}">${esc(t('continueBtn'))}</button>`
                  : ''
              }
              ${
                canMessage
                  ? `<button class="btn btn-sm" data-vaction="send" data-path="${esc(item.path)}" data-title="${esc(item.title)}">${esc(t('sendBtn'))}</button>`
                  : ''
              }
              <button class="btn btn-danger btn-sm" data-vaction="delete" data-path="${esc(item.path)}">${esc(t('deleteBtn'))}</button>
            </div>
          </div>
        `;
  };

  const taskProjectBar =
    state.vaultFilter === 'task' && !isSearching
      ? `
        <div class="task-filter-bar">
          <select id="taskProjectSelect" class="input" style="flex:1;min-width:0;">
            <option value="__all__" ${state.taskProjectFilter === '__all__' ? 'selected' : ''}>${esc(t('allProjectsOpt'))}</option>
            ${projectList
              .map((p) => `<option value="${esc(p)}" ${p === state.taskProjectFilter ? 'selected' : ''}>${esc(p)}</option>`)
              .join('')}
          </select>
        </div>
      `
      : '';

  const filteredVaultItems =
    state.vaultFilter === 'task' && !isSearching && state.taskProjectFilter !== '__all__'
      ? vaultItems.filter((i) => (i.project || '') === state.taskProjectFilter)
      : vaultItems;

  const packCardsHtml = matchingPacks.map((p) => renderPackCard(p, canAttach, canMessage)).join('');

  let listHtml = '';
  if (state.vaultFilter === 'task' && !isSearching) {
    const groupedHtml = TASK_COLS.map((col) => {
      const colItems = filteredVaultItems.filter((i) => (i.status || 'inbox') === col.id);
      return `
        <div class="task-group-head">
          <span>${esc(col.label)}</span>
          <span>${colItems.length}</span>
        </div>
        ${colItems.length > 0 ? colItems.map(renderVaultItemCard).join('') : ''}
      `;
    }).join('');
    listHtml = `<div class="pack-list">${groupedHtml}</div>`;
  } else {
    const vaultCardsHtml = filteredVaultItems.map(renderVaultItemCard).join('');
    listHtml =
      filteredVaultItems.length === 0 && matchingPacks.length === 0
        ? `<div class="card"><div class="empty">${t('emptyVault')}</div></div>`
        : `<div class="pack-list">${packCardsHtml}${vaultCardsHtml}</div>`;
  }

  return `
    <div class="vault-bar">
      <div class="vault-path-wrap">
        <div class="vault-path" title="${esc(v?.vaultDir || '')}">📁 ${esc(v?.vaultDir || '~/Antigravity-Brain')}</div>
        <div class="vault-hint">${esc(t('vaultHint'))}</div>
      </div>
      <div style="display:flex;gap:4px;flex-shrink:0;">
        <button id="btnSnapshotChat" class="btn btn-sm" title="${esc(t('snapshotBtn'))}">${esc(t('snapshotBtn'))}</button>
        <button id="btnBackupVault" class="btn btn-sm" title="${esc(t('backupBtn'))}">${esc(t('backupBtn'))}</button>
        ${
          v?.agentsFileUri
            ? `<button id="btnOpenAgents" class="btn btn-sm" data-uri="${esc(
                state.lang === 'tr' ? v.agentsTrFileUri || v.agentsFileUri : v.agentsFileUri
              )}">${esc(t('openAgents'))}</button>`
            : ''
        }
      </div>
    </div>

    ${attachedBanner}

    <div class="action-strip">
      <button id="btnFormHandoff" class="btn ${state.vaultForm === 'handoff' ? 'btn-primary' : ''}">${esc(t('btnHandoff'))}</button>
      <button id="btnFormTask" class="btn ${state.vaultForm === 'task' ? 'btn-primary' : ''}">${esc(t('btnTask'))}</button>
      <button id="btnFormDecision" class="btn ${state.vaultForm === 'decision' ? 'btn-primary' : ''}">${esc(t('btnDecision'))}</button>
      <button id="btnFormCapture" class="btn ${state.vaultForm === 'capture' ? 'btn-primary' : ''}">${esc(t('btnCapture'))}</button>
      <button id="btnFormPack" class="btn ${state.vaultForm === 'pack' ? 'btn-primary' : ''}">${esc(t('btnPack'))}</button>
    </div>

    ${formHtml}

    <form id="vaultSearchForm" class="search-row">
      <input id="vaultSearchInput" class="input search-input" placeholder="${esc(t('searchPh'))}" value="${esc(state.vaultSearchQuery)}" />
      <button type="submit" class="btn btn-sm">${esc(t('searchBtn'))}</button>
    </form>

    <div class="filter-pills">
      <button class="pill-btn ${state.vaultFilter === 'all' && !isSearching ? 'active' : ''}" data-vfilter="all">${esc(t('filterAll'))} (${totalAll})</button>
      <button class="pill-btn ${state.vaultFilter === 'handoff' && !isSearching ? 'active' : ''}" data-vfilter="handoff">${esc(t('filterHandoff'))} (${counts.handoff})</button>
      <button class="pill-btn ${state.vaultFilter === 'task' && !isSearching ? 'active' : ''}" data-vfilter="task">${esc(t('filterTask'))} (${counts.task ?? 0})</button>
      <button class="pill-btn ${state.vaultFilter === 'decision' && !isSearching ? 'active' : ''}" data-vfilter="decision">${esc(t('filterDecision'))} (${counts.decision})</button>
      <button class="pill-btn ${state.vaultFilter === 'inbox' && !isSearching ? 'active' : ''}" data-vfilter="inbox">${esc(t('filterInbox'))} (${counts.inbox})</button>
      <button class="pill-btn ${state.vaultFilter === 'pack' && !isSearching ? 'active' : ''}" data-vfilter="pack">${esc(t('filterPack'))} (${state.packs.length})</button>
    </div>

    ${taskProjectBar}

    ${listHtml}
  `;
}

function formatDayHeading(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const now = new Date();
  const locale = state.lang === 'tr' ? 'tr-TR' : 'en-US';
  const dateText = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  if (d.toDateString() === now.toDateString()) return `${state.lang === 'tr' ? 'Bugün' : 'Today'} · ${dateText}`;
  if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return `${state.lang === 'tr' ? 'Dün' : 'Yesterday'} · ${dateText}`;
  return dateText;
}

function logFieldLabel(field) {
  const tr = {
    title: 'Başlık', status: 'Durum', notes: 'Açıklama', project: 'Proje', priority: 'Öncelik', dueDate: 'Hedef Tarih',
    summary: 'Sonuç', openItems: 'Açık Konular', nextStep: 'Sonraki Adım',
    decision: 'Karar', rationale: 'Gerekçe', source: 'Kaynak', file: 'Dosya',
  };
  const en = {
    title: 'Title', status: 'Status', notes: 'Description', project: 'Project', priority: 'Priority', dueDate: 'Due Date',
    summary: 'Outcome', openItems: 'Open Items', nextStep: 'Next Step',
    decision: 'Decision', rationale: 'Rationale', source: 'Source', file: 'File',
  };
  return (state.lang === 'tr' ? tr : en)[field] || field;
}

function logSourceLabel(src) {
  if (src === 'web') return 'Web';
  if (src === 'antigravity') return 'Antigravity';
  return state.lang === 'tr' ? 'AI Ajan' : 'AI Agent';
}

function renderLogs() {
  const isTr = state.lang === 'tr';
  const statusMap = {
    inbox: t('colInbox'),
    active: t('colActive'),
    waiting: t('colWaiting'),
    done: t('colDone'),
    cancelled: t('colCancelled'),
  };
  const cats = [
    { id: 'all', label: isTr ? 'Tümü' : 'All' },
    { id: 'task', label: isTr ? 'Görevler' : 'Tasks' },
    { id: 'vault', label: isTr ? 'Oturum & Karar' : 'Sessions & Decisions' },
    { id: 'delete', label: isTr ? 'Silinenler' : 'Deleted' },
  ];

  const q = state.logFilter.trim().toLowerCase();
  const filtered = state.logs.filter((l) => {
    if (state.logCat === 'task' && l.entity !== 'task') return false;
    if (state.logCat === 'vault' && !['handoff', 'decision', 'inbox', 'pack'].includes(l.entity)) return false;
    if (state.logCat === 'delete' && !l.action.includes('delete')) return false;
    if (!q) return true;
    return `${l.title} ${l.detail} ${l.project} ${l.action} ${l.relativePath || ''}`.toLowerCase().includes(q);
  });

  const byDay = new Map();
  for (const l of filtered) {
    const key = formatDayHeading(l.timestamp);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(l);
  }

  const fmtVal = (field, val) => (field === 'status' ? statusMap[val] || val : val);
  const actionsMap = t('logActions');

  const groupsHtml = [...byDay.entries()]
    .map(([day, items]) => {
      const rows = items
        .map((l) => {
          const actionLabel = (actionsMap && actionsMap[l.action]) || l.action;
          const badgeKind = l.action.includes('delete') ? 'inbox' : l.entity || 'decision';
          const moveText =
            l.fromStatus && l.toStatus && l.fromStatus !== l.toStatus
              ? `${statusMap[l.fromStatus] || l.fromStatus} → ${statusMap[l.toStatus] || l.toStatus}`
              : l.toStatus
                ? `${statusMap[l.toStatus] || l.toStatus}`
                : '';
          const isOpen = state.expandedLogs.has(l.id);
          const changes =
            Array.isArray(l.changes) && l.changes.length > 0
              ? l.changes
              : [
                  ...(l.detail ? [{ field: 'notes', next: l.detail }] : []),
                  ...(l.relativePath ? [{ field: 'file', next: l.relativePath }] : []),
                ];
          const changesHtml =
            isOpen && changes.length > 0
              ? `<div class="log-changes">${changes
                  .map(
                    (c) => `
                  <div class="log-change-row">
                    <span class="log-change-k">${esc(logFieldLabel(c.field))}:</span>
                    <span class="log-change-v">
                      ${c.old ? `<span class="log-old">${esc(fmtVal(c.field, c.old))}</span>→ ` : ''}${esc(fmtVal(c.field, c.next))}
                    </span>
                  </div>
                `
                  )
                  .join('')}</div>`
              : '';

          const timeOnly = new Date(l.timestamp).toLocaleTimeString(isTr ? 'tr-TR' : 'en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
          });

          return `
            <div class="log-card" data-alog-toggle="${esc(l.id)}">
              <div class="log-top">
                <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                  <span class="kind-badge kind-${esc(badgeKind)}">${esc(actionLabel)}</span>
                  <span class="tag">${esc(logSourceLabel(l.source))}</span>
                  ${
                    l.canRestore
                      ? `<button class="btn btn-sm" data-restore-trash="${esc(l.trashPath)}" data-restore-orig="${esc(l.originalPath)}">${esc(t('restoreBtn'))}</button>`
                      : ''
                  }
                </div>
                <span class="log-ts">${esc(timeOnly)} · ${esc(fmtRelativeTime(l.timestamp))} ${changes.length > 0 ? (isOpen ? '▴' : '▾') : ''}</span>
              </div>
              <div style="font-size:12px;font-weight:700;color:var(--fg-1);">
                ${esc(l.title || '-')}
                ${moveText ? `<span class="tag" style="margin-left:4px;">${esc(moveText)}</span>` : ''}
                ${l.project ? `<span class="tag" style="margin-left:4px;">#${esc(l.project)}</span>` : ''}
              </div>
              ${!isOpen && l.detail ? `<div class="log-detail">${esc(l.detail)}</div>` : ''}
              ${changesHtml}
            </div>
          `;
        })
        .join('');

      return `
        <div class="log-day-head">
          <span>📅 ${esc(day)}</span>
          <span>${items.length}</span>
        </div>
        ${rows}
      `;
    })
    .join('');

  return `
    <div class="search-row">
      <input id="logFilterInput" class="input search-input" placeholder="${esc(t('logFilterPh'))}" value="${esc(state.logFilter)}" />
      <button id="btnClearLogs" class="btn btn-danger btn-sm">${esc(t('logClearBtn'))}</button>
    </div>
    <div class="filter-pills">
      ${cats.map((c) => `<button class="pill-btn ${state.logCat === c.id ? 'active' : ''}" data-alog-cat="${c.id}">${esc(c.label)}</button>`).join('')}
    </div>
    <div class="pack-list">
      ${groupsHtml || `<div class="card"><div class="empty">${esc(t('logEmpty'))}</div></div>`}
    </div>
  `;
}

function render() {
  const root = document.getElementById('root');
  if (!root) return;
  const prevScrollY = window.scrollY;
  const memoryCount = (state.vault?.counts?.all ?? 0) + state.packs.length;

  root.innerHTML = `
    <div class="shell">
      <div class="header-bar">
        <div class="tabs">
          <button id="tabMonitor" class="tab-btn ${state.activeTab === 'monitor' ? 'active' : ''}">${esc(t('tabMonitor'))}</button>
          <button id="tabMemory" class="tab-btn ${state.activeTab === 'memory' ? 'active' : ''}">${esc(t('tabMemory'))} (${memoryCount})</button>
          <button id="tabLog" class="tab-btn ${state.activeTab === 'logs' ? 'active' : ''}">${esc(t('tabLog'))} (${state.logs.length})</button>
        </div>
        <div class="header-controls">
          <button id="btnOpenWeb" class="lang-btn" title="${esc(t('webBtnTitle'))}">🌐 Web</button>
          <button id="btnLang" class="lang-btn" title="${esc(t('langTitle'))}">${state.lang.toUpperCase()}</button>
          ${
            state.activeTab === 'monitor'
              ? `
                <button id="btnAuto" class="live-btn ${state.autoRefresh ? 'on' : ''}" title="${esc(t('liveTitle'))}">
                  <span class="live-dot"></span>${esc(t('live'))}
                </button>
                <button id="btnRefresh" class="icon-btn" title="${esc(t('refreshTitle'))}" ${state.loading ? 'disabled' : ''}>↻</button>
              `
              : state.activeTab === 'memory'
                ? `<button id="btnRefreshVault" class="icon-btn" title="${esc(t('refreshTitle'))}">↻</button>`
                : `<button id="btnRefreshLogs" class="icon-btn" title="${esc(t('refreshTitle'))}">↻</button>`
          }
        </div>
      </div>

      ${state.activeTab === 'monitor' ? renderMonitor() : state.activeTab === 'memory' ? renderMemory() : renderLogs()}
    </div>
    <div id="toast" class="toast hidden"></div>
  `;

  bindEvents();
  if (prevScrollY > 0) window.scrollTo(0, prevScrollY);
}

function bindEvents() {
  document.getElementById('tabMonitor')?.addEventListener('click', () => {
    state.activeTab = 'monitor';
    render();
    if (!state.analysis) refreshMonitor();
  });

  document.getElementById('tabMemory')?.addEventListener('click', () => {
    state.activeTab = 'memory';
    render();
    Promise.allSettled([refreshVault(state.vaultFilter === 'pack' ? 'all' : state.vaultFilter), refreshPacks()]);
  });

  document.getElementById('tabLog')?.addEventListener('click', () => {
    state.activeTab = 'logs';
    render();
    refreshLogs();
  });

  document.getElementById('btnRefreshLogs')?.addEventListener('click', () => refreshLogs());
  document.getElementById('btnClearLogs')?.addEventListener('click', () => handleClearLogs());
  document.getElementById('logFilterInput')?.addEventListener('input', (e) => {
    state.logFilter = e.target.value;
    render();
    const inp = document.getElementById('logFilterInput');
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  });

  document.querySelectorAll('[data-alog-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.logCat = btn.dataset.alogCat;
      render();
    });
  });

  document.querySelectorAll('[data-restore-trash]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRestoreVaultNote(btn.dataset.restoreTrash, btn.dataset.restoreOrig);
    });
  });

  document.querySelectorAll('[data-alog-toggle]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.alogToggle;
      if (state.expandedLogs.has(id)) state.expandedLogs.delete(id);
      else state.expandedLogs.add(id);
      render();
    });
  });

  document.getElementById('btnRefreshVault')?.addEventListener('click', () => {
    Promise.allSettled([refreshVault(state.vaultFilter === 'pack' ? 'all' : state.vaultFilter), refreshPacks()]);
  });
  document.getElementById('btnOpenAgents')?.addEventListener('click', (e) => {
    const uri = e.currentTarget.dataset.uri;
    if (uri) handleOpenVaultFile(uri);
  });
  document.getElementById('btnBackupVault')?.addEventListener('click', () => handleBackupVault());
  document.getElementById('btnSnapshotChat')?.addEventListener('click', () => handleSnapshotChat());

  document.getElementById('btnFormHandoff')?.addEventListener('click', () => {
    state.editingPackId = null;
    state.vaultForm = state.vaultForm === 'handoff' ? null : 'handoff';
    render();
  });
  document.getElementById('btnFormTask')?.addEventListener('click', () => {
    state.editingPackId = null;
    state.editingTaskPath = null;
    state.vaultForm = state.vaultForm === 'task' ? null : 'task';
    render();
  });
  document.getElementById('btnFormCapture')?.addEventListener('click', () => {
    state.editingPackId = null;
    state.vaultForm = state.vaultForm === 'capture' ? null : 'capture';
    render();
  });
  document.getElementById('btnFormDecision')?.addEventListener('click', () => {
    state.editingPackId = null;
    state.vaultForm = state.vaultForm === 'decision' ? null : 'decision';
    render();
  });
  document.getElementById('btnFormPack')?.addEventListener('click', () => {
    state.editingPackId = null;
    state.vaultForm = state.vaultForm === 'pack' ? null : 'pack';
    render();
  });
  document.getElementById('btnCancelVaultForm')?.addEventListener('click', () => {
    state.vaultForm = null;
    state.editingPackId = null;
    state.editingTaskPath = null;
    render();
  });

  document.getElementById('handoffForm')?.addEventListener('submit', handleSaveHandoff);
  document.getElementById('taskForm')?.addEventListener('submit', handleSaveTask);
  document.getElementById('captureForm')?.addEventListener('submit', handleCaptureResource);
  document.getElementById('decisionForm')?.addEventListener('submit', handleSaveDecision);
  document.getElementById('vaultSearchForm')?.addEventListener('submit', handleSearchVault);

  document.querySelectorAll('[data-vfilter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.vaultFilter = btn.dataset.vfilter;
      state.vaultSearchQuery = '';
      state.vaultSearchResults = null;
      if (state.vaultFilter === 'pack') {
        refreshPacks();
      } else {
        refreshVault(state.vaultFilter);
      }
    });
  });

  document.getElementById('taskProjectSelect')?.addEventListener('change', (e) => {
    state.taskProjectFilter = e.target.value;
    render();
  });

  document.querySelectorAll('[data-task-status-path]').forEach((sel) => {
    sel.addEventListener('change', () => {
      handleUpdateTaskStatus(sel.dataset.taskStatusPath, sel.value);
    });
  });

  document.querySelectorAll('[data-vaction]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { vaction, uri, path: filePath, title } = btn.dataset;
      if (vaction === 'pin') {
        handleTogglePin(filePath);
      } else if (vaction === 'editTask') {
        state.editingTaskPath = filePath;
        state.vaultForm = 'task';
        render();
        window.scrollTo(0, 0);
      } else if (vaction === 'open') handleOpenVaultFile(uri);
      else if (vaction === 'attach') handleAttachVaultNote(filePath, title);
      else if (vaction === 'send') handleSendVaultNote(filePath, title);
      else if (vaction === 'delete') handleDeleteVaultNote(filePath);
    });
  });

  document.getElementById('btnLang')?.addEventListener('click', () => toggleLanguage());
  document.getElementById('btnOpenWeb')?.addEventListener('click', async () => {
    try {
      const res = await callTool('open_web_ui', {});
      if (res?.url) {
        if (state.capabilities?.openLinks) {
          await app.openLink({ url: res.url });
        }
        showToast(t('toastWebReady', res.url));
      }
    } catch (err) {
      showToast(err.message);
    }
  });

  document.getElementById('convSelect')?.addEventListener('change', (e) => {
    state.selectedConvId = e.target.value;
    refreshMonitor();
  });

  document.getElementById('limitSelect')?.addEventListener('change', (e) => {
    state.customLimit = Number(e.target.value) || 0;
    refreshMonitor();
  });

  document.getElementById('btnRefresh')?.addEventListener('click', () => refreshMonitor());
  document.getElementById('btnAuto')?.addEventListener('click', () => toggleAutoRefresh());
  document.getElementById('btnRefreshPacks')?.addEventListener('click', () => refreshPacks());

  document.getElementById('detailsHeaviest')?.addEventListener('toggle', (e) => {
    state.heaviestOpen = e.target.open;
  });
  document.getElementById('detailsBreakdown')?.addEventListener('toggle', (e) => {
    state.breakdownOpen = e.target.open;
  });

  document.querySelectorAll('[data-spike-step]').forEach((row) => {
    row.addEventListener('click', () => {
      const stepIdx = Number(row.dataset.spikeStep);
      if (state.expandedSpikes.has(stepIdx)) {
        state.expandedSpikes.delete(stepIdx);
      } else {
        state.expandedSpikes.add(stepIdx);
      }
      render();
    });
  });

  document.getElementById('btnNewPack')?.addEventListener('click', () => {
    state.editingPackId = null;
    state.showPackForm = !state.showPackForm;
    render();
  });

  document.getElementById('btnCancelForm')?.addEventListener('click', () => {
    state.showPackForm = false;
    state.editingPackId = null;
    render();
  });

  document.getElementById('packForm')?.addEventListener('submit', handleSavePack);
  document.getElementById('btnClearCtx')?.addEventListener('click', handleClearAttachedContext);

  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { action, id, name } = btn.dataset;
      if (action === 'attach') handleAttachPack(id, name);
      else if (action === 'send') handleSendPack(id, name);
      else if (action === 'edit') {
        state.editingPackId = id;
        state.vaultForm = 'pack';
        render();
      } else if (action === 'delete') handleDeletePack(id, name);
    });
  });
}

async function init() {
  render();
  await app.connect();
  state.capabilities = app.getHostCapabilities() || {};
  applyThemeFromContext(app.getHostContext());
  startTimers();
  render();

  try {
    const prefs = await callTool('get_preferences', {});
    if (prefs?.lang === 'tr' || prefs?.lang === 'en') {
      state.lang = prefs.lang;
      document.documentElement.lang = state.lang;
      render();
    }
  } catch {
    // Keep default language
  }

  if (!state.analysis) {
    await Promise.allSettled([refreshMonitor(true), refreshPacks(), refreshVault('all'), refreshLogs()]);
  }
}

init().catch((err) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div class="shell"><div class="card">${esc(t('initError'))} ${esc(err?.message || String(err))}</div></div>`;
  }
});
