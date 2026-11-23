import { createStore } from './store.js';
import { ic } from './icons.js';
import * as Sheet from './sheet.js';

// ================= 基本 =================
const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '');
const WD = ['日', '月', '火', '水', '木', '金', '土'];

const CURRENCIES = {
  JPY: { sym: '¥', name: '日本円' }, SGD: { sym: 'S$', name: 'シンガポールドル' }, USD: { sym: 'US$', name: '米ドル' },
  EUR: { sym: '€', name: 'ユーロ' }, GBP: { sym: '£', name: '英ポンド' }, KRW: { sym: '₩', name: '韓国ウォン' },
  TWD: { sym: 'NT$', name: '台湾ドル' }, HKD: { sym: 'HK$', name: '香港ドル' }, THB: { sym: '฿', name: 'タイバーツ' },
  AUD: { sym: 'A$', name: '豪ドル' }, CNY: { sym: '元', name: '人民元' }, VND: { sym: '₫', name: 'ベトナムドン' },
};
const num = (n) => Number(n).toLocaleString('ja-JP', { maximumFractionDigits: 2 });
function yenApprox(yen) {
  if (!isFinite(yen)) return '';
  if (Math.abs(yen) >= 10000) return `約${(yen / 10000).toFixed(yen >= 1e6 ? 0 : 1).replace(/\.0$/, '')}万円`;
  return `約${num(Math.round(yen / 10) * 10)}円`;
}
function toYen(amount, cur, trip) {
  if (!cur || cur === 'JPY') return Number(amount);
  return Number(amount) * Number(trip.rate || 0);
}
// 例: S$1,200（約14.8万円）
function money(amount, cur, trip) {
  if (amount === '' || amount == null || isNaN(amount)) return '';
  cur = cur || trip.currency || 'JPY';
  const sym = CURRENCIES[cur]?.sym || cur + ' ';
  if (cur === 'JPY') return `¥${num(amount)}`;
  const yen = toYen(amount, cur, trip);
  return `${sym}${num(amount)}${trip.rate ? `<span class="yen">（${yenApprox(yen)}）</span>` : ''}`;
}

function parseDate(s) { const [y, m, d] = (s || '').split('-').map(Number); return y ? new Date(y, m - 1, d) : null; }
function fmtDate(s, withYear = false) {
  const d = parseDate(s); if (!d) return '';
  return `${withYear ? d.getFullYear() + '/' : ''}${d.getMonth() + 1}/${d.getDate()}(${WD[d.getDay()]})`;
}
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function dateRange(start, end) {
  const out = []; const d = parseDate(start); const e = parseDate(end);
  if (!d || !e) return out;
  for (let i = 0; d <= e && i < 120; i++) { out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`); d.setDate(d.getDate() + 1); }
  return out;
}

// ================= 項目の種類 =================
// フィールド: [key, ラベル, 型, 必須/選択肢]
const KINDS = {
  plan: {
    label: '旅程', icon: 'calendar-days', noun: '予定',  add: '予定を追加',
    fields: [['date', '日付', 'date'], ['time', '開始', 'time'], ['endTime', '終了', 'time'], ['title', '予定', 'text', true],
      ['place', '場所', 'text'], ['amount', '費用の目安', 'money'], ['memo', 'メモ', 'textarea'], ['link', 'リンク', 'url']],
  },
  booking: {
    label: '予約', icon: 'ticket', noun: '予約',  add: '予約を追加',
    fields: [['category', '種類', 'select', ['航空券', 'ホテル', 'チケット', '交通', 'ツアー', 'レストラン', 'その他']], ['title', '名前', 'text', true],
      ['date', '日付', 'date'], ['time', '時刻', 'time'], ['endDate', '終了日（ホテル等）', 'date'], ['confNo', '予約番号', 'text'],
      ['amount', '金額', 'money'], ['paid', '支払い', 'select', ['未払い', '支払い済み', '現地払い']], ['link', 'リンク', 'url'], ['memo', 'メモ', 'textarea']],
  },
  todo: {
    label: 'やること', icon: 'list-checks', noun: 'やること',  add: 'やることを追加',
    fields: [['title', 'やること', 'text', true], ['due', '期限', 'date'], ['who', '担当', 'person+both'],
      ['category', '分類', 'select', ['準備', '予約', '手続き', '持ち物', '現地', 'その他']], ['memo', 'メモ', 'textarea'], ['link', 'リンク', 'url']],
  },
  expense: {
    label: '費用', icon: 'wallet', noun: '支出',  add: '支出を追加',
    fields: [['date', '日付', 'date'], ['title', '内容', 'text', true], ['amount', '金額', 'money', true], ['paidBy', '払った人', 'person'],
      ['split', '負担', 'select', ['2人で割る', '払った人の分']], ['category', '分類', 'select', ['食事', '交通', '宿泊', 'チケット', '観光', '買い物', 'その他']], ['memo', 'メモ', 'textarea']],
  },
  candidate: {
    label: '比較', icon: 'scale', noun: '候補',  add: '候補を追加',
    fields: [['group', 'グループ', 'select', ['航空券', 'ホテル', 'チケット', 'ツアー', 'レストラン', 'その他']], ['title', '候補名', 'text', true],
      ['status', '状態', 'select', ['候補', '◎おすすめ', '決定', '見送り']], ['price', '料金の目安（文字）', 'text'], ['amount', '料金（計算用）', 'money'],
      ['details', '詳細（「項目: 内容」を1行ずつ）', 'details'], ['link', 'リンク', 'url']],
  },
  note: {
    label: 'メモ', icon: 'notebook-pen', noun: 'メモ',  add: 'メモを追加',
    fields: [['category', '分類', 'text'], ['title', 'タイトル', 'text', true], ['importance', '重要度', 'select', ['高', '中', '低']],
      ['body', '内容', 'textarea'], ['source', '信頼度・出典メモ', 'text'], ['link', 'リンク', 'url']],
  },
};
const TABS = [['overview', '概要', 'house'], ['plan', '旅程', 'calendar-days'], ['booking', '予約', 'ticket'], ['todo', 'やること', 'list-checks'], ['expense', '費用', 'wallet'], ['candidate', '比較', 'scale'], ['note', 'メモ', 'notebook-pen']];
// 種類ごとの線アイコン
const CAT_ICONS = { 航空券: 'plane', ホテル: 'bed-double', 宿泊: 'bed-double', チケット: 'ticket', 交通: 'train-front', ツアー: 'map', レストラン: 'utensils-crossed', 食事: 'utensils-crossed', 観光: 'camera', 買い物: 'shopping-bag' };
const catIcon = (c, size = 18) => `<span class="cat-ic">${ic(CAT_ICONS[c] || 'ellipsis', size)}</span>`;
const TRIP_ICONS = [['plane', '飛行機'], ['train-front', '電車'], ['luggage', 'スーツケース'], ['map', '地図']];
const tripIcon = (t) => (TRIP_ICONS.some(([k]) => k === t.icon) ? t.icon : t.currency && t.currency !== 'JPY' ? 'plane' : 'luggage');

// ================= 状態 =================
const S = { store: null, user: null, trips: [], items: [], tripId: null, tab: 'overview', unsubTrips: null, unsubItems: null, filter: {}, error: '', cmpView: (() => { try { return localStorage.getItem('cmpView'); } catch { return null; } })() };
const trip = () => S.trips.find((t) => t.id === S.tripId);
const people = (t = trip()) => (t?.people?.length ? t.people : ['夫', '妻']);
const itemsOf = (kind) => S.items.filter((i) => i.kind === kind);

// ================= 起動 =================
(async function boot() {
  app.innerHTML = '<div class="center muted">読み込み中…</div>';
  try { S.store = await createStore(); }
  catch (e) { console.error(e); app.innerHTML = `<div class="center">データの保存先に接続できませんでした。<br><small>${esc(e.message)}</small></div>`; return; }
  S.store.onAuth((u) => {
    S.user = u;
    S.unsubTrips?.(); S.unsubItems?.(); S.unsubItems = null; S.trips = []; S.items = [];
    if (!u) { renderLogin(); return; }
    S.unsubTrips = S.store.watchTrips((list) => {
      S.error = '';
      S.trips = list.sort((a, b) => (a.startDate || '9').localeCompare(b.startDate || '9'));
      route();
    }, onErr('旅行の一覧'));
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('online', render); window.addEventListener('offline', render);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
function onErr(where) {
  return (e) => {
    console.error(where, e);
    S.error = (e.code === 'permission-denied' ? `${where}を読めませんでした（共有メンバーに入っているか確認してください）` : `${where}の読み込みでエラー：${e.message}`) + ` [${e.code || 'error'}]`;
    render();
  };
}

function route() {
  const [, page, id, tab] = location.hash.split('/');
  if (page === 'trip' && id) {
    if (S.tripId !== id) {
      S.unsubItems?.(); S.items = []; S.tripId = id;
      S.unsubItems = S.store.watchItems(id, (list) => { S.error = ''; S.items = list; render(); }, onErr('旅行の中身'));
    }
    S.tab = TABS.some((t) => t[0] === tab) ? tab : 'overview';
  } else {
    S.unsubItems?.(); S.unsubItems = null; S.tripId = null; S.items = [];
  }
  render();
}
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

// ================= 画面 =================
function render() {
  if (!S.user) return;
  const offline = !navigator.onLine;
  const banner = (S.store.mode === 'local'
    ? '<div class="banner">お試しモード：データはこの端末のブラウザだけに保存されます</div>' : '')
    + (offline ? '<div class="banner warn">オフラインです。変更は電波が戻ると同期されます</div>' : '')
    + (S.error ? `<div class="banner warn">${esc(S.error)}</div>` : '');
  if (S.tripId) {
    const t = trip();
    if (!t) { app.innerHTML = banner + '<div class="center muted">旅行を読み込み中…<br><a href="#/">一覧に戻る</a></div>'; return; }
    app.innerHTML = banner + renderTripHeader(t) + `<main class="main">${renderTab(t)}</main>`;
    bindTrip(t);
  } else {
    app.innerHTML = banner + renderHome();
    bindHome();
  }
}

function renderLogin() {
  app.innerHTML = `<div class="login">
    <div class="logo">${ic('plane', 34)}</div><h1>ふたりの旅ノート</h1>
    <p class="muted">2人で同じ旅行の予定・予約・費用を共有できます</p>
    <button class="btn primary big" id="signin">Googleでログイン</button>
    <p class="err" id="loginErr"></p></div>`;
  $('#signin').onclick = async () => {
    try { await S.store.signIn(); } catch (e) { $('#loginErr').textContent = 'ログインできませんでした：' + e.message; }
  };
}

// ---------- ホーム（旅行一覧） ----------
function renderHome() {
  const today = todayStr();
  const upcoming = S.trips.filter((t) => !t.endDate || t.endDate >= today);
  const past = S.trips.filter((t) => t.endDate && t.endDate < today).reverse();
  const card = (t) => {
    const d = t.startDate ? daysBetween(today, t.startDate) : null;
    const badge = d == null ? '' : d > 0 ? `あと${d}日` : t.endDate >= today ? '旅行中' : '';
    return `<a class="trip-card" href="#/trip/${esc(t.id)}">
      <div class="trip-ic">${ic(tripIcon(t), 24)}</div>
      <div class="grow"><div class="trip-name">${esc(t.name)}</div>
      <div class="muted small">${[esc(t.destination || ''), t.startDate ? fmtDate(t.startDate, true) + '〜' + fmtDate(t.endDate) : ''].filter(Boolean).join(' ・ ')}</div></div>
      ${badge ? `<span class="badge">${badge}</span>` : ''}</a>`;
  };
  return `<header class="home-head"><h1 class="row"><span class="brand-ic">${ic('plane', 18)}</span>ふたりの旅ノート</h1>
      <div class="muted small">${esc(S.user.name)}${S.store.mode === 'cloud' ? ' ・ <button class="link" id="signout">ログアウト</button>' : ''}</div></header>
    <main class="main">
      <div class="row gap"><button class="btn primary" id="newTrip">${ic('plus', 18)}新しい旅行</button>
        <label class="btn">${ic('upload', 18)}JSONから取り込む<input type="file" id="importFile" accept="application/json,.json" hidden></label></div>
      ${S.trips.length === 0 ? `<div class="empty">まだ旅行がありません。<br>
        <button class="btn" id="seedSg">シンガポール旅行（2027/6 D23 Asia）のデータを取り込む</button></div>` : ''}
      ${upcoming.length ? '<h2>これからの旅行</h2>' + upcoming.map(card).join('') : ''}
      ${past.length ? '<h2>思い出</h2>' + past.map(card).join('') : ''}
      ${S.trips.length && !S.trips.some((t) => t.seed === 'sg-2027') ? '<p class="small"><button class="link" id="seedSg">シンガポール旅行（2027/6）の初期データを取り込む</button></p>' : ''}
    </main>`;
}
function bindHome() {
  $('#signout') && ($('#signout').onclick = () => S.store.signOut());
  $('#newTrip').onclick = () => editTrip(null);
  $('#seedSg') && ($('#seedSg').onclick = async () => {
    const { singaporeSeed } = await import('./seed-singapore.js');
    await importTrip(singaporeSeed);
  });
  $('#importFile').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { await importTrip(JSON.parse(await f.text())); } catch (err) { toast('取り込めませんでした：' + err.message); }
  };
}
async function importTrip({ trip: t, items }) {
  if (!t?.name) throw new Error('旅行データの形式が違います');
  const { id, members, createdAt, ...rest } = t;
  const newId = await S.store.addTrip({ ...rest, members: S.store.mode === 'cloud' ? (members || []) : [] });
  await S.store.addItems(newId, (items || []).map(({ id: _i, updatedAt, updatedBy, ...it }) => it));
  toast('取り込みました');
  go(`#/trip/${newId}`);
}

// ---------- 旅行のヘッダーとタブ ----------
function renderTripHeader(t) {
  return `<header class="trip-head">
    <div class="row"><a href="#/" class="back" aria-label="一覧へ">${ic('chevron-left', 26)}</a>
      <div class="grow"><div class="trip-title">${esc(t.name)}</div>
      <div class="muted small">${t.startDate ? fmtDate(t.startDate, true) + '〜' + fmtDate(t.endDate) : '日程未定'}${t.currency && t.currency !== 'JPY' ? ` ・ 1${esc(CURRENCIES[t.currency]?.sym || t.currency)}≈${esc(t.rate)}円` : ''}</div></div>
      <button class="set-btn" id="tripSettings">${ic('settings', 20)}<span>設定</span></button></div>
  </header>
  <nav class="tabbar">${TABS.map(([k, l, i]) => `<a href="#/trip/${esc(t.id)}/${k}" class="${S.tab === k ? 'on' : ''}">${ic(i, 20)}<span class="tab-label">${l}</span></a>`).join('')}</nav>`;
}
function renderTab(t) {
  switch (S.tab) {
    case 'plan': return renderPlan(t);
    case 'booking': return renderBookings(t);
    case 'todo': return renderTodos(t);
    case 'expense': return renderExpenses(t);
    case 'candidate': return t.sheet?.compare?.length ? renderSheet(t, 'compare') : renderCandidates(t);
    case 'note': return t.sheet?.notes?.length ? renderSheet(t, 'notes') : renderNotes(t);
    default: return renderOverview(t);
  }
}
function bindTrip(t) {
  $('#tripSettings').onclick = () => editTrip(t);
  app.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => editItem(b.dataset.add, null, b.dataset.preset ? JSON.parse(b.dataset.preset) : {})));
  app.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = (e) => {
    if (e.target.closest('a,input,summary,details[open] dl,button:not([data-edit])')) return;
    const it = S.items.find((i) => i.id === b.dataset.edit); if (it) editItem(it.kind, it);
  }));
  app.querySelectorAll('[data-done]').forEach((c) => (c.onchange = () => S.store.updateItem(t.id, c.dataset.done, { done: c.checked }).catch(fail)));
  app.querySelectorAll('[data-filter]').forEach((b) => (b.onclick = () => { S.filter[S.tab] = b.dataset.filter; render(); }));
  app.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => { S.cmpView = b.dataset.view; try { localStorage.setItem('cmpView', S.cmpView); } catch {} render(); }));
  app.querySelectorAll('[data-sheet-link]').forEach((b) => (b.onclick = () => editSheetLink(t)));
  app.querySelectorAll('[data-sheet-refresh]').forEach((b) => (b.onclick = () => { S.sheetErr = ''; loadSheet(t, true); render(); }));
  app.querySelectorAll('[data-purge]').forEach((b) => (b.onclick = async () => {
    const list = itemsOf(b.dataset.purge);
    if (!confirmBox(`アプリ内の${KINDS[b.dataset.purge].label}データ${list.length}件を削除しますか？（スプレッドシートには影響しません）`)) return;
    for (const it of list) await S.store.deleteItem(t.id, it.id).catch(fail);
  }));
  app.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = () => go(`#/trip/${t.id}/${b.dataset.goto}`)));
}
const pill = (text, cls = '') => `<span class="pill ${cls}">${text}</span>`;
function duePill(due, done, t) {
  if (!due) return '';
  const left = daysBetween(todayStr(), due);
  const label = fmtDate(due, due.slice(0, 4) !== (t.startDate || todayStr()).slice(0, 4));
  if (done) return pill(label);
  if (left < 0) return pill(`${ic('circle-alert', 12)}${label} 期限切れ`, 'red');
  if (left <= 14) return pill(`${ic('clock', 12)}${label}${left === 0 ? ' 今日' : ` あと${left}日`}`, 'amber');
  return pill(`${ic('clock', 12)}${label}`);
}
const addBtn = (kind, preset) => `<button class="fab" data-add="${kind}" ${preset ? `data-preset='${esc(JSON.stringify(preset))}'` : ''}>${ic('plus', 18)}${KINDS[kind].add}</button>`;
const linkOut = (u) => (safeUrl(u) ? `<a href="${esc(u)}" target="_blank" rel="noopener" class="ext">リンク${ic('external-link', 14)}</a>` : '');
const filterBar = (opts) => {
  const cur = S.filter[S.tab] || 'すべて';
  return `<div class="chips">${['すべて', ...opts].map((o) => `<button class="chip ${o === cur ? 'on' : ''}" data-filter="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
};
const filtered = (list, key) => { const f = S.filter[S.tab]; return !f || f === 'すべて' ? list : list.filter((i) => (i[key] || 'その他') === f); };

// ---------- 概要 ----------
function renderOverview(t) {
  const today = todayStr();
  let count = '';
  if (t.startDate) {
    const d = daysBetween(today, t.startDate);
    count = d > 0 ? `<div class="count"><span>出発まで</span><b>${d}</b><span>日</span></div>`
      : today <= t.endDate ? `<div class="count"><span>旅行</span><b>${daysBetween(t.startDate, today) + 1}</b><span>日目</span></div>`
        : '<div class="count"><span>おかえりなさい</span></div>';
  }
  const todos = itemsOf('todo');
  const open = todos.filter((i) => !i.done).sort((a, b) => (a.due || '9').localeCompare(b.due || '9'));
  const todayPlans = itemsOf('plan').filter((p) => p.date === today).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const bookTotal = itemsOf('booking').reduce((s, b) => s + (Number(b.amount) ? toYen(b.amount, b.currency, t) : 0), 0);
  const expTotal = itemsOf('expense').reduce((s, b) => s + (Number(b.amount) ? toYen(b.amount, b.currency, t) : 0), 0);
  const chosen = itemsOf('candidate').filter((c) => c.status === '決定');
  return `${count}
    ${todayPlans.length ? `<section class="card"><h3>今日の予定</h3>${todayPlans.map(planRow).join('')}</section>` : ''}
    <section class="card"><div class="row"><h3 class="grow">やること</h3><span class="muted small">${todos.length - open.length}/${todos.length} 完了</span></div>
      ${todos.length ? `<div class="progress"><i style="width:${Math.round(((todos.length - open.length) / todos.length) * 100)}%"></i></div>` : ''}
      ${open.slice(0, 5).map((i) => todoRow(i, t)).join('') || '<p class="muted small">未完了のやることはありません</p>'}
      ${open.length > 5 ? `<button class="link" data-goto="todo">ほか${open.length - 5}件を見る</button>` : ''}</section>
    <section class="card"><h3>お金</h3>
      <div class="stat-row"><div><span class="muted small">予約の合計</span><b>${yenApprox(bookTotal) || '—'}</b></div>
      <div><span class="muted small">支出の合計</span><b>${yenApprox(expTotal) || '—'}</b></div>
      ${t.budget ? `<div><span class="muted small">予算</span><b>${yenApprox(Number(t.budget))}</b></div>` : ''}</div>
      ${t.budget ? `<div class="progress ${bookTotal + expTotal > t.budget ? 'over' : ''}"><i style="width:${Math.min(100, Math.round(((bookTotal + expTotal) / t.budget) * 100))}%"></i></div>` : ''}
      <button class="link" data-goto="expense">精算を見る</button></section>
    <section class="card"><h3>決まったこと</h3>
      ${chosen.length ? chosen.map((c) => `<div class="line" data-edit="${esc(c.id)}">${catIcon(c.group)}<b>${esc(c.group)}</b>：${esc(c.title)}</div>`).join('') : '<p class="muted small">比較タブで「決定」にした候補がここに出ます</p>'}</section>
    ${t.memo ? `<section class="card"><h3>旅行メモ</h3><p class="small pre clamp3">${esc(t.memo)}</p></section>` : ''}`;
}

// ---------- 旅程 ----------
function planRow(p) {
  return `<div class="item" data-edit="${esc(p.id)}"><div class="time">${p.time ? `<span class="tpill">${esc(p.time)}</span>` : ''}</div>
    <div class="grow"><div class="title">${esc(p.title)}</div>
    ${p.place ? `<div class="small muted row">${ic('map-pin', 14)}&nbsp;${esc(p.place)}</div>` : ''}
    ${p.memo ? `<div class="small muted clamp">${esc(p.memo)}</div>` : ''}
    ${p.amount || safeUrl(p.link) ? `<div class="small">${p.amount ? money(p.amount, p.currency, trip()) + ' ' : ''}${linkOut(p.link)}</div>` : ''}</div></div>`;
}
function renderPlan(t) {
  const plans = itemsOf('plan');
  const books = itemsOf('booking').filter((b) => b.date);
  const days = dateRange(t.startDate, t.endDate);
  const extra = [...new Set([...plans, ...books].map((p) => p.date).filter((d) => d && !days.includes(d)))].sort();
  const all = [...days, ...extra];
  const sortT = (a, b) => (a.time || '99').localeCompare(b.time || '99');
  let html = all.map((d) => {
    const i = days.indexOf(d);
    const ps = plans.filter((p) => p.date === d);
    const bs = books.filter((b) => b.date === d);
    const rows = [...ps.map((p) => ({ ...p, _t: 'p' })), ...bs.map((b) => ({ ...b, _t: 'b' }))].sort(sortT)
      .map((x) => x._t === 'p' ? planRow(x) : `<div class="item booking-in-plan" data-edit="${esc(x.id)}"><div class="time">${esc(x.time || '')}</div>
        <div class="grow"><div class="title row">${ic('ticket', 16)}&nbsp;${esc(x.title)}</div><div class="small muted">${esc(x.category || '予約')}${x.confNo ? ' ・ 予約番号 ' + esc(x.confNo) : ''}</div></div></div>`).join('');
    return `<section class="day ${d === todayStr() ? 'today' : ''}"><div class="day-head"><b>${i >= 0 ? `${i + 1}日目` : '日程外'}</b> ${fmtDate(d)}
      <button class="mini" data-add="plan" data-preset='${esc(JSON.stringify({ date: d }))}' aria-label="この日に予定を追加">${ic('plus', 16)}</button></div>
      ${rows || '<div class="muted small pad">予定なし</div>'}</section>`;
  }).join('');
  const undated = plans.filter((p) => !p.date);
  if (undated.length) html += `<section class="day"><div class="day-head"><b>日付未定・行きたい所</b></div>${undated.map(planRow).join('')}</section>`;
  if (!all.length && !undated.length) html = '<div class="empty">右上の設定から旅行の日程を入れると、日ごとの予定表になります</div>';
  return html + addBtn('plan');
}

// ---------- 予約 ----------
function renderBookings(t) {
  const list = filtered(itemsOf('booking'), 'category').sort((a, b) => (a.date || '9').localeCompare(b.date || '9') || (a.time || '').localeCompare(b.time || ''));
  const total = list.reduce((s, b) => s + (Number(b.amount) ? toYen(b.amount, b.currency, t) : 0), 0);
  return filterBar(KINDS.booking.fields[0][3]) + (list.length ? list.map((b) => `<div class="item card" data-edit="${esc(b.id)}">
      <div class="grow"><div class="row">${catIcon(b.category)}<span class="title grow">${esc(b.title)}</span><span class="tag">${esc(b.category || 'その他')}</span></div>
      <div class="small">${b.date ? fmtDate(b.date) + ' ' + esc(b.time || '') : '日付未定'}${b.endDate ? ' 〜 ' + fmtDate(b.endDate) : ''}</div>
      ${b.confNo ? `<div class="conf">予約番号 <b>${esc(b.confNo)}</b></div>` : ''}
      <div class="small">${money(b.amount, b.currency, t)} ${b.paid ? `<span class="tag ${b.paid === '未払い' ? 'warn' : ''}">${esc(b.paid)}</span>` : ''} ${linkOut(b.link)}</div>
      ${b.memo ? `<div class="small muted clamp">${esc(b.memo)}</div>` : ''}</div></div>`).join('')
    + `<p class="total">合計 ${yenApprox(total)}</p>`
    : '<div class="empty">予約した航空券・ホテル・チケットの予約番号や金額をここにまとめます</div>') + addBtn('booking');
}

// ---------- やること ----------
function todoRow(i, t) {
  return `<div class="item todo ${i.done ? 'done' : ''}" data-edit="${esc(i.id)}">
    <input type="checkbox" data-done="${esc(i.id)}" ${i.done ? 'checked' : ''} aria-label="完了">
    <div class="grow"><div class="title">${esc(i.title)}</div>
    <div class="meta">${duePill(i.due, i.done, t)}${i.who && i.who !== '2人' ? pill(esc(i.who)) : ''}${i.memo || i.link ? `<span class="more">${ic('notebook-pen', 12)}メモ</span>` : ''}</div></div></div>`;
}
function renderTodos(t) {
  const who = ['2人', ...people(t)];
  const f = S.filter.todo;
  let list = itemsOf('todo');
  if (f && f !== 'すべて') list = f === '未完了' ? list.filter((i) => !i.done) : list.filter((i) => (i.who || '2人') === f);
  const sorted = list.sort((a, b) => (a.done - b.done) || (a.due || '9').localeCompare(b.due || '9'));
  return filterBar(['未完了', ...who]) + (sorted.length ? sorted.map((i) => todoRow(i, t)).join('') : '<div class="empty">準備や手続きを期限つきで2人でチェックできます</div>') + addBtn('todo');
}

// ---------- 費用と精算 ----------
function renderExpenses(t) {
  const ps = people(t);
  const list = itemsOf('expense').sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const paid = Object.fromEntries(ps.map((p) => [p, 0]));
  const owe = Object.fromEntries(ps.map((p) => [p, 0]));
  let total = 0;
  list.forEach((e) => {
    const y = toYen(e.amount, e.currency, t); if (!isFinite(y)) return;
    total += y;
    const payer = ps.includes(e.paidBy) ? e.paidBy : ps[0];
    paid[payer] += y;
    if (e.split === '払った人の分') owe[payer] += y; else ps.forEach((p) => (owe[p] += y / ps.length));
  });
  const bal = ps.map((p) => ({ p, v: paid[p] - owe[p] }));
  const debtors = bal.filter((b) => b.v < -1).map((b) => ({ ...b })); const creditors = bal.filter((b) => b.v > 1).map((b) => ({ ...b }));
  const settle = [];
  for (const d of debtors) for (const c of creditors) {
    const x = Math.min(-d.v, c.v); if (x < 1) continue;
    settle.push(`${esc(d.p)} → ${esc(c.p)} に <b>${yenApprox(x)}</b>${t.currency && t.currency !== 'JPY' && t.rate ? `（${CURRENCIES[t.currency]?.sym || ''}${num(Math.round(x / t.rate * 100) / 100)}）` : ''}`);
    d.v += x; c.v -= x;
  }
  const byCat = {};
  list.forEach((e) => { const y = toYen(e.amount, e.currency, t); if (isFinite(y)) byCat[e.category || 'その他'] = (byCat[e.category || 'その他'] || 0) + y; });
  return `<section class="card"><h3>精算</h3>
      <div class="stat-row"><div><span class="muted small">支出の合計</span><b>${yenApprox(total) || '—'}</b></div>
      ${ps.map((p) => `<div><span class="muted small">${esc(p)}が払った額</span><b>${yenApprox(paid[p]) || '—'}</b></div>`).join('')}</div>
      <p>${settle.length ? settle.join('<br>') : '精算は不要です（貸し借りなし）'}</p>
      ${Object.keys(byCat).length ? `<div class="cats">${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="tag">${esc(k)} ${yenApprox(v)}</span>`).join('')}</div>` : ''}
    </section>
    ${list.length ? list.map((e) => `<div class="item" data-edit="${esc(e.id)}">${catIcon(e.category)}
      <div class="grow"><div class="title">${esc(e.title)}</div><div class="small muted">${e.date ? fmtDate(e.date) + ' ・ ' : ''}${esc(e.paidBy || ps[0])}が支払い ・ ${esc(e.split || '2人で割る')}${e.category ? ' ・ ' + esc(e.category) : ''}</div></div>
      <div class="amt">${money(e.amount, e.currency, t)}</div></div>`).join('') : '<div class="empty">現地での支出を記録すると、どちらがいくら払ったか自動で精算します</div>'}
    ${addBtn('expense', { date: todayStr() >= (t.startDate || '') && todayStr() <= (t.endDate || '') ? todayStr() : '' })}`;
}

// ---------- 比較（表） ----------
function renderCandidates(t) {
  const all = itemsOf('candidate');
  const groups = [...new Set(all.map((c) => c.group || 'その他'))];
  const list = filtered(all, 'group');
  const useTable = (S.cmpView || (innerWidth >= 700 ? 'table' : 'cards')) === 'table';
  const order = { '決定': 0, '◎おすすめ': 1, '候補': 2, '見送り': 3 };
  const html = [...new Set(list.map((c) => c.group || 'その他'))].map((g) => {
    const rows = list.filter((c) => (c.group || 'その他') === g).sort((a, b) => (order[a.status] ?? 2) - (order[b.status] ?? 2) || (a.order ?? 0) - (b.order ?? 0));
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r.details || {})))];
    if (!useTable) return `<h2>${esc(g)}</h2>${rows.map((r) => `<div class="item card cand st-${esc(r.status || '候補')}" data-edit="${esc(r.id)}"><div class="grow">
        <div class="row"><span class="title grow">${esc(r.title)}</span><span class="tag ${r.status === '決定' ? 'solid' : ''}">${esc(r.status || '候補')}</span></div>
        ${r.price || r.amount ? `<div class="price">${esc(r.price || '')}${r.amount ? ' ' + money(r.amount, r.currency, t) : ''}</div>` : ''}
        ${keys.length && Object.keys(r.details || {}).length ? `<details><summary class="small">詳細</summary><dl>${Object.entries(r.details).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details>` : ''}
        ${linkOut(r.link)}</div></div>`).join('')}`;
    return `<h2>${esc(g)}</h2><div class="table-wrap"><table class="cmp"><thead><tr><th class="sticky">候補</th><th>状態</th><th>料金</th>${keys.map((k) => `<th>${esc(k)}</th>`).join('')}<th></th></tr></thead><tbody>
      ${rows.map((r) => `<tr class="st-${esc(r.status || '候補')}" data-edit="${esc(r.id)}"><th class="sticky">${esc(r.title)}</th><td><span class="tag">${esc(r.status || '候補')}</span></td>
        <td>${esc(r.price || '')}${r.amount ? '<br>' + money(r.amount, r.currency, t) : ''}</td>
        ${keys.map((k) => `<td>${esc(r.details?.[k] || '')}</td>`).join('')}<td>${linkOut(r.link)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }).join('');
  const toggle = `<div class="seg"><button class="${useTable ? '' : 'on'}" data-view="cards">カード</button><button class="${useTable ? 'on' : ''}" data-view="table">表</button></div>`;
  return `<div class="row">${groups.length > 1 ? `<div class="grow">${filterBar(groups)}</div>` : '<span class="grow"></span>'}${toggle}</div>`
    + (html || '<div class="empty">航空券やホテルの候補を並べて比べ、決まったら「決定」にします</div>')
    + `<p class="muted small">タップすると編集・状態の変更ができます。${useTable ? '表は横にスクロールできます。' : ''}</p>`
    + '<p class="small"><button class="link" data-sheet-link>スプレッドシートの表を表示する</button></p>' + addBtn('candidate');
}

// ---------- メモ ----------
function noteCard(n) {
  return `<div class="item card note imp-${esc(n.importance || '中')}" data-edit="${esc(n.id)}"><div class="grow">
    <div class="row"><span class="title grow">${esc(n.title)}</span>${n.importance === '高' ? pill('重要', 'red') : ''}</div>
    ${n.body ? `<div class="small clamp">${esc(n.body)}</div>` : ''}</div></div>`;
}
function renderNotes(t) {
  const all = itemsOf('note');
  const cats = [...new Set(all.map((n) => n.category || 'その他'))];
  const imp = (x) => ({ 高: 0, 中: 1, 低: 2 }[x.importance] ?? 1);
  const list = filtered(all, 'category').sort((a, b) => imp(a) - imp(b) || (a.order ?? 0) - (b.order ?? 0));
  const groups = [...new Set(list.map((n) => n.category || 'その他'))];
  return (cats.length > 1 ? filterBar(cats) : '') + (list.length ? groups.map((g) => `<h2>${esc(g)}</h2>` + list.filter((n) => (n.category || 'その他') === g).map(noteCard).join('')).join('') : '<div class="empty">注意点・持ち物・現地情報などのメモ</div>') + '<p class="small"><button class="link" data-sheet-link>スプレッドシートの表を表示する</button></p>' + addBtn('note');
}

// ================= 入力フォーム =================
function fieldHtml([key, label, type, opt], v, t) {
  const val = v[key] ?? '';
  const id = 'f_' + key;
  const req = opt === true ? 'required' : '';
  let input;
  switch (type) {
    case 'textarea': input = `<textarea id="${id}" name="${key}" rows="3">${esc(val)}</textarea>`; break;
    case 'details': input = `<textarea id="${id}" name="${key}" rows="5" placeholder="所要時間: 約7時間&#10;受託手荷物: 23kg">${esc(Object.entries(val || {}).map(([k, x]) => `${k}: ${x}`).join('\n'))}</textarea>`; break;
    case 'select': input = `<select id="${id}" name="${key}"><option value=""></option>${opt.map((o) => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`; break;
    case 'person': case 'person+both': {
      const opts = [...(type === 'person+both' ? ['2人'] : []), ...people(t)];
      input = `<select id="${id}" name="${key}">${opts.map((o) => `<option ${o === (val || opts[0]) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`; break;
    }
    case 'money': {
      const cur = v.currency || t.currency || 'JPY';
      const curs = [...new Set([t.currency || 'JPY', 'JPY'])];
      input = `<div class="row gap"><input id="${id}" name="${key}" type="number" step="any" inputmode="decimal" value="${esc(val)}" ${req} class="grow">
        <select name="currency">${curs.map((c) => `<option value="${c}" ${c === cur ? 'selected' : ''}>${esc(CURRENCIES[c]?.sym || c)}</option>`).join('')}</select></div>`; break;
    }
    default: input = `<input id="${id}" name="${key}" type="${type === 'url' ? 'url' : type}" value="${esc(val)}" ${req}>`;
  }
  return `<label class="field" for="${id}"><span>${esc(label)}${req ? ' *' : ''}</span>${input}</label>`;
}
function openSheet(title, inner, onSave, onDelete, delLabel = '削除') {
  const el = document.createElement('div');
  el.className = 'sheet-bg';
  el.innerHTML = `<form class="sheet" novalidate><div class="sheet-head"><b>${esc(title)}</b><button type="button" class="icon-btn" data-close aria-label="閉じる">${ic('x', 22)}</button></div>
    <div class="sheet-body">${inner}</div>
    <div class="sheet-foot">${onDelete ? `<button type="button" class="btn danger" data-del>${esc(delLabel)}</button>` : ''}<span class="grow"></span>
    <button type="button" class="btn" data-close>キャンセル</button><button class="btn primary">保存</button></div></form>`;
  document.body.appendChild(el);
  const close = () => el.remove();
  el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) close(); });
  el.querySelector('[data-del]')?.addEventListener('click', async () => { if (confirmBox(`${delLabel}しますか？`)) { close(); await onDelete().catch(fail); } });
  const form = el.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const missing = [...form.querySelectorAll('[required]')].find((i) => !i.value.trim());
    if (missing) { missing.focus(); missing.classList.add('invalid'); return; }
    const fd = Object.fromEntries(new FormData(form).entries());
    close();
    try { await onSave(fd, form); } catch (err) { fail(err); }
  });
  setTimeout(() => form.querySelector('input:not([type=hidden]),textarea')?.focus({ preventScroll: true }), 50);
}
function confirmBox(msg) { return window.confirm(msg); }

function editItem(kind, item, preset = {}) {
  const t = trip(); const def = KINDS[kind];
  const v = item ? { ...item } : { ...preset };
  if (!item && kind === 'todo') v.who = '2人';
  openSheet(`${def.noun}${item ? 'を編集' : 'を追加'}`, def.fields.map((f) => fieldHtml(f, v, t)).join(''),
    async (fd) => {
      const out = { kind };
      def.fields.forEach(([k, , type]) => {
        if (type === 'money') { out[k] = fd[k] === '' ? '' : Number(fd[k]); out.currency = fd.currency; }
        else if (type === 'details') {
          out[k] = Object.fromEntries((fd[k] || '').split('\n').map((l) => l.match(/^(.*?)[:：]\s*(.*)$/)).filter((m) => m && m[1].trim()).map((m) => [m[1].trim(), m[2].trim()]));
        } else out[k] = (fd[k] ?? '').trim();
      });
      if (item) await S.store.updateItem(t.id, item.id, out); else await S.store.addItem(t.id, { ...out, done: false });
    },
    item ? () => S.store.deleteItem(t.id, item.id) : null);
}

function editTrip(t) {
  const v = t || { currency: 'JPY', rate: '', people: ['夫', '妻'] };
  const cloud = S.store.mode === 'cloud';
  const inner = `
    <label class="field"><span>旅行の名前 *</span><input name="name" required value="${esc(v.name)}" placeholder="例：シンガポール（D23 Asia）"></label>
    <div class="row gap"><label class="field" style="flex:0 0 8em"><span>アイコン</span><select name="icon">${TRIP_ICONS.map(([k, l]) => `<option value="${k}" ${k === tripIcon(v) ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="field grow"><span>行き先</span><input name="destination" value="${esc(v.destination)}"></label></div>
    <div class="row gap"><label class="field grow"><span>出発日</span><input type="date" name="startDate" value="${esc(v.startDate)}"></label>
    <label class="field grow"><span>帰着日</span><input type="date" name="endDate" value="${esc(v.endDate)}"></label></div>
    <div class="row gap"><label class="field grow"><span>現地通貨</span><select name="currency">${Object.entries(CURRENCIES).map(([c, x]) => `<option value="${c}" ${c === v.currency ? 'selected' : ''}>${x.sym} ${x.name}</option>`).join('')}</select></label>
    <label class="field grow"><span>1単位＝何円（目安）</span><input type="number" step="any" name="rate" value="${esc(v.rate)}" placeholder="例：123"></label></div>
    <label class="field"><span>予算（円・2人分）</span><input type="number" name="budget" value="${esc(v.budget)}"></label>
    <label class="field"><span>旅行する人（カンマ区切り）</span><input name="people" value="${esc(people(v).join(', '))}"></label>
    ${cloud ? `<label class="field"><span>共有するGoogleアカウント（メール、カンマ区切り）</span><input name="members" value="${esc((v.members || []).join(', '))}" placeholder="相手のメールアドレス"></label>` : ''}
    <label class="field"><span>旅行メモ</span><textarea name="memo" rows="3">${esc(v.memo)}</textarea></label>
    ${t ? `<div class="row gap"><button type="button" class="btn" id="sheetLinkBtn">${ic('sheet', 18)}スプレッドシート連携${t.sheet?.url ? '（設定済み）' : ''}</button>
      <button type="button" class="btn" id="exportJson">${ic('download', 18)}バックアップ（JSON）</button></div>` : ''}`;
  openSheet(t ? '旅行の設定' : '新しい旅行', inner, async (fd) => {
    const data = {
      name: fd.name.trim(), icon: fd.icon, destination: fd.destination.trim(), startDate: fd.startDate, endDate: fd.endDate || fd.startDate,
      currency: fd.currency, rate: fd.currency === 'JPY' ? 1 : Number(fd.rate) || '', budget: Number(fd.budget) || '', memo: fd.memo,
      people: fd.people.split(/[,、，]/).map((s) => s.trim()).filter(Boolean),
    };
    if (cloud) {
      data.members = [...new Set([S.user.email, ...fd.members.split(/[,、，\s]/).map((s) => s.trim().toLowerCase()).filter((s) => s.includes('@'))])];
    }
    if (t) await S.store.updateTrip(t.id, data);
    else { const id = await S.store.addTrip(data); go(`#/trip/${id}`); }
  }, t ? async () => { await S.store.deleteTrip(t.id); go('#/'); } : null);
  $('#sheetLinkBtn')?.addEventListener('click', () => { document.querySelector('.sheet-bg')?.remove(); editSheetLink(t); });
  $('#exportJson')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ trip: t, items: S.items }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${t.name}.json`; a.click();
  });
}

// ================= 通知 =================
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}
function fail(e) { console.error(e); toast('保存できませんでした：' + (e.code === 'permission-denied' ? '権限がありません' : e.message)); }

// ================= スプレッドシート連携 =================
const SECTION = { compare: '比較', notes: 'メモ' };
function loadSheet(t, force = false) {
  const tabs = [...(t.sheet?.compare || []), ...(t.sheet?.notes || [])];
  if (!t.sheet?.url || !tabs.length) return;
  Sheet.refresh(t.id, t.sheet, tabs, {
    force,
    onDone: () => { S.sheetErr = ''; render(); },
    onError: (e) => { S.sheetErr = e.message; render(); },
  });
}
const shortTab = (name, all) => {
  // 共通の頭（例：「シンガポール 」）を省いて短く
  const pre = all.length > 1 ? all.reduce((p, n) => { let i = 0; while (i < p.length && p[i] === n[i]) i++; return p.slice(0, i); }) : '';
  const cut = pre.lastIndexOf(' ') + 1 || pre.lastIndexOf('　') + 1;
  return name.slice(cut) || name;
};
const cell = (v) => {
  if (v === 'TRUE') return ic('check', 16);
  if (v === 'FALSE') return '<span class="muted">—</span>';
  if (/^https?:\/\/\S+$/.test(v)) return `<a href="${esc(v)}" target="_blank" rel="noopener" class="ext">リンク${ic('external-link', 14)}</a>`;
  return esc(v);
};
// 1列目が「旅行先」の共通タブは、この旅行の行（と「共通」の行）だけにする
const PLACE_COL = /^(旅行先|行き先|国|都市|国・地域)$/;
function forTrip(tab, t) {
  if (!PLACE_COL.test(tab.header[0] || '')) return tab;
  const place = (t.sheet?.place || t.destination || '').trim();
  const hit = (c) => c === '共通' || c === '全般' || (place && c && (c.includes(place) || place.includes(c)));
  return { ...tab, header: tab.header.slice(1), body: tab.body.filter((r) => hit((r[0] || '').trim())).map((r) => r.slice(1)), common: true };
}
function sheetCards(tab) {
  const { header, body } = tab;
  // 1列目が短い印（◎おすすめ・カテゴリ等）なら、2列目を名前にする
  const badgeCol = header.length > 2 && body.every((r) => (r[0] || '').length <= 10) && body.some((r) => r[1]);
  const titleCol = badgeCol ? 1 : 0;
  const find = (re) => header.findIndex((h, k) => k !== titleCol && re.test(h));
  const priceCol = [/2名合計|2人合計|総額/, /合計|価格|料金|運賃|^金額$|^money/i].map(find).find((k) => k >= 0) ?? -1;
  const sumCol = find(/^(内容|特徴|特徴・メモ|メモ|notes?)$/i);
  const todoCol = find(/やること|対策/);
  const impCol = find(/^重要度$/);
  const used = new Set([titleCol, priceCol, sumCol, todoCol, impCol, badgeCol ? 0 : -1]);
  const groupBy = badgeCol && /カテゴリ|分類|category/i.test(header[0]);
  const card = (r) => {
    const imp = impCol >= 0 ? r[impCol] : '';
    const rest = header.map((h, k) => [h, r[k], k]).filter(([h, v, k]) => h && v && v !== '—' && !used.has(k));
    return `<div class="item card cand ${imp ? 'note imp-' + esc(imp) : ''}"><div class="grow">
      <div class="row"><span class="title grow">${esc(r[titleCol] || r.find(Boolean) || '')}</span>${imp === '高' ? pill('重要', 'red') : ''}${badgeCol && r[0] && !groupBy ? pill(esc(r[0]), /◎|おすすめ/.test(r[0]) ? 'green' : '') : ''}</div>
      ${priceCol >= 0 && r[priceCol] && r[priceCol] !== '—' ? `<div class="price">${esc(r[priceCol])}</div>` : ''}
      ${sumCol >= 0 && r[sumCol] && r[sumCol] !== '—' ? `<div class="small clamp">${esc(r[sumCol])}</div>` : ''}
      ${todoCol >= 0 && r[todoCol] && r[todoCol] !== '—' ? `<div class="small todo-line">${ic('check', 14)}<span>${esc(r[todoCol])}</span></div>` : ''}
      ${rest.length ? `<details><summary class="small">詳細</summary><dl>${rest.map(([h, v]) => `<dt>${esc(h)}</dt><dd>${cell(v)}</dd>`).join('')}</dl></details>` : ''}</div></div>`;
  };
  if (!groupBy) return body.map(card).join('');
  const groups = [...new Set(body.map((r) => r[0] || 'その他'))];
  return groups.map((g) => `<h3 class="sub">${esc(g)}</h3>` + body.filter((r) => (r[0] || 'その他') === g).map(card).join('')).join('');
}
function sheetTable(tab) {
  const { header, body } = tab;
  return `<div class="table-wrap"><table class="cmp"><thead><tr>${header.map((h, k) => `<th class="${k === 0 ? 'sticky' : ''}">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${body.map((r) => `<tr>${header.map((h, k) => `<td class="${k === 0 ? 'sticky' : ''}">${cell(r[k] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function renderSheet(t, which) {
  loadSheet(t);
  const names = t.sheet[which];
  const data = Sheet.cached(t.id);
  const useTable = (S.cmpView || (innerWidth >= 700 ? 'table' : 'cards')) === 'table';
  const f = S.filter[S.tab];
  const shown = names.filter((n) => !f || f === 'すべて' || shortTab(n, names) === f);
  const when = data?.fetchedAt ? new Date(data.fetchedAt).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
  const head = `<div class="sheet-src small"><span class="grow">${ic('sheet', 16)} ${esc(data?.title || 'スプレッドシート')}${when ? ` ・ ${when} 時点` : ''}${Sheet.isLoading(t.id) ? ' ・ 更新中…' : ''}</span>
      <button class="mini wide" data-sheet-refresh>更新</button>${data?.url && safeUrl(data.url) ? `<a class="mini wide" href="${esc(data.url)}" target="_blank" rel="noopener">シートで編集</a>` : ''}</div>
    ${S.sheetErr ? `<div class="banner warn">シートを読めませんでした：${esc(S.sheetErr)}${data ? '（前回の内容を表示しています）' : ''}</div>` : ''}`;
  const toggle = `<div class="seg"><button class="${useTable ? '' : 'on'}" data-view="cards">カード</button><button class="${useTable ? 'on' : ''}" data-view="table">表</button></div>`;
  const bar = `<div class="row">${names.length > 1 ? `<div class="grow">${filterBar(names.map((n) => shortTab(n, names)))}</div>` : '<span class="grow"></span>'}${toggle}</div>`;
  let body = '';
  if (!data) body = `<div class="empty">${Sheet.isLoading(t.id) ? 'スプレッドシートを読み込み中…' : '「更新」を押すとスプレッドシートを読み込みます'}</div>`;
  else body = shown.map((n) => {
    const raw = data.tabs?.[n];
    if (!raw) return `<h2>${esc(shortTab(n, names))}</h2><div class="empty">このタブはまだ読み込まれていません。「更新」を押してください</div>`;
    const tab = forTrip(Sheet.parseTab(raw.values), t);
    const link = data.url && safeUrl(data.url) ? `<a class="ext" href="${esc(data.url)}#gid=${esc(raw.gid)}" target="_blank" rel="noopener">${ic('external-link', 14)}</a>` : '';
    return `<h2 class="row">${esc(shortTab(n, names))}&nbsp;${link}</h2>
      ${tab.pre.length ? `<p class="small muted pre">${tab.pre.map(esc).join('\n')}</p>` : ''}
      ${tab.body.length ? (useTable ? sheetTable(tab) : sheetCards(tab)) : tab.common ? `<div class="empty">「${esc(t.sheet?.place || t.destination || '')}」の行はまだありません。シートの1列目にこの旅行先の名前を入れて行を足すと、ここに出ます</div>` : ''}
      ${tab.post.length ? `<div class="card small pre">${tab.post.map(esc).join('\n')}</div>` : ''}`;
  }).join('');
  const kind = which === 'compare' ? 'candidate' : 'note';
  const old = itemsOf(kind).length;
  const foot = `<p class="small muted">内容の追加・修正はスプレッドシートで行います。<button class="link" data-sheet-link>表示するタブを変える</button></p>
    ${old ? `<p class="small muted">アプリに取り込んだ以前の${KINDS[kind].label}データが${old}件残っています。<button class="link" data-purge="${kind}">削除する</button></p>` : ''}`;
  return head + bar + body + foot;
}

function editSheetLink(t) {
  const other = S.trips.find((x) => x.id !== t.id && x.sheet?.url)?.sheet;
  const cfg = t.sheet || (other ? { url: other.url, key: other.key, allTabs: other.allTabs } : {});
  const tabBoxes = (all, which) => all.map((n) => `<label class="check"><input type="checkbox" name="${which}" value="${esc(n)}" ${(cfg[which] || []).includes(n) ? 'checked' : ''}> ${esc(n)}</label>`).join('');
  const inner = `<p class="small muted">スプレッドシートの表を、この旅行の「比較」「メモ」にそのまま表示します。内容はシートが正本で、アプリからは編集しません。</p>
    <label class="field"><span>連携URL（Apps Script のウェブアプリURL）</span><input name="url" type="url" value="${esc(cfg.url)}" placeholder="https://script.google.com/macros/s/…/exec"></label>
    <label class="field"><span>合言葉</span><input name="key" value="${esc(cfg.key)}" autocomplete="off"></label>
    <label class="field"><span>シートでの旅行先名（1列目が「旅行先」の共通タブを、この名前の行で絞り込みます）</span><input name="place" value="${esc(cfg.place || t.destination || '')}" placeholder="例：シンガポール"></label>
    <button type="button" class="btn" id="loadTabs">${ic('sheet', 18)}タブ一覧を読み込む</button>
    <p class="small err" id="tabsErr"></p>
    <div id="tabPick">${cfg.allTabs?.length ? pickHtml(cfg.allTabs) : ''}</div>`;
  function pickHtml(all) {
    return `<h3>「比較」に表示するタブ</h3><div class="checks">${tabBoxes(all, 'compare')}</div>
      <h3>「メモ」に表示するタブ</h3><div class="checks">${tabBoxes(all, 'notes')}</div>`;
  }
  let allTabs = cfg.allTabs || [];
  openSheet('スプレッドシート連携', inner, async (fd, form) => {
    const pick = (w) => [...form.querySelectorAll(`input[name="${w}"]:checked`)].map((i) => i.value);
    const sheet = { url: fd.url.trim(), key: fd.key.trim(), place: fd.place.trim(), compare: pick('compare'), notes: pick('notes'), allTabs };
    await S.store.updateTrip(t.id, { sheet });
    S.sheetErr = '';
    loadSheet({ ...t, sheet }, true);
  }, cfg.url ? async () => { await S.store.updateTrip(t.id, { sheet: null }); } : null, '連携を解除');
  document.getElementById('loadTabs').onclick = async () => {
    const form = document.querySelector('.sheet');
    const url = form.url.value.trim(); const key = form.key.value.trim();
    const err = document.getElementById('tabsErr'); err.textContent = '読み込み中…';
    try {
      if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) throw new Error('script.google.com のURLを入れてください');
      const res = await Sheet.listTabs({ url, key });
      allTabs = res.tabs;
      // まだ何も選んでいなければ、共通タブとこの旅行の名前が付いたタブを先に選んでおく
      if (!(cfg.compare?.length || cfg.notes?.length)) {
        const place = form.place.value.trim();
        const hasCommon = allTabs.some((n) => /^(注意点|航空券比較|ホテル比較)$/.test(n));
        form.querySelectorAll('input[type=checkbox]').forEach((c) => {
          const n = c.value; const isNote = /注意|メモ/.test(n);
          const common = /^(注意点|航空券比較|ホテル比較)$/.test(n);
          const own = place && n.includes(place) && !(hasCommon && /(注意点|航空券比較|ホテル比較)$/.test(n));
          if ((common || own) && (c.name === 'notes') === isNote) c.checked = true;
        });
      }
      err.textContent = `「${res.title}」のタブを${allTabs.length}個読み込みました`;
    } catch (e) { err.textContent = '読み込めませんでした：' + e.message; }
  };
}
