import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const DEFAULT_BRAIN_DIR = path.join(os.homedir(), '.gemini', 'antigravity', 'brain');

const MODEL_LIMITS = [
  { match: /gemini-4|gemini-3|gemini-2\.5|gemini-2\.0|gemini-1\.5-pro/i, limit: 1_000_000 },
  { match: /gemini/i, limit: 1_000_000 },
  { match: /claude-3|claude-4|claude-sonnet|claude-opus|claude-haiku/i, limit: 200_000 },
  { match: /gpt-4o|gpt-4\.1|o1|o3|o4/i, limit: 128_000 },
];

export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(String(text).length / 4);
}

export function inferContextLimit(modelName) {
  if (!modelName) return 1_000_000;
  for (const entry of MODEL_LIMITS) {
    if (entry.match.test(modelName)) return entry.limit;
  }
  return 200_000;
}

export function getBrainDir() {
  return process.env.ANTIGRAVITY_BRAIN_DIR || DEFAULT_BRAIN_DIR;
}

function extractUserTitle(rawContent) {
  if (!rawContent) return 'İsimsiz Konuşma';
  const match = rawContent.match(/<USER_REQUEST>\s*([\s\S]*?)\s*<\/USER_REQUEST>/i);
  const clean = (match ? match[1] : rawContent).replace(/\s+/g, ' ').trim();
  if (!clean) return 'İsimsiz Konuşma';
  return clean.length > 64 ? `${clean.slice(0, 64)}…` : clean;
}

function unwrapArgValue(val) {
  if (val == null) return '';
  let s = String(val).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    try {
      s = JSON.parse(s);
    } catch {
      s = s.slice(1, -1);
    }
  }
  return String(s).trim();
}

const GENERIC_FILENAMES = new Set(['skill.md', 'index.js', 'index.mjs', 'index.ts', 'readme.md', 'package.json']);

function extractToolTarget(toolCall, includeParentForGeneric = false) {
  const args = toolCall?.args;
  if (!args || typeof args !== 'object') return '';

  const pathKeys = ['Path', 'path', 'TargetFile', 'AbsolutePath', 'FilePath', 'DirectoryPath', 'SearchPath'];
  for (const k of pathKeys) {
    if (args[k]) {
      const val = unwrapArgValue(args[k]);
      if (val) {
        const cleaned = val.replace(/[\\/]+$/, '');
        const parts = cleaned.split(/[\\/]/).filter(Boolean);
        const base = parts[parts.length - 1] || val.slice(0, 28);
        if (includeParentForGeneric && parts.length >= 2 && GENERIC_FILENAMES.has(base.toLowerCase())) {
          return `${parts[parts.length - 2]}/${base}`;
        }
        return base;
      }
    }
  }

  const labelKeys = ['toolSummary', 'query', 'CommandLine', 'Pattern', 'Query'];
  for (const k of labelKeys) {
    if (args[k]) {
      const val = unwrapArgValue(args[k]).replace(/\s+/g, ' ');
      if (val) return val.length > 36 ? `${val.slice(0, 36)}…` : val;
    }
  }
  return '';
}

const LOW_SIGNAL_TOOLS = new Set(['update_steps', 'update_focus']);

function summarizeToolCalls(toolCalls) {
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
    return { toolCount: 0, primaryTool: '', targetFile: '', label: 'Mesaj / Yanıt', tools: [] };
  }
  const preferred =
    toolCalls.find((tc) => !LOW_SIGNAL_TOOLS.has(tc?.name) && extractToolTarget(tc)) ||
    toolCalls.find((tc) => !LOW_SIGNAL_TOOLS.has(tc?.name)) ||
    toolCalls[0];
  const primaryTool = preferred?.name || 'tool';
  const targetFile = extractToolTarget(preferred);
  const extraCount = toolCalls.length - 1;

  let label = primaryTool;
  if (targetFile) {
    label = `${primaryTool} · ${targetFile}`;
  }
  if (extraCount > 0) {
    label = `${label} +${extraCount}`;
  }

  const tools = toolCalls.map((tc) => ({
    name: tc?.name || 'tool',
    target: extractToolTarget(tc, true),
  }));

  return {
    toolCount: toolCalls.length,
    primaryTool,
    targetFile,
    label,
    tools,
  };
}

function truncateText(text, maxLen = 100) {
  const clean = String(text || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return '';
  return clean.length > maxLen ? `${clean.slice(0, maxLen - 1)}…` : clean;
}

function describeToolAction(toolCallsArr) {
  if (!Array.isArray(toolCallsArr) || toolCallsArr.length === 0) return null;
  const substantive = toolCallsArr.filter((tc) => !LOW_SIGNAL_TOOLS.has(tc?.name));
  const list = substantive.length > 0 ? substantive : toolCallsArr;
  const items = list.slice(0, 5).map((tc) => {
    const name = (tc?.name || 'tool').replace(/[|;]/g, '');
    const target = extractToolTarget(tc).replace(/[|;]/g, '');
    return target ? `${name}:${target}` : name;
  });
  return `__desc:actions|${items.join(';')}`;
}

function describeToolOutput(raw) {
  if (!raw) return '__desc:empty';
  const lines = String(raw)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^Created At:/i.test(l) && !/^Completed At:/i.test(l));
  if (lines.length === 0) return '__desc:empty';
  const joined = lines.join('\n');

  const showingMatch = joined.match(/Showing lines (\d+-\d+) of (\d+)/i);
  if (showingMatch) return `__desc:read_lines|${showingMatch[2]}`;

  const exitMatch = joined.match(/Command exited with code (-?\d+)/i);
  if (exitMatch) return `__desc:cmd_exit|${exitMatch[1]}`;

  const editMatch = joined.match(/Made (\d+) replacement(?:s)? in (.+?) starting at/i);
  if (editMatch) {
    const base = editMatch[2].trim().split(/[\\/]/).pop() || editMatch[2].trim();
    return `__desc:file_edit|${editMatch[1]}|${base}`;
  }

  if (/^Created file\.?$/i.test(lines[0])) return '__desc:file_created';
  if (/^Tool is running as a background task/i.test(lines[0])) return '__desc:bg_task';
  if (/^A1:\s*/i.test(lines[0])) return '__desc:user_choices';
  if (/^\{"results":/.test(lines[0])) return '__desc:search_results';
  if (/^OK$/i.test(lines[0])) return '__desc:ok';

  return truncateText(lines[0], 100) || '__desc:empty';
}

function extractUserPreview(rawContent, maxLen = 100) {
  if (!rawContent) return 'İsimsiz Konuşma';
  const match = rawContent.match(/<USER_REQUEST>\s*([\s\S]*?)\s*<\/USER_REQUEST>/i);
  return truncateText(match ? match[1] : rawContent, maxLen);
}

function getTranscriptPath(brainDir, conversationId) {
  return path.join(brainDir, conversationId, '.system_generated', 'logs', 'transcript.jsonl');
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const steps = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      steps.push(JSON.parse(trimmed));
    } catch {
      // Skip partially written trailing line during live writes
    }
  }
  return steps;
}

export function listConversations(limit = 20) {
  const brainDir = getBrainDir();
  if (!fs.existsSync(brainDir)) return [];

  let entries;
  try {
    entries = fs.readdirSync(brainDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const found = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const convId = entry.name;
    const transcriptPath = getTranscriptPath(brainDir, convId);
    if (!fs.existsSync(transcriptPath)) continue;

    try {
      const stat = fs.statSync(transcriptPath);
      const steps = readJsonl(transcriptPath);
      let title = convId.slice(0, 8);
      let model = null;
      let latestContextTokens = 0;
      let latestCacheTokens = 0;
      let turns = 0;

      for (const s of steps) {
        if (s.type === 'USER_INPUT' && title === convId.slice(0, 8)) {
          title = extractUserTitle(s.content);
        }
        if (s.type === 'PLANNER_RESPONSE') {
          turns += 1;
          if (s.model) model = s.model;
          const inTok = Number(s.input_tokens) || 0;
          const cacheTok = Number(s.cache_read_tokens) || 0;
          if (inTok + cacheTok > 0) {
            latestContextTokens = inTok + cacheTok;
            latestCacheTokens = cacheTok;
          }
        }
      }

      const contextLimit = inferContextLimit(model);
      found.push({
        id: convId,
        title,
        model: model || 'unknown',
        updatedAt: stat.mtime.toISOString(),
        mtimeMs: stat.mtimeMs,
        stepCount: steps.length,
        turns,
        latestContextTokens,
        latestCacheTokens,
        contextLimit,
        utilizationPct: contextLimit > 0 ? Number(((latestContextTokens / contextLimit) * 100).toFixed(2)) : 0,
      });
    } catch {
      // Ignore unreadable directories
    }
  }

  found.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return found.slice(0, limit).map(({ mtimeMs, ...rest }) => rest);
}

export function analyzeConversation(conversationId, customLimit) {
  const brainDir = getBrainDir();
  const conversations = listConversations(25);

  let targetId = conversationId;
  if (!targetId) {
    if (conversations.length === 0) {
      return {
        found: false,
        error: 'Henüz analiz edilecek bir Antigravity konuşması bulunamadı.',
        conversations: [],
      };
    }
    targetId = conversations[0].id;
  }

  const transcriptPath = getTranscriptPath(brainDir, targetId);
  if (!fs.existsSync(transcriptPath)) {
    return {
      found: false,
      error: `Konuşma transkripti bulunamadı: ${targetId}`,
      conversations,
    };
  }

  const stat = fs.statSync(transcriptPath);
  const steps = readJsonl(transcriptPath);

  let title = targetId.slice(0, 8);
  let model = null;
  let totalInputTokens = 0;
  let totalCacheReadTokens = 0;
  let totalOutputTokens = 0;
  let latestContextTokens = 0;
  let latestInputTokens = 0;
  let latestCacheReadTokens = 0;
  let latestOutputTokens = 0;
  let totalToolCalls = 0;
  let userMessageCount = 0;

  const breakdown = {
    userMessages: 0,
    toolOutputs: 0,
    modelResponses: 0,
    thinking: 0,
    systemOverhead: 0,
  };

  const turnTimeline = [];
  const rawTurns = [];
  const stepWeights = [];
  let turnIndex = 0;
  let pendingUserPreview = null;

  for (const s of steps) {
    const contentStr = typeof s.content === 'string' ? s.content : '';
    const thinkingStr = typeof s.thinking === 'string' ? s.thinking : '';
    const toolCallsArr = Array.isArray(s.tool_calls) ? s.tool_calls : [];
    const toolCallsStr = toolCallsArr.length > 0 ? JSON.stringify(toolCallsArr) : '';

    let extraTruncatedTokens = 0;
    const truncMatch = contentStr.match(/<truncated (\d+) bytes>/);
    if (truncMatch) {
      extraTruncatedTokens = Math.ceil(Number(truncMatch[1]) / 4);
    }

    if (s.type === 'USER_INPUT') {
      userMessageCount += 1;
      const cleanTitle = extractUserTitle(contentStr);
      if (title === targetId.slice(0, 8)) {
        title = cleanTitle;
      }
      pendingUserPreview = cleanTitle;
      const tok = estimateTokens(contentStr) + extraTruncatedTokens;
      breakdown.userMessages += tok;
      stepWeights.push({
        stepIndex: s.step_index ?? stepWeights.length,
        type: 'USER_INPUT',
        label: 'Kullanıcı Mesajı',
        tokens: tok,
        preview: extractUserPreview(contentStr, 100),
      });
    } else if (s.type === 'PLANNER_RESPONSE') {
      turnIndex += 1;
      if (s.model) model = s.model;
      const inTok = Number(s.input_tokens) || 0;
      const cacheTok = Number(s.cache_read_tokens) || 0;
      const outTok = Number(s.output_tokens) || 0;

      totalInputTokens += inTok;
      totalCacheReadTokens += cacheTok;
      totalOutputTokens += outTok;
      totalToolCalls += toolCallsArr.length;

      const ctxSize = inTok + cacheTok;
      if (ctxSize > 0) {
        latestContextTokens = ctxSize;
        latestInputTokens = inTok;
        latestCacheReadTokens = cacheTok;
        latestOutputTokens = outTok;
      }

      const thinkTok = estimateTokens(thinkingStr);
      const respTok = estimateTokens(contentStr) + estimateTokens(toolCallsStr);
      breakdown.thinking += thinkTok;
      breakdown.modelResponses += respTok;

      const toolSummary = summarizeToolCalls(toolCallsArr);
      const stepIdx = s.step_index ?? 0;

      turnTimeline.push({
        turn: turnIndex,
        stepIndex: stepIdx,
        contextTokens: ctxSize,
        inputTokens: inTok,
        cacheReadTokens: cacheTok,
        outputTokens: outTok,
        cacheHitPct: ctxSize > 0 ? Number(((cacheTok / ctxSize) * 100).toFixed(1)) : 0,
        createdAt: s.created_at || null,
      });

      rawTurns.push({
        turn: turnIndex,
        stepIndex: stepIdx,
        contextTokens: ctxSize,
        toolSummary,
        userBefore: pendingUserPreview,
        createdAt: s.created_at || null,
      });

      const toolNames = toolCallsArr.map((tc) => tc.name).filter(Boolean);
      const plannerPreview =
        toolNames.length > 0
          ? describeToolAction(toolCallsArr)
          : contentStr
            ? truncateText(contentStr, 100)
            : '__desc:thinking';

      stepWeights.push({
        stepIndex: stepIdx,
        type: 'PLANNER_RESPONSE',
        label:
          toolNames.length > 0
            ? `Model + Araçlar (${toolNames.slice(0, 3).join(', ')})`
            : 'Model Yanıtı',
        tokens: outTok || (thinkTok + respTok),
        preview: plannerPreview,
      });
      pendingUserPreview = null;
    } else {
      const tok = estimateTokens(contentStr) + extraTruncatedTokens;
      breakdown.toolOutputs += tok;
      stepWeights.push({
        stepIndex: s.step_index ?? stepWeights.length,
        type: s.type || 'GENERIC',
        label: s.type === 'SYSTEM_MESSAGE' ? 'Sistem Mesajı' : 'Araç Çıktısı',
        tokens: tok,
        preview: describeToolOutput(contentStr),
      });
    }
  }

  // Real turn-to-turn context delta spikes:
  // Delta between turn[i-1] and turn[i] is caused by turn[i-1]'s tool calls + results (or user message before turn[i]).
  const spikes = [];
  for (let i = 1; i < rawTurns.length; i += 1) {
    const prev = rawTurns[i - 1];
    const curr = rawTurns[i];
    if (prev.contextTokens <= 0 || curr.contextTokens <= 0) continue;
    const delta = curr.contextTokens - prev.contextTokens;
    if (delta <= 0) continue;

    let label = prev.toolSummary.label;
    let toolCount = prev.toolSummary.toolCount;
    let stepIndex = prev.stepIndex;

    if (toolCount === 0 && curr.userBefore) {
      label = `user · ${curr.userBefore.slice(0, 32)}`;
      stepIndex = curr.stepIndex;
    }

    spikes.push({
      stepIndex,
      turn: prev.turn,
      toolCount,
      primaryTool: prev.toolSummary.primaryTool,
      targetFile: prev.toolSummary.targetFile,
      label,
      tools: prev.toolSummary.tools || [],
      deltaTokens: delta,
      createdAt: curr.createdAt,
    });
  }

  const topSpikes = [...spikes]
    .sort((a, b) => b.deltaTokens - a.deltaTokens)
    .slice(0, 5);

  const heaviestSteps = [...stepWeights]
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 10);

  const estimatedVisibleSum =
    breakdown.userMessages + breakdown.toolOutputs + breakdown.modelResponses + breakdown.thinking;
  if (latestContextTokens > estimatedVisibleSum) {
    breakdown.systemOverhead = latestContextTokens - estimatedVisibleSum;
  }

  const contextLimit = Number(customLimit) > 0 ? Number(customLimit) : inferContextLimit(model);
  const utilizationPct =
    contextLimit > 0 ? Number(((latestContextTokens / contextLimit) * 100).toFixed(1)) : 0;

  const latestCacheHitPct =
    latestContextTokens > 0
      ? Number(((latestCacheReadTokens / latestContextTokens) * 100).toFixed(1))
      : 0;

  const cumulativePromptTokens = totalInputTokens + totalCacheReadTokens;
  const cumulativeCacheHitPct =
    cumulativePromptTokens > 0
      ? Number(((totalCacheReadTokens / cumulativePromptTokens) * 100).toFixed(1))
      : 0;

  let health = 'healthy';
  let recommendation = 'Bağlam penceresi sağlıklı durumda.';
  if (utilizationPct >= 85) {
    health = 'critical';
    recommendation = 'Bağlam kritik seviyede (%85+). `/compact` çalıştırmanız önerilir.';
  } else if (utilizationPct >= 65) {
    health = 'warning';
    recommendation = 'Bağlam dolmaya başlıyor (%65+). Yakında `/compact` kullanabilirsiniz.';
  } else if (utilizationPct >= 40) {
    health = 'moderate';
    recommendation = 'Bağlam kullanımı orta seviyede.';
  }

  const firstStepIndex = turnTimeline.length > 0 ? turnTimeline[0].stepIndex : 0;
  const lastStepIndex = turnTimeline.length > 0 ? turnTimeline[turnTimeline.length - 1].stepIndex : 0;

  return {
    found: true,
    conversationId: targetId,
    title,
    model: model || 'unknown',
    updatedAt: stat.mtime.toISOString(),
    stepCount: steps.length,
    firstStepIndex,
    lastStepIndex,
    turns: turnIndex,
    userMessageCount,
    totalToolCalls,
    contextLimit,
    latestContextTokens,
    latestInputTokens,
    latestCacheReadTokens,
    latestOutputTokens,
    latestCacheHitPct,
    utilizationPct,
    remainingTokens: Math.max(0, contextLimit - latestContextTokens),
    cumulative: {
      inputTokens: totalInputTokens,
      cacheReadTokens: totalCacheReadTokens,
      outputTokens: totalOutputTokens,
      cacheHitPct: cumulativeCacheHitPct,
    },
    health,
    recommendation,
    breakdown,
    turnTimeline,
    topSpikes,
    heaviestSteps,
    conversations,
  };
}
