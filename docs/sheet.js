// Googleスプレッドシート（Apps Script のウェブアプリ経由）から表を読む。
// 最後に読んだ内容は端末に保存し、オフラインでも表示できるようにする。

const mem = {};
const inflight = {};
const lastTry = {};
const cacheKey = (tripId) => 'sheet-cache:' + tripId;

async function call(cfg, params) {
  const u = new URL(cfg.url);
  Object.entries({ key: cfg.key, ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
  const res = await fetch(u.toString(), { redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error === 'forbidden') throw new Error('合言葉が違います');
  if (data.error) throw new Error(data.error);
  return data;
}

export function listTabs(cfg) { return call(cfg, { action: 'tabs' }); }

export function cached(tripId) {
  if (!mem[tripId]) { try { mem[tripId] = JSON.parse(localStorage.getItem(cacheKey(tripId))); } catch { mem[tripId] = null; } }
  return mem[tripId];
}

// 古ければ取り直す。onDone は新しい内容が届いたときに呼ばれる
export function refresh(tripId, cfg, tabs, { force = false, maxAgeMs = 5 * 60 * 1000, onDone, onError } = {}) {
  const c = cached(tripId);
  const want = [...new Set(tabs)].sort().join('\n');
  const fresh = c && c.want === want && Date.now() - new Date(c.fetchedAt).getTime() < maxAgeMs;
  if ((fresh && !force) || inflight[tripId] || !navigator.onLine) return;
  if (!force && Date.now() - (lastTry[tripId] || 0) < 30000) return;
  lastTry[tripId] = Date.now();
  inflight[tripId] = call(cfg, { tabs: want })
    .then((data) => {
      mem[tripId] = { ...data, want };
      try { localStorage.setItem(cacheKey(tripId), JSON.stringify(mem[tripId])); } catch {}
      onDone?.();
    })
    .catch((e) => onError?.(e))
    .finally(() => { delete inflight[tripId]; });
}
export const isLoading = (tripId) => !!inflight[tripId];

// 1つのタブを「前書き・見出し・行・後書き」に分ける
export function parseTab(values) {
  const rows = (values || []).map((r) => r.map((c) => String(c ?? '').trim()));
  const width = Math.max(0, ...rows.map((r) => { let w = r.length; while (w && !r[w - 1]) w--; return w; }));
  const filled = (r) => r.slice(0, width).filter(Boolean).length;
  const maxFilled = Math.max(0, ...rows.map(filled));
  const hi = rows.findIndex((r) => filled(r) >= Math.max(2, Math.ceil(maxFilled * 0.6)));
  if (hi < 0) return { pre: rows.filter((r) => filled(r)).map((r) => r.filter(Boolean).join(' ')), header: [], body: [], post: [] };
  const pre = rows.slice(0, hi).filter((r) => filled(r)).map((r) => r.filter(Boolean).join(' '));
  let header = rows[hi].slice(0, width);
  let start = hi + 1;
  // 2段の見出し（例：「予約状況」の下に「予約媒体・金額」）はまとめる
  const next = rows[start] ? rows[start].slice(0, width) : null;
  if (next && filled(next) >= 2 && header.some((h) => !h)
    && next.filter(Boolean).every((c) => c.length <= 14 && !/^[\d¥$S]/.test(c))
    && next.some((c, k) => c && !header[k])) {
    header = header.map((h, k) => next[k] || h);
    start++;
  }
  const body = []; let i = start;
  for (; i < rows.length; i++) { if (!filled(rows[i])) break; body.push(rows[i].slice(0, width)); }
  const post = rows.slice(i).filter((r) => filled(r)).map((r) => r.filter(Boolean).join(' '));
  header = header.map((h, k) => h || (body.some((r) => r[k]) ? `列${k + 1}` : ''));
  return { pre, header, body, post };
}

// Googleカレンダーに予定を書く／消す（Apps Script の doPost）
export async function calendar(cfg, payload) {
  // text/plain で送ると、ブラウザの事前確認（プリフライト）なしで送れる
  const res = await fetch(cfg.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key: cfg.key, calendar: cfg.calName || undefined, ...payload }), redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error === 'forbidden') throw new Error('合言葉が違います');
  if (data.error) throw new Error(data.error);
  return data;
}

// カレンダーの予定一覧（カレンダー側の変更をアプリに取り込む用）
export async function calendarEvents(cfg, { from, to, tz }) {
  return call(cfg, { action: 'events', calendar: cfg.calName || '', from, to, tz });
}
