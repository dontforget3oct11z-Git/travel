/**
 * ふたりの旅ノート ⇄ Googleスプレッドシート連携
 *
 * 使い方：スプレッドシートの「拡張機能」→「Apps Script」にこのコードを貼り、
 * KEY を自分だけの合言葉に変えて「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 * （次のユーザーとして実行：自分／アクセスできるユーザー：全員）でデプロイします。
 * 表示された URL と合言葉を、アプリの旅行の設定に入れます。
 * 合言葉を知らない人は何も読めません。
 *
 * 共通タブ（1列目＝旅行先）：「注意点」「航空券比較」「ホテル比較」は、国ごとに行を足していく1つの表です。
 * アプリは旅行先の名前で行を絞り込んで表示します。旅行先が「共通」の行はすべての旅行に出ます。
 * 初回だけ、エディタ上部の関数で setupCommonTabs を選んで「実行」すると、
 * 既存の「シンガポール 〜」タブの内容から共通タブを作ります（元のタブは消しません）。
 */
const KEY = 'ここに合言葉';

function doGet(e) {
  const p = e.parameter || {};
  if (!KEY || KEY === 'ここに合言葉' || p.key !== KEY) return json_({ error: 'forbidden' });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (p.action === 'tabs') {
    return json_({ title: ss.getName(), url: ss.getUrl(), tabs: ss.getSheets().map((s) => s.getName()) });
  }
  const names = String(p.tabs || '').split('\n').filter(String);
  const tabs = {};
  names.forEach((n) => {
    const sh = ss.getSheetByName(n);
    if (!sh) return;
    tabs[n] = { gid: sh.getSheetId(), values: sh.getDataRange().getDisplayValues() };
  });
  return json_({ title: ss.getName(), url: ss.getUrl(), fetchedAt: new Date().toISOString(), tabs: tabs });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- 初回だけ実行：共通タブを作る ----------
const COMMON = {
  '注意点': ['旅行先', 'カテゴリ', '項目', '内容', '金額・罰則（現地通貨＋円目安）', 'やること・対策', 'いつまでに', '重要度', '出典URL', '信頼度'],
  '航空券比較': ['旅行先', '航空会社', '種別', '往路', '復路', '所要時間', '掲載最安運賃（1人・往復）', '荷物・座席込み実質目安（1人・往復）', '2名合計の目安（円）', '2名合計の目安（現地通貨）', '受託手荷物', '座席指定', '注意点', '出典'],
  'ホテル比較': ['旅行先', 'おすすめ', 'ホテル', 'ランク', '1泊目安（2名1室・税込）', '総額目安', '円換算（総額）', '主な目的地へのアクセス', '最寄り駅・観光の便', '特徴・メモ'],
};

function setupCommonTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const place = 'シンガポール';
  const notes = [];
  const read = (name) => { const sh = ss.getSheetByName(name); return sh ? sh.getDataRange().getDisplayValues() : null; };
  const isBlank = (r) => r.every((c) => !String(c).trim());
  // 見出し行（firstCell で始まる行）から、空行までを表として取り出す。前後の文は注意点に回す
  const split = (rows, firstCell, category) => {
    if (!rows) return [];
    const h = rows.findIndex((r) => String(r[0]).trim() === firstCell);
    if (h < 0) return [];
    rows.slice(0, h).filter((r) => !isBlank(r)).forEach((r) => notes.push([place, category, '前提', r.filter(String).join(' '), '', '', '', '中', '', '']));
    let i = h + 1; const body = [];
    for (; i < rows.length && !isBlank(rows[i]); i++) body.push(rows[i]);
    rows.slice(i).filter((r) => !isBlank(r)).forEach((r) => {
      const t = r.filter(String);
      if (t.length === 1 && /^(注意点|出典)$/.test(t[0])) return;
      if (/^\d+$/.test(t[0]) && t.length >= 3) notes.push([place, category, t[1], t.slice(2).join('、'), '', '', '', '中', '', '二次情報']);
      else if (/^https?:/.test(t[0])) notes.push([place, category, '出典', t[0], '', '', '', '低', t[0], '']);
      else notes.push([place, category, t[0].replace(/^・/, '').split(/[。：:]/)[0].slice(0, 30), t.join(' ').replace(/^・/, ''), '', '', '', '中', '', '二次情報']);
    });
    return body;
  };
  const flights = split(read('シンガポール 航空券比較'), '航空会社', '航空券');
  const hotels = split(read('シンガポール ホテル比較'), 'おすすめ', 'ホテル');
  const caution = split(read('シンガポール 注意点'), 'カテゴリ', '注意点');
  const width = (name) => COMMON[name].length - 1;
  const fit = (r, n) => { const a = r.slice(0, n); while (a.length < n) a.push(''); return a; };
  write_(ss, '注意点', [...caution.map((r) => [place, ...fit(r, width('注意点'))]), ...notes]);
  write_(ss, '航空券比較', flights.map((r) => [place, ...fit(r, width('航空券比較'))]));
  write_(ss, 'ホテル比較', hotels.map((r) => [place, ...fit(r, width('ホテル比較'))]));
  SpreadsheetApp.getUi().alert('共通タブ「注意点」「航空券比較」「ホテル比較」を作りました。元の「シンガポール 〜」タブはそのまま残しています。');
}

function write_(ss, name, rows) {
  if (ss.getSheetByName(name)) throw new Error('「' + name + '」タブがすでにあります。名前を変えるか削除してから実行してください');
  const sh = ss.insertSheet(name);
  const header = COMMON[name];
  const all = [header, ...rows.map((r) => r.slice(0, header.length))];
  sh.getRange(1, 1, all.length, header.length).setNumberFormat('@').setValues(all).setWrap(true).setVerticalAlignment('top');
  sh.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#e3f1ed');
  sh.setFrozenRows(1); sh.setFrozenColumns(2);
  sh.setColumnWidths(1, header.length, 180); sh.setColumnWidth(1, 110);
}

// ---------- Googleカレンダー連携（アプリの「旅程」を書き込む） ----------
const CAL_NAME = 'ふたりの旅ノート';

// 初回だけ実行：カレンダーを作り、カレンダーへの書き込みを許可する
function setupCalendar() {
  const cal = getCal_(CAL_NAME);
  SpreadsheetApp.getUi().alert('カレンダー「' + cal.getName() + '」を用意しました。Googleカレンダーの設定から相手と共有できます。');
}

function getCal_(name) {
  return CalendarApp.getCalendarsByName(name)[0] || CalendarApp.createCalendar(name, { color: CalendarApp.Color.TEAL });
}

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: 'bad request' }); }
  if (!KEY || KEY === 'ここに合言葉' || b.key !== KEY) return json_({ error: 'forbidden' });
  const cal = getCal_(b.calendar || CAL_NAME);
  // 変更は「前の予定を消して作り直す」。終日⇄時刻ありの切り替えも同じ扱いにできる
  if (b.id) {
    try { const old = cal.getEventById(b.id); if (old) old.deleteEvent(); } catch (err) { /* すでに消えている */ }
  }
  if (b.action === 'delete') return json_({ ok: true });
  const ev = b.event || {};
  if (!ev.date || !ev.title) return json_({ error: 'date and title are required' });
  const opts = { location: ev.place || '', description: ev.description || '' };
  let created;
  if (ev.time) {
    const tz = ev.tz || Session.getScriptTimeZone();
    const start = Utilities.parseDate(ev.date + ' ' + ev.time, tz, 'yyyy-MM-dd HH:mm');
    let end = ev.endTime ? Utilities.parseDate(ev.date + ' ' + ev.endTime, tz, 'yyyy-MM-dd HH:mm') : new Date(start.getTime() + 60 * 60 * 1000);
    if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // 日をまたぐ予定
    created = cal.createEvent(ev.title, start, end, opts);
  } else {
    created = cal.createAllDayEvent(ev.title, Utilities.parseDate(ev.date, Session.getScriptTimeZone(), 'yyyy-MM-dd'), opts);
  }
  return json_({ id: created.getId() });
}
