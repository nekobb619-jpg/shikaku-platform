(function(){
/* ============================================================
   gyoho-questions.js — 宅建業法 ケーススタディ問題データ
   ============================================================ */

const QUESTIONS = [

  {
    id: 1,
    category: "媒介契約",
    title: "ケース01：監視カメラの台数",
    caseText:
      "Aは自宅の売却をB業者に依頼し、[[専任媒介契約]]を結んだ。契約期間中、Aは自分の知人Cを見つけ、" +
      "Bを介さずに直接Cと売買交渉を進めたいと考えている。",
    question: "Aは、Bを介さずに自分でCと直接契約すること（[[自己発見取引]]）ができるか。",
    choices: [
      "できる。専任媒介契約では自己発見取引が認められている。",
      "できない。専任媒介契約では自己発見取引も禁止されている。",
      "できる。ただしBの事前許可が必要である。",
      "できない。媒介契約の種類を問わず自己発見取引は常に禁止される。"
    ],
    answerIndex: 0,
    relatedTerms: ["専任媒介契約", "自己発見取引", "専属専任媒介契約"],
    explanation:
      "専任媒介契約は、依頼者が他の業者に重複して依頼することを禁止するものであり、自己発見取引（業者を介さない直接契約）は禁止されていません。" +
      "自己発見取引まで禁止されるのは、より規制の強い専属専任媒介契約の場合です。この違いは頻出のひっかけポイントです。",
    branchLab: {
      intro: "媒介契約の種類を切り替えると、規制内容がどう変わるか試してみよう。",
      levers: [
        {
          key: "type",
          label: "媒介契約の種類",
          options: [
            { value: "general", label: "一般媒介契約" },
            { value: "exclusive", label: "専任媒介契約" },
            { value: "exclusive_full", label: "専属専任媒介契約" }
          ]
        }
      ],
      defaultState: { type: "exclusive" },
      evaluate: function(state){
        if(state.type === "general"){
          return {
            win: true,
            headline: "自己発見取引：できる／他業者への重複依頼：できる",
            reason: "一般媒介契約は規制が最も緩く、報告義務も指定流通機構への登録義務もありません。"
          };
        }
        if(state.type === "exclusive"){
          return {
            win: true,
            headline: "自己発見取引：できる／他業者への重複依頼：できない",
            reason: "専任媒介契約は1社専属ですが、自己発見取引は禁止されていません。2週間に1回以上の報告と7日以内の指定流通機構への登録が必要です。"
          };
        }
        return {
          win: false,
          headline: "自己発見取引：できない／他業者への重複依頼：できない",
          reason: "専属専任媒介契約は最も規制が厳しく、自己発見取引も禁止されます。1週間に1回以上の報告と5日以内の指定流通機構への登録が必要です。"
        };
      }
    }
  },

  {
    id: 2,
    category: "クーリングオフ",
    title: "ケース02：返品ボタンの封印",
    caseText:
      "買主Dは、B業者の事務所ではなく、公園のベンチ（[[事務所等]]に該当しない場所）で買受けの申込みをした。" +
      "その3日後、Dは契約を解除したいと考えた。物件の引渡しは未了で、代金もまだ支払っていない。",
    question: "Dは[[クーリングオフ]]によってこの契約を解除できるか。",
    choices: [
      "解除できる。事務所等以外での申込みであり、引渡し・代金完済もまだで、告知から8日も経過していない。",
      "解除できない。一度申込みをした以上、いかなる場合も撤回できない。",
      "解除できない。3日が経過しているため、クーリングオフの期間はすでに過ぎている。",
      "解除できる。ただし業者の事前同意が必要である。"
    ],
    answerIndex: 0,
    relatedTerms: ["クーリングオフ", "事務所等"],
    explanation:
      "クーリングオフは、事務所等以外の場所で申込みをした場合に認められます。クーリングオフできる旨の告知を受けた日から8日を過ぎていないこと、" +
      "かつ引渡しを受けて代金全額を支払っていないことが条件です。本ケースはいずれも満たすため、Dは解除できます。",
    branchLab: {
      intro: "場所・経過日数・引渡し状況を切り替えて、クーリングオフが封印される条件を確かめよう。",
      levers: [
        {
          key: "place",
          label: "申込みをした場所",
          options: [
            { value: "outside", label: "事務所等以外" },
            { value: "office", label: "事務所等" }
          ]
        },
        {
          key: "days",
          label: "告知からの経過日数",
          options: [
            { value: "within8", label: "8日以内" },
            { value: "over8", label: "8日を超える" }
          ]
        },
        {
          key: "delivery",
          label: "引渡し・代金の状況",
          options: [
            { value: "pending", label: "未引渡し・未完済" },
            { value: "done", label: "引渡し済み・全額完済" }
          ]
        }
      ],
      defaultState: { place: "outside", days: "within8", delivery: "pending" },
      evaluate: function(state){
        if(state.place === "office"){
          return {
            win: false,
            headline: "クーリングオフできない（そもそも対象外）",
            reason: "事務所等で申込みをした場合は、クーリングオフの対象になりません。"
          };
        }
        if(state.delivery === "done"){
          return {
            win: false,
            headline: "クーリングオフできない（封印条件：引渡し＋完済）",
            reason: "引渡しを受け、かつ代金全額を支払うと、クーリングオフはできなくなります。"
          };
        }
        if(state.days === "over8"){
          return {
            win: false,
            headline: "クーリングオフできない（封印条件：8日超過）",
            reason: "告知を受けた日から8日を過ぎると、クーリングオフの権利は消滅します。"
          };
        }
        return {
          win: true,
          headline: "クーリングオフできる",
          reason: "事務所等以外での申込みで、8日以内、かつ未引渡し・未完済なので、無条件で解除できます。"
        };
      }
    }
  },

  {
    id: 3,
    category: "重要事項説明",
    title: "ケース03：検査票の手渡しタイミング",
    caseText:
      "B業者は、買主Eとの売買契約に先立ち、[[宅地建物取引士]]の資格を持つ従業員Fに[[重要事項説明]]を行わせた。" +
      "Fは、その事務所における[[専任の宅地建物取引士]]ではない、一般の宅建士である。",
    question: "Fが行った重要事項説明は適法か。",
    choices: [
      "適法である。重要事項説明をする者は宅地建物取引士であればよく、専任である必要はない。",
      "違法である。重要事項説明は専任の宅地建物取引士でなければ行えない。",
      "違法である。重要事項説明は宅建業者の代表者本人が行わなければならない。",
      "適法である。ただし専任の宅地建物取引士の同席が必須である。"
    ],
    answerIndex: 0,
    relatedTerms: ["宅地建物取引士", "専任の宅地建物取引士", "重要事項説明"],
    explanation:
      "重要事項説明を行えるのは宅地建物取引士であれば足り、その事務所の専任の宅地建物取引士である必要はありません。" +
      "「専任」は事務所ごとの設置基準（人数比など）の話であり、個々の説明業務の資格要件とは別の話です。この区別は頻出のひっかけです。",
    branchLab: {
      intro: "説明者・タイミング・説明先を切り替えて、適法/違法の分岐を確かめよう。",
      levers: [
        {
          key: "explainer",
          label: "説明をする者",
          options: [
            { value: "license", label: "宅地建物取引士" },
            { value: "none", label: "資格を持たない従業員" }
          ]
        },
        {
          key: "timing",
          label: "説明のタイミング",
          options: [
            { value: "before", label: "契約締結前" },
            { value: "after", label: "契約締結後" }
          ]
        },
        {
          key: "target",
          label: "説明を受ける相手",
          options: [
            { value: "buyer", label: "買主（借主）" },
            { value: "seller", label: "売主のみ" }
          ]
        }
      ],
      defaultState: { explainer: "license", timing: "before", target: "buyer" },
      evaluate: function(state){
        if(state.explainer === "none"){
          return {
            win: false,
            headline: "違法（説明者の資格要件を満たさない）",
            reason: "重要事項説明は宅地建物取引士でなければ行えません（専任である必要はありません）。"
          };
        }
        if(state.timing === "after"){
          return {
            win: false,
            headline: "違法（説明のタイミングが遅い）",
            reason: "重要事項説明は契約締結前に行わなければなりません。契約後の説明では要件を満たしません。"
          };
        }
        if(state.target === "seller"){
          return {
            win: false,
            headline: "違法（説明先を満たさない）",
            reason: "重要事項説明は買主（または借主）に対して行うものです。売主への説明だけでは要件を満たしません。"
          };
        }
        return {
          win: true,
          headline: "適法",
          reason: "宅地建物取引士が、契約締結前に、買主に対して説明しているため要件を満たします。"
        };
      }
    }
  },

  {
    id: 4,
    category: "8種制限",
    title: "ケース04：デポジットの上限ゲージ",
    caseText:
      "業者Gは自ら売主となり、買主H（一般person）との間で代金3000万円の売買契約を締結する際、" +
      "[[手付金の制限]]を踏まえずに手付金として900万円（代金の3割）を受領しようとした。",
    question: "業者Gがこの手付金を受領することは適法か。",
    choices: [
      "違法である。業者が自ら売主の場合、手付の額は代金の2割を超えてはならない。",
      "適法である。手付の額は当事者間の合意で自由に決められる。",
      "違法である。業者は自ら売主として手付を一切受領できない。",
      "適法である。買主が同意していれば金額の上限はない。"
    ],
    answerIndex: 0,
    relatedTerms: ["手付金の制限", "8種制限"],
    explanation:
      "業者が自ら売主となり、相手方が業者でない場合（8種制限の対象）、手付の額は代金の2割を超えてはなりません。" +
      "超える部分は無効となります。これは買主の同意があっても変わらない強行規定です。",
    branchLab: {
      intro: "手付の額の割合を切り替えて、上限ゲージがどこで作動するか確かめよう。",
      levers: [
        {
          key: "ratio",
          label: "手付の額（代金に対する割合）",
          options: [
            { value: "within20", label: "2割以下" },
            { value: "over20", label: "2割を超える" }
          ]
        }
      ],
      defaultState: { ratio: "over20" },
      evaluate: function(state){
        if(state.ratio === "within20"){
          return {
            win: true,
            headline: "適法（上限ゲージ内）",
            reason: "代金の2割以下の手付であれば、業者が自ら売主でも問題なく受領できます。"
          };
        }
        return {
          win: false,
          headline: "違法（上限ゲージを超過）",
          reason: "代金の2割を超える手付は受領できません。超える部分は無効になります。"
        };
      }
    }
  },

  {
    id: 5,
    category: "広告規制",
    title: "ケース05：合格スタンプ前の出荷案内",
    caseText:
      "業者Iは、造成工事中の宅地について、[[広告開始時期の制限]]の対象となる開発許可をまだ受けていない段階で、" +
      "新聞折込チラシによる販売広告を開始した。",
    question: "業者Iがこの段階で広告を開始することは適法か。",
    choices: [
      "違法である。開発許可など必要な許可・確認を受ける前に広告をすることはできない。",
      "適法である。広告は契約とは別であり、いつ出しても問題ない。",
      "違法である。広告自体がそもそも常に禁止されている。",
      "適法である。ただし「販売予定」と明記すれば許可前でも広告できる。"
    ],
    answerIndex: 0,
    relatedTerms: ["広告開始時期の制限", "誇大広告の禁止"],
    explanation:
      "宅地建物の広告は、開発許可・建築確認など必要な許可等を受けた後でなければ行うことができません。" +
      "「販売予定」などの表示をしても、許可前の広告という違法状態は解消されません。",
    branchLab: {
      intro: "許可・確認の取得状況を切り替えて、広告ゲートの開閉を確かめよう。",
      levers: [
        {
          key: "permit",
          label: "開発許可・建築確認の状況",
          options: [
            { value: "granted", label: "取得済み" },
            { value: "pending", label: "未取得" }
          ]
        }
      ],
      defaultState: { permit: "pending" },
      evaluate: function(state){
        if(state.permit === "granted"){
          return {
            win: true,
            headline: "適法（ゲート開放）",
            reason: "開発許可・建築確認等を受けた後であれば、広告を開始できます。"
          };
        }
        return {
          win: false,
          headline: "違法（ゲート封鎖中）",
          reason: "必要な許可・確認を受ける前の広告は禁止されています。「予定」と明記しても解消されません。"
        };
      }
    }
  },

  {
    id: 6,
    category: "37条書面",
    title: "ケース06：検査票と納品書の順序",
    caseText:
      "業者Jは、買主Kとの売買契約が成立した直後に[[37条書面の交付タイミング]]に従って契約書面（37条書面）を交付した。" +
      "重要事項説明（35条書面）は、この契約の締結前にすでに行われている。",
    question: "この37条書面の交付タイミングは適法か。",
    choices: [
      "適法である。37条書面は契約成立後に交付するものであり、35条書面（契約前）とは順序が異なる。",
      "違法である。37条書面も契約締結前に交付しなければならない。",
      "違法である。37条書面と35条書面は同時に交付しなければならない。",
      "適法である。ただし37条書面は契約成立から1か月以内であればいつでもよい。"
    ],
    answerIndex: 0,
    relatedTerms: ["37条書面の交付タイミング", "重要事項説明"],
    explanation:
      "重要事項説明（35条書面）は契約締結前、契約書面（37条書面）は契約成立後に交付するという順序が決まっています。" +
      "本ケースはこの順序どおりなので適法です。35条書面と37条書面のタイミングを混同するのが頻出のひっかけです。",
    branchLab: {
      intro: "35条書面と37条書面、それぞれの交付タイミングを切り替えて順序の正誤を確かめよう。",
      levers: [
        {
          key: "doc35",
          label: "35条書面（重要事項説明）",
          options: [
            { value: "before", label: "契約締結前に実施" },
            { value: "after", label: "契約締結後に実施" }
          ]
        },
        {
          key: "doc37",
          label: "37条書面（契約書面）",
          options: [
            { value: "after", label: "契約成立後に交付" },
            { value: "before", label: "契約成立前に交付" }
          ]
        }
      ],
      defaultState: { doc35: "before", doc37: "after" },
      evaluate: function(state){
        if(state.doc35 === "before" && state.doc37 === "after"){
          return {
            win: true,
            headline: "適法（正しい順序）",
            reason: "35条書面は契約前、37条書面は契約後という正しい順序が守られています。"
          };
        }
        return {
          win: false,
          headline: "違法（順序が崩れている）",
          reason: "35条書面は必ず契約前、37条書面は契約成立後でなければなりません。順序が逆転すると違法になります。"
        };
      }
    }
  },

  {
    id: 7,
    category: "8種制限",
    title: "ケース07：まだ倉庫にない部品",
    caseText:
      "業者Lは、まだ自己の所有になっていない（取得していない）甲地について、これを取得する契約も結んでいない状態で、" +
      "自ら売主として一般person買主Mとの売買契約を締結しようとしている。",
    question: "業者Lは、この売買契約を締結することができるか。",
    choices: [
      "できない。自己の所有に属しない物件は、原則として自ら売主となる売買契約の対象にできない。",
      "できる。業者であればどんな物件でも自由に売買契約を結べる。",
      "できる。買主Mの同意があれば、所有していない物件でも問題ない。",
      "できない。一度でも他人の物件を売買契約の対象にした業者は、免許を取り消される。"
    ],
    answerIndex: 0,
    relatedTerms: ["自己の所有に属しない物件の売買制限"],
    explanation:
      "業者が自ら売主となる場合、原則として自己の所有に属しない物件を売買契約の対象にできません。" +
      "ただし、業者がその物件を取得する契約（予約契約等）を締結しているなど一定の場合は、例外的に売買契約を結ぶことができます。",
    branchLab: {
      intro: "物件の取得状況を切り替えて、出荷リストに載せられる条件を確かめよう。",
      levers: [
        {
          key: "status",
          label: "物件の取得状況",
          options: [
            { value: "owned", label: "すでに取得済み" },
            { value: "contracted", label: "取得する契約を締結済み" },
            { value: "none", label: "何の契約もない" }
          ]
        }
      ],
      defaultState: { status: "none" },
      evaluate: function(state){
        if(state.status === "none"){
          return {
            win: false,
            headline: "売買契約を締結できない",
            reason: "取得の見込みを示す契約すらない場合、自己の所有に属しない物件として売買契約の対象にできません。"
          };
        }
        return {
          win: true,
          headline: "売買契約を締結できる",
          reason: "すでに取得済み、または取得する契約を締結済みであれば、例外的に売買契約の対象にできます。"
        };
      }
    }
  },

  {
    id: 8,
    category: "8種制限",
    title: "ケース08：違約金メーターの上限ゲージ",
    caseText:
      "業者Nは自ら売主となり、買主との間で代金2000万円の売買契約を締結する際、" +
      "[[損害賠償額の予定]]と違約金の合計額を700万円（代金の3割5分）と定めた。",
    question: "この特約は有効か。",
    choices: [
      "代金の2割を超える部分（300万円分）が無効になる。",
      "全額有効である。当事者間の合意である以上、金額に上限はない。",
      "全額無効になる。損害賠償額の予定はそもそも業者が自ら売主の場合は禁止されている。",
      "代金の2割を超える部分も含めて、買主が同意していれば有効である。"
    ],
    answerIndex: 0,
    relatedTerms: ["損害賠償額の予定", "手付金の制限"],
    explanation:
      "業者が自ら売主となる場合、損害賠償額の予定と違約金を合計しても代金の2割を超える定めをすることはできません。" +
      "2割を超える部分は無効になります。本ケースでは代金の2割＝400万円が上限なので、超える300万円分が無効です。",
    branchLab: {
      intro: "予定額の割合を切り替えて、上限ゲージがどこで作動するか確かめよう。",
      levers: [
        {
          key: "ratio",
          label: "損害賠償額の予定＋違約金の割合",
          options: [
            { value: "within20", label: "2割以下" },
            { value: "over20", label: "2割を超える" }
          ]
        }
      ],
      defaultState: { ratio: "over20" },
      evaluate: function(state){
        if(state.ratio === "within20"){
          return {
            win: true,
            headline: "全額有効（上限ゲージ内）",
            reason: "代金の2割以下であれば、損害賠償額の予定・違約金の特約は全額有効です。"
          };
        }
        return {
          win: false,
          headline: "超える部分が無効（上限ゲージを超過）",
          reason: "代金の2割を超える部分は無効になります。手付金の制限と同じ「2割」基準が、ここでは違約金に適用されます。"
        };
      }
    }
  },

  {
    id: 9,
    category: "媒介報酬",
    title: "ケース09：自動で切り替わる報酬メーター",
    caseText:
      "業者Oは、代金300万円の売買の媒介をし、依頼者から[[媒介報酬の限度額]]に従って報酬を受け取ろうとしている。",
    question: "300万円という代金の額は、報酬の速算法における料率にどう影響するか。",
    choices: [
      "200万円超400万円以下の部分には、200万円以下の部分より低い料率が適用される。",
      "代金の額にかかわらず、常に同じ料率が適用される。",
      "300万円を超えているため、報酬は受け取れない。",
      "代金が400万円を超えるまでは、報酬の上限は設定されていない。"
    ],
    answerIndex: 0,
    relatedTerms: ["媒介報酬の限度額"],
    explanation:
      "媒介報酬の限度額は、代金の額を段階（200万円以下・200万円超400万円以下・400万円超）に分けた速算法で計算され、" +
      "金額が大きい段階ほど料率（上乗せ分）は低く設定されています。これにより高額になるほど報酬総額の増え方が緩やかになります。",
    branchLab: {
      intro: "代金の額を切り替えて、報酬メーターの段階がどう切り替わるか確かめよう。",
      levers: [
        {
          key: "price",
          label: "売買代金の額",
          options: [
            { value: "low", label: "200万円以下" },
            { value: "mid", label: "200万円超400万円以下" },
            { value: "high", label: "400万円超" }
          ]
        }
      ],
      defaultState: { price: "mid" },
      evaluate: function(state){
        if(state.price === "low"){
          return {
            win: "contest",
            headline: "速算法：代金×5%が上限",
            reason: "200万円以下の部分には最も高い料率（5%）が適用されます。"
          };
        }
        if(state.price === "mid"){
          return {
            win: "contest",
            headline: "速算法：代金×4%＋2万円が上限",
            reason: "200万円超400万円以下の部分には、低めの料率（4%＋調整額）が適用されます。"
          };
        }
        return {
          win: "contest",
          headline: "速算法：代金×3%＋6万円が上限",
          reason: "400万円を超える部分には、さらに低い料率（3%＋調整額）が適用されます。"
        };
      }
    }
  },

  {
    id: 10,
    category: "事務所の規制",
    title: "ケース10：配置基準メーターの不足",
    caseText:
      "業者Pの事務所には従業者が10名いるが、[[専任の宅地建物取引士の設置基準]]に基づく専任の宅地建物取引士は1名しか置かれていない。",
    question: "この事務所の専任の宅地建物取引士の設置数は、基準を満たしているか。",
    choices: [
      "満たしていない。従業者5名につき専任の宅地建物取引士1名以上が必要であり、10名なら2名以上必要である。",
      "満たしている。専任の宅地建物取引士は事務所に1名いれば、従業者数に関係なく問題ない。",
      "満たしていない。専任の宅地建物取引士は従業者と同数必要である。",
      "満たしている。専任の宅地建物取引士の人数に法律上の基準はない。"
    ],
    answerIndex: 0,
    relatedTerms: ["専任の宅地建物取引士の設置基準", "専任の宅地建物取引士"],
    explanation:
      "事務所には、従業者5名に対して専任の宅地建物取引士1名以上の割合での設置が必要です。" +
      "従業者10名の事務所であれば、専任の宅地建物取引士は2名以上必要であり、1名では基準を満たしません。",
    branchLab: {
      intro: "従業者数と専任宅建士の人数を切り替えて、配置基準メーターの充足を確かめよう。",
      levers: [
        {
          key: "ratio",
          label: "従業者数に対する専任宅建士の比率",
          options: [
            { value: "ok", label: "5人につき1人以上を確保" },
            { value: "short", label: "比率が不足している" }
          ]
        }
      ],
      defaultState: { ratio: "short" },
      evaluate: function(state){
        if(state.ratio === "ok"){
          return {
            win: true,
            headline: "基準を満たしている",
            reason: "従業者5名につき専任の宅地建物取引士1名以上の比率が確保されています。"
          };
        }
        return {
          win: false,
          headline: "基準を満たしていない",
          reason: "比率が不足する場合、基準を満たすまで専任の宅地建物取引士を増員する必要があります。"
        };
      }
    }
  }

];

if (typeof window !== 'undefined') {
  window.FIELDS = window.FIELDS || {};
  window.FIELDS.gyoho = window.FIELDS.gyoho || {};
  window.FIELDS.gyoho.questions = QUESTIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTIONS;
}
})();
