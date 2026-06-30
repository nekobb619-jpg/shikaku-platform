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
  },

  {
    id: 6,
    category: "建築基準法",
    title: "ケース06：住居系ラインの製品制限",
    caseText:
      "Fは、第一種低層住居専用地域に指定されている敷地に、大規模な工場を建てようとしている。",
    question: "Fはこの[[用途地域]]に工場を建築することができるか。",
    choices: [
      "できない。第一種低層住居専用地域では、原則として住宅以外の大規模な用途の建築物は建てられない。",
      "できる。用途地域は容積率・建蔽率のみを規制するもので、建物の用途は制限しない。",
      "できる。工場であっても、住宅と同じ高さ以内であれば建築できる。",
      "できない。住居専用地域では、いかなる建築物も新たに建てられない。"
    ],
    answerIndex: 0,
    relatedTerms: ["用途地域"],
    explanation:
      "用途地域は、地域ごとに建築できる建物の用途を制限する制度です。第一種低層住居専用地域は住宅を中心とした低層の住環境を守るための地域指定であり、" +
      "大規模な工場のような用途は原則建築できません。",
    branchLab: {
      intro: "用途地域の種類と建てたい建物の種類を切り替えて、製品ライン制限を確かめよう。",
      levers: [
        {
          key: "zone",
          label: "用途地域",
          options: [
            { value: "residential", label: "第一種低層住居専用地域" },
            { value: "industrial", label: "工業専用地域" }
          ]
        },
        {
          key: "building",
          label: "建てたい建物",
          options: [
            { value: "house", label: "住宅" },
            { value: "factory", label: "大規模工場" }
          ]
        }
      ],
      defaultState: { zone: "residential", building: "factory" },
      evaluate: function(state){
        if(state.zone === "residential"){
          if(state.building === "house"){
            return { win: true, headline: "建築できる", reason: "第一種低層住居専用地域は住宅を中心とした用途を前提としています。" };
          }
          return { win: false, headline: "建築できない", reason: "住居専用地域では大規模工場のような用途は原則建築できません。" };
        }
        if(state.building === "factory"){
          return { win: true, headline: "建築できる", reason: "工業専用地域は工場の建築を前提とした地域指定です。" };
        }
        return { win: false, headline: "建築できない", reason: "工業専用地域では住宅を建てることが原則できません。" };
      }
    }
  },

  {
    id: 7,
    category: "国土利用計画法",
    title: "ケース07：事後報告ラインの面積基準",
    caseText:
      "Gは、市街化区域内にある2500㎡の土地を、売買によりHから取得した。",
    question: "Gは、[[国土利用計画法の届出]]を行う必要があるか。",
    choices: [
      "必要である。市街化区域では2000㎡以上の土地の対価を伴う取引について、契約後に事後届出が必要である。",
      "不要である。市街化区域内の取引には届出制度自体が適用されない。",
      "必要である。ただし届出は契約締結前に行わなければならない。",
      "不要である。2500㎡程度の規模では届出の対象にならない。"
    ],
    answerIndex: 0,
    relatedTerms: ["国土利用計画法の届出"],
    explanation:
      "国土利用計画法では、市街化区域内で2000㎡以上の土地について対価を伴う取引をした場合、契約締結後2週間以内に事後届出を行う必要があります。" +
      "本ケースは2500㎡で基準を超えているため届出が必要です。",
    branchLab: {
      intro: "面積と取得の方法を切り替えて、事後報告ラインの対象になるか確かめよう。",
      levers: [
        {
          key: "area",
          label: "取得した面積（市街化区域内）",
          options: [
            { value: "small", label: "2000㎡未満" },
            { value: "large", label: "2000㎡以上" }
          ]
        },
        {
          key: "method",
          label: "取得の方法",
          options: [
            { value: "paid", label: "売買等の対価を伴う契約" },
            { value: "free", label: "贈与・相続など対価を伴わない取得" }
          ]
        }
      ],
      defaultState: { area: "large", method: "paid" },
      evaluate: function(state){
        if(state.method === "free"){
          return { win: false, headline: "届出は不要", reason: "対価を伴わない取得（贈与・相続等）はそもそも届出の対象になりません。" };
        }
        if(state.area === "large"){
          return { win: true, headline: "事後届出が必要", reason: "市街化区域内で2000㎡以上の対価を伴う取引には、契約後の事後届出が必要です。" };
        }
        return { win: false, headline: "届出は不要", reason: "市街化区域内でも2000㎡未満であれば、面積基準に達せず届出は不要です。" };
      }
    }
  },

  {
    id: 8,
    category: "宅地造成等規制法",
    title: "ケース08：盛土の高さゲート",
    caseText:
      "Iは、宅地造成等工事規制区域内で、高さ2mの崖を生じる盛土を行おうとしている。",
    question: "Iはこの工事について、[[宅地造成等規制法の許可]]を受ける必要があるか。",
    choices: [
      "必要である。一定の高さを超える崖を生じる盛土・切土には、都道府県知事等の許可が必要である。",
      "不要である。盛土・切土の工事には、そもそも許可制度が存在しない。",
      "必要である。ただし造成後に事後申請をすれば足りる。",
      "不要である。規制区域内でも個人が行う工事には許可は不要である。"
    ],
    answerIndex: 0,
    relatedTerms: ["宅地造成等規制法の許可"],
    explanation:
      "宅地造成等工事規制区域内で、一定の高さを超える崖を生じる盛土・切土等を行う場合は、工事に着手する前に都道府県知事等の許可を受ける必要があります。",
    branchLab: {
      intro: "盛土・切土で生じる崖の高さを切り替えて、許可ゲートが作動する条件を確かめよう。",
      levers: [
        {
          key: "height",
          label: "生じる崖の高さ",
          options: [
            { value: "low", label: "基準未満の小規模" },
            { value: "high", label: "基準を超える規模" }
          ]
        }
      ],
      defaultState: { height: "high" },
      evaluate: function(state){
        if(state.height === "high"){
          return { win: false, headline: "許可が必要（ゲート作動）", reason: "一定の高さを超える崖を生じる工事には、着手前に許可が必要です。" };
        }
        return { win: true, headline: "許可は不要（ゲート非作動）", reason: "基準未満の小規模な工事であれば、許可なく行うことができます。" };
      }
    }
  },

  {
    id: 9,
    category: "建築基準法",
    title: "ケース09：増築のゲート素通り条件",
    caseText:
      "Jは、防火地域・準防火地域に指定されていない地域で、既存住宅に8㎡の増築を行おうとしている。",
    question: "この増築について、[[建築確認]]を受ける必要があるか。",
    choices: [
      "不要である。防火地域・準防火地域外で10㎡以下の増築は、建築確認を受けずに行える特例がある。",
      "必要である。増築の規模を問わず、常に建築確認を受けなければならない。",
      "不要である。住宅の増築には、地域を問わず建築確認は一切不要である。",
      "必要である。防火地域・準防火地域外では、面積に関係なく確認が必須である。"
    ],
    answerIndex: 0,
    relatedTerms: ["建築確認"],
    explanation:
      "防火地域・準防火地域外で10㎡以下の増築・改築・移転については、建築確認を受けずに行える特例があります。" +
      "これに対し、防火地域・準防火地域内では規模を問わず建築確認が必要になる点が対照的です。",
    branchLab: {
      intro: "地域と増築の規模を切り替えて、確認ゲートを素通りできる条件を確かめよう。",
      levers: [
        {
          key: "zone",
          label: "地域",
          options: [
            { value: "outside", label: "防火・準防火地域外" },
            { value: "inside", label: "防火・準防火地域内" }
          ]
        },
        {
          key: "scale",
          label: "増築の規模",
          options: [
            { value: "small", label: "10㎡以下" },
            { value: "large", label: "10㎡超" }
          ]
        }
      ],
      defaultState: { zone: "outside", scale: "small" },
      evaluate: function(state){
        if(state.zone === "inside"){
          return { win: false, headline: "建築確認が必要（規模を問わない）", reason: "防火地域・準防火地域内では、増築の規模にかかわらず建築確認が必要です。" };
        }
        if(state.scale === "small"){
          return { win: true, headline: "建築確認は不要（ゲート素通り）", reason: "防火・準防火地域外で10㎡以下の増築は、確認なしで行える特例があります。" };
        }
        return { win: false, headline: "建築確認が必要", reason: "10㎡を超える増築は、地域外であっても建築確認が必要です。" };
      }
    }
  },

  {
    id: 10,
    category: "土地区画整理法",
    title: "ケース10：旧ラインから新ラインへの切り替え",
    caseText:
      "Kの所有する土地について、土地区画整理事業の[[仮換地]]が指定された。指定後、Kは従前の土地をこれまでどおり使用したいと考えている。",
    question: "Kは、仮換地指定後も従前の土地を使用・収益できるか。",
    choices: [
      "できない。仮換地指定後は、従前の土地ではなく仮換地を使用・収益することになる。",
      "できる。仮換地が指定されても、換地処分まで従前の土地の使用権は維持される。",
      "できる。ただし仮換地と従前の土地の両方を同時に使用できる。",
      "できない。仮換地指定後は、いかなる土地も使用できなくなる。"
    ],
    answerIndex: 0,
    relatedTerms: ["仮換地"],
    explanation:
      "仮換地が指定されると、その効力発生の日から、従前の土地について使用し収益する権利がなくなり、仮換地を使用・収益することになります。" +
      "新ラインへの切り替えスイッチが入った瞬間に旧ラインが止まるイメージです。",
    branchLab: {
      intro: "仮換地指定の前後を切り替えて、使用権の切り替えスイッチを確かめよう。",
      levers: [
        {
          key: "timing",
          label: "仮換地指定の状況",
          options: [
            { value: "before", label: "指定前" },
            { value: "after", label: "指定後" }
          ]
        }
      ],
      defaultState: { timing: "after" },
      evaluate: function(state){
        if(state.timing === "before"){
          return { win: true, headline: "従前の土地を使用できる", reason: "仮換地の指定前は、従前の土地をそのまま使用・収益できます。" };
        }
        return { win: false, headline: "従前の土地は使用できない（仮換地に切り替わる）", reason: "仮換地指定後は、従前の土地の使用権がなくなり、仮換地を使用・収益することになります。" };
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
