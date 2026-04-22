export type ConceptKind = "foundation" | "class" | "tool" | "problem" | "theorem";

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type ConceptNode = {
  id: string;
  title: string;
  kind: ConceptKind;
  sector: string;
  keywords: string[];
  color: string;
  x: number;
  y: number;
  requires: string[];

  theme: string;
  goal: string;
  motivation: string;
  coreDefinition: string;
  intuition: string;
  example: string;
  misconception: string;
  formulas: Array<{ label: string; latex: string; display?: boolean }>;

  miniQuiz: QuizQuestion;
  unlockQuiz: QuizQuestion;
  nextConnection: string;
};

export const startingNodeId = "decision-problem";

export const conceptNodes: ConceptNode[] = [
  {
    id: "decision-problem",
    title: "決定問題",
    kind: "foundation",
    sector: "Launch Bay",
    keywords: ["decision problem", "language", "yes/no", "instance"],
    color: "#7DD3FC",
    x: 12,
    y: 52,
    requires: [],

    theme: "あらゆる計算問題を Yes/No の形式に統一する",

    goal:
      "計算問題を「決定問題」という形式に変換することで、異なる問題の難しさを公平に比較できるようになることを理解する。複雑性理論の共通言語として決定問題が選ばれた理由を把握し、最適化・探索・計数などの問題を決定問題に変換するテクニックを身につける。",

    motivation:
      "最適化問題（最短路を求めよ）や探索問題（条件を満たす解を見つけよ）は形が様々で、そのまま比較すると難しさの基準がずれてしまう。Yes/No の二値に統一することで、あらゆる計算問題を同じ目盛りで測ることができる。理論の整合性を保ちながら、最終的には最適化版への応用もできる汎用的な枠組みになる。",

    coreDefinition:
      "決定問題とは、入力 x に対して「Yes」か「No」の二値で答える問題のこと。形式的には文字列の集合（言語）L ⊆ {0,1}* として表現し、「x は L に属するか？」を判定する問題と同一視する。計算機は入力 x を受け取り、x ∈ L なら受理（Yes）、x ∉ L なら拒否（No）して停止する。",

    intuition:
      "最適化問題をいきなり解こうとすると比較が難しい。しかし「長さ k 以下の解が存在するか？」という Yes/No 問いに変えると、アルゴリズムの挙動を単純なフラグで評価できる。k を変化させながら二分探索すれば最適値も求まるので、決定版を制した瞬間に最適化版も制したも同然になることが多い。難しさを一点に凝縮する操作が決定問題化の本質。",

    example:
      "グラフ G と整数 k が与えられたとき、「G に長さ k 以下のハミルトン路が存在するか？」という問いは決定問題。一方「最短のハミルトン路を求めよ」は最適化問題で決定問題ではない。前者で Yes/No が言えれば、k を二分探索することで後者の最小長も求まる。",

    misconception:
      "「決定問題しか扱わないなら、最適化や探索は無視しているのでは？」という疑問はよくある。実際には逆で、まず決定版として難しさを証明し、その結果を最適化版・計数版に応用する手順を踏む。決定問題への変換は制限ではなく、理論構築のための出発点。また「Yes/No しかないので表現力が弱い」という誤解もあるが、驚くほど多様な問題がこの形式で表せる。",

    formulas: [
      { label: "言語として書く", latex: "L \\subseteq \\{0,1\\}^*" },
      { label: "判定器", latex: "x \\in L\\;?" },
    ],

    miniQuiz: {
      question: "次のうち決定問題の形式になっているのはどれ？",
      options: [
        "グラフの最短路を求めよ",
        "このグラフに長さ 5 以下の路が存在するか？",
        "すべての経路を長さの昇順で列挙せよ",
        "グラフの辺の数を計算せよ",
      ],
      correct: 1,
      explanation:
        "決定問題は Yes/No で答える形式。選択肢 B だけが「存在するか？」という二値判定になっている。A は最適化問題、C は列挙問題、D は計数問題でそれぞれ決定問題ではない。",
    },

    unlockQuiz: {
      question:
        "最適化問題「整数の集合 S から、最大の部分和を求めよ」を決定問題化すると最も適切なのはどれ？",
      options: [
        "S のすべての部分集合の和を列挙せよ",
        "S の最大部分和を出力せよ",
        "S の部分集合で和が k 以上のものが存在するか？",
        "S を降順に並び替えた結果を返せ",
      ],
      correct: 2,
      explanation:
        "決定問題化の典型パターンは「閾値 k を導入して Yes/No の存在判定に変換する」こと。「k 以上の部分和が存在するか？」は Yes/No で答えられる決定問題になっている。k を二分探索すれば元の最適化問題も解ける。",
    },

    nextConnection:
      "決定問題という共通形式を手に入れたら、次は「その問題を解くのに何ステップかかるか」という時間計算量の問いへ進む。効率を測る道具が揃って初めて、複雑性クラスの比較が始まる。",
  },

  {
    id: "time-complexity",
    title: "時間計算量",
    kind: "foundation",
    sector: "Launch Bay",
    keywords: ["T(n)", "Big-O", "polynomial time", "exponential time"],
    color: "#A5F3FC",
    x: 24,
    y: 28,
    requires: ["decision-problem"],

    theme: "アルゴリズムの速さを入力サイズの増加率で捉える",

    goal:
      "計算時間を入力サイズ n の関数 T(n) として表現し、O 記法での比較方法を習得する。特に多項式時間と指数時間という根本的な違いを体感的に理解することが目標。この分水嶺こそが、複雑性クラスのほぼすべての境界線の基礎になる。",

    motivation:
      "コンピュータが毎秒 10 億ステップ処理できても、指数時間アルゴリズムは n=100 程度で宇宙の年齢を超える時間がかかる。この現実的な限界を理解するには、定数倍を無視して増長率だけを見る抽象的な道具が必要になる。同じ「速い」でも n が小さいときと大きいときで逆転するため、漸近的な視点が欠かせない。",

    coreDefinition:
      "時間計算量 T(n) は入力サイズ n に対して最悪ケースで要するステップ数として定義される。O 記法では T(n) = O(f(n)) が「十分大きな n に対して T(n) ≤ c · f(n) を満たす定数 c, n₀ が存在する」ことを意味し、定数倍・低次項を無視した成長率の比較を可能にする。多項式時間とは T(n) = O(nᵏ) の形、指数時間は T(n) = O(2ⁿ) などの形。",

    intuition:
      "電話帳から名前を探すとき、先頭から順に読む（O(n)）より、ページを半分に折って範囲を絞る二分探索（O(log n)）が速い。n が 100 万のとき O(n) は 100 万ステップ、O(log n) はわずか 20 ステップ。一方 O(2ⁿ) は n=50 で 10¹⁵ ステップになり、現代のコンピュータでも現実的に処理不能。この爆発的な違いが「多項式時間か否か」という判断に凝縮されている。",

    example:
      "整列：バブルソートは O(n²)、クイックソート（平均）は O(n log n)。素数判定：試し割りは O(√n)、ミラー–ラビンは O(k log² n)。巡回セールスマン問題の力まかせ解法は O(n!)。n=30 のとき n² = 900、n log n ≈ 150、n! ≈ 2.6×10³²。この差がアルゴリズム選択の全てを決める。",

    misconception:
      "「O(n^100) は多項式時間だから効率的なはず」は誤解。O 記法は漸近的比較の道具であり、実際に n^100 ステップかかるなら実用的ではない。また「定数倍は無視していいなら、実装は何でもよい」も誤解で、定数倍の差は実際には何倍ものパフォーマンス差になる。理論的分類と実用的な速さは別問題として区別する必要がある。",

    formulas: [
      { label: "多項式時間の形", latex: "T(n) \\le c\\,n^k" },
      { label: "指数時間の例", latex: "T(n)=2^n" },
    ],

    miniQuiz: {
      question: "n = 1,000,000 のとき、最も計算ステップ数が少ないのはどれ？",
      options: ["O(n²)", "O(n log n)", "O(2ⁿ)", "O(log n)"],
      correct: 3,
      explanation:
        "log₂(1,000,000) ≈ 20 ステップ。O(n log n) ≈ 2000 万ステップ。O(n²) = 10¹² ステップ。O(2ⁿ) は天文学的数字で到底計算できない。O(log n) が圧倒的に小さい。",
    },

    unlockQuiz: {
      question:
        "アルゴリズム A の計算量が T(n) = 3n³ + 100n + 1000 のとき、正しい説明はどれ？",
      options: [
        "T(n) = O(n³) であり、A は多項式時間アルゴリズム",
        "定数 1000 があるので多項式時間ではない",
        "係数 3 があるので O(3n³) と正確に書かなければならない",
        "T(n) = O(n) になる（最も遅く増える項のみ残す）",
      ],
      correct: 0,
      explanation:
        "Big-O は定数倍・低次項を無視する。最高次の n³ だけを見て T(n) = O(n³) であり、これは多項式時間。係数も低次項も漸近的には意味をなさない。",
    },

    nextConnection:
      "O 記法で計算量を測れるようになったら、次は「多項式時間で解ける問題の集合」という具体的なクラス P の定義へ進む。理論上の効率性の基準点が誕生する瞬間がここにある。",
  },

  {
    id: "p-class",
    title: "P クラス",
    kind: "class",
    sector: "Core Systems",
    keywords: ["P", "deterministic", "polytime", "tractable"],
    color: "#93C5FD",
    x: 39,
    y: 44,
    requires: ["time-complexity"],

    theme: "多項式時間で解ける問題をひとつのクラスとして定義する",

    goal:
      "複雑性クラス P の正確な定義を理解し、なぜ多項式時間が「効率的」の理論的基準として採用されたかを把握する。身近なアルゴリズム問題が P に属することを確認し、P の外にある問題との違いを感じる。P は複雑性理論全体の基準点になるクラス。",

    motivation:
      "アルゴリズムが「速い」か「遅い」かを議論するとき、具体的なコンピュータの速度や実装に依存しない普遍的な基準が必要になる。多項式時間はコンピュータモデルを変えても本質が変わらず（合理的なモデル間で多項式時間は保存される）、効率性の理論的基準として広く受け入れられている。",

    coreDefinition:
      "P（Polynomial time）は多項式時間で解ける決定問題の集合。P = ⋃_{k≥1} TIME(nᵏ) と表す。問題 L が P に属するとは、ある決定的アルゴリズム A と定数 c, k が存在して、任意の入力 x に対して A が c|x|ᵏ ステップ以内に停止し、x ∈ L を正しく判定することをいう。非決定性を一切使わない点が重要。",

    intuition:
      "P にある問題は「構造的に攻略可能」なもの。最短路なら Dijkstra 法、整列ならマージソートのように、問題の本質的なパターンを見抜いて効率よく解く手順が存在する問題群。グラフの中に答えへの近道を見つけるイメージ。一方 P の外にある問題は現在知られている限り全探索に近いアプローチしかなく、入力が少し大きくなるだけで手が届かなくなる。",

    example:
      "P に属する問題：グラフの連結判定（BFS/DFS で O(n+m)）、最短路問題の決定版（Dijkstra で O(n log n)）、素数判定（AKS 素数判定法により多項式時間）、線形計画法の決定版（楕円体法で多項式時間）、最大マッチング。これらはすべて多項式時間アルゴリズムが存在することが証明されている。",

    misconception:
      "「P に属する問題は簡単で、P の外の問題は難しい」という二分法の誤解がある。P は理論上の効率性の基準であり、O(n^100) のような「理論上は P だが実用的でない」問題も存在する。また「P ⊆ NP だから P の問題は NP より簡単」という誤解もある。NP は難しい問題だけの集合ではなく、P も完全に NP の中に含まれている。",

    formulas: [
      {
        label: "P の定義",
        latex: "\\mathrm{P}=\\bigcup_{k \\ge 1} \\mathrm{TIME}(n^k)",
        display: true,
      },
      { label: "基本関係", latex: "\\mathrm{P} \\subseteq \\mathrm{NP}" },
    ],

    miniQuiz: {
      question: "次のうち P に属することが証明されているのはどれ？",
      options: [
        "グラフのハミルトン閉路存在判定",
        "命題論理式の充足可能性（SAT）",
        "グラフの連結判定問題",
        "部分和問題（Subset Sum）",
      ],
      correct: 2,
      explanation:
        "グラフの連結判定は BFS/DFS で O(n+m) と多項式時間で解ける。ハミルトン閉路・SAT・部分和問題は NP 完全問題として知られており、多項式時間アルゴリズムは現在未発見。",
    },

    unlockQuiz: {
      question: "「P = NP」が証明された場合、最も正確な結論はどれ？",
      options: [
        "NP のすべての問題が多項式時間で解けるようになる",
        "P のすべての問題が指数時間になる",
        "NP 完全問題という概念が消滅する",
        "現在の暗号技術がすべて安全になる",
      ],
      correct: 0,
      explanation:
        "P = NP とは NP ⊆ P ということ。P ⊆ NP はすでに成立しているので P = NP になる。これは NP のすべての問題が多項式時間で解けることを意味する。現代暗号の多くは NP の問題が困難であることに依存しているため、P = NP は暗号を危機に晒す可能性がある。",
    },

    nextConnection:
      "P が「解けるクラス」を定義するなら、次の問いは「検証は速くできるが、解くのが難しそうな問題」の存在。それを定式化する道具として、まず「多項式時間検証器」の概念を理解し、その後 NP クラスへ進む。",
  },

  {
    id: "verifier",
    title: "多項式時間検証器",
    kind: "tool",
    sector: "Core Systems",
    keywords: ["verifier", "certificate", "witness", "polytime check"],
    color: "#C4B5FD",
    x: 45,
    y: 20,
    requires: ["time-complexity"],

    theme: "解を見つけるより「証拠を確認する」ほうが簡単なことがある",

    goal:
      "多項式時間検証器（verifier）の概念を理解し、「解を生成する」ことと「解を検証する」ことの非対称性を把握する。この非対称性こそが P と NP の差を生む可能性があり、計算複雑性の最大の謎である P vs NP 問題の核心にある。",

    motivation:
      "迷路の出口を自力で探すのは大変でも、誰かに「この道順で出られる」と道順を示されれば、正しいかどうかの確認は素早くできる。この「探索より検証が速い」という非対称性は直感的に自然だが、理論的に証明するのは非常に難しい。この直感を数学的に定式化したのが検証器の概念。",

    coreDefinition:
      "検証器 V は入力 x と証明 y（certificate / witness とも呼ぶ）を受け取り、多項式時間で「受理」か「棄却」を出力する。言語 L が多項式時間検証器を持つとは、「x ∈ L ならば多項式長の y が存在して V(x,y)=1」かつ「x ∉ L ならばいかなる y に対しても V(x,y)=0」が成り立つことをいう。",

    intuition:
      "テスト採点に例えると、問題を解くこと（試験）と答えが正しいかを確認すること（採点）は別の作業。数独パズルを解くのは難しくても、「この解答が正しいか」を確認するのは各マスを1回見るだけで O(n)。SAT なら変数への割り当てを確認するだけ、ハミルトン路なら与えられた経路が全頂点を通るか確認するだけ。",

    example:
      "SAT の検証器：入力は CNF φ と変数割り当て y。各節に y を代入して全節が真になるか確認。これは O(n) で完了する。ハミルトン路の検証器：入力はグラフ G と頂点の順列 y。y が各辺を持つか、全頂点を通るかを確認。どちらも y が与えられれば多項式時間で検証できる。",

    misconception:
      "「検証器があるなら、それを逆用して解も作れるのでは？」というのは自然な疑問だが、これはまさに P vs NP 問題の核心。現時点では「検証できることと解が生成できることは等価ではないかもしれない」という立場が支配的（つまり P ≠ NP という予想）。しかし証明はされていない。",

    formulas: [
      {
        label: "検証器による定義",
        latex:
          "x \\in L \\iff \\exists y,\\; |y| \\le |x|^k \\text{ and } V(x,y)=1",
        display: true,
      },
    ],

    miniQuiz: {
      question: "多項式時間検証器における「証明（certificate）」とは何か？",
      options: [
        "問題を解くアルゴリズムの擬似コード",
        "yes-instance に対して存在を保証する短い証拠",
        "no-instance を棄却するための反例",
        "計算量を多項式に削減する変換関数",
      ],
      correct: 1,
      explanation:
        "検証器は x と certificate y を受け取り、y が「x は yes-instance だ」という証拠であることを確認する。y は多項式長で存在し（yes-instance の場合）、それを提示されれば多項式時間で正しさを確認できる。",
    },

    unlockQuiz: {
      question: "SAT に対する certificate として最も適切なのはどれ？",
      options: [
        "CNF を充足する変数への真偽値割り当て",
        "CNF のすべての節の組み合わせリスト",
        "最短の充足可能な部分論理式",
        "充足不可能であることの証明",
      ],
      correct: 0,
      explanation:
        "SAT の yes-instance（充足可能な CNF）に対する certificate は、全節を真にする変数への割り当て。これを受け取れば各変数に代入して全節を確認するだけで O(n) 時間で検証できる。certificate は「解そのもの」であることが多い。",
    },

    nextConnection:
      "検証器の概念を理解したら、「多項式時間検証器が存在する問題の集合」としての NP クラスを定義できる。P と NP の差が「解くこと」と「検証すること」の差であることが見えてくる。",
  },

  {
    id: "np-class",
    title: "NP クラス",
    kind: "class",
    sector: "Core Systems",
    keywords: ["NP", "certificate", "nondeterminism", "verifier"],
    color: "#F9A8D4",
    x: 58,
    y: 38,
    requires: ["p-class", "verifier"],

    theme: "「見つけるのは難しいが、見せられれば確認は速い」問題の集合",

    goal:
      "NP クラスの定義を多項式時間検証器の観点から理解し、P との関係（P ⊆ NP）を把握する。「NP = Not Polynomial の略」「NP = 難しい問題の集合」という二大誤解を払拭し、NP が実際に何を意味するかを正確に理解する。",

    motivation:
      "P の外に出ると、全探索しか知られていない問題が山積みになる。これらの問題は「解を見つける」のは困難に見えるが、「解を検証する」のは速い。この共通の性質を持つ問題群を一つのクラスとして定式化することで、計算の難しさの構造が見えてくる。",

    coreDefinition:
      "NP（Nondeterministic Polynomial time）は、多項式時間検証器が存在する決定問題の集合。L ∈ NP であるとは、多項式時間で動く検証器 V が存在して、x ∈ L ならば多項式長の y が存在し V(x,y)=1、x ∉ L ならばいかなる y でも V(x,y)=0 が成り立つこと。P ⊆ NP が成り立つ（P の問題は解くアルゴリズム自体が検証器になれる）。",

    intuition:
      "NP を宝探しゲームで例えると：宝の地図（certificate）さえ手に入れれば、宝の場所を確認するのは速い（多項式時間検証）。しかし宝の地図を最初から自力で作るのは、砂浜全体を掘り返すのと同じくらい大変かもしれない。NP は「宝の地図があれば確認が速い問題の集合」。地図なしに宝を見つける効率的な方法があるかどうかが P vs NP 問題。",

    example:
      "SAT：与えられた割り当てが全節を充足するか O(n) で確認できる。ハミルトン閉路：与えられた順列が全頂点を通る閉路かどうか O(n) で確認できる。部分和問題：与えられた部分集合の和が目標値かどうか O(n) で確認できる。これらはすべて NP に属する（多項式時間検証器が存在）。",

    misconception:
      "最大の誤解は「NP = Not Polynomial（多項式時間で解けない）」という解釈。NP は Nondeterministic Polynomial の略で、P も NP に含まれる。NP は「難しい問題だけの箱」ではなく「検証が速い問題の箱」。もう一つの誤解は「NP の問題を解くには必ず指数時間がかかる」という思い込みで、これは P ≠ NP の予想が正しい場合の話であり、現時点では証明されていない。",

    formulas: [
      {
        label: "検証器の形",
        latex: "\\mathrm{NP}=\\{L \\mid \\exists \\text{ polytime verifier } V\\}",
        display: true,
      },
      { label: "包含関係", latex: "\\mathrm{P} \\subseteq \\mathrm{NP}" },
    ],

    miniQuiz: {
      question: "NP クラスの定義として最も正確なのはどれ？",
      options: [
        "多項式時間で解くことができる問題の集合",
        "解くのに指数時間かかる問題の集合",
        "多項式時間で動く検証器が存在する問題の集合",
        "非決定性が必ず必要な問題の集合",
      ],
      correct: 2,
      explanation:
        "NP の最も直感的な定義は「多項式時間検証器が存在する問題の集合」。A はPの定義、B は誤り（指数時間かどうか不明）、D は誤り（P ∈ NP なので P の問題も NP に含まれ、非決定性は不要）。",
    },

    unlockQuiz: {
      question: "P ⊆ NP が成り立つ理由として正しいのはどれ？",
      options: [
        "P の問題にも非決定性が必要だから",
        "P の問題は多項式時間で解けるので、解くアルゴリズム自体が検証器として機能するから",
        "NP の定義が P を含むよう人為的に設計されているから",
        "P と NP は証明なしに同じクラスと仮定されているから",
      ],
      correct: 1,
      explanation:
        "L ∈ P なら決定アルゴリズム A が O(nᵏ) で動く。certificate y を無視して A そのものを検証器として使えば、多項式時間検証器が構成できる。よって L ∈ NP。「解くアルゴリズム ⇒ 検証器」という方向は常に成立する（逆は未解決）。",
    },

    nextConnection:
      "NP を理解したら、次は問題間の難しさを比較する「多項式時間還元」と、NP の中の代表的な問題 SAT の二方向へ進める。還元を使うことで NP の中の最難問題（NP 完全）を特定できるようになる。",
  },

  {
    id: "reduction",
    title: "多項式時間還元",
    kind: "tool",
    sector: "Warp Gate",
    keywords: ["reduction", "many-one", "mapping", "hardness"],
    color: "#FDE68A",
    x: 67,
    y: 57,
    requires: ["np-class"],

    theme: "問題の難しさを別の問題へ「移送」する変換",

    goal:
      "多項式時間 many-one 還元の定義を理解し、還元の向きと難しさの伝播方向の関係を正確に把握する。還元を使って問題の難しさを比較・証明する方法を身につけることで、NP 完全性の証明という強力な道具を使えるようになる。",

    motivation:
      "新しい問題が難しいかどうかをゼロから証明するのは非常に困難。しかし「この新しい問題を解ければ、既に難しいと分かっている問題も解けてしまう」と示せれば、新しい問題も少なくとも同じくらい難しいと言える。この「難しさの移送」が還元の発想。",

    coreDefinition:
      "多項式時間 many-one 還元 A ≤ₚ B とは、多項式時間で計算できる関数 f が存在し、任意の入力 x について「x ∈ A ⟺ f(x) ∈ B」が成り立つことをいう。A の入力を f で変換して B に問い合わせると、B の答えがそのまま A の答えになる。「B を解ける機械があれば A も解ける」という関係。",

    intuition:
      "「川を渡る」という問題を解くために「橋を架ける」という別の問題に帰着させるイメージ。橋を架けられれば川は渡れる（B が解ければ A も解ける）。つまり「橋を架ける問題」は少なくとも「川を渡る問題」と同じくらい難しい。A ≤ₚ B は「B は A と同じかそれ以上難しい」という難しさの下限を主張している。",

    example:
      "3-COLORING ≤ₚ SAT：グラフの 3 彩色問題を SAT に変換する。各頂点に 3 色のうちどれかを割り当てるという制約を CNF で表現し、SAT を解けば 3 彩色も解ける。SAT ≤ₚ 3-SAT：任意の節を 3 リテラル以下に変換することで、SAT を 3-SAT の特別なケースとして解ける。",

    misconception:
      "最も頻繁な誤解は「A ≤ₚ B の向き」。A ≤ₚ B は「A は B より簡単」ではなく「B は A より難しい（少なくとも同じくらい難しい）」という意味。直感に反するので注意が必要。B を道具として使い A の入力を変換するので、B が手元にあれば A は解ける = B は A の上位互換的な力を持つ。",

    formulas: [
      {
        label: "還元の定義",
        latex:
          "A \\le_p B \\iff \\exists f \\in \\mathrm{FP}\\;\\forall x\\;(x \\in A \\iff f(x) \\in B)",
        display: true,
      },
      {
        label: "難しさの伝播",
        latex:
          "A \\le_p B \\land B \\in \\mathrm{P} \\Rightarrow A \\in \\mathrm{P}",
      },
    ],

    miniQuiz: {
      question: "A ≤ₚ B が成り立つとき、何が言えるか？",
      options: [
        "A は B より難しい",
        "B を多項式時間で解けるなら A も多項式時間で解ける",
        "A と B は全く同じ問題である",
        "B を解くには A を先に解く必要がある",
      ],
      correct: 1,
      explanation:
        "A ≤ₚ B は「B が解ければ A も解ける」という関係。B ∈ P なら、f（多項式時間変換）に B の多項式時間アルゴリズムを組み合わせることで、A も多項式時間で解ける。難しさは B → A の方向に伝わる（B が易しければ A も易しい）。",
    },

    unlockQuiz: {
      question: "A ≤ₚ B かつ B ≤ₚ A が成り立つとき、正しい結論はどれ？",
      options: [
        "A と B は同一の問題である（全く同じ言語）",
        "A と B は多項式時間等価であり、一方が P に属せば他方も P に属す",
        "A も B も P に属することが確定する",
        "A も B も NP 完全であることが確定する",
      ],
      correct: 1,
      explanation:
        "相互に還元可能な問題は「多項式時間等価（polynomial-time equivalent）」と言う。問題の形が違っても難しさが同等ということ。一方が P に入れば他方も P に入り、一方が NP 完全なら他方も NP 完全になる。ただし両方 P というわけでも NP 完全というわけでもなく、同じ難しさのクラスにいることだけが言える。",
    },

    nextConnection:
      "還元の概念を手に入れたら、次は「すべての NP 問題を SAT に還元できる」という Cook-Levin 定理へ進む。還元こそが NP 完全性の証明の主役であり、複雑性理論の最強の道具になる。",
  },

  {
    id: "sat",
    title: "SAT（充足可能性問題）",
    kind: "problem",
    sector: "Boolean Nebula",
    keywords: ["SAT", "CNF", "assignment", "clause"],
    color: "#FDBA74",
    x: 72,
    y: 24,
    requires: ["np-class"],

    theme: "論理式を「真」にできる変数の割り当てが存在するか",

    goal:
      "SAT（Boolean Satisfiability Problem）の定義を理解し、CNF（連言標準形）という標準的な入力形式を把握する。SAT が計算複雑性理論において果たす中心的な役割（NP 完全性の原点）を理解し、様々な問題を SAT に符号化する発想を学ぶ。",

    motivation:
      "制約を満たす設定が存在するか、という問いは無数のアプリケーションに登場する。スケジューリング、回路設計、プランニング、暗号解析など。これらすべてを SAT に変換できるなら、SAT ソルバーという一つの強力な道具で多様な問題を解けることになる。SAT は組合せ問題の「共通言語」。",

    coreDefinition:
      "SAT は「与えられた命題論理式 φ を真にする変数への割り当てが存在するか？」という決定問題。入力は通常 CNF（Conjunctive Normal Form / 連言標準形）で与えられる。CNF は節（clause）の AND で構成され、各節はリテラル（変数か変数の否定）の OR。問いは「全節を同時に真にする割り当てが存在するか？」。",

    intuition:
      "n 人の会議のスケジュールを組むとき、「A さんは月曜か水曜に参加」「B さんは火曜か木曜に参加」「A と B は同じ日には来られない」といった制約を全部同時に満たすスケジュールが存在するかを問うのが SAT のイメージ。各制約が節になり、全節を満たす割り当てを見つけることが「充足」。",

    example:
      "(x₁ ∨ ¬x₂) ∧ (x₂ ∨ x₃) ∧ (¬x₁ ∨ ¬x₃) という CNF に対して x₁=T, x₂=T, x₃=F を代入すると (T∨F)=T, (T∨F)=T, (F∨T)=T となり全節が充足される。この割り当てが certificate になる。一方 ¬x₁ ∧ x₁ のような矛盾した CNF は充足不可能で SAT の答えは No。",

    misconception:
      "「SAT は論理の問題だから、アルゴリズムや組合せ問題とは別物」という誤解がある。実際には多くの組合せ問題（グラフ彩色、スケジューリング、ゲームの解析など）を多項式時間で SAT に変換できる。SAT は「論理問題」ではなく「組合せ最適化の普遍的な形式」と捉えるほうが正確。また「2-SAT は P に属するが 3-SAT は NP 完全」という事実は、節のサイズ一つで難しさが劇的に変わることを示す。",

    formulas: [
      {
        label: "CNF の形",
        latex:
          "\\varphi = \\bigwedge_{i=1}^{m} \\left(\\bigvee_{j=1}^{k_i} \\ell_{ij}\\right)",
        display: true,
      },
      {
        label: "SAT の問い",
        latex: "\\exists a \\in \\{0,1\\}^n\\;[\\varphi(a)=1] \\;?",
      },
    ],

    miniQuiz: {
      question: "SAT（充足可能性問題）を解くとは何をすることか？",
      options: [
        "CNF の全節の数を数える",
        "与えられた CNF の全節を真にする変数への割り当てが存在するか判定する",
        "CNF を等価な別の論理形式に変換する",
        "CNF の節の数を最小化する等価な式を見つける",
      ],
      correct: 1,
      explanation:
        "SAT は充足可能性（Satisfiability）の問題。決定問題として「全節を同時に真にする割り当てが存在するか Yes/No で答える」のが目的。割り当てを見つけること（最適化・探索）ではなく、存在するかどうかを判定することが決定問題としての SAT。",
    },

    unlockQuiz: {
      question:
        "(x₁ ∨ ¬x₂) ∧ (x₂ ∨ x₃) ∧ (¬x₁ ∨ ¬x₃) は充足可能か？",
      options: [
        "No（充足不可能）",
        "Yes（x₁=T, x₂=T, x₃=F が一つの解）",
        "Yes（x₁=F, x₂=F, x₃=F が一つの解）",
        "判断するには変数が少なすぎる",
      ],
      correct: 1,
      explanation:
        "x₁=T, x₂=T, x₃=F を代入：(T∨F)=T ✓、(T∨F)=T ✓、(F∨T)=T ✓。全節が充足され、SAT の答えは Yes。x₁=F, x₂=F, x₃=F だと節 2 が (F∨F)=F となり充足されない。certificate として x₁=T, x₂=T, x₃=F を提示すれば多項式時間で検証できる。",
    },

    nextConnection:
      "SAT という具体的な問題を理解したら、次は「なぜ SAT が NP のすべての問題を代表できるのか」を示す Cook-Levin 定理へ進む。どんな NP 問題も SAT に変換できるという驚くべき事実が明らかになる。",
  },

  {
    id: "cook-levin",
    title: "Cook-Levin 定理",
    kind: "theorem",
    sector: "Boolean Nebula",
    keywords: ["Cook-Levin", "tableau", "encoding", "NP-complete"],
    color: "#FCA5A5",
    x: 82,
    y: 47,
    requires: ["sat", "reduction"],

    theme: "すべての NP 問題は SAT に多項式時間で変換できる",

    goal:
      "Cook-Levin 定理が SAT の NP 完全性を示す歴史的な証明であることを理解し、証明の核心となる「計算過程の論理式への符号化」というアイデアを把握する。この定理が NP 完全性という概念を誕生させた起点であることを認識する。",

    motivation:
      "NP 完全性を証明するには最初の一発が必要だった。Cook（1971年）と Levin（1973年）は独立に、任意の NP 問題の多項式時間検証器の計算過程そのものを論理式で表現できることを示した。これにより「SAT が解ければすべての NP 問題が解ける」という強力な事実が確立された。",

    coreDefinition:
      "Cook-Levin 定理：SAT は NP 完全である。すなわち (1) SAT ∈ NP、かつ (2) 任意の L ∈ NP に対して L ≤ₚ SAT が成り立つ。証明の核心は (2) の NP-hard 側。任意の NP 問題の多項式時間検証器の計算表（tableau）を変数・遷移規則・受理状態の制約として CNF 論理式に符号化し、この変換が多項式時間で可能であることを示す。",

    intuition:
      "コンピュータのプログラム実行を「表」で追跡するイメージ。行が時刻ステップ、列がメモリの場所を表す計算表を作る。「このプログラムがこの入力に対して受理するか？」という問いを、計算表の各セルに課せられる制約（初期状態・遷移規則・受理条件）の CNF に変換する。この変換は多項式時間でできるので、任意の NP 問題が SAT に帰着する。",

    example:
      "n ステップで動く検証器の計算表は n 行 × n 列 = n² セルからなる。各セルの状態を表す変数を作り、「初期行が入力 x に一致する」「各行の遷移が有効な遷移規則に従う」「最終行が受理状態である」という制約を CNF で表現する。証明したい x ∈ L と certificate y の存在を SAT の充足可能性に対応させる。",

    misconception:
      "「Cook-Levin は SAT が NP に入ることを示す定理」という誤解がある。SAT ∈ NP は trivial（割り当てを certificate にすれば多項式時間で検証できる）。Cook-Levin の本質は NP-hard 側、すなわち「すべての NP 問題が SAT に帰着できる」という部分。また Cook-Levin 以降は「既知の NP 完全問題からの還元」で新しい NP 完全性を証明できるようになり、ゼロから証明する必要がなくなった。",

    formulas: [
      {
        label: "定理の核",
        latex: "\\forall L \\in \\mathrm{NP},\\; L \\le_p \\mathrm{SAT}",
        display: true,
      },
      {
        label: "結論",
        latex:
          "\\mathrm{SAT} \\in \\mathrm{NP} \\land \\forall L \\in \\mathrm{NP},\\,L \\le_p \\mathrm{SAT}",
      },
    ],

    miniQuiz: {
      question: "Cook-Levin 定理が証明したことは何か？",
      options: [
        "SAT は P に属する",
        "すべての NP 問題は SAT に多項式時間還元できる（SAT は NP 完全）",
        "SAT を解くアルゴリズムは存在しない",
        "P = NP である",
      ],
      correct: 1,
      explanation:
        "Cook-Levin は SAT が NP 完全（NP に属し、かつ NP のすべての問題が SAT に還元できる）であることを示した。これは SAT が「解ければ NP のすべてが解ける」最難問題の一つであることを意味する。P = NP の主張ではない。",
    },

    unlockQuiz: {
      question:
        "Cook-Levin 定理の証明で、NP 問題を SAT に還元する方法は何か？",
      options: [
        "NP 問題のグラフ表現を論理式に変換する",
        "多項式時間検証器の計算過程（計算表）を CNF 論理式に符号化する",
        "NP 問題の全入力を網羅的に試す回路を論理式で表す",
        "乱択アルゴリズムを使って NP 問題を近似し、SAT に変換する",
      ],
      correct: 1,
      explanation:
        "証明の核心は「任意の NP 問題の多項式時間検証器が動く計算表を、変数・初期条件・遷移規則・受理条件の制約として CNF に符号化する」こと。この符号化が多項式時間で可能であることがポイント。計算表のセル数が入力の多項式に収まるため、全体が多項式サイズの CNF になる。",
    },

    nextConnection:
      "Cook-Levin が SAT の NP 完全性を示したことで、NP 完全という概念が正式に誕生した。以降は SAT からの還元を連鎖させることで、様々な問題の NP 完全性を証明できるようになる。NP 完全性という「難しさの地図」が開く。",
  },

  {
    id: "npc",
    title: "NP 完全",
    kind: "class",
    sector: "Frontier Rim",
    keywords: ["NP-complete", "hardness", "reduction", "membership"],
    color: "#FB7185",
    x: 90,
    y: 31,
    requires: ["cook-levin"],

    theme: "NP の中で最も難しい問題群 ― 「NP のボス」",

    goal:
      "NP 完全の定義（NP への帰属 + NP-hardness）を正確に理解し、なぜこれが「NP で最も難しい問題群」を意味するかを把握する。新しい問題が NP 完全であることを示す実践的な方法（既知 NP 完全問題からの還元）を習得する。",

    motivation:
      "NP には簡単な問題（P に属するもの）も、難しそうな問題（全探索しか知られていないもの）も混在している。「NP で最も難しいグループ」を特定できれば、そのグループに属する問題の一つでも多項式時間で解ければ NP 全体が解けてしまうことが分かる。これが NP 完全性の意義。",

    coreDefinition:
      "問題 C が NP 完全であるとは (1) C ∈ NP かつ (2) ∀L ∈ NP, L ≤ₚ C の両方が成り立つこと。(1) は NP に属するという「上限の証明」、(2) は NP のすべてより難しくないという「下限の証明」（NP-hardness）。両方を合わせて「NP の中で最大限に難しい問題」を意味する。",

    intuition:
      "NP 完全問題は「NP の代表ボス」。どれか一つでも多項式時間で解ければ（C ∈ P）、還元の連鎖を使って NP のすべての問題が多項式時間で解けてしまう（P = NP）。逆に NP 完全問題を多項式時間で解けないなら（P ≠ NP が証明されたとき）、それらは本質的に困難であることが確定する。",

    example:
      "NP 完全問題の例：SAT（Cook-Levin により最初に証明）、3-SAT（SAT から還元）、クリーク問題（グラフに大きさ k のクリークが存在するか）、頂点被覆問題、ハミルトン閉路問題、部分和問題、巡回セールスマン問題の決定版。数百から数千の問題が NP 完全と知られている。",

    misconception:
      "「NP 完全は絶対に解けない」という誤解がある。NP 完全は多項式時間の確定的アルゴリズムが（おそらく）存在しないということであり、他のアプローチは有効。指数時間アルゴリズム（小さい入力には使える）、近似アルゴリズム（最適解に近い解を多項式時間で求める）、ランダム化アルゴリズム、特殊ケースへの対処（FPT）など。「解けない」ではなく「効率的な決定アルゴリズムがない（と予想される）」が正確。",

    formulas: [
      {
        label: "定義",
        latex:
          "C \\text{ is NP-complete} \\iff C \\in \\mathrm{NP} \\land \\forall L \\in \\mathrm{NP},\\,L \\le_p C",
        display: true,
      },
      {
        label: "もし一つが速く解けたら",
        latex:
          "C \\in \\mathrm{NPC} \\land C \\in \\mathrm{P} \\Rightarrow \\mathrm{P}=\\mathrm{NP}",
      },
    ],

    miniQuiz: {
      question: "問題 C が NP 完全であるための条件として正しいのはどれ？",
      options: [
        "C が NP に属し、かつ NP のすべての問題が C に多項式時間還元できる",
        "C が P に属し、かつ指数時間アルゴリズムしか知られていない",
        "C が決定問題で、かつ多項式時間検証器が存在しない",
        "C が NP に属し、かつ P に属さないことが証明されている",
      ],
      correct: 0,
      explanation:
        "NP 完全の定義は「(1) C ∈ NP かつ (2) ∀L∈NP, L≤ₚC」の両方。(1) は NP 帰属の証明、(2) は NP-hardness の証明。どちらか一方だけでは NP 完全にはなれない。D は誤りで、P ≠ NP は未証明のため「P に属さない」ことを証明するのは現状ほぼ不可能。",
    },

    unlockQuiz: {
      question: "新しい問題 X の NP 完全性を示す最も一般的な方法は？",
      options: [
        "X が指数時間より速く解けないことを直接証明する",
        "X ∈ NP を示した後、既知の NP 完全問題 Y から X への還元 Y ≤ₚ X を構成する",
        "すべての NP 問題から X への還元を個別に示す",
        "X を多項式時間で解くアルゴリズムが存在しないことを証明する",
      ],
      correct: 1,
      explanation:
        "実践的な手順は「① X ∈ NP の証明（certificate と検証器を示す）＋ ② 既知の NP 完全問題 Y で Y ≤ₚ X を構成」。すべての NP 問題からの還元は不要（推移律による連鎖で十分）。直接「解けないことの証明」は現状ほぼ不可能な難問。",
    },

    nextConnection:
      "NP 完全を理解したら、NP にも属さないが NP と同じかそれ以上に難しいという「NP-hard」という広い概念へ進む。決定問題以外にも複雑性の地図が広がる。また別の軸として空間計算量・PSPACE という新しい次元も開ける。",
  },

  {
    id: "nph",
    title: "NP-Hard",
    kind: "class",
    sector: "Frontier Rim",
    keywords: ["NP-hard", "optimization", "hardness", "not necessarily in NP"],
    color: "#F87171",
    x: 94,
    y: 58,
    requires: ["npc"],

    theme: "NP-complete より広い「難しさの下限」ラベル",

    goal:
      "NP-hard と NP-complete の違いを正確に理解し、NP-hard が NP に属さない問題にも適用できることを把握する。最適化問題・計数問題・停止性問題など NP の外にある問題への複雑性の拡張を理解する。",

    motivation:
      "NP 完全は「NP の中で最難」を表すが、世の中には NP の外にある問題も多い。最適化問題（最短 TSP 路を求めよ）は技術的に NP に属さないが、NP 完全の決定版（決定版 TSP）と同じかそれ以上に難しい。このような問題を適切に「難しい」と分類するために NP-hard という広い概念が必要になる。",

    coreDefinition:
      "問題 H が NP-hard であるとは、∀L ∈ NP, L ≤ₚ H が成り立つことをいう。NP への帰属は要求しない。NP-complete ⊆ NP-hard という関係があり、NP-hard は「少なくとも NP のすべての問題と同じくらい難しい」という下限の主張。最適化問題・関数問題・計数問題も NP-hard になりうる。",

    intuition:
      "NP-complete が「NP のボス」なら、NP-hard は「それ以上の強敵も含む概念」。NP の外に出てもよい（PSPACE-complete や decidable だが超指数時間など）分、より広い。「これより簡単ではない」という下限のラベルで、上限（NP に属するかどうか）については何も言わない。",

    example:
      "NP-hard だが NP-complete でない問題の例：TSP の最適化版（最短巡回路を求めよ）、MAX-CLIQUE の最適化版（最大クリークのサイズを求めよ）、停止性問題（NP-hard だが undecidable）、PSPACE-complete 問題（NP-hard だが NP の外）。",

    misconception:
      "最大の誤解は「NP-hard = NP-complete」という同一視。NP-hard は NP への帰属を要求しない。停止性問題は NP-hard だが計算不可能（undecidable）であり、NP にも属さない。また「NP-hard なら絶対に解けない」という誤解もある。NP-hard は難しさの下限の主張であり、近似・特殊ケース・実用的なヒューリスティックは有効。",

    formulas: [
      {
        label: "定義",
        latex: "H \\text{ is NP-hard} \\iff \\forall L \\in \\mathrm{NP},\\,L \\le_p H",
        display: true,
      },
      {
        label: "関係",
        latex: "\\mathrm{NPC} \\subseteq \\mathrm{NP\\text{-}hard}",
      },
    ],

    miniQuiz: {
      question: "NP-hard の問題について正しいのはどれ？",
      options: [
        "NP-hard の問題はすべて NP にも属する（= NP 完全）",
        "NP-hard の問題は NP の外にある問題も含む",
        "NP-hard の問題は多項式時間では絶対に解けない",
        "NP-hard の問題はすべて決定問題である",
      ],
      correct: 1,
      explanation:
        "NP-hard は NP への帰属を要求しない。停止性問題のような計算不可能な問題も NP-hard になりうる。また最適化問題（決定問題でない）も NP-hard になりうる。NP-hard ⊇ NP-complete という包含関係で、NP-hard は NP-complete より広い概念。",
    },

    unlockQuiz: {
      question:
        "「P = NP」が証明されたとして、NP-hard 問題 H の扱いとして正しいのはどれ？",
      options: [
        "すべての NP-hard 問題が多項式時間で解けることになる",
        "H ∈ NP なら（= NP 完全なら）多項式時間で解けるが、H ∉ NP の NP-hard 問題は依然として困難なことがある",
        "NP-hard 全体が P に含まれることになる",
        "NP-hard という概念が消滅する",
      ],
      correct: 1,
      explanation:
        "P = NP は「NP のすべての問題が P に入る」ことを意味する。NP に属する NP-hard 問題（= NP 完全問題）は P に入るが、NP に属さない NP-hard 問題（停止性問題など）には影響しない。NP の外にある難しい問題は P = NP とは無関係に難しいまま。",
    },

    nextConnection:
      "NP-hard まで理解すると、計算複雑性の基礎地図（P, NP, NP-complete, NP-hard）が完成する。次は時間ではなくメモリ量で問題を測る「空間計算量」と PSPACE という新たな次元へ進み、複雑性の宇宙を縦横に広げていく。",
  },

  {
    id: "space-complexity",
    title: "空間計算量",
    kind: "foundation",
    sector: "Deep Field",
    keywords: ["space complexity", "workspace", "L", "PSPACE"],
    color: "#86EFAC",
    x: 76,
    y: 74,
    requires: ["np-class"],

    theme: "メモリ使用量という別の軸で問題の難しさを測る",

    goal:
      "計算時間とは独立したもう一つの複雑性の軸「空間計算量」を理解し、対数空間（L/NL）・多項式空間（PSPACE）という主要な空間クラスを把握する。L ⊆ NL ⊆ P ⊆ NP ⊆ PSPACE という包含関係を理解し、空間と時間の相互作用を考える。",

    motivation:
      "同じ問題でも、巨大なメモリを使うアルゴリズムと小さなメモリで動くアルゴリズムでは性質が大きく異なる。組み込みシステムやストリーミング処理など、メモリが制約要因になる場面では時間ではなく空間が主要なコスト。時間複雑性とは独立した空間複雑性の理論が必要になる。",

    coreDefinition:
      "空間計算量 S(n) は、入力サイズ n に対して最悪ケースで使用する作業メモリ（入力テープを除く）のセル数として定義される。主要な空間クラス：L = SPACE(log n)（対数空間）、NL = NSPACE(log n)（非決定性対数空間）、PSPACE = ⋃_{k≥1} SPACE(nᵏ)（多項式空間）。時間との関係：S(n) ≤ T(n)（空間は再利用できるため時間以下）。",

    intuition:
      "本を読みながら考えるイメージで：本のページ（入力）を何度も読み返せても、メモを書けるメモ帳のページ数（作業メモリ）が制限される。L は「メモ帳が log n ページだけ」、PSPACE は「多項式ページ使えるが、時間は無限に許容」という制約のクラス。時間と空間は違う軸で、PSPACE は時間に関して制約がないので NP を超えることができる。",

    example:
      "L に属する問題：グラフの到達可能性（DFS を使わず対数空間で）。NL に属する問題：有向グラフでの到達可能性（Savitch の定理により NL ⊆ L²）。PSPACE 完全な問題：量化 SAT（QSAT）、ゲームの勝利戦略判定（囲碁の簡易版など）。PSPACE は NP より大きい（少なくとも NP ⊆ PSPACE が成立）が等しいかどうかは未解決。",

    misconception:
      "「空間が小さければ時間も短い」という誤解がある。L ⊆ P は成立するが、対数空間で動くアルゴリズムの時間は多項式どころか超多項式になりうる（同じ状態を繰り返さなければ 2^(log n) = nᵏ のステップで止まる、という議論はある）。また「PSPACE = NP」ではないかという予想があるが、未解決。空間階層定理により L ⊊ PSPACE（真の包含）は証明済み。",

    formulas: [
      { label: "空間クラス", latex: "\\mathrm{SPACE}(s(n))" },
      {
        label: "基本包含",
        latex:
          "\\mathrm{L} \\subseteq \\mathrm{NL} \\subseteq \\mathrm{P} \\subseteq \\mathrm{NP} \\subseteq \\mathrm{PSPACE}",
        display: true,
      },
    ],

    miniQuiz: {
      question:
        "空間計算量が時間計算量と根本的に異なる点はどれ？",
      options: [
        "空間は O 記法で表せないが、時間は表せる",
        "空間（メモリ）は再利用できるため S(n) ≤ T(n) が常に成り立つ",
        "時間より空間の方が常に消費量が多い",
        "空間計算量はランダムアクセスマシンでしか定義できない",
      ],
      correct: 1,
      explanation:
        "メモリは上書き再利用できるが、時間は戻せない。T(n) ステップで動くアルゴリズムが使うメモリは最大でも T(n) セル。したがって S(n) ≤ T(n) が常に成立。逆は成り立たず（少ないメモリで多くの時間をかけることはできる）。",
    },

    unlockQuiz: {
      question:
        "L ⊆ NL ⊆ P ⊆ NP ⊆ PSPACE の包含関係で、「真の包含（⊊）」が現在証明されているのはどれか？",
      options: [
        "P ⊊ NP",
        "NP ⊊ PSPACE",
        "L ⊊ PSPACE",
        "NL ⊊ P",
      ],
      correct: 2,
      explanation:
        "空間階層定理により L ⊊ PSPACE（log n 空間と多項式空間は異なる）は証明済み。しかし P ⊊ NP（= P vs NP 問題）、NP ⊊ PSPACE、NL ⊊ P はすべて未解決の大問題。包含関係の連鎖は分かっているが、どこに「真の境界」があるかはほぼ未解明。",
    },

    nextConnection:
      "空間計算量の地平を理解すると、複雑性の宇宙がさらに広がる。PSPACE 完全問題（QSAT など）、対話型証明（IP）、ランダム化計算（BPP, ZPP, RP）、近似複雑性（APX）など、計算複雑性の多様な次元が待っている。",
  },
];
