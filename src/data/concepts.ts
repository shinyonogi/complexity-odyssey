export type ConceptKind =
  | "foundation"
  | "class"
  | "tool"
  | "problem"
  | "theorem";

export type ConceptNode = {
  id: string;
  title: string;
  short: string;
  summary: string;
  intuition: string;
  details: string;
  example: string;
  pitfall: string;
  unlocks: string;
  keywords: string[];
  formulas: Array<{
    label: string;
    latex: string;
    display?: boolean;
  }>;
  requires: string[];
  kind: ConceptKind;
  sector: string;
  x: number;
  y: number;
  color: string;
};

export const startingNodeId = "decision-problem";

export const conceptNodes: ConceptNode[] = [
  {
    id: "decision-problem",
    title: "Decision Problems",
    short: "Yes / No で答える問題形式",
    summary: "計算複雑性では問題を yes/no で答える形へそろえて比べる。",
    intuition:
      "最適化問題や探索問題はそのままだと比較軸がぶれやすい。まず『条件を満たす解が存在するか』という問いへ落とすと、アルゴリズムの速さを整理しやすい。",
    details:
      "複雑性クラス P, NP, PSPACE は典型的には決定問題の集合として定義される。たとえば『長さ 10 以下の巡回路を持つか』のように閾値つきの存在判定へ変えるのが基本になる。",
    example: "グラフに長さ 10 以下の経路が存在するか?",
    pitfall:
      "複雑性理論が yes/no 問題だけを扱うわけではない。まず決定版を核として理論を組み、その後に最適化版や探索版へ戻る。",
    unlocks: "時間計算量と P の意味が読めるようになる。",
    keywords: ["decision problem", "language", "yes/no", "instance"],
    formulas: [
      {
        label: "言語として書く",
        latex: "L \\subseteq \\{0,1\\}^*",
      },
      {
        label: "判定器",
        latex: "x \\in L\\ ?",
      },
    ],
    requires: [],
    kind: "foundation",
    sector: "Launch Bay",
    x: 12,
    y: 52,
    color: "#7DD3FC",
  },
  {
    id: "time-complexity",
    title: "Time Complexity",
    short: "入力サイズに対して何ステップ必要か",
    summary: "入力長 n に対して計算回数がどう増えるかを見る座標軸。",
    intuition:
      "小さい入力では速く見えるアルゴリズムも、n が大きくなると急に使えなくなる。そこで n を大きくしたときの成長率だけを追う。",
    details:
      "時間計算量は通常 worst-case のステップ数 T(n) で表す。複雑性理論では定数倍や低次項を無視した O 記法が使われ、多項式時間か指数時間かが大きな分水嶺になる。",
    example: "O(n^2) は多項式時間、O(2^n) は指数時間。",
    pitfall:
      "現実で速いことと理論上多項式時間であることは同じではない。O(n^{100}) は多項式時間だが実用的とは限らない。",
    unlocks: "P と効率的アルゴリズムの感覚が入る。",
    keywords: ["T(n)", "Big-O", "polynomial time", "exponential time"],
    formulas: [
      {
        label: "多項式時間の形",
        latex: "T(n) \\le c\\,n^k",
      },
      {
        label: "指数時間の例",
        latex: "T(n)=2^n",
      },
    ],
    requires: ["decision-problem"],
    kind: "foundation",
    sector: "Launch Bay",
    x: 24,
    y: 28,
    color: "#A5F3FC",
  },
  {
    id: "p-class",
    title: "P",
    short: "多項式時間で解ける決定問題の集合",
    summary: "P は『効率的に解ける』とみなす問題の中核クラス。",
    intuition:
      "入力が大きくなっても、計算時間が n の多項式で抑えられるなら、その問題は構造的に扱いやすいと考える。",
    details:
      "厳密には、決定問題 L が P に属するとは、ある決定アルゴリズム A と定数 c,k が存在して全入力 x に対して A が c|x|^k ステップ以内に停止し、x \\in L を正しく判定することをいう。",
    example: "最短路、連結判定、最小全域木などの決定版。",
    pitfall:
      "P は『簡単』そのものではなく、理論上の効率性の基準。実装定数やメモリ消費は別問題として残る。",
    unlocks: "NP と比較して、検証と探索の差が見えてくる。",
    keywords: ["P", "deterministic", "polytime", "tractable"],
    formulas: [
      {
        label: "P の定義",
        latex: "\\mathrm{P}=\\bigcup_{k \\ge 1} \\mathrm{TIME}(n^k)",
        display: true,
      },
      {
        label: "基本関係",
        latex: "\\mathrm{P} \\subseteq \\mathrm{NP}",
      },
    ],
    requires: ["time-complexity"],
    kind: "class",
    sector: "Core Systems",
    x: 39,
    y: 44,
    color: "#93C5FD",
  },
  {
    id: "verifier",
    title: "Polynomial Verifier",
    short: "候補解を素早く検証する視点",
    summary: "解を見つけるより『与えられた証拠が正しいか』を速く確かめる機械。",
    intuition:
      "迷路の出口を自力で探すのは大変でも、誰かに『この道順で出られる』と言われれば確認は早い。NP はこの感覚で定義される。",
    details:
      "検証器 V は入力 x と証明 y を受け取り、多項式時間で受理/棄却する。yes-instance には短い証明 y が存在し、no-instance にはどんな y を与えても受理しない。",
    example: "巡回路候補が本当に Hamiltonian cycle かを確かめる。",
    pitfall:
      "検証器が速いことは、証明を生成する手順が速いことを意味しない。そこが P と NP のギャップになる。",
    unlocks: "NP を『検証可能性』で理解できる。",
    keywords: ["verifier", "certificate", "witness", "polytime check"],
    formulas: [
      {
        label: "検証器による定義",
        latex: "x \\in L \\iff \\exists y,\\ |y| \\le |x|^k \\text{ and } V(x,y)=1",
        display: true,
      },
    ],
    requires: ["time-complexity"],
    kind: "tool",
    sector: "Core Systems",
    x: 45,
    y: 20,
    color: "#C4B5FD",
  },
  {
    id: "np-class",
    title: "NP",
    short: "解の正しさを多項式時間で検証できる問題群",
    summary: "yes-instance に対して短い証明があり、それを速く検証できる問題群。",
    intuition:
      "『見つけるのは難しいが、見せられれば確認は速い』問題を集めたクラスが NP。",
    details:
      "NP は nondeterministic polynomial time の略だが、学習初期では多項式時間検証器による定義が直感的。P に含まれる問題ももちろん NP に入る。",
    example: "SAT, Hamiltonian Cycle, Clique の決定版。",
    pitfall:
      "NP は 'not polynomial' ではない。P も NP に含まれるので、NP は『難しい問題だけの箱』ではない。",
    unlocks: "P vs NP と NP 完全性へ進める。",
    keywords: ["NP", "certificate", "nondeterminism", "verifier"],
    formulas: [
      {
        label: "検証器の形",
        latex: "\\mathrm{NP}=\\{L \\mid \\exists \\text{ polytime verifier } V\\}",
        display: true,
      },
      {
        label: "包含関係",
        latex: "\\mathrm{P} \\subseteq \\mathrm{NP}",
      },
    ],
    requires: ["p-class", "verifier"],
    kind: "class",
    sector: "Core Systems",
    x: 58,
    y: 38,
    color: "#F9A8D4",
  },
  {
    id: "reduction",
    title: "Polynomial Reduction",
    short: "問題の難しさを移送する変換",
    summary: "問題 A の難しさを問題 B へ写し込む多項式時間変換。",
    intuition:
      "A の入力を B の入力へ変形して、B の答えがそのまま A の答えを教えてくれるなら、B は少なくとも A くらい難しい。",
    details:
      "多項式時間 many-one 還元 A \\le_p B とは、多項式時間で計算できる関数 f が存在し、任意の入力 x について x \\in A \\iff f(x) \\in B が成り立つことをいう。",
    example: "SAT を 3SAT に変換する。",
    pitfall:
      "還元の向きは直感に反しやすい。A \\le_p B は『A が B より簡単』ではなく、『B を解ければ A も解ける』という意味。",
    unlocks: "NP-hard と NP-complete の証明ルートが開く。",
    keywords: ["reduction", "many-one", "mapping", "hardness"],
    formulas: [
      {
        label: "還元の定義",
        latex: "A \\le_p B \\iff \\exists f \\in \\mathrm{FP}\\;\\forall x\\;(x \\in A \\iff f(x) \\in B)",
        display: true,
      },
      {
        label: "難しさの伝播",
        latex: "A \\le_p B \\land B \\in \\mathrm{P} \\Rightarrow A \\in \\mathrm{P}",
      },
    ],
    requires: ["np-class"],
    kind: "tool",
    sector: "Warp Gate",
    x: 67,
    y: 57,
    color: "#FDE68A",
  },
  {
    id: "sat",
    title: "SAT",
    short: "論理式を真にできるかを問う問題",
    summary: "命題論理式に真偽値を入れて全体を真にできるかを問う。",
    intuition:
      "多数の条件を同時に満たす設定が存在するかを見る、制約充足の原型のような問題。",
    details:
      "通常は CNF で与えられることが多い。各 clause が少なくとも 1 つ真になるように変数へ代入を与えられるかを判定する。",
    example: "(x or y) and (not x or z) を満たす代入はあるか?",
    pitfall:
      "SAT は『論理っぽいから簡単』ではない。むしろ多くの組合せ問題を論理式へ符号化できるので、難しさの基準点になる。",
    unlocks: "Cook-Levin と NP 完全性の実感がつながる。",
    keywords: ["SAT", "CNF", "assignment", "clause"],
    formulas: [
      {
        label: "CNF の形",
        latex: "\\varphi = \\bigwedge_{i=1}^{m} \\left(\\bigvee_{j=1}^{k_i} \\ell_{ij}\\right)",
        display: true,
      },
      {
        label: "SAT の問い",
        latex: "\\exists a \\in \\{0,1\\}^n\\;[\\varphi(a)=1] \\ ?",
      },
    ],
    requires: ["np-class"],
    kind: "problem",
    sector: "Boolean Nebula",
    x: 72,
    y: 24,
    color: "#FDBA74",
  },
  {
    id: "cook-levin",
    title: "Cook-Levin",
    short: "SAT が NP 完全であることを示す定理",
    summary: "任意の NP 問題は SAT に多項式時間で還元できる。",
    intuition:
      "『検証器の計算過程そのもの』を論理式で表現すれば、元の NP 問題を SAT として言い換えられる。",
    details:
      "多項式時間で動く非決定性計算または検証器の計算表をブール変数で表し、各時刻・各セルで成立すべき局所制約を論理式として組み上げる。",
    example: "多項式時間検証器の計算過程を論理式に符号化する。",
    pitfall:
      "Cook-Levin は SAT が NP に入ることだけを示す定理ではない。『NP の全問題が SAT へ落ちる』という NP-hard 側が本体。",
    unlocks: "NP 完全の概念がボス星として開く。",
    keywords: ["Cook-Levin", "tableau", "encoding", "NP-complete"],
    formulas: [
      {
        label: "定理の核",
        latex: "\\forall L \\in \\mathrm{NP},\\; L \\le_p \\mathrm{SAT}",
        display: true,
      },
      {
        label: "結論",
        latex: "\\mathrm{SAT} \\in \\mathrm{NP} \\land \\forall L \\in \\mathrm{NP},\\,L \\le_p \\mathrm{SAT}",
      },
    ],
    requires: ["sat", "reduction"],
    kind: "theorem",
    sector: "Boolean Nebula",
    x: 82,
    y: 47,
    color: "#FCA5A5",
  },
  {
    id: "npc",
    title: "NP-Complete",
    short: "NP に属し、かつ NP の中で最難級",
    summary: "NP に属し、しかも NP のあらゆる問題がそこへ還元できる問題群。",
    intuition:
      "NP の代表ボス戦。どれか 1 つでも多項式時間で解ければ、NP の全部が多項式時間で解ける。",
    details:
      "問題 C が NP-complete であるとは、(1) C \\in NP かつ (2) 任意の L \\in NP について L \\le_p C が成り立つこと。証明では通常、既知の NP-complete 問題からの還元を作る。",
    example: "SAT, 3SAT, Clique, Vertex Cover など。",
    pitfall:
      "NP-complete であることは『絶対に解けない』ことではない。指数時間アルゴリズムや特殊ケース、近似、パラメータ化など別のアプローチはありうる。",
    unlocks: "NP-hard や代表問題群の理解へ進める。",
    keywords: ["NP-complete", "hardness", "reduction", "membership"],
    formulas: [
      {
        label: "定義",
        latex: "C \\text{ is NP-complete } \\iff C \\in \\mathrm{NP} \\land \\forall L \\in \\mathrm{NP},\\,L \\le_p C",
        display: true,
      },
      {
        label: "もし一つが速く解けたら",
        latex: "C \\in \\mathrm{NPC} \\land C \\in \\mathrm{P} \\Rightarrow \\mathrm{P}=\\mathrm{NP}",
      },
    ],
    requires: ["cook-levin"],
    kind: "class",
    sector: "Frontier Rim",
    x: 90,
    y: 31,
    color: "#FB7185",
  },
  {
    id: "nph",
    title: "NP-Hard",
    short: "少なくとも NP の全問題以上に難しい",
    summary: "NP の全問題が還元できるが、必ずしも NP に属するとは限らない。",
    intuition:
      "難しさの上限ではなく下限を表すラベル。『これより簡単ではない』という意味で使う。",
    details:
      "最適化問題や停止性に近い問題など、yes/no 形式にそのまま乗らないものでも NP-hard はありうる。NP-complete は NP-hard の中で NP にも属する部分集合。",
    example: "巡回セールスマン問題の最適化版。",
    pitfall:
      "NP-hard は NP の外に出てもよいので、NP-complete より広い概念。両者を同一視すると理論の輪郭がぼやける。",
    unlocks: "決定問題以外にも複雑性の地図が広がる。",
    keywords: ["NP-hard", "optimization", "hardness", "not necessarily in NP"],
    formulas: [
      {
        label: "定義",
        latex: "H \\text{ is NP-hard } \\iff \\forall L \\in \\mathrm{NP},\\,L \\le_p H",
        display: true,
      },
      {
        label: "関係",
        latex: "\\mathrm{NPC} \\subseteq \\mathrm{NP\\text{-}hard}",
      },
    ],
    requires: ["npc"],
    kind: "class",
    sector: "Frontier Rim",
    x: 94,
    y: 58,
    color: "#F87171",
  },
  {
    id: "space-complexity",
    title: "Space Complexity",
    short: "使うメモリ量で見る別軸の難しさ",
    summary: "計算時間ではなく、必要な作業メモリ量で問題を測る軸。",
    intuition:
      "同じ時間でも、巨大なメモリを必要とするか、小さな作業領域で済むかでアルゴリズムの性質は大きく変わる。",
    details:
      "空間計算量は作業テープの使用量 S(n) で測る。入力自体の置き場所は別扱いにすることが多く、対数空間や多項式空間が主要なクラスになる。",
    example: "対数空間で解けるか、多項式空間が必要か。",
    pitfall:
      "時間と空間は完全には独立でない。一般に空間が小さい計算は時間もある程度制約されるが、両者の階層構造は一致しない。",
    unlocks: "PSPACE のような次の銀河へ進める。",
    keywords: ["space complexity", "workspace", "L", "PSPACE"],
    formulas: [
      {
        label: "空間クラス",
        latex: "\\mathrm{SPACE}(s(n))",
      },
      {
        label: "基本包含",
        latex: "\\mathrm{L} \\subseteq \\mathrm{NL} \\subseteq \\mathrm{P} \\subseteq \\mathrm{PSPACE}",
        display: true,
      },
    ],
    requires: ["np-class"],
    kind: "foundation",
    sector: "Deep Field",
    x: 76,
    y: 74,
    color: "#86EFAC",
  },
];
