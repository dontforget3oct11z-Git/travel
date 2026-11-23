// tools/make_seed_singapore.py で生成（2026/11時点の調査データ）
export const singaporeSeed = {
 "trip": {
  "name": "シンガポール（D23 Asia）",
  "emoji": "🇸🇬",
  "destination": "シンガポール",
  "seed": "sg-2027",
  "startDate": "2027-06-24",
  "endDate": "2027-06-28",
  "currency": "SGD",
  "rate": 123,
  "budget": "",
  "people": [
   "夫",
   "妻"
  ],
  "memo": "D23 Asia（2027/6/25〜27・マリーナ・ベイ・サンズ）。6/25 新作発表と 6/27 コンサートに参加。\n円換算は 1S$≈123円（2026/11時点の目安）。料金は2026/11時点の目安で、実際の6月料金は要確認。"
 },
 "items": [
  {
   "kind": "candidate",
   "group": "航空券",
   "title": "シンガポール航空（SQ）",
   "status": "候補",
   "order": 0,
   "price": "2名 S$1,545〜2,115（¥190,000〜260,000）",
   "details": {
    "種別": "フルサービス",
    "往路 6/24（東京→SIN）": "成田10:00 SQ637→16:30／成田18:30 SQ11→翌01:00",
    "復路（SIN→東京）": "6/28 SIN 08:05 SQ632→羽田15:35／09:20 SQ12→成田17:05",
    "所要時間": "約6.5〜7.5時間",
    "掲載最安運賃（1人・往復）": "¥90,350〜（セール・非会員）／¥87,650〜（KrisFlyer会員）",
    "荷物・座席込み実質目安（1人・往復）": "¥95,000〜130,000",
    "受託手荷物": "Economy Liteは25kgの見込み（要確認）",
    "座席指定": "Liteは有料",
    "注意点": "セール販売：KrisFlyer会員 11/24 10:00〜、一般 11/27 10:00〜12/7（日本時間）。往復のみ・席数限定。6/21〜9/30は別料金帯で最安より高い可能性"
   },
   "link": "https://www.singaporeair.com/en_UK/jp/plan-travel/local-promotions/sq-wanderlust"
  },
  {
   "kind": "candidate",
   "group": "航空券",
   "title": "JAL",
   "status": "候補",
   "order": 1,
   "price": "2名 S$2,275〜2,765（¥280,000〜340,000）",
   "details": {
    "種別": "フルサービス",
    "往路 6/24（東京→SIN）": "成田18:10 JL711→翌00:50（羽田便の時刻は要確認）",
    "復路（SIN→東京）": "6/28 SIN 08:15 JL712→成田16:00／22:45 JL36→6/29羽田06:20",
    "所要時間": "約6.5〜7.5時間",
    "掲載最安運賃（1人・往復）": "¥134,370〜158,640（2026/11〜2027/4の月別最安）",
    "荷物・座席込み実質目安（1人・往復）": "¥140,000〜170,000",
    "受託手荷物": "23kg×2個込み",
    "座席指定": "無料（一部有料席あり）",
    "注意点": "往路が深夜着になる便が多い。6月の運賃は未掲載のため推測"
   },
   "link": "https://www.jal.co.jp/jp/ja/inter/route/haneda/singapore/index.html"
  },
  {
   "kind": "candidate",
   "group": "航空券",
   "title": "ANA",
   "status": "候補",
   "order": 2,
   "price": "2名 S$2,275〜2,765（¥280,000〜340,000）",
   "details": {
    "種別": "フルサービス",
    "往路 6/24（東京→SIN）": "成田17:00 NH803→23:40／成田11:10 NH6253（SQ運航）→17:20",
    "復路（SIN→東京）": "6/28 SIN 06:15 NH802→成田14:30／11:05 NH842→羽田19:15",
    "所要時間": "約6.5〜7.5時間",
    "掲載最安運賃（1人・往復）": "S$1,154〜（シンガポール発の参考値・約¥142,000）",
    "荷物・座席込み実質目安（1人・往復）": "¥140,000〜170,000",
    "受託手荷物": "23kg×2個込み",
    "座席指定": "無料（一部有料席あり）",
    "注意点": "日本発の価格は未確認のため推測。SQとのコードシェア便が多い"
   },
   "link": "https://www.ana.co.jp/plan-book/ja-sg/flights-from-singapore-to-tokyo"
  },
  {
   "kind": "candidate",
   "group": "航空券",
   "title": "ZIPAIR",
   "status": "候補",
   "order": 3,
   "price": "2名 S$975〜1,465（¥120,000〜180,000）",
   "details": {
    "種別": "LCC",
    "往路 6/24（東京→SIN）": "成田16:40 ZG53→23:10",
    "復路（SIN→東京）": "6/28深夜 SIN 00:40 ZG54→6/29成田08:30（6/27深夜発なら6/28朝着）",
    "所要時間": "約7〜7.5時間",
    "掲載最安運賃（1人・往復）": "片道¥15,680〜（Standard・税別）",
    "荷物・座席込み実質目安（1人・往復）": "¥60,000〜90,000（推測）",
    "受託手荷物": "有料（7kg機内持込のみ込み）",
    "座席指定": "有料",
    "注意点": "2027年夏ダイヤ未発表（2026年は7/20〜9/19運休、6月は運航）。Wi-Fi無料。帰国は6/29朝になる"
   },
   "link": "https://www.aviationwire.jp/archives/344898"
  },
  {
   "kind": "candidate",
   "group": "航空券",
   "title": "スクート（Scoot）",
   "status": "候補",
   "order": 4,
   "price": "2名 S$1,140〜1,625（¥140,000〜200,000）",
   "details": {
    "種別": "LCC",
    "往路 6/24（東京→SIN）": "成田08:50 TR→15:30／羽田02:15 TR883→08:30（6/23深夜発）",
    "復路（SIN→東京）": "6/28 SIN 17:35 TR882→6/29羽田01:00／23:30 TR→6/29成田07:10",
    "所要時間": "約6.5〜7.5時間",
    "掲載最安運賃（1人・往復）": "¥56,602〜（羽田発・12月の参考値・荷物なし）",
    "荷物・座席込み実質目安（1人・往復）": "¥70,000〜100,000（推測・バリュー運賃）",
    "受託手荷物": "バリュー運賃以上で20kg込み",
    "座席指定": "バリュー運賃以上で込み",
    "注意点": "一部便は台北経由のため予約時に直行便か確認。食事は有料"
   },
   "link": "https://skyticket.jp/international-flights/scoot_international/"
  },
  {
   "kind": "note",
   "category": "航空券",
   "title": "日程",
   "body": "6/24中にシンガポール着、6/27夜のコンサート後に帰る前提。6/28昼の便だと28日は移動だけになり、6/28深夜発（6/29朝着）なら28日も観光できる",
   "importance": "中",
   "source": "二次情報（2026/11時点）",
   "link": "",
   "order": 200
  },
  {
   "kind": "note",
   "category": "航空券",
   "title": "価格",
   "body": "金額は2026/11時点の掲載最安値。6月下旬は需要が高く上振れの可能性あり。S$換算は1S$≒123円",
   "importance": "中",
   "source": "二次情報（2026/11時点）",
   "link": "",
   "order": 201
  },
  {
   "kind": "note",
   "category": "航空券",
   "title": "SQセール",
   "body": "KrisFlyer会員は11/24 10:00から先行販売（無料登録で会員価格も適用）。旅行期間6/21〜9/30が対象に含まれる",
   "importance": "中",
   "source": "二次情報（2026/11時点）",
   "link": "",
   "order": 202
  },
  {
   "kind": "note",
   "category": "航空券",
   "title": "ZIPAIR",
   "body": "2027年夏ダイヤが出たら6/24・6/28の運航を確認する",
   "importance": "中",
   "source": "二次情報（2026/11時点）",
   "link": "",
   "order": 203
  },
  {
   "kind": "note",
   "category": "航空券",
   "title": "LCC",
   "body": "荷物・座席・税金を足すとフルサービスとの差が縮む。SQセールなら差は1人あたり数万円程度",
   "importance": "中",
   "source": "二次情報（2026/11時点）",
   "link": "",
   "order": 204
  },
  {
   "kind": "note",
   "category": "航空券",
   "title": "時刻",
   "body": "時刻は2026年11月時点のもの。2027年夏ダイヤで変わる可能性あり",
   "importance": "中",
   "source": "二次情報（2026/11時点）",
   "link": "",
   "order": 205
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "【組み合わせ案】MBS 1泊（6/27）＋パンパシフィック 3泊",
   "order": 0,
   "status": "◎おすすめ",
   "price": "4泊 S$2,350〜3,050（約29〜38万円）",
   "details": {
    "ランク": "5★＋5★",
    "会場MBSへのアクセス": "6/27コンサート後は徒歩で部屋へ。他の日はパンパシから徒歩15分",
    "最寄りMRT・観光の便": "両ホテルとも下記参照",
    "特徴・メモ": "MBSのインフィニティプール（宿泊者限定）を体験しつつ総額を半分近くに。コンサート夜→翌日帰国の流れが楽。途中で1回ホテル移動あり"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "マリーナ・ベイ・サンズ（MBS）",
   "order": 1,
   "status": "候補",
   "price": "4泊 S$4,400〜5,600（約54〜69万円）",
   "details": {
    "ランク": "5★",
    "1泊目安（2名1室・税込）": "S$1,100〜1,400",
    "会場MBSへのアクセス": "会場直結（0分）",
    "最寄りMRT・観光の便": "Bayfront駅直結（DT線・CE線）",
    "特徴・メモ": "インフィニティプール・展望デッキが宿泊者特典。D23期間は高騰・満室リスク大。金土は平日より約4割高",
    "区分": "○"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "パンパシフィック・シンガポール",
   "order": 2,
   "status": "◎おすすめ",
   "price": "4泊 S$1,700〜2,200（約21〜27万円）",
   "details": {
    "ランク": "5★",
    "1泊目安（2名1室・税込）": "S$420〜550",
    "会場MBSへのアクセス": "徒歩約15分（ヘリックス橋経由）／タクシー5分",
    "最寄りMRT・観光の便": "Promenade駅・Esplanade駅 徒歩5分、マリーナスクエア直結",
    "特徴・メモ": "改装済みでモダン。ベイビュー客室あり。コスパと立地のバランス最良"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "パークロイヤル・コレクション・マリーナベイ",
   "order": 3,
   "status": "候補",
   "price": "4泊 S$1,850〜2,300（約23〜28万円）",
   "details": {
    "ランク": "5★",
    "1泊目安（2名1室・税込）": "S$460〜580",
    "会場MBSへのアクセス": "徒歩約15分／Promenade→Bayfront 1駅",
    "最寄りMRT・観光の便": "Promenade駅 徒歩3分",
    "特徴・メモ": "緑に囲まれたガーデンホテル。写真映え。パンパシの隣",
    "区分": "○"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "スイスホテル・ザ・スタンフォード",
   "order": 4,
   "status": "候補",
   "price": "4泊 S$1,800〜2,200（約22〜27万円）",
   "details": {
    "ランク": "4〜5★",
    "1泊目安（2名1室・税込）": "S$450〜550",
    "会場MBSへのアクセス": "徒歩約20分／タクシー5〜10分",
    "最寄りMRT・観光の便": "City Hall駅直結（東西線・南北線で空港・オーチャード・セントーサ方面に便利）",
    "特徴・メモ": "高層階からの眺望。観光の拠点として最も移動しやすい",
    "区分": "○"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "フラトン・ホテル",
   "order": 5,
   "status": "候補",
   "price": "4泊 S$1,900〜2,300（約23〜28万円）",
   "details": {
    "ランク": "5★",
    "1泊目安（2名1室・税込）": "S$470〜570",
    "会場MBSへのアクセス": "湾沿いを徒歩15〜20分",
    "最寄りMRT・観光の便": "Raffles Place駅 徒歩5分、マーライオン至近",
    "特徴・メモ": "歴史的建造物ホテル。湾沿いの夜景散歩が楽しい",
    "区分": "○"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "カールトン・ホテル",
   "order": 6,
   "status": "候補",
   "price": "4泊 S$1,200〜1,800（約15〜22万円）",
   "details": {
    "ランク": "4★",
    "1泊目安（2名1室・税込）": "S$300〜450",
    "会場MBSへのアクセス": "タクシー約10分",
    "最寄りMRT・観光の便": "City Hall駅・Bras Basah駅 徒歩3〜5分",
    "特徴・メモ": "中心部で手頃な4つ星。ラッフルズホテル近く",
    "区分": "△節約"
   },
   "link": ""
  },
  {
   "kind": "candidate",
   "group": "ホテル",
   "title": "Vホテル・ベンクーレン／ホテル・ボス等",
   "order": 7,
   "status": "候補",
   "price": "4泊 S$650〜900（約8〜11万円）",
   "details": {
    "ランク": "3★",
    "1泊目安（2名1室・税込）": "S$160〜220",
    "会場MBSへのアクセス": "Bencoolen駅からDT線でBayfrontまで約10分",
    "最寄りMRT・観光の便": "Bencoolen駅・Bugis駅周辺",
    "特徴・メモ": "部屋は狭め。寝るだけと割り切るなら最安",
    "区分": "△節約"
   },
   "link": ""
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "6/24〜28は木〜月で金・土泊を含むため平日より高め",
   "body": "6/24〜28は木〜月で金・土泊を含むため平日より高め。さらに6月下旬は現地の学校休暇＋D23 Asia開催で、MBSと周辺は早めに埋まる見込み",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 100
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "予約は「無料キャンセル可」プランで早めに押さえ、直前に料金を",
   "body": "予約は「無料キャンセル可」プランで早めに押さえ、直前に料金を見直すのがおすすめ",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 101
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "シンガポールのホテル料金は「++」表記（サービス料10%＋G",
   "body": "シンガポールのホテル料金は「++」表記（サービス料10%＋GST9%）が多い。予約サイトで税込総額かどうか必ず確認",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 102
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "MBSのインフィニティプール（57階）は宿泊者のみ利用可",
   "body": "MBSのインフィニティプール（57階）は宿泊者のみ利用可。組み合わせ案ならコンサート当日（6/27）泊で体験できる",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 103
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "チェックインは15時前後、チェックアウトは11〜12時が一般",
   "body": "チェックインは15時前後、チェックアウトは11〜12時が一般的。6/28の帰国便が夜なら荷物預け・レイトチェックアウトを確認",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 104
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "6/26の観光",
   "body": "6/26の観光：セントーサへはHarbourFront駅（City Hallから乗換1回）またはタクシー約15分。ナイトサファリは中心部からタクシー約30分、またはKlookのシャトル付きチケットが便利",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 105
  },
  {
   "kind": "note",
   "category": "ホテル",
   "title": "予約先の比較",
   "body": "予約先の比較：Klook・楽天トラベル（楽天ポイント）・公式サイトで同日料金を見比べる。D23ゴールド会員向けのホテル特典が出ないかも要チェック",
   "importance": "中",
   "source": "二次情報（OTA・2026/11時点）",
   "link": "",
   "order": 106
  },
  {
   "kind": "candidate",
   "group": "チケット",
   "title": "コンベンション 1日券",
   "status": "候補",
   "price": "S$69/人・日",
   "details": {
    "内容": "コンベンション会場のみ",
    "2日（6/25・6/27）×2人": "S$276",
    "購入": "Klookのみ・手数料10%（上限S$30）",
    "会場": "マリーナ・ベイ・サンズ"
   },
   "link": "",
   "order": 0
  },
  {
   "kind": "candidate",
   "group": "チケット",
   "title": "コンベンション＋プレミアステージ Cat4",
   "status": "候補",
   "price": "S$129/人・日",
   "details": {
    "内容": "夜のショー（6/25 Studio Showcase・6/27 Disney Hits LIVE!）込み",
    "2日×2人": "S$516",
    "購入": "Klookのみ・手数料10%（上限S$30）",
    "会場": "マリーナ・ベイ・サンズ"
   },
   "link": "",
   "order": 1
  },
  {
   "kind": "candidate",
   "group": "チケット",
   "title": "コンベンション＋プレミアステージ Cat3",
   "status": "候補",
   "price": "S$169/人・日",
   "details": {
    "2日×2人": "S$676",
    "購入": "Klookのみ・手数料10%（上限S$30）",
    "会場": "マリーナ・ベイ・サンズ"
   },
   "link": "",
   "order": 2
  },
  {
   "kind": "candidate",
   "group": "チケット",
   "title": "コンベンション＋プレミアステージ Cat2",
   "status": "候補",
   "price": "S$209/人・日",
   "details": {
    "2日×2人": "S$836",
    "購入": "Klookのみ・手数料10%（上限S$30）",
    "会場": "マリーナ・ベイ・サンズ"
   },
   "link": "",
   "order": 3
  },
  {
   "kind": "candidate",
   "group": "チケット",
   "title": "コンベンション＋プレミアステージ Cat1",
   "status": "候補",
   "price": "S$249/人・日",
   "details": {
    "2日×2人": "S$996",
    "購入": "Klookのみ・手数料10%（上限S$30）",
    "会場": "マリーナ・ベイ・サンズ"
   },
   "link": "",
   "order": 4
  },
  {
   "kind": "candidate",
   "group": "チケット",
   "title": "プラチナ 3日券",
   "status": "候補",
   "price": "S$989/人",
   "details": {
    "内容": "3日間",
    "2人": "S$1,978",
    "購入": "Klookのみ・手数料10%（上限S$30）",
    "会場": "マリーナ・ベイ・サンズ"
   },
   "link": "",
   "order": 5
  },
  {
   "kind": "note",
   "category": "入国",
   "title": "SG Arrival Card",
   "body": "入国前3日以内（到着日含む）にICA公式サイトかMyICAアプリで無料提出。有料の代行・偽サイトに注意\n金額：無料\n対策：2人分それぞれ公式サイトから提出",
   "importance": "高",
   "source": "公式",
   "link": "https://www.ica.gov.sg/enter-depart/entry_requirements/sg-arrival-card",
   "order": 0
  },
  {
   "kind": "todo",
   "title": "SG Arrival Card：2人分それぞれ公式サイトから提出",
   "due": "2027-06-21",
   "who": "2人",
   "category": "手続き",
   "memo": "入国前3日以内（到着日含む）にICA公式サイトかMyICAアプリで無料提出。有料の代行・偽サイトに注意",
   "link": "https://www.ica.gov.sg/enter-depart/entry_requirements/sg-arrival-card",
   "done": false
  },
  {
   "kind": "note",
   "category": "入国",
   "title": "ビザ",
   "body": "日本国籍は観光の短期滞在ならビザ不要（最大30日が目安）\n対策：不要。往復航空券を用意",
   "importance": "低",
   "source": "公式",
   "link": "https://www.ica.gov.sg/public-education/visiting-singapore",
   "order": 1
  },
  {
   "kind": "note",
   "category": "入国",
   "title": "パスポート残存期間",
   "body": "入国時に6か月以上の残存期間が必要とされる\n対策：2人のパスポート期限を確認。足りなければ更新",
   "importance": "高",
   "source": "公式",
   "link": "https://www.ica.gov.sg/public-education/visiting-singapore",
   "order": 2
  },
  {
   "kind": "todo",
   "title": "パスポート残存期間：2人のパスポート期限を確認。足りなければ更新",
   "due": "2027-04-30",
   "who": "2人",
   "category": "手続き",
   "memo": "入国時に6か月以上の残存期間が必要とされる",
   "link": "https://www.ica.gov.sg/public-education/visiting-singapore",
   "done": false
  },
  {
   "kind": "note",
   "category": "持ち込み・規則",
   "title": "電子タバコ（ベイプ）",
   "body": "所持・使用とも違法。2025/9/1から罰則強化。外国人は国外退去・入国禁止の可能性。エトミデート入りは薬物扱いで厳罰\n金額：初回でS$700（約8.6万円）程度の罰金など（金額は要確認）\n対策：一切持ち込まない（乗り継ぎ含む）",
   "importance": "高",
   "source": "公式",
   "link": "https://www.gov.sg/stopvaping-penalties/",
   "order": 3
  },
  {
   "kind": "todo",
   "title": "電子タバコ（ベイプ）：一切持ち込まない（乗り継ぎ含む）",
   "due": "2027-06-23",
   "who": "2人",
   "category": "持ち物",
   "memo": "所持・使用とも違法。2025/9/1から罰則強化。外国人は国外退去・入国禁止の可能性。エトミデート入りは薬物扱いで厳罰",
   "link": "https://www.gov.sg/stopvaping-penalties/",
   "done": false
  },
  {
   "kind": "note",
   "category": "持ち込み・規則",
   "title": "チューインガム",
   "body": "ガムの持ち込みは禁止\n対策：カバンに入れっぱなしにしない",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 4
  },
  {
   "kind": "todo",
   "title": "チューインガム：カバンに入れっぱなしにしない",
   "due": "2027-06-23",
   "who": "2人",
   "category": "持ち物",
   "memo": "ガムの持ち込みは禁止",
   "link": "",
   "done": false
  },
  {
   "kind": "note",
   "category": "持ち込み・規則",
   "title": "紙巻きタバコ",
   "body": "免税枠なし。1本から申告・課税が必要\n金額：申告漏れは罰金\n対策：吸わないなら持ち込まない",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 5
  },
  {
   "kind": "note",
   "category": "持ち込み・規則",
   "title": "医薬品",
   "body": "一部の日本の市販薬（コデイン等を含むものなど）は許可が必要な場合あり\n対策：常備薬は個人使用量を元の箱のまま。不安な薬はHSAで確認",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 6
  },
  {
   "kind": "todo",
   "title": "医薬品：常備薬は個人使用量を元の箱のまま。不安な薬はHSAで確認",
   "due": "2027-06-23",
   "who": "2人",
   "category": "持ち物",
   "memo": "一部の日本の市販薬（コデイン等を含むものなど）は許可が必要な場合あり",
   "link": "",
   "done": false
  },
  {
   "kind": "note",
   "category": "マナー・罰金",
   "title": "MRT・バス車内の飲食",
   "body": "飲食禁止。ドリアンの持ち込みも禁止\n金額：最大S$500（約6.2万円）\n対策：水も車内では飲まない",
   "importance": "高",
   "source": "二次情報",
   "link": "https://thesmartlocal.com/read/singapore-mrt-rules/amp/",
   "order": 7
  },
  {
   "kind": "note",
   "category": "マナー・罰金",
   "title": "喫煙・ポイ捨て・信号無視",
   "body": "喫煙は指定場所のみ。ポイ捨てや信号無視にも罰金\n金額：罰金あり（金額は要確認）\n対策：ゴミは持ち帰り、横断歩道を使う",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 8
  },
  {
   "kind": "note",
   "category": "お金",
   "title": "飲食店の「++」",
   "body": "表示価格に＋サービス料10%＋GST 9%。チップは基本不要\n金額：表示価格の約1.2倍\n対策：予算は表示価格×1.2で見積もる",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 9
  },
  {
   "kind": "note",
   "category": "お金",
   "title": "クレジットカード手数料",
   "body": "楽天Visaの海外利用は事務手数料がかかる（約2%前後）\n金額：利用額の約2%\n対策：レートは楽天カード公式で確認",
   "importance": "低",
   "source": "推測（要確認）",
   "link": "",
   "order": 10
  },
  {
   "kind": "note",
   "category": "お金",
   "title": "GST還付（eTRS）",
   "body": "参加店舗で一定額以上（S$100程度）購入すると、チャンギ空港で9% GSTの還付を受けられる\n金額：購入額の最大約9%\n対策：大きな買い物はパスポート持参、空港で手続き",
   "importance": "低",
   "source": "推測（要確認）",
   "link": "",
   "order": 11
  },
  {
   "kind": "note",
   "category": "交通",
   "title": "MRT・バスの支払い",
   "body": "Visa・Mastercardのタッチ決済でそのまま乗車できる（SimplyGo）\n金額：海外カードは手数料がかかる場合あり（要確認）\n対策：楽天Visaのタッチ決済が有効か確認。2人で別々のカードを使う",
   "importance": "高",
   "source": "公式",
   "link": "https://sg.review.visa.com/about-visa/newsroom/press-releases/visa-contactless-payments-now-live-for-singapore-transit.html",
   "order": 12
  },
  {
   "kind": "todo",
   "title": "MRT・バスの支払い：楽天Visaのタッチ決済が有効か確認。2人で別々のカードを使う",
   "due": "2027-06-23",
   "who": "2人",
   "category": "準備",
   "memo": "Visa・Mastercardのタッチ決済でそのまま乗車できる（SimplyGo）",
   "link": "https://sg.review.visa.com/about-visa/newsroom/press-releases/visa-contactless-payments-now-live-for-singapore-transit.html",
   "done": false
  },
  {
   "kind": "note",
   "category": "交通",
   "title": "終電とイベント帰り",
   "body": "MRTの終電は深夜0時前後。6/25・6/27夜のイベント終了が遅いと乗れない可能性\n対策：Grab・タクシーでの帰り方を決めておく。ホテルはMBS近くが楽",
   "importance": "高",
   "source": "公式",
   "link": "https://www.lta.gov.sg/content/ltagov/en/getting_around/public_transport/plan_your_journey.html",
   "order": 13
  },
  {
   "kind": "note",
   "category": "交通",
   "title": "Grabアプリ",
   "body": "配車アプリ。シンガポールで定番\n対策：出発前にインストールしてカード登録",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 14
  },
  {
   "kind": "todo",
   "title": "Grabアプリ：出発前にインストールしてカード登録",
   "due": "2027-06-23",
   "who": "2人",
   "category": "準備",
   "memo": "配車アプリ。シンガポールで定番",
   "link": "",
   "done": false
  },
  {
   "kind": "note",
   "category": "気候・持ち物",
   "title": "6月下旬の天気",
   "body": "25〜32℃前後で蒸し暑く、突然のスコールあり。屋内は冷房が強い\n対策：薄手の羽織り物と折りたたみ傘",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 15
  },
  {
   "kind": "note",
   "category": "気候・持ち物",
   "title": "ヘイズ（煙害）",
   "body": "6〜9月頃に近隣国の森林火災による煙害が出る年がある\n対策：直前にNEAのヘイズ予報を確認。マスクがあると安心",
   "importance": "低",
   "source": "推測（要確認）",
   "link": "",
   "order": 16
  },
  {
   "kind": "note",
   "category": "気候・持ち物",
   "title": "電源プラグ",
   "body": "BF（Gタイプ）・230V\n対策：変換プラグを持参（スマホ充電器は通常そのまま使える）",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 17
  },
  {
   "kind": "todo",
   "title": "電源プラグ：変換プラグを持参（スマホ充電器は通常そのまま使える）",
   "due": "2027-06-23",
   "who": "2人",
   "category": "持ち物",
   "memo": "BF（Gタイプ）・230V",
   "link": "",
   "done": false
  },
  {
   "kind": "note",
   "category": "気候・持ち物",
   "title": "水道水・時差",
   "body": "水道水は飲める。時差は日本−1時間",
   "importance": "低",
   "source": "推測（要確認）",
   "link": "",
   "order": 18
  },
  {
   "kind": "note",
   "category": "通信",
   "title": "スマホ通信",
   "body": "eSIM・ローミング・Wi-Fiルーターのいずれか\n対策：eSIM対応機種なら出発前に購入・設定",
   "importance": "中",
   "source": "推測（要確認）",
   "link": "",
   "order": 19
  },
  {
   "kind": "todo",
   "title": "スマホ通信：eSIM対応機種なら出発前に購入・設定",
   "due": "2027-06-23",
   "who": "2人",
   "category": "準備",
   "memo": "eSIM・ローミング・Wi-Fiルーターのいずれか",
   "link": "",
   "done": false
  },
  {
   "kind": "todo",
   "title": "D23 Asia チケットを買う（6/25・6/27）",
   "due": "2026-11-26",
   "who": "2人",
   "category": "予約",
   "memo": "Klookで購入。一般発売 11/26 10:00 SGT（日本時間11:00）",
   "link": "",
   "done": false
  },
  {
   "kind": "todo",
   "title": "航空券を予約する",
   "due": "2026-12-07",
   "who": "2人",
   "category": "予約",
   "memo": "SQ Wanderlustセール：一般 11/27 10:00〜12/7（日本時間）。比較タブ参照",
   "link": "",
   "done": false
  },
  {
   "kind": "todo",
   "title": "ホテルを予約する（無料キャンセル可プラン）",
   "due": "2026-12-31",
   "who": "2人",
   "category": "予約",
   "memo": "おすすめ：MBS 1泊（6/27）＋パンパシフィック 3泊。比較タブ参照",
   "link": "",
   "done": false
  },
  {
   "kind": "todo",
   "title": "6/26 の観光プランを決める",
   "due": "2027-05-31",
   "who": "2人",
   "category": "準備",
   "memo": "セントーサ／ナイトサファリなど",
   "link": "",
   "done": false
  },
  {
   "kind": "plan",
   "date": "2027-06-24",
   "time": "",
   "title": "東京（羽田／成田）→ シンガポール",
   "place": "チャンギ空港",
   "memo": "便は未定（比較タブ参照）",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-24",
   "time": "",
   "title": "ホテルにチェックイン",
   "place": "",
   "memo": "チェックインは15時前後が一般的",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-25",
   "time": "",
   "title": "D23 Asia 1日目（コンベンション）",
   "place": "マリーナ・ベイ・サンズ",
   "memo": "",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-25",
   "time": "",
   "title": "夜：プレミアステージ「Studio Showcase」（新作発表）",
   "place": "マリーナ・ベイ・サンズ",
   "memo": "終了が遅ければ Grab・タクシーで帰る",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-26",
   "time": "",
   "title": "観光日",
   "place": "",
   "memo": "候補：セントーサ（HarbourFront駅／タクシー約15分）、ナイトサファリ（タクシー約30分・Klookのシャトル付きチケット）",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-27",
   "time": "",
   "title": "D23 Asia 2日目（コンベンション）",
   "place": "マリーナ・ベイ・サンズ",
   "memo": "",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-27",
   "time": "",
   "title": "夜：プレミアステージ「Disney Hits LIVE!」（コンサート）",
   "place": "マリーナ・ベイ・サンズ",
   "memo": "この夜MBS泊なら徒歩で部屋へ",
   "link": ""
  },
  {
   "kind": "plan",
   "date": "2027-06-28",
   "time": "",
   "title": "チェックアウト → 帰国",
   "place": "チャンギ空港",
   "memo": "GST還付（eTRS）は空港で。便は未定",
   "link": ""
  }
 ]
};
