(function(){
/* ============================================================
   houserei-questions.js — 法令上の制限 ケーススタディ問題データ
   ============================================================ */

const QUESTIONS = [

  {
    id: 1,
    category: "建築基準法",
    title: "ケース01：4mゲートの進入路",
    caseText:
      "Aは、幅3m（4m未満）の道路にのみ接する土地に建物を建てようとしている。この道路は、" +
      "特定行政庁の指定を受けた[[2項道路]]であり、道路の中心線から2m後退する線を道路境界線とみなす" +
      "セットバックの手続きはまだ行っていない。",
    question: "Aは現状のまま、建築確認を受けて建物を建てることができるか。",
    choices: [
      "できる。2項道路の指定があれば、セットバックの有無を問わず建築できる。",
      "できない。2項道路の指定を受けていても、現状のセットバックが未了では[[接道義務]]を満たさない。",
      "できる。道路幅が4m未満でも、接道義務はそもそも要求されない。",
      "できない。2項道路の指定がある道路では、いかなる場合も建築できない。"
    ],
    answerIndex: 1,
    relatedTerms: ["接道義務", "2項道路"],
    explanation:
      "2項道路の指定は、将来的に道路の中心線から2m後退（セットバック）することを前提に道路とみなす特例です。" +
      "セットバックの手続きが済んでいない現状では、接道義務を満たす道路境界線が確定しておらず、そのままでは建築確認を受けられません。",
    branchLab: {
      intro: "道路幅とセットバックの状況を切り替えて、建築できる条件を確かめよう。",
      levers: [
        {
          key: "width",
          label: "前面道路の幅",
          options: [
            { value: "wide", label: "4m以上" },
            { value: "narrow", label: "4m未満" }
          ]
        },
        {
          key: "setback",
          label: "2項道路のセットバック",
          options: [
            { value: "none", label: "指定なし／未実施" },
            { value: "done", label: "指定あり・実施済み" }
          ]
        }
      ],
      defaultState: { width: "narrow", setback: "none" },
      evaluate: function(state){
        if(state.width === "wide"){
          return {
            win: true,
            headline: "建築できる（通常の道路で接道義務を満たす）",
            reason: "前面道路の幅が4m以上あれば、通常の接道義務を満たし、建築確認を受けられます。"
          };
        }
        if(state.setback === "done"){
          return {
            win: true,
            headline: "建築できる（2項道路のセットバック完了）",
            reason: "2項道路の指定を受け、中心線から2m後退したセットバックが完了していれば、その線が道路境界線とみなされ建築できます。"
          };
        }
        return {
          win: false,
          headline: "建築できない（接道義務を満たさない）",
          reason: "道路幅が4m未満で、2項道路としてのセットバックも未了の場合、接道義務を満たす道路境界線が確定していません。"
        };
      }
    }
  },

  {
    id: 2,
    category: "建築基準法",
    title: "ケース02：道路幅というセーブポイント",
    caseText:
      "指定容積率400%の住居系地域にある土地で、前面道路の幅は6mである。",
    question: "この土地に実際に適用される容積率は、指定された400%のままか。",
    choices: [
      "400%のまま適用される。指定容積率は前面道路の幅に関係なく常に適用される。",
      "240%に制限される。前面道路幅が12m未満の場合、道路幅×係数と指定容積率の低い方が適用される。",
      "400%のまま適用される。前面道路幅による制限は商業系地域にのみ適用される。",
      "0%になる。前面道路幅が12m未満の土地には一切建築できない。"
    ],
    answerIndex: 1,
    relatedTerms: ["容積率", "前面道路幅による容積率制限"],
    explanation:
      "前面道路の幅が12m未満の場合、道路幅に係数（住居系は0.4）を掛けた値と指定容積率のうち、低い方が適用されます。" +
      "本ケースでは6m×0.4＝240%となり、指定の400%より低いため、240%が上限となります。",
    branchLab: {
      intro: "前面道路の幅と用途地域の系統を切り替えて、適用される容積率を測ってみよう。",
      levers: [
        {
          key: "width",
          label: "前面道路の幅",
          options: [
            { value: "wide", label: "12m以上" },
            { value: "narrow", label: "12m未満（6m）" }
          ]
        },
        {
          key: "useType",
          label: "用途地域の系統",
          options: [
            { value: "residential", label: "住居系（係数0.4）" },
            { value: "other", label: "その他系（係数0.6）" }
          ]
        }
      ],
      defaultState: { width: "narrow", useType: "residential" },
      evaluate: function(state){
        if(state.width === "wide"){
          return {
            win: true,
            headline: "指定容積率400%のまま適用される",
            reason: "前面道路の幅が12m以上あれば、道路幅による制限は適用されず、指定容積率がそのまま使えます。"
          };
        }
        if(state.useType === "residential"){
          return {
            win: false,
            headline: "240%に制限される（6m×0.4）",
            reason: "住居系地域では係数0.4を使用します。6m×0.4＝240%が指定の400%より低いため、240%が上限になります。"
          };
        }
        return {
          win: false,
          headline: "360%に制限される（6m×0.6）",
          reason: "その他系地域では係数0.6を使用します。6m×0.6＝360%が指定の400%より低いため、360%が上限になります。"
        };
      }
    }
  },

  {
    id: 3,
    category: "建築基準法",
    title: "ケース03：足跡ゲージのロック解除",
    caseText:
      "建蔽率80%・[[防火地域]]に指定された地域に、Bは耐火建築物を建てようとしている。",
    question: "この建物について、建蔽率の制限はどうなるか。",
    choices: [
      "建蔽率の制限がなくなる（実質100%まで建築可能）。",
      "指定どおり80%が上限のままで変わらない。",
      "70%に引き下げられる。",
      "防火地域では耐火建築物自体が建築できない。"
    ],
    answerIndex: 0,
    relatedTerms: ["建蔽率", "防火地域の建蔽率緩和"],
    explanation:
      "防火地域内で耐火建築物を建てる場合、建蔽率の制限に10%が加算されます。" +
      "指定建蔽率がもともと80%の地域では、この加算によって建蔽率の制限自体がなくなり、実質100%まで建築できます。",
    branchLab: {
      intro: "指定建蔽率と地域・建築物の組み合わせを切り替えて、緩和の効き方を確かめよう。",
      levers: [
        {
          key: "baseRate",
          label: "指定建蔽率",
          options: [
            { value: "80", label: "80%" },
            { value: "60", label: "60%" }
          ]
        },
        {
          key: "condition",
          label: "地域・建築物の組み合わせ",
          options: [
            { value: "qualify", label: "防火地域＋耐火建築物" },
            { value: "notqualify", label: "それ以外" }
          ]
        }
      ],
      defaultState: { baseRate: "80", condition: "qualify" },
      evaluate: function(state){
        if(state.condition === "notqualify"){
          return {
            win: false,
            headline: "指定建蔽率のまま（緩和なし）",
            reason: "防火地域内の耐火建築物という組み合わせでなければ、緩和は適用されず指定どおりの建蔽率が上限です。"
          };
        }
        if(state.baseRate === "80"){
          return {
            win: true,
            headline: "建蔽率の制限なし（実質100%）",
            reason: "指定建蔽率80%の地域で防火地域内の耐火建築物を建てる場合、10%加算により制限自体がなくなります。"
          };
        }
        return {
          win: true,
          headline: "70%に緩和される（60%+10%）",
          reason: "指定建蔽率60%の地域でも、防火地域内の耐火建築物であれば10%加算され、上限が70%に緩和されます。"
        };
      }
    }
  },

  {
    id: 4,
    category: "都市計画法",
    title: "ケース04：許可ゲートの作動条件",
    caseText:
      "Cは、[[市街化調整区域]]内で、2000㎡の規模の宅地分譲を目的とした開発行為（土地の区画形質の変更）を行おうとしている。",
    question: "Cは開発許可を受ける必要があるか。",
    choices: [
      "必要である。市街化調整区域では、規模を問わず原則として開発許可が必要になる。",
      "不要である。2000㎡程度の規模であれば、区域を問わず許可は不要である。",
      "必要である。ただし[[市街化区域]]に変更すれば不要になる。",
      "不要である。宅地分譲目的の開発行為は常に許可の対象外である。"
    ],
    answerIndex: 0,
    relatedTerms: ["市街化調整区域", "市街化区域", "開発許可"],
    explanation:
      "市街化調整区域では、市街化を抑制する方針のため、規模を問わず原則として開発許可が必要です。" +
      "これに対し市街化区域では、1000㎡未満などの小規模な開発行為であれば許可が不要になる点が対照的です。",
    branchLab: {
      intro: "区域と開発の規模を切り替えて、許可ゲートが作動する条件を確かめよう。",
      levers: [
        {
          key: "zone",
          label: "区域",
          options: [
            { value: "control", label: "市街化調整区域" },
            { value: "urban", label: "市街化区域" }
          ]
        },
        {
          key: "scale",
          label: "開発行為の規模",
          options: [
            { value: "small", label: "1000㎡未満（小規模）" },
            { value: "large", label: "1000㎡以上" }
          ]
        }
      ],
      defaultState: { zone: "control", scale: "large" },
      evaluate: function(state){
        if(state.zone === "control"){
          return {
            win: false,
            headline: "開発許可が必要（規模を問わない）",
            reason: "市街化調整区域では、市街化を抑制するため、規模にかかわらず原則として開発許可が必要です。"
          };
        }
        if(state.scale === "small"){
          return {
            win: true,
            headline: "開発許可は不要（小規模）",
            reason: "市街化区域内で1000㎡未満の小規模な開発行為であれば、開発許可は不要です。"
          };
        }
        return {
          win: false,
          headline: "開発許可が必要（一定規模以上）",
          reason: "市街化区域内でも、1000㎡以上の開発行為には開発許可が必要です。"
        };
      }
    }
  },

  {
    id: 5,
    category: "農地法",
    title: "ケース05：複合許可証の簡易ゲート",
    caseText:
      "Dは、[[市街化区域]]内にある自己所有の農地を、宅地に転用する目的でEに売却しようとしている。",
    question: "この売買において、Dはどの手続きを行う必要があるか。",
    choices: [
      "農業委員会への届出で足りる（[[農地法5条許可]]は不要）。",
      "都道府県知事等の5条許可を受ける必要がある。",
      "[[農地法3条許可]]を受ける必要がある（転用ではなく権利移動として扱われる）。",
      "区域を問わず、いかなる手続きも不要である。"
    ],
    answerIndex: 0,
    relatedTerms: ["農地法5条許可", "市街化区域", "農地法3条許可"],
    explanation:
      "農地を転用目的で売買する場合、原則として5条許可（都道府県知事等の許可）が必要です。" +
      "ただし市街化区域内では特例があり、あらかじめ農業委員会に届け出れば、5条許可は不要になります。",
    branchLab: {
      intro: "区域と転用の有無を切り替えて、どの許可・届出が必要になるか確かめよう。",
      levers: [
        {
          key: "zone",
          label: "区域",
          options: [
            { value: "urban", label: "市街化区域内" },
            { value: "outside", label: "市街化区域外" }
          ]
        },
        {
          key: "convert",
          label: "転用の有無",
          options: [
            { value: "yes", label: "転用目的で売買" },
            { value: "no", label: "農地のまま売買" }
          ]
        }
      ],
      defaultState: { zone: "urban", convert: "yes" },
      evaluate: function(state){
        if(state.convert === "no"){
          return {
            win: "contest",
            headline: "農地法3条許可が必要（区域を問わない）",
            reason: "農地のまま権利だけを移動する場合は、転用の有無に関する区域特例は関係なく、3条許可（農業委員会）が必要です。"
          };
        }
        if(state.zone === "urban"){
          return {
            win: true,
            headline: "5条許可は不要（農業委員会への届出で足りる）",
            reason: "市街化区域内での転用目的の売買には特例があり、あらかじめ届け出れば5条許可は不要になります。"
          };
        }
        return {
          win: false,
          headline: "5条許可が必要",
          reason: "市街化区域外での転用目的の売買には特例が適用されず、原則どおり都道府県知事等の5条許可が必要です。"
        };
      }
    }
  }

];

if (typeof window !== 'undefined') {
  window.FIELDS = window.FIELDS || {};
  window.FIELDS.houserei = window.FIELDS.houserei || {};
  window.FIELDS.houserei.questions = QUESTIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTIONS;
}
})();
