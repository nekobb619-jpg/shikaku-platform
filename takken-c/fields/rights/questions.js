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
