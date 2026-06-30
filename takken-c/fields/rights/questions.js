(function(){
/* ============================================================
   questions.js — 宅建ケーススタディ問題データ
   caseText 内の [[用語]] は terms.js のキーと対応し、
   index.html 側のレンダラーがクリック可能な分析対象に変換する。
   ============================================================ */

const QUESTIONS = [

  {
    id: 1,
    category: "意思表示",
    title: "ケース01：嘘の売買契約",
    caseText:
      "Aは自分の土地を所有しているが、本気で売る気はないのに、税金対策のためBと示し合わせ、" +
      "[[通謀虚偽表示]]によってBに売却する契約書を作成した。その後、事情を知らないCが、" +
      "Bからこの土地を購入した。CはAB間の事情について[[善意]]であった。",
    question: "AはCに対して、AB間の売買は無効であると主張できるか。",
    choices: [
      "主張できる。虚偽表示は誰に対しても無効である。",
      "主張できない。善意の第三者Cには、AB間の無効を対抗できない。",
      "主張できない。虚偽表示は取消の対象であり、無効ではないため。",
      "主張できる。Cが善意でも不動産の場合は保護されない。"
    ],
    answerIndex: 1,
    relatedTerms: ["通謀虚偽表示", "善意", "対抗できない", "善意の第三者"],
    explanation:
      "通謀虚偽表示は当事者間（A・B間）では無効ですが、民法94条2項により、" +
      "その無効を「善意の第三者」に対抗することはできません。Cは事情を知らない善意の第三者なので、" +
      "AはCに対してAB間の無効を主張できず、Cは土地の権利を取得します。",
    branchLab: {
      intro: "Cの認識（善意／悪意）を切り替えると、結論はどう変わるか試してみよう。",
      levers: [
        {
          key: "knowledge",
          label: "Cの認識（AB間が嘘の契約だったことについて）",
          options: [
            { value: "good", label: "善意（知らなかった）" },
            { value: "bad", label: "悪意（知っていた）" }
          ]
        }
      ],
      defaultState: { knowledge: "good" },
      evaluate: function(state){
        if(state.knowledge === "good"){
          return {
            win: false,
            headline: "Aは対抗できない → Cが土地を取得する",
            reason: "善意の第三者には、虚偽表示の無効を対抗できません（94条2項）。Cの過失の有無は問われません。"
          };
        }
        return {
          win: true,
          headline: "Aは対抗できる → AB間の無効をCにも主張できる",
          reason: "Cが事情を知っていた（悪意）なら保護する必要がなく、Aは無効を押し通せます。"
        };
      }
    }
  },

  {
    id: 2,
    category: "意思表示",
    title: "ケース02：騙されて売った土地",
    caseText:
      "Aは、Bにだまされて（[[詐欺]]）、本来売る気のなかった自分の土地をBに売却した。" +
      "Aはこの契約を[[取消]]したいと考えている。その後、Bはこの事情を知らないCに土地を転売してしまった。" +
      "CはAB間の詐欺について[[善意]]かつ[[過失]]なく取引をしていた。",
    question: "Aは取消によって、Cから土地を取り戻すことができるか。",
    choices: [
      "取り戻せる。詐欺による取消は誰に対しても主張できる。",
      "取り戻せない。詐欺による取消前に現れた善意無過失の第三者には対抗できない。",
      "取り戻せない。詐欺はそもそも無効であり取消の余地がないため。",
      "取り戻せる。不動産取引では善意の第三者保護は適用されない。"
    ],
    answerIndex: 1,
    relatedTerms: ["詐欺", "取消", "善意", "過失"],
    explanation:
      "詐欺による意思表示は取消すことができますが、民法96条3項により、" +
      "取消前に現れた善意無過失の第三者には、その取消を対抗できません。" +
      "Cは善意無過失なので保護され、Aは土地を取り戻せません。" +
      "なお、強迫による取消の場合は善意の第三者にも対抗できる点が詐欺との大きな違いです。",
    branchLab: {
      intro: "「詐欺／強迫」「タイミング」「Cの状態」を切り替えて、ひっかけの分岐を体感しよう。",
      levers: [
        {
          key: "cause",
          label: "原因",
          options: [
            { value: "fraud", label: "詐欺" },
            { value: "duress", label: "強迫" }
          ]
        },
        {
          key: "timing",
          label: "Cが現れたタイミング",
          options: [
            { value: "before", label: "取消の前" },
            { value: "after", label: "取消の後" }
          ]
        },
        {
          key: "state",
          label: "Cの状態",
          options: [
            { value: "clean", label: "善意・無過失" },
            { value: "tainted", label: "悪意 または 過失あり" }
          ]
        }
      ],
      defaultState: { cause: "fraud", timing: "before", state: "clean" },
      evaluate: function(state){
        if(state.cause === "duress"){
          return {
            win: true,
            headline: "Aは常にCから取り戻せる（タイミング・Cの状態を問わない）",
            reason: "強迫による取消は、第三者がどんな状態でも、取消の前後を問わず対抗できます。脅された者をより強く保護するためです。"
          };
        }
        if(state.timing === "after"){
          return {
            win: "contest",
            headline: "取消後は「対抗問題」になる（登記の先後で決まる）",
            reason: "取消後に現れた第三者との関係は、無権利者からの二重譲渡と同様に扱われ、先に登記を備えた側が優先します。"
          };
        }
        if(state.state === "clean"){
          return {
            win: false,
            headline: "Aは対抗できない → Cが土地を保持する",
            reason: "詐欺による取消前に現れた善意無過失の第三者には対抗できません（96条3項）。"
          };
        }
        return {
          win: true,
          headline: "Aは対抗できる → 取消の効果をCにも主張できる",
          reason: "Cが悪意または過失ありなら保護されず、Aは取消の効果を押し通せます。"
        };
      }
    }
  },

  {
    id: 3,
    category: "時効",
    title: "ケース03：時効のカウントダウン",
    caseText:
      "Aは、Bに対して持っている100万円の貸金債権について、返済期限から5年が経過した。" +
      "この間、Bからの返済や、Aによる裁判上の請求などの[[更新]]事由は一度も発生していない。" +
      "[[時効]]の完成後、Bは「自分から時効を主張するつもりはない」と考えている。",
    question: "Aの債権は、この時点で消滅しているか。",
    choices: [
      "消滅している。5年経過すれば自動的に債権は消える。",
      "消滅していない。時効が完成しても、Bが[[援用]]しない限り効果は確定しない。",
      "消滅していない。貸金債権の消滅時効は10年なので、まだ完成していない。",
      "消滅している。時効は当事者の意思に関わらず常に自動適用される。"
    ],
    answerIndex: 1,
    relatedTerms: ["時効", "更新", "援用"],
    explanation:
      "消滅時効は、期間が経過しただけでは確定的に効果が生じません。" +
      "時効によって利益を受ける当事者（この場合B）が、その時効を「援用」する意思表示をすることで、" +
      "初めて時効の効果が確定します。Bが援用しない限り、債権は消滅していません。",
    branchLab: {
      intro: "Bが援用するかしないかで、結論はどう変わるか試してみよう。",
      levers: [
        {
          key: "invoke",
          label: "Bの行動",
          options: [
            { value: "yes", label: "援用する" },
            { value: "no", label: "援用しない" }
          ]
        }
      ],
      defaultState: { invoke: "no" },
      evaluate: function(state){
        if(state.invoke === "yes"){
          return {
            win: true,
            headline: "債権は消滅する",
            reason: "援用によって時効の利益を受ける意思が確定し、初めて消滅の効果が生じます。"
          };
        }
        return {
          win: false,
          headline: "債権はまだ消滅していない",
          reason: "時効が完成していても、援用しない限り効果は確定せず、債権はそのまま存続します。"
        };
      }
    }
  },

  {
    id: 4,
    category: "代理",
    title: "ケース04：権限のない代理人",
    caseText:
      "Aは、Bに何の代理権も与えていなかった。しかしBは、Aの代理人を名乗ってCとの間で" +
      "Aの土地の売買契約（[[無権代理]]）を結んでしまった。Cはこの契約は有効に成立すると信じて取引した。",
    question: "この売買契約は、誰の対応によって有効になり得るか。",
    choices: [
      "Cが取消をしない限り、契約は当然に有効である。",
      "Aが事後的に[[追認]]をすれば、契約時点に遡って有効になる。",
      "Bが代理権を持っていたと宣言すれば有効になる。",
      "契約は無効であり、誰の行為によっても有効にはならない。"
    ],
    answerIndex: 1,
    relatedTerms: ["無権代理", "追認"],
    explanation:
      "無権代理行為は、本人が追認するまでは本人に対して効力を生じません（民法113条）。" +
      "本人Aが追認すれば、契約は契約時に遡って有効になります。" +
      "なお追認がない場合、Cは一定の要件のもとでBに責任を追及できる（117条）か、" +
      "表見代理が成立する事情があれば別途Aに対して契約の効力を主張できます。",
    branchLab: {
      intro: "Aが追認するか拒絶するかで、契約の運命がどう変わるか試してみよう。",
      levers: [
        {
          key: "ratify",
          label: "本人Aの対応",
          options: [
            { value: "yes", label: "追認する" },
            { value: "no", label: "追認を拒絶する" }
          ]
        }
      ],
      defaultState: { ratify: "yes" },
      evaluate: function(state){
        if(state.ratify === "yes"){
          return {
            win: true,
            headline: "契約は契約時に遡って有効になる",
            reason: "本人が追認すれば、無権代理行為は最初から有効だったものとして扱われます（113条・116条）。"
          };
        }
        return {
          win: false,
          headline: "契約はAに対して無効のままである",
          reason: "追認を拒絶すれば、本人に契約の効力は生じません。Cは無権代理人Bに責任を追及できる場合があります（117条）。"
        };
      }
    }
  },

  {
    id: 5,
    category: "抵当権",
    title: "ケース05：抵当権のタグ",
    caseText:
      "AはBから1000万円を借りる際、自己所有の建物に[[抵当権]]を設定し、登記をした。" +
      "その後Aは、Bへの借金を完済した。Aの友人Cは「抵当権の登記が残っているなら、" +
      "まだ借金も残っているはずだ」と考えている。",
    question: "Cの考えは正しいか。",
    choices: [
      "正しい。登記が残っていれば抵当権も債権も存続している。",
      "正しくない。抵当権には[[附従性]]があり、債権の消滅とともに抵当権も消滅する。登記の有無とは別問題。",
      "正しい。抵当権は債権と無関係に独立して存続する権利である。",
      "正しくない。抵当権は登記をした時点で債権から完全に独立する。"
    ],
    answerIndex: 1,
    relatedTerms: ["抵当権", "附従性"],
    explanation:
      "抵当権には附従性があり、担保している債権（借金）が消滅すれば、抵当権も自動的に消滅します。" +
      "登記が残っていても、それは単に抹消登記がされていないだけで、実体としての抵当権はすでに消滅しています。" +
      "ただしCのような第三者に明確に対抗するためには、Aは抵当権抹消登記をしておくべきです。",
    branchLab: {
      intro: "債権（借金）の状態を切り替えると、抵当権の運命はどう変わるか試してみよう。",
      levers: [
        {
          key: "debt",
          label: "債権（借金）の状態",
          options: [
            { value: "remaining", label: "まだ残っている" },
            { value: "paidoff", label: "完済した" }
          ]
        }
      ],
      defaultState: { debt: "remaining" },
      evaluate: function(state){
        if(state.debt === "remaining"){
          return {
            win: true,
            headline: "抵当権は存続している",
            reason: "附従性により、抵当権は担保している債権の存在に従います。債権が残っている限り抵当権も存続します。"
          };
        }
        return {
          win: false,
          headline: "抵当権は消滅している（登記の有無は無関係）",
          reason: "債権が消滅すれば、附従性により抵当権も自動的に消滅します。登記が残っているのは単に抹消手続き未了というだけです。"
        };
      }
    }
  },

  {
    id: 6,
    category: "物権変動",
    title: "ケース06：二重譲渡の早押し勝負",
    caseText:
      "Aは自己所有の土地を、まずBに売却し、その後同じ土地をCにも売却した（二重譲渡）。" +
      "Bはまだ登記をしていないが、Cは先に所有権移転登記を済ませた。",
    question: "この土地の所有権を、BとCのどちらが優先して主張できるか。",
    choices: [
      "Cが優先する。先に登記を備えた者が、第三者に対して所有権を対抗できる。",
      "Bが優先する。先に売買契約を締結した者が常に優先する。",
      "Bが優先する。Aから見て最初の買主であるBに、土地は確定的に帰属している。",
      "BとCが土地を共有することになる。"
    ],
    answerIndex: 0,
    relatedTerms: ["対抗要件", "対抗できない"],
    explanation:
      "不動産の物権変動は、契約の先後ではなく登記の先後で対抗関係が決まります（民法177条）。" +
      "BはAとの契約が先でも登記をしていないため、先に登記を備えたCに対して所有権を主張できません。",
    branchLab: {
      intro: "登記を備える順番を切り替えて、二重譲渡の早押し勝負の結果を確かめよう。",
      levers: [
        {
          key: "registry",
          label: "先に登記を備えたのは誰か",
          options: [
            { value: "first", label: "先に契約したB" },
            { value: "second", label: "後から契約したC" }
          ]
        }
      ],
      defaultState: { registry: "second" },
      evaluate: function(state){
        if(state.registry === "first"){
          return {
            win: true,
            headline: "Bが優先する（先に登記したため）",
            reason: "契約の先後に関係なく、先に登記を備えた者が対抗関係で優先します。"
          };
        }
        return {
          win: false,
          headline: "Cが優先する（先に登記したため）",
          reason: "Bは契約が先でも登記をしていないため、先に登記を備えたCに所有権を対抗できません。"
        };
      }
    }
  },

  {
    id: 7,
    category: "賃貸借",
    title: "ケース07：鍵だけで手に入る通行証",
    caseText:
      "Dは、E所有の建物を賃借し、引渡しを受けて居住している。賃借権の登記はしていない。" +
      "その後、Eはこの建物をFに売却した。",
    question: "Dは、新所有者Fに対して[[賃借権の対抗力]]を主張できるか。",
    choices: [
      "主張できる。建物の引渡しを受けていれば、賃借権の登記がなくても対抗できる。",
      "主張できない。賃借権は登記をしなければ、いかなる場合も対抗できない。",
      "主張できる。ただしFの事前の同意が必要である。",
      "主張できない。建物の賃借権はそもそも対抗力を持たない権利である。"
    ],
    answerIndex: 0,
    relatedTerms: ["賃借権の対抗力", "対抗要件"],
    explanation:
      "不動産の賃借権は原則として登記が対抗要件ですが、建物の賃貸借については、借地借家法により引渡しを受けていれば登記がなくても新所有者に対抗できる特例があります。",
    branchLab: {
      intro: "引渡しの有無を切り替えて、通行証の抜け道が使えるか確かめよう。",
      levers: [
        {
          key: "delivery",
          label: "建物の引渡し状況",
          options: [
            { value: "received", label: "引渡しを受けている" },
            { value: "none", label: "引渡しを受けていない（登記もなし）" }
          ]
        }
      ],
      defaultState: { delivery: "received" },
      evaluate: function(state){
        if(state.delivery === "received"){
          return {
            win: true,
            headline: "対抗できる（引渡しが通行証になる）",
            reason: "建物の賃借権は、引渡しを受けていれば登記がなくても新所有者に対抗できます。"
          };
        }
        return {
          win: false,
          headline: "対抗できない",
          reason: "登記も引渡しもなければ、対抗要件を満たさず新所有者に賃借権を主張できません。"
        };
      }
    }
  },

  {
    id: 8,
    category: "保証",
    title: "ケース08：取り外されたボタン",
    caseText:
      "Gは、Hの債務について[[連帯保証]]人になった。Hが債務を履行しないため、債権者はGに直接全額の請求をした。" +
      "Gは「まずHの財産から執行してほしい」と主張したい。",
    question: "Gはこの主張（[[検索の抗弁権]]）をすることができるか。",
    choices: [
      "できない。連帯保証人には検索の抗弁権がなく、いつでも直接請求に応じなければならない。",
      "できる。すべての保証人は、まず主たる債務者への請求を求める権利を持つ。",
      "できる。ただし裁判所の許可が必要である。",
      "できない。検索の抗弁権はそもそも存在しない制度である。"
    ],
    answerIndex: 0,
    relatedTerms: ["連帯保証", "検索の抗弁権"],
    explanation:
      "単純な保証人には検索の抗弁権（まず主債務者に請求・執行するよう求める権利）がありますが、連帯保証人にはこの権利がありません。" +
      "連帯保証人は、債権者からの請求に対し、主債務者の財産状況に関わらず直接応じる必要があります。",
    branchLab: {
      intro: "保証の種類を切り替えて、検索の抗弁権ボタンの有無を確かめよう。",
      levers: [
        {
          key: "type",
          label: "保証の種類",
          options: [
            { value: "simple", label: "単純な保証" },
            { value: "joint", label: "連帯保証" }
          ]
        }
      ],
      defaultState: { type: "joint" },
      evaluate: function(state){
        if(state.type === "simple"){
          return {
            win: true,
            headline: "検索の抗弁権を主張できる",
            reason: "単純な保証人には検索の抗弁権があり、先に主債務者の財産から執行するよう求められます。"
          };
        }
        return {
          win: false,
          headline: "検索の抗弁権を主張できない",
          reason: "連帯保証人にはこの権利がなく、直接全額の請求に応じなければなりません。"
        };
      }
    }
  },

  {
    id: 9,
    category: "共有",
    title: "ケース09：3段階の操作権限",
    caseText:
      "甲地はA・B・Cの3人が等しい割合で共有している。Aは単独で、甲地の老朽化した塀の修繕（保存行為）を行った。" +
      "別の場面でAは、単独で甲地全体をDに売却（処分行為）しようとしている。",
    question: "Aが単独で行えるのは、修繕と売却のどちらか。",
    choices: [
      "修繕のみ。保存行為は各共有者が単独で行えるが、処分行為には共有者全員の同意が必要である。",
      "売却のみ。共有物の処分は持分割合の大きい者が単独で決定できる。",
      "どちらも単独で行える。共有者は自己の判断で自由に共有物を扱える。",
      "どちらも単独では行えない。共有物に関する行為は常に全員の同意が必要である。"
    ],
    answerIndex: 0,
    relatedTerms: ["共有物の管理"],
    explanation:
      "共有物に対する行為は3段階に分かれます。保存行為（現状維持の修繕など）は各共有者が単独で行えますが、" +
      "処分・変更行為（売却や大規模な変更）には共有者全員の同意が必要です。中間の管理行為（賃貸など）は過半数の同意で足ります。",
    branchLab: {
      intro: "行為の種類を切り替えて、必要な同意のレベルを確かめよう。",
      levers: [
        {
          key: "action",
          label: "共有物に対する行為の種類",
          options: [
            { value: "preserve", label: "保存行為（修繕等）" },
            { value: "manage", label: "管理行為（賃貸等）" },
            { value: "dispose", label: "処分・変更行為（売却等）" }
          ]
        }
      ],
      defaultState: { action: "dispose" },
      evaluate: function(state){
        if(state.action === "preserve"){
          return {
            win: true,
            headline: "単独でできる",
            reason: "保存行為は各共有者が単独で行えます。他の共有者の同意は不要です。"
          };
        }
        if(state.action === "manage"){
          return {
            win: "contest",
            headline: "過半数の同意が必要",
            reason: "管理行為は、共有者の持分の過半数の同意があれば行えます。全員の同意までは不要です。"
          };
        }
        return {
          win: false,
          headline: "全員の同意が必要",
          reason: "処分・変更行為は共有物そのものの性質を変えるため、共有者全員の同意が必要です。"
        };
      }
    }
  },

  {
    id: 10,
    category: "相続",
    title: "ケース10：自動で切り替わる配分メーター",
    caseText:
      "被相続人Iが死亡した。Iには配偶者Jと、Iの父M（直系尊属）がいるが、子はいない。",
    question: "この場合の[[法定相続分]]はどうなるか。",
    choices: [
      "配偶者Jが3分の2、父Mが3分の1となる。",
      "配偶者Jが2分の1、父Mが2分の1となる。",
      "配偶者Jがすべてを相続し、父Mは相続人にならない。",
      "配偶者Jが4分の3、父Mが4分の1となる。"
    ],
    answerIndex: 0,
    relatedTerms: ["法定相続分"],
    explanation:
      "法定相続分は相続人の組み合わせで変わります。配偶者と直系尊属（父母など）が相続人になる場合、配偶者が3分の2、直系尊属が3分の1です。" +
      "これに対し配偶者と子の組み合わせなら各2分の1、配偶者と兄弟姉妹の組み合わせなら配偶者4分の3・兄弟姉妹4分の1になる点が頻出のひっかけです。",
    branchLab: {
      intro: "配偶者と組み合わさる相続人の種類を切り替えて、配分メーターの自動切り替えを確かめよう。",
      levers: [
        {
          key: "combo",
          label: "配偶者と組み合わさる相続人",
          options: [
            { value: "child", label: "子" },
            { value: "ancestor", label: "直系尊属（父母等）" },
            { value: "sibling", label: "兄弟姉妹" }
          ]
        }
      ],
      defaultState: { combo: "ancestor" },
      evaluate: function(state){
        if(state.combo === "child"){
          return {
            win: true,
            headline: "配偶者1/2・子1/2",
            reason: "配偶者と子が相続人の場合、各2分の1ずつになります（子が複数なら1/2をさらに等分）。"
          };
        }
        if(state.combo === "ancestor"){
          return {
            win: true,
            headline: "配偶者2/3・直系尊属1/3",
            reason: "配偶者と直系尊属が相続人の場合、配偶者が3分の2、直系尊属が3分の1になります。"
          };
        }
        return {
          win: true,
          headline: "配偶者3/4・兄弟姉妹1/4",
          reason: "配偶者と兄弟姉妹が相続人の場合、配偶者が4分の3、兄弟姉妹が4分の1になります。"
        };
      }
    }
  }

];

if (typeof window !== 'undefined') {
  window.FIELDS = window.FIELDS || {};
  window.FIELDS.rights = window.FIELDS.rights || {};
  window.FIELDS.rights.questions = QUESTIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTIONS;
}
})();
