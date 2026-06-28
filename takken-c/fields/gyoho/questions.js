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
