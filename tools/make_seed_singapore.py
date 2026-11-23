"""プロジェクトの比較CSV（航空券・ホテル・注意点）からシンガポール旅行の初期データ docs/seed-singapore.js を作る。

使い方: python3 tools/make_seed_singapore.py <flights.csv> <hotel.csv> <notes.csv>
"""
import csv, io, json, re, sys
from pathlib import Path

flights_p, hotel_p, notes_p = map(Path, sys.argv[1:4])
items = []


def read_rows(path, header_startswith):
    text = path.read_text(encoding='utf-8-sig')
    lines = text.splitlines()
    start = next(i for i, l in enumerate(lines) if l.startswith(header_startswith))
    # 表のあとに空行が来たらそこまで
    end = next((i for i in range(start + 1, len(lines)) if not lines[i].strip(' ,')), len(lines))
    rows = list(csv.reader(io.StringIO('\n'.join(lines[start:end]))))
    head, out = rows[0], []
    for r in rows[1:]:
        # 金額の「S$1,154」が引用符なしで2列に割れた行を直す
        while len(r) > len(head):
            j = next(i for i in range(len(r) - 1) if re.search(r'\d$', r[i]) and re.match(r'^\d{3}', r[i + 1]))
            r[j:j + 2] = [r[j] + ',' + r[j + 1]]
        out.append(dict(zip(head, r)))
    return out, lines[end:]


def clean(d, drop):
    return {k: v for k, v in d.items() if k not in drop and v and v.strip() and v.strip() != '—'}


# ---- 航空券 ----
rows, rest = read_rows(flights_p, '航空会社')
for i, r in enumerate(rows):
    items.append({
        'kind': 'candidate', 'group': '航空券', 'title': r['航空会社'], 'status': '候補', 'order': i,
        'price': f"2名 {r['2名合計の目安（S$）']}（{r['2名合計の目安（円）']}）",
        'details': clean(r, {'航空会社', '出典', '2名合計の目安（S$）', '2名合計の目安（円）'}),
        'link': r.get('出典', ''),
    })

for i, l in enumerate(csv.reader(io.StringIO('\n'.join(x for x in rest if re.match(r'^\d+,', x))))):
    items.append({'kind': 'note', 'category': '航空券', 'title': l[1], 'body': '、'.join(x for x in l[2:] if x), 'importance': '中',
                  'source': '二次情報（2026/11時点）', 'link': '', 'order': 200 + i})

# ---- ホテル ----
rows, rest = read_rows(hotel_p, 'おすすめ')
for i, r in enumerate(rows):
    mark = r['おすすめ']
    items.append({
        'kind': 'candidate', 'group': 'ホテル', 'title': r['ホテル'], 'order': i,
        'status': '◎おすすめ' if '◎' in mark else '候補',
        'price': f"4泊 {r['4泊総額目安']}（{r['円換算（4泊）']}）",
        'details': clean(r, {'ホテル', 'おすすめ', '4泊総額目安', '円換算（4泊）'}) | ({'区分': mark} if mark and '◎' not in mark else {}),
        'link': '',
    })
hotel_notes = [l.lstrip('・').strip() for l in rest if l.startswith('・')]
for i, n in enumerate(hotel_notes):
    title = re.split(r'[。：:]', n)[0][:30]
    items.append({'kind': 'note', 'category': 'ホテル', 'title': title, 'body': n, 'importance': '中', 'source': '二次情報（OTA・2026/11時点）', 'link': '', 'order': 100 + i})

# ---- D23 Asia チケット（2026/11 調査時点） ----
d23 = [
    ('コンベンション 1日券', 'S$69/人・日', {'内容': 'コンベンション会場のみ', '2日（6/25・6/27）×2人': 'S$276'}),
    ('コンベンション＋プレミアステージ Cat4', 'S$129/人・日', {'内容': '夜のショー（6/25 Studio Showcase・6/27 Disney Hits LIVE!）込み', '2日×2人': 'S$516'}),
    ('コンベンション＋プレミアステージ Cat3', 'S$169/人・日', {'2日×2人': 'S$676'}),
    ('コンベンション＋プレミアステージ Cat2', 'S$209/人・日', {'2日×2人': 'S$836'}),
    ('コンベンション＋プレミアステージ Cat1', 'S$249/人・日', {'2日×2人': 'S$996'}),
    ('プラチナ 3日券', 'S$989/人', {'内容': '3日間', '2人': 'S$1,978'}),
]
for i, (t, p, det) in enumerate(d23):
    det = det | {'購入': 'Klookのみ・手数料10%（上限S$30）', '会場': 'マリーナ・ベイ・サンズ'}
    items.append({'kind': 'candidate', 'group': 'チケット', 'title': t, 'status': '候補', 'price': p, 'details': det, 'link': '', 'order': i})

# ---- 注意点 → メモ、期限のあるものは やること にも ----
rows, _ = read_rows(notes_p, 'カテゴリ')
due_map = {'出発前': '2027-06-23', '出発1週間前': '2027-06-17', '帰国時': '2027-06-28', '6/21〜6/24': '2027-06-21', '2027年4月頃まで': '2027-04-30'}
cat_map = {'入国': '手続き', '持ち込み・規則': '持ち物', '気候・持ち物': '持ち物', '交通': '準備', '通信': '準備', 'お金': '準備', 'マナー・罰金': '現地'}
for i, r in enumerate(rows):
    body = r['内容']
    if r['金額・罰則（S$＋円目安 1S$≈123円）'] not in ('', '—'):
        body += f"\n金額：{r['金額・罰則（S$＋円目安 1S$≈123円）']}"
    if r['やること・対策'] not in ('', '—'):
        body += f"\n対策：{r['やること・対策']}"
    link = r['出典URL'] if r['出典URL'].startswith('http') else ''
    items.append({'kind': 'note', 'category': r['カテゴリ'], 'title': r['項目'], 'body': body, 'importance': r['重要度'] or '中',
                  'source': r['信頼度'], 'link': link, 'order': i})
    due = due_map.get(r['いつまでに'])
    if due and r['重要度'] in ('高', '中') and r['やること・対策'] not in ('', '—'):
        items.append({'kind': 'todo', 'title': f"{r['項目']}：{r['やること・対策']}", 'due': due, 'who': '2人',
                      'category': cat_map.get(r['カテゴリ'], 'その他'), 'memo': r['内容'], 'link': link, 'done': False})

# ---- 予約関係のやること ----
for t, due, cat, memo in [
    ('D23 Asia チケットを買う（6/25・6/27）', '2026-11-26', '予約', 'Klookで購入。一般発売 11/26 10:00 SGT（日本時間11:00）'),
    ('航空券を予約する', '2026-12-07', '予約', 'SQ Wanderlustセール：一般 11/27 10:00〜12/7（日本時間）。比較タブ参照'),
    ('ホテルを予約する（無料キャンセル可プラン）', '2026-12-31', '予約', 'おすすめ：MBS 1泊（6/27）＋パンパシフィック 3泊。比較タブ参照'),
    ('6/26 の観光プランを決める', '2027-05-31', '準備', 'セントーサ／ナイトサファリなど'),
]:
    items.append({'kind': 'todo', 'title': t, 'due': due, 'who': '2人', 'category': cat, 'memo': memo, 'link': '', 'done': False})

# ---- 旅程（骨組み） ----
plans = [
    ('2027-06-24', '', '東京（羽田／成田）→ シンガポール', 'チャンギ空港', '便は未定（比較タブ参照）'),
    ('2027-06-24', '', 'ホテルにチェックイン', '', 'チェックインは15時前後が一般的'),
    ('2027-06-25', '', 'D23 Asia 1日目（コンベンション）', 'マリーナ・ベイ・サンズ', ''),
    ('2027-06-25', '', '夜：プレミアステージ「Studio Showcase」（新作発表）', 'マリーナ・ベイ・サンズ', '終了が遅ければ Grab・タクシーで帰る'),
    ('2027-06-26', '', '観光日', '', '候補：セントーサ（HarbourFront駅／タクシー約15分）、ナイトサファリ（タクシー約30分・Klookのシャトル付きチケット）'),
    ('2027-06-27', '', 'D23 Asia 2日目（コンベンション）', 'マリーナ・ベイ・サンズ', ''),
    ('2027-06-27', '', '夜：プレミアステージ「Disney Hits LIVE!」（コンサート）', 'マリーナ・ベイ・サンズ', 'この夜MBS泊なら徒歩で部屋へ'),
    ('2027-06-28', '', 'チェックアウト → 帰国', 'チャンギ空港', 'GST還付（eTRS）は空港で。便は未定'),
]
for d, tm, t, place, memo in plans:
    items.append({'kind': 'plan', 'date': d, 'time': tm, 'title': t, 'place': place, 'memo': memo, 'link': ''})

trip = {
    'name': 'シンガポール（D23 Asia）', 'emoji': '🇸🇬', 'destination': 'シンガポール', 'seed': 'sg-2027',
    'startDate': '2027-06-24', 'endDate': '2027-06-28', 'currency': 'SGD', 'rate': 123, 'budget': '',
    'people': ['夫', '妻'],
    'memo': 'D23 Asia（2027/6/25〜27・マリーナ・ベイ・サンズ）。6/25 新作発表と 6/27 コンサートに参加。\n円換算は 1S$≈123円（2026/11時点の目安）。料金は2026/11時点の目安で、実際の6月料金は要確認。',
}
out = Path(__file__).resolve().parent.parent / 'docs' / 'seed-singapore.js'
out.write_text('// tools/make_seed_singapore.py で生成（2026/11時点の調査データ）\nexport const singaporeSeed = '
               + json.dumps({'trip': trip, 'items': items}, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')
print(out, len(items), 'items')
