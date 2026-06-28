/* ============================================================
   app.js — 宅建 統合ラボ 共通ロジック
   4分野（rights / gyoho / houserei / zeimu）を
   FIELD_META・DEVICE_RENDERERS で切り替えながら動かす。
   ============================================================ */
(function(){

  /* ============== 分野メタ情報 ============== */
  var FIELD_META = {
    rights: {
      key: "rights",
      name: "法律実験ラボ",
      cardName: "権利関係",
      cardSub: "化学実験ラボ",
      emoji: "⚗️",
      headerIcon: "⚗",
      heroSub: "宅建 権利関係 — ケーススタディで条件を動かして理解する",
      runLabel: "▶ 実験開始（判定する）",
      okText: "反応成功 — 正解",
      noText: "反応不成功 — 不正解",
      relatedIcon: "🔬",
      branchHead: "🧪 分岐実験ラボ",
      doneTagMulti: "実験終了",
      doneTagSingle: "1問終了",
      doneCommentFull: "すべての反応が成功。コアイメージが定着しています。",
      doneCommentMid: "良い調子です。間違えた用語をもう一度分析してみましょう。",
      doneCommentLow: "まずは用語のコアイメージから見直してみましょう。",
      footerTitle: "タイトル画面からモードを選んで実験を始めましょう。",
      footerList: "ケースをタップすると、その場から1問挑戦できます。",
      footerGlossary: "用語をタップすると、コアイメージの分析パネルが開きます。",
      footerPlay: "用語をタップすると、コアイメージで法律用語を分解表示します。",
      searchPlaceholder: "🔍 用語を検索（例：善意、対抗）"
    },
    gyoho: {
      key: "gyoho",
      name: "検査管制ラボ",
      cardName: "宅建業法",
      cardSub: "検査ライン／管制室",
      emoji: "🚦",
      headerIcon: "🚦",
      heroSub: "宅建業法 — 検査ライン／管制室で判断の分岐を試す",
      runLabel: "🚦 検査開始（判定する）",
      okText: "検査合格 — 正解",
      noText: "検査不合格 — 不正解",
      relatedIcon: "🔧",
      branchHead: "🔧 分岐実験ラボ",
      doneTagMulti: "検査終了",
      doneTagSingle: "1問終了",
      doneCommentFull: "すべての検査が合格。判断基準が定着しています。",
      doneCommentMid: "良い調子です。不合格だった項目をもう一度分析してみましょう。",
      doneCommentLow: "まずは用語のコアイメージから見直してみましょう。",
      footerTitle: "タイトル画面からモードを選んで検査を始めましょう。",
      footerList: "ケースをタップすると、その場から1問挑戦できます。",
      footerGlossary: "用語をタップすると、コアイメージの分析パネルが開きます。",
      footerPlay: "用語をタップすると、コアイメージで法律用語を分解表示します。",
      searchPlaceholder: "🔍 用語を検索（例：媒介、クーリング）"
    },
    houserei: {
      key: "houserei",
      name: "測量設計ラボ",
      cardName: "法令上の制限",
      cardSub: "測量・建築現場",
      emoji: "📐",
      headerIcon: "📐",
      heroSub: "法令上の制限 — メジャーとブループリントで基準値の分岐を試す",
      runLabel: "📐 測定開始（判定する）",
      okText: "測定一致 — 正解",
      noText: "測定不一致 — 不正解",
      relatedIcon: "📏",
      branchHead: "📏 分岐実験ラボ",
      doneTagMulti: "測定終了",
      doneTagSingle: "1問終了",
      doneCommentFull: "すべての測定が一致。基準値の感覚が定着しています。",
      doneCommentMid: "良い調子です。ズレた基準をもう一度測り直しましょう。",
      doneCommentLow: "まずは用語のコアイメージから見直してみましょう。",
      footerTitle: "タイトル画面からモードを選んで測量を始めましょう。",
      footerList: "ケースをタップすると、その場から1問挑戦できます。",
      footerGlossary: "用語をタップすると、コアイメージの分析パネルが開きます。",
      footerPlay: "用語をタップすると、コアイメージで法律用語を分解表示します。",
      searchPlaceholder: "🔍 用語を検索（例：容積率、開発許可）"
    },
    zeimu: {
      key: "zeimu",
      name: "会計窓口ラボ",
      cardName: "税・その他",
      cardSub: "会計窓口",
      emoji: "🧮",
      headerIcon: "🧮",
      heroSub: "税・その他 — 電卓とレシートで計算式の分岐を試す",
      runLabel: "🧮 計算開始（判定する）",
      okText: "計算一致 — 正解",
      noText: "計算不一致 — 不正解",
      relatedIcon: "🧾",
      branchHead: "🧾 分岐実験ラボ",
      doneTagMulti: "計算終了",
      doneTagSingle: "1問終了",
      doneCommentFull: "すべての計算が一致。基準日のルールが定着しています。",
      doneCommentMid: "良い調子です。ズレた計算をもう一度見直しましょう。",
      doneCommentLow: "まずは用語のコアイメージから見直してみましょう。",
      footerTitle: "タイトル画面からモードを選んで計算を始めましょう。",
      footerList: "ケースをタップすると、その場から1問挑戦できます。",
      footerGlossary: "用語をタップすると、コアイメージの分析パネルが開きます。",
      footerPlay: "用語をタップすると、コアイメージで法律用語を分解表示します。",
      searchPlaceholder: "🔍 用語を検索（例：固定資産税、控除）"
    }
  };

  var FIELD_ORDER = ["rights", "gyoho", "houserei", "zeimu"];

  /* ============== 分野ごとのビジュアル装置レンダラー ============== */
  var DEVICE_RENDERERS = {

    rights: function(t){
      switch(t.visual){
        case 'lamp':
          return '<div class="r-lamp-bulb ' + (t.state==='on'?'on':'') + '"></div><div class="device-caption">' + (t.state==='on' ? '点灯＝知っている' : '消灯＝知らない') + '</div>';
        case 'dual-lamp':
          return '<div class="r-lamp-bulb on"></div><div class="r-lamp-bulb ' + (t.state==='on'?'on':'') + '"></div><div class="device-caption">双方が「演技中」のサイン</div>';
        case 'dial':
          return '<div class="r-lamp-bulb"></div><div class="device-caption">感度を下げて見逃した状態</div>';
        case 'transmitter':
          return '<div class="generic-dot"></div><div class="device-caption">送信内容と内心が不一致</div>';
        case 'signal-tamper':
          return '<div class="generic-dot" style="background:var(--danger);"></div><div class="device-caption">入力データが書き換えられた</div>';
        case 'pressure':
          return '<div class="generic-dot" style="background:var(--danger);"></div><div class="device-caption">外部から強制された意思表示</div>';
        case 'circuit':
          return '<div class="r-gate-bar ' + (t.state==='never-on'?'':'unlocked') + '"></div><div class="device-caption">' + (t.state==='never-on' ? '一度も通電していない' : '一度点灯→巻き戻り') + '</div>';
        case 'gate':
          return '<div class="r-gate-bar ' + (t.state==='locked'?'':'unlocked') + '"></div><div class="device-caption">' + (t.state==='locked' ? '通行証がないと通れない' : '通行証チェックの対象') + '</div>';
        case 'timer':
          return '<div class="r-timer-ring"></div><div class="device-caption">カウントダウン中の権利</div>';
        case 'button':
          return '<div class="generic-dot"></div><div class="device-caption">本人が押さないと反映されない</div>';
        case 'remote':
          return '<div class="r-gate-bar ' + (t.state==='linked'?'unlocked':'') + '"></div><div class="device-caption">' + (t.state==='linked' ? '本体に接続済み' : '本体に未接続/偽装接続') + '</div>';
        case 'tag':
          return '<div class="r-tag-chip"></div><div class="device-caption">担保タグが建物に付着</div>';
        case 'magnet':
          return '<div class="r-magnet-pair"><div></div><div></div></div><div class="device-caption">債権と一緒に動く・消える</div>';
        case 'ticket':
          return '<div class="r-tag-chip"></div><div class="device-caption">使用権のみのチケット</div>';
        case 'box':
          return '<div class="generic-dot"></div><div class="device-caption">問題なければ全額返却</div>';
        case 'reset':
          return '<div class="r-timer-ring"></div><div class="device-caption">経年劣化分は対象外</div>';
        case 'panel':
          return '<div class="generic-dot" style="background:var(--danger);"></div><div class="device-caption">表示を信じても保証されない</div>';
        default:
          return '<div class="generic-dot"></div><div class="device-caption">' + (t.core || '') + '</div>';
      }
    },

    gyoho: function(t){
      switch(t.visual){
        case 'camera':
          if(t.state === 'off') return '<div class="g-cam-icon"></div><div class="device-caption">監視カメラなし＝報告義務なし</div>';
          if(t.state === 'single') return '<div class="g-cam-icon single"></div><div class="device-caption">カメラ1台＝定期報告あり（自己発見取引は対象外）</div>';
          return '<div class="g-cam-icon full"></div><div class="device-caption">常時フル監視＝報告も自己発見取引も封鎖</div>';
        case 'bypass':
          return '<div class="g-signal-set"><div class="g-signal-dot green"></div></div><div class="device-caption">監視ラインを通らない直接ルート</div>';
        case 'network':
          return '<div class="g-signal-set"><div class="g-signal-dot amber"></div><div class="g-signal-dot amber"></div></div><div class="device-caption">中央管制システムへの登録期限あり</div>';
        case 'cancel-button':
          return '<div class="g-stamp-circle"></div><div class="device-caption">条件を満たす間だけ作動する返品ボタン</div>';
        case 'zone':
          return '<div class="g-signal-set"><div class="g-signal-dot green"></div><div class="g-signal-dot green"></div></div><div class="device-caption">正式ラインの内側＝対象外ゾーン</div>';
        case 'inspection-sheet':
          return '<div class="g-badge-shield">35</div><div class="device-caption">出荷前に手渡す検査票</div>';
        case 'badge':
          return '<div class="g-badge-shield">士</div><div class="device-caption">' + (t.state==='resident' ? '事務所常駐の配置基準' : '検査を行うための資格バッジ') + '</div>';
        case 'delivery-note':
          return '<div class="g-badge-shield">37</div><div class="device-caption">出荷後に渡す納品書</div>';
        case 'safety-lock':
          return '<div class="g-lock-icon"></div><div class="device-caption">業者×一般person取引にだけ作動するロック</div>';
        case 'gauge':
          return '<div class="g-gauge-bar"><div class="g-gauge-fill" style="width:60%"></div></div><div class="device-caption">代金の2割で頭打ちになる上限ゲージ</div>';
        case 'fake-signal':
          return '<div class="g-signal-set"><div class="g-signal-dot green"></div></div><div class="device-caption">実態と異なる偽の合格ランプ</div>';
        case 'gate-stamp':
          return '<div class="g-lock-icon"></div><div class="device-caption">合格スタンプ前は出荷案内できないゲート</div>';
        default:
          return '<div class="generic-dot"></div><div class="device-caption">' + (t.core || '') + '</div>';
      }
    },

    houserei: function(t){
      switch(t.visual){
        case 'gate-width':
          return '<div class="h-ruler-bar short"></div><div class="device-caption">幅4m未満のゲート＝重機が入れない</div>';
        case 'setback':
          return '<div class="h-gate-icon open"></div><div class="device-caption">中心線から2m後退した仮設ルート</div>';
        case 'gauge':
          return '<div class="h-gauge-block"><div class="h-gauge-fill" style="width:70%"></div></div><div class="device-caption">積み上げ可能な総ボリュームの上限</div>';
        case 'ruler-gauge':
          return '<div class="h-ruler-bar"></div><div class="h-gauge-block"><div class="h-gauge-fill over" style="width:50%"></div></div><div class="device-caption">道路幅が上限ゲージを決める</div>';
        case 'footprint':
          return '<div class="h-footprint-box"><div class="fill" style="height:60%"></div></div><div class="device-caption">建物の足跡が占める面積の上限</div>';
        case 'gauge-unlock':
          return '<div class="h-gauge-block"><div class="h-gauge-fill unlocked" style="width:100%"></div></div><div class="device-caption">耐火仕様でロックが緩む／外れる</div>';
        case 'zone-map':
          if(t.state === 'restricted') return '<div class="h-zone-grid"><div class="h-zone-cell restricted"></div><div class="h-zone-cell restricted"></div><div class="h-zone-cell restricted"></div></div><div class="device-caption">全面に許可ゲートが必要なゾーン</div>';
          if(t.state === 'fireproof') return '<div class="h-zone-grid"><div class="h-zone-cell fireproof"></div><div class="h-zone-cell fireproof"></div></div><div class="device-caption">耐火仕様ラベルが貼られた区画</div>';
          return '<div class="h-zone-grid"><div class="h-zone-cell active"></div><div class="h-zone-cell active"></div><div class="h-zone-cell"></div></div><div class="device-caption">小規模工事はフリーパスのゾーン</div>';
        case 'stamp-gate':
          return '<div class="h-gate-icon"></div><div class="device-caption">区域とサイズで開閉が決まる許可ゲート</div>';
        case 'permit-tag':
          return '<div class="h-permit-tag"></div><div class="device-caption">' +
            (t.state==='internal' ? '区域を問わない内部移動許可' :
             t.state==='convert' ? 'ラインの仕様変更許可' :
             '持ち主交代＋仕様変更の複合許可') + '</div>';
        default:
          return '<div class="generic-dot"></div><div class="device-caption">' + (t.core || '') + '</div>';
      }
    },

    zeimu: function(t){
      switch(t.visual){
        case 'receipt-stamp':
          return '<div class="z-stamp-mark exempt">相続</div><div class="device-caption">引き継ぎ窓口だけ手数料免除のスタンプ</div>';
        case 'calendar-snapshot':
          return '<div class="z-calendar-grid">' +
            Array.from({length:14}).map(function(_,i){return '<div class="z-cal-cell' + (i===0?' marked':'') + '"></div>';}).join('') +
            '</div><div class="device-caption">1月1日の瞬間に名前が載っている人に請求</div>';
        case 'calculator-discount':
          return '<div class="z-calc-grid">' +
            Array.from({length:9}).map(function(_,i){ return '<div class="z-calc-btn' + (i<6?' strong':' weak') + '"></div>'; }).join('') +
            '</div><div class="device-caption">' + (t.state==='small' ? '200㎡分は強い割引(1/6)' : '超えた分は弱い割引(1/3)') + '</div>';
        case 'timer-rate':
          return '<div class="z-rate-gauge"><div class="z-rate-fill' + (t.state==='short'?' high':'') + '" style="width:' + (t.state==='short'?'85%':'40%') + '"></div></div>' +
            '<div class="device-caption">' + (t.state==='long' ? '5年超＝低いレート' : '5年以下＝高いレート') + '</div>';
        case 'coupon-expiry':
          return '<div class="z-coupon-tag">¥3000万</div><div class="device-caption">居住をやめて3年目の年末で失効</div>';
        default:
          return '<div class="generic-dot"></div><div class="device-caption">' + (t.core || '') + '</div>';
      }
    }
  };

  /* ============== 永続化（分野ごとの進捗） ============== */
  var STORAGE_PREFIX = 'takkenlab_v2_';
  var progressCache = {};

  function loadProgress(field){
    if(progressCache[field]) return progressCache[field];
    var data = { answers:{}, viewedTerms:[], bestStreak:0, totalAttempts:0, totalCorrect:0 };
    try{
      var raw = localStorage.getItem(STORAGE_PREFIX + field);
      if(raw) data = JSON.parse(raw);
    }catch(e){}
    progressCache[field] = data;
    return data;
  }
  function saveProgress(field){
    try{ localStorage.setItem(STORAGE_PREFIX + field, JSON.stringify(progressCache[field])); }catch(e){}
  }
  function markAnswer(field, qid, correct){
    var p = loadProgress(field);
    p.answers[qid] = correct;
    p.totalAttempts++;
    if(correct) p.totalCorrect++;
    if(correct){
      currentStreak++;
      if(currentStreak > p.bestStreak) p.bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
    saveProgress(field);
  }
  function markTermViewed(field, term){
    var p = loadProgress(field);
    if(p.viewedTerms.indexOf(term) === -1){
      p.viewedTerms.push(term);
      saveProgress(field);
    }
  }

  /* ============== 状態 ============== */
  var currentField = null;
  var playQueue = [];
  var queueIndex = 0;
  var score = 0;
  var currentStreak = 0;
  var selected = null;
  var answered = false;
  var branchState = {};
  var isSingleMode = false;

  function meta(){ return FIELD_META[currentField]; }
  function data(){ return window.FIELDS[currentField]; }
  function getCurrentQuestion(){ return data().questions[playQueue[queueIndex]]; }
  function deviceHTML(t){ return DEVICE_RENDERERS[currentField](t); }

  var els = {
    headerIcon: document.getElementById('headerIcon'),
    headerName: document.getElementById('headerName'),
    headerSub: document.getElementById('headerSub'),
    headerMeter: document.getElementById('headerMeter'),
    fieldBackBtn: document.getElementById('fieldBackBtn'),
    homeBtn: document.getElementById('homeBtn'),
    fieldGrid: document.getElementById('fieldGrid'),
    heroEmoji: document.getElementById('heroEmoji'),
    heroTitle: document.getElementById('heroTitle'),
    heroSub: document.getElementById('heroSub'),
    metaIndex: document.getElementById('metaIndex'),
    metaTotal: document.getElementById('metaTotal'),
    metaScore: document.getElementById('metaScore'),
    progressFill: document.getElementById('progressFill'),
    progressLabel: document.getElementById('progressLabel'),
    casePanel: document.getElementById('casePanel'),
    caseCategory: document.getElementById('caseCategory'),
    caseTitle: document.getElementById('caseTitle'),
    caseText: document.getElementById('caseText'),
    questionLine: document.getElementById('questionLine'),
    termPanel: document.getElementById('termPanel'),
    termPanelInner: document.getElementById('termPanelInner'),
    choicesBox: document.getElementById('choicesBox'),
    runBtn: document.getElementById('runBtn'),
    resultPanel: document.getElementById('resultPanel'),
    resultFlag: document.getElementById('resultFlag'),
    resultFlagText: document.getElementById('resultFlagText'),
    resultExplanation: document.getElementById('resultExplanation'),
    relatedTerms: document.getElementById('relatedTerms'),
    nextBtn: document.getElementById('nextBtn'),
    branchPanel: document.getElementById('branchPanel'),
    branchHead: document.getElementById('branchHead'),
    branchIntro: document.getElementById('branchIntro'),
    branchLevers: document.getElementById('branchLevers'),
    branchResult: document.getElementById('branchResult'),
    branchFlag: document.getElementById('branchFlag'),
    branchReason: document.getElementById('branchReason'),
    doneTag: document.getElementById('doneTag'),
    doneScore: document.getElementById('doneScore'),
    doneStreak: document.getElementById('doneStreak'),
    doneComment: document.getElementById('doneComment'),
    doneActions: document.getElementById('doneActions'),
    statRate: document.getElementById('statRate'),
    statStreak: document.getElementById('statStreak'),
    statTerms: document.getElementById('statTerms'),
    listItems: document.getElementById('listItems'),
    glossaryItems: document.getElementById('glossaryItems'),
    glossarySearch: document.getElementById('glossarySearch'),
    pageFooter: document.getElementById('pageFooter'),
  };

  /* ============== 画面切替 ============== */
  function showScreen(name){
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('show'); });
    document.getElementById('screen' + name).classList.add('show');

    var isFieldSelect = name === 'FieldSelect';
    var isTitle = name === 'Title';
    els.fieldBackBtn.style.display = isFieldSelect ? 'none' : 'inline-block';
    els.homeBtn.style.display = (isFieldSelect || isTitle) ? 'none' : 'inline-block';
    els.headerSub.style.display = isFieldSelect ? 'none' : 'inline';
    els.headerMeter.style.display = (name === 'Play') ? 'flex' : 'none';

    if(isFieldSelect){
      els.headerIcon.textContent = '🏗️';
      els.headerName.textContent = '宅建 統合ラボ';
      els.pageFooter.textContent = '分野を選んでケーススタディを始めましょう。';
      return;
    }

    var m = meta();
    var footers = {
      Title: m.footerTitle, List: m.footerList, Glossary: m.footerGlossary, Play: m.footerPlay, Done: ''
    };
    els.pageFooter.textContent = footers[name] || '';
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1; i>0; i--){
      var j = Math.floor(Math.random() * (i+1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ============== 分野選択画面 ============== */
  function renderFieldGrid(){
    els.fieldGrid.innerHTML = '';
    FIELD_ORDER.forEach(function(key){
      var m = FIELD_META[key];
      var p = loadProgress(key);
      var rate = p.totalAttempts > 0 ? Math.round(p.totalCorrect / p.totalAttempts * 100) : 0;

      var card = document.createElement('button');
      card.className = 'field-card';
      card.dataset.color = key;
      card.innerHTML =
        '<div class="field-card-emoji">' + m.emoji + '</div>' +
        '<div class="field-card-body">' +
          '<div class="field-card-name">' + m.cardName + '</div>' +
          '<div class="field-card-sub">' + m.cardSub + '</div>' +
          '<div class="field-card-stats">正答率 ' + rate + '% ・ ベストストリーク ' + p.bestStreak + '</div>' +
        '</div>' +
        '<div class="field-card-arrow">›</div>';
      card.addEventListener('click', function(){ enterField(key); });
      els.fieldGrid.appendChild(card);
    });
  }

  function enterField(field){
    currentField = field;
    document.body.dataset.field = field;
    var m = meta();
    els.headerIcon.textContent = m.headerIcon;
    els.headerName.textContent = m.name;
    els.headerSub.textContent = '/ ' + m.cardName;
    els.heroEmoji.textContent = m.emoji;
    els.heroTitle.textContent = m.name;
    els.heroSub.textContent = m.heroSub;
    els.glossarySearch.placeholder = m.searchPlaceholder;
    els.branchHead.textContent = m.branchHead;
    renderTitleStats();
    showScreen('Title');
  }

  function backToFieldSelect(){
    renderFieldGrid();
    showScreen('FieldSelect');
  }

  /* ============== タイトル画面の統計表示 ============== */
  function renderTitleStats(){
    var p = loadProgress(currentField);
    var rate = p.totalAttempts > 0 ? Math.round(p.totalCorrect / p.totalAttempts * 100) : 0;
    els.statRate.textContent = rate + '%';
    els.statStreak.textContent = p.bestStreak;
    els.statTerms.textContent = p.viewedTerms.length + '/' + Object.keys(data().terms).length;
  }

  /* ============== プレイ開始 ============== */
  function startPlay(queue, single){
    playQueue = queue;
    queueIndex = 0;
    score = 0;
    isSingleMode = !!single;
    showScreen('Play');
    renderQuestion();
  }

  /* ============== [[用語]] をクリック可能なspanに変換 ============== */
  function renderCaseText(text){
    return text.replace(/\[\[(.+?)\]\]/g, function(_, term){
      return '<span class="term" data-term="' + term + '">' + term + '</span>';
    });
  }

  function openTermPanel(termKey){
    var t = data().terms[termKey];
    if(!t) return;
    markTermViewed(currentField, termKey);
    els.termPanelInner.innerHTML =
      '<div class="term-head"><span class="term-name">' + termKey + '</span>' +
      '<span class="term-reading">' + (t.reading||'') + '</span></div>' +
      '<p class="term-plain">' + t.plain + '</p>' +
      '<div class="term-core-label">CORE IMAGE — コアイメージ</div>' +
      '<p class="term-core">' + t.core + '</p>' +
      '<div class="device">' + deviceHTML(t) + '</div>';
    els.termPanel.classList.add('open');

    document.querySelectorAll('.term').forEach(function(el){
      el.classList.toggle('active', el.dataset.term === termKey);
    });
  }

  function bindTermClicks(){
    document.querySelectorAll('.term').forEach(function(el){
      el.addEventListener('click', function(){ openTermPanel(el.dataset.term); });
    });
    document.querySelectorAll('.related-chip').forEach(function(el){
      el.addEventListener('click', function(){
        openTermPanel(el.dataset.term);
        els.termPanel.scrollIntoView({behavior:'smooth', block:'center'});
      });
    });
  }

  /* ============== 問題プレイ ============== */
  function renderQuestion(){
    answered = false;
    selected = null;
    els.termPanel.classList.remove('open');
    els.resultPanel.classList.remove('show','ok','no');
    els.branchPanel.classList.remove('show');

    var q = getCurrentQuestion();
    els.caseCategory.textContent = q.category;
    els.caseTitle.textContent = q.title;
    els.caseText.innerHTML = renderCaseText(q.caseText);
    els.questionLine.innerHTML = renderCaseText(q.question);

    els.choicesBox.innerHTML = '';
    q.choices.forEach(function(choiceText, i){
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = '<span class="choice-lever"></span><span>' + renderCaseText(choiceText) + '</span>';
      btn.addEventListener('click', function(){
        if(answered) return;
        selected = i;
        document.querySelectorAll('.choice-btn').forEach(function(b,idx){
          b.classList.toggle('selected', idx===i);
        });
        els.runBtn.disabled = false;
      });
      els.choicesBox.appendChild(btn);
    });

    els.runBtn.disabled = true;
    els.runBtn.textContent = meta().runLabel;

    bindTermClicks();
    updateMeta();
  }

  function updateMeta(){
    els.metaIndex.textContent = queueIndex + 1;
    els.metaTotal.textContent = playQueue.length;
    els.metaScore.textContent = score;
    var pct = Math.round(queueIndex / playQueue.length * 100);
    els.progressFill.style.width = pct + '%';
    els.progressLabel.textContent = pct + '%';
  }

  function renderBranchLab(q){
    var bl = q.branchLab;
    if(!bl){ els.branchPanel.classList.remove('show'); return; }
    els.branchIntro.textContent = bl.intro;
    branchState = Object.assign({}, bl.defaultState);

    els.branchLevers.innerHTML = '';
    bl.levers.forEach(function(lever){
      var group = document.createElement('div');
      group.className = 'branch-lever-group';

      var label = document.createElement('div');
      label.className = 'branch-lever-label';
      label.textContent = lever.label;
      group.appendChild(label);

      var pillGroup = document.createElement('div');
      pillGroup.className = 'pill-group';

      lever.options.forEach(function(opt){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-btn' + (branchState[lever.key] === opt.value ? ' active' : '');
        btn.textContent = opt.label;
        btn.addEventListener('click', function(){
          branchState[lever.key] = opt.value;
          pillGroup.querySelectorAll('.pill-btn').forEach(function(b){ b.classList.remove('active'); });
          btn.classList.add('active');
          updateBranchResult(q);
        });
        pillGroup.appendChild(btn);
      });

      group.appendChild(pillGroup);
      els.branchLevers.appendChild(group);
    });

    updateBranchResult(q);
    els.branchPanel.classList.add('show');
  }

  function updateBranchResult(q){
    var result = q.branchLab.evaluate(branchState);
    var cls = result.win === true ? 'win' : result.win === false ? 'lose' : 'contest';
    var mark = result.win === true ? '✅' : result.win === false ? '❌' : '⚖️';
    els.branchResult.className = 'branch-result ' + cls;
    els.branchFlag.textContent = mark + ' ' + result.headline;
    els.branchReason.textContent = result.reason;
  }

  function runJudgement(){
    if(selected === null || answered) return;
    answered = true;
    var q = getCurrentQuestion();
    var isCorrect = selected === q.answerIndex;
    if(isCorrect) score++;
    markAnswer(currentField, q.id, isCorrect);

    document.querySelectorAll('.choice-btn').forEach(function(b, idx){
      b.disabled = true;
      if(idx === q.answerIndex) b.classList.add('correct');
      else if(idx === selected) b.classList.add('wrong');
    });

    var m = meta();
    els.resultPanel.classList.add('show', isCorrect ? 'ok' : 'no');
    els.resultFlag.className = 'result-flag ' + (isCorrect ? 'ok-text' : 'no-text');
    els.resultFlagText.textContent = isCorrect ? m.okText : m.noText;
    els.resultExplanation.textContent = q.explanation;

    els.relatedTerms.innerHTML = '';
    (q.relatedTerms || []).forEach(function(term){
      var chip = document.createElement('span');
      chip.className = 'related-chip';
      chip.textContent = m.relatedIcon + ' ' + term;
      chip.dataset.term = term;
      els.relatedTerms.appendChild(chip);
    });
    bindTermClicks();
    renderBranchLab(q);

    els.runBtn.disabled = true;
    els.resultPanel.scrollIntoView({behavior:'smooth', block:'center'});
    updateMeta();
  }

  function nextQuestion(){
    queueIndex++;
    if(queueIndex >= playQueue.length){
      showDone();
    } else {
      renderQuestion();
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }

  function showDone(){
    showScreen('Done');
    var m = meta();
    var p = loadProgress(currentField);
    els.doneScore.textContent = score + ' / ' + playQueue.length;
    els.doneStreak.textContent = '現在のストリーク ' + currentStreak + ' ／ ベスト ' + p.bestStreak;
    var rate = score / playQueue.length;
    els.doneComment.textContent =
      rate === 1 ? m.doneCommentFull :
      rate >= 0.6 ? m.doneCommentMid :
      m.doneCommentLow;
    els.doneTag.textContent = isSingleMode ? m.doneTagSingle : m.doneTagMulti;

    els.doneActions.innerHTML = '';
    if(isSingleMode){
      addDoneBtn('ghost-btn', '📋 問題リストに戻る', function(){ showScreen('List'); renderList(); });
    } else {
      addDoneBtn('restart-btn', '🔁 もう一度同じセットで挑戦', function(){ startPlay(playQueue.slice(), false); });
    }
    addDoneBtn('ghost-btn', '🏠 タイトルに戻る', function(){ renderTitleStats(); showScreen('Title'); });
    addDoneBtn('ghost-btn', '⬅ 分野選択に戻る', backToFieldSelect);
  }

  function addDoneBtn(cls, label, handler){
    var b = document.createElement('button');
    b.className = cls;
    b.textContent = label;
    b.addEventListener('click', handler);
    els.doneActions.appendChild(b);
  }

  /* ============== 問題選択リスト ============== */
  function renderList(){
    var p = loadProgress(currentField);
    els.listItems.innerHTML = '';
    data().questions.forEach(function(q, idx){
      var a = p.answers[q.id];
      var badgeCls = a === true ? 'correct' : a === false ? 'wrong' : '';
      var badgeMark = a === true ? '✓' : a === false ? '✕' : (idx+1);

      var item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML =
        '<div class="list-badge ' + badgeCls + '">' + badgeMark + '</div>' +
        '<div class="list-body">' +
          '<div class="list-title">' + q.title + '</div>' +
          '<div class="list-sub">' + q.category + '</div>' +
        '</div>';
      item.addEventListener('click', function(){ startPlay([idx], true); });
      els.listItems.appendChild(item);
    });
  }

  /* ============== 用語集 ============== */
  function renderGlossary(filter){
    var f = (filter || '').trim();
    var p = loadProgress(currentField);
    var terms = data().terms;
    els.glossaryItems.innerHTML = '';
    Object.keys(terms).forEach(function(key){
      var t = terms[key];
      if(f && key.indexOf(f) === -1 && (t.reading||'').indexOf(f) === -1) return;

      var seen = p.viewedTerms.indexOf(key) !== -1;
      var item = document.createElement('div');
      item.className = 'glossary-item';
      item.innerHTML =
        '<div class="glossary-row">' +
          '<span class="glossary-name">' + key + '</span>' +
          '<span class="glossary-reading">' + (t.reading||'') + '</span>' +
          (seen ? '<span class="glossary-seen">✓既読</span>' : '') +
        '</div>' +
        '<div class="glossary-detail" id="gd-' + key + '">' +
          '<p class="term-plain">' + t.plain + '</p>' +
          '<div class="term-core-label">CORE IMAGE — コアイメージ</div>' +
          '<p class="term-core">' + t.core + '</p>' +
          '<div class="device">' + deviceHTML(t) + '</div>' +
        '</div>';

      item.addEventListener('click', function(){
        var d = item.querySelector('.glossary-detail');
        var willOpen = !d.classList.contains('open');
        document.querySelectorAll('.glossary-detail.open').forEach(function(el){ el.classList.remove('open'); });
        if(willOpen){
          d.classList.add('open');
          markTermViewed(currentField, key);
          var seenEl = item.querySelector('.glossary-seen');
          if(!seenEl){
            var s = document.createElement('span');
            s.className = 'glossary-seen';
            s.textContent = '✓既読';
            item.querySelector('.glossary-row').appendChild(s);
          }
        }
      });

      els.glossaryItems.appendChild(item);
    });
  }

  /* ============== イベント登録 ============== */
  document.getElementById('menuStart').addEventListener('click', function(){
    startPlay(data().questions.map(function(_,i){return i;}), false);
  });
  document.getElementById('menuRandom').addEventListener('click', function(){
    startPlay(shuffle(data().questions.map(function(_,i){return i;})), false);
  });
  document.getElementById('menuList').addEventListener('click', function(){
    renderList(); showScreen('List');
  });
  document.getElementById('menuGlossary').addEventListener('click', function(){
    renderGlossary(''); els.glossarySearch.value=''; showScreen('Glossary');
  });
  els.glossarySearch.addEventListener('input', function(){
    renderGlossary(els.glossarySearch.value);
  });
  els.homeBtn.addEventListener('click', function(){ renderTitleStats(); showScreen('Title'); });
  els.fieldBackBtn.addEventListener('click', backToFieldSelect);
  els.runBtn.addEventListener('click', runJudgement);
  els.nextBtn.addEventListener('click', nextQuestion);

  /* ============== 起動 ============== */
  renderFieldGrid();
})();
