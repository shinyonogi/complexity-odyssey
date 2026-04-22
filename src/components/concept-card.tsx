"use client";

import { useEffect, useRef, useState } from "react";
import MathFormula from "@/components/math-formula";
import type { ConceptNode, QuizQuestion } from "@/data/concepts";

const PAGE_LABELS = ["学習", "クイズ①", "クイズ②", "つながり"] as const;
const TOTAL_PAGES = 4;

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className={`text-[10px] sm:text-[11px] uppercase tracking-[0.28em] ${color} mb-2`}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Learning page ───────────────────────────────────────────────────────────

function LearningPage({ node }: { node: ConceptNode }) {
  return (
    <div className="space-y-3 pb-2">
      {/* Goal */}
      <Section label="理解してほしいこと" color="text-cyan-200/70">
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.goal}</p>
      </Section>

      {/* Motivation */}
      <Section label="なぜ必要か" color="text-fuchsia-200/70">
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.motivation}</p>
      </Section>

      {/* Core definition + formulas */}
      <Section label="コア概念・定義" color="text-amber-200/70">
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.coreDefinition}</p>
        {node.formulas.length > 0 && (
          <div className="mt-3 space-y-2">
            {node.formulas.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-white/8 bg-slate-950/50 px-3 py-2"
              >
                <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                  {f.label}
                </div>
                <div className="overflow-x-auto text-[14px] text-cyan-50">
                  <MathFormula latex={f.latex} displayMode={f.display} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Intuition */}
      <Section label="直感的な説明" color="text-emerald-200/70">
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.intuition}</p>
      </Section>

      {/* Example */}
      <Section label="具体例" color="text-sky-200/70">
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.example}</p>
      </Section>

      {/* Misconception */}
      <Section label="よくある誤解" color="text-rose-200/70">
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.misconception}</p>
      </Section>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5">
        {node.keywords.map((kw) => (
          <span
            key={kw}
            className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-slate-400"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Quiz page ───────────────────────────────────────────────────────────────

function QuizPage({
  quiz,
  label,
  answer,
  onAnswer,
}: {
  quiz: QuizQuestion;
  label: string;
  answer: number | null;
  onAnswer: (i: number) => void;
}) {
  const answered = answer !== null;
  const correct = answered && answer === quiz.correct;

  return (
    <div className="space-y-4 pb-2">
      {/* Header */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-violet-200/70 mb-2">
          {label}
        </div>
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100 font-medium">
          {quiz.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const isSelected = answer === i;
          const isCorrect = i === quiz.correct;

          let ringColor = "border-white/10 bg-white/[0.03] text-slate-200";
          if (answered) {
            if (isCorrect) {
              ringColor =
                "border-emerald-400/60 bg-emerald-500/10 text-emerald-100";
            } else if (isSelected && !isCorrect) {
              ringColor = "border-rose-400/60 bg-rose-500/10 text-rose-100";
            } else {
              ringColor = "border-white/5 bg-white/[0.02] text-slate-500";
            }
          } else if (isSelected) {
            ringColor =
              "border-cyan-400/60 bg-cyan-500/10 text-cyan-100";
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              disabled={answered}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm sm:text-base leading-6 sm:leading-7 transition-all duration-200 ${ringColor} ${
                !answered ? "hover:border-white/25 hover:bg-white/[0.06]" : ""
              }`}
            >
              <span className="mr-2 text-[10px] tracking-wider opacity-60">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Result + explanation */}
      {answered && (
        <div
          className={`rounded-2xl border p-4 ${
            correct
              ? "border-emerald-400/30 bg-emerald-500/10"
              : "border-rose-400/30 bg-rose-500/10"
          }`}
        >
          <div
            className={`text-[10px] sm:text-[11px] uppercase tracking-[0.26em] mb-2 font-semibold ${
              correct ? "text-emerald-300/80" : "text-rose-300/80"
            }`}
          >
            {correct ? "✓ 正解！" : "✗ 不正解"}
          </div>
          <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Connection page ──────────────────────────────────────────────────────────

function ConnectionPage({ node }: { node: ConceptNode }) {
  return (
    <div className="space-y-4 pb-2">
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-cyan-200/70 mb-2">
          次のNodeへのつながり
        </div>
        <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-100">{node.nextConnection}</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400 mb-2">
          エリア
        </div>
        <span className="text-sm text-slate-300">{node.sector}</span>
      </div>
    </div>
  );
}

// ─── Main card ───────────────────────────────────────────────────────────────

export default function ConceptCard({
  node,
  onClose,
}: {
  node: ConceptNode;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [miniAnswer, setMiniAnswer] = useState<number | null>(null);
  const [unlockAnswer, setUnlockAnswer] = useState<number | null>(null);

  // Reset when node changes
  useEffect(() => {
    setPage(0);
    setMiniAnswer(null);
    setUnlockAnswer(null);
  }, [node.id]);

  // Horizontal swipe to change pages
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeAxisRef = useRef<"none" | "h" | "v">("none");

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
    swipeAxisRef.current = "none";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!swipeStartRef.current || swipeAxisRef.current === "v") return;
    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;
    if (swipeAxisRef.current === "none" && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      swipeAxisRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!swipeStartRef.current || swipeAxisRef.current !== "h") {
      swipeStartRef.current = null;
      swipeAxisRef.current = "none";
      return;
    }
    const dx = e.clientX - swipeStartRef.current.x;
    if (Math.abs(dx) > 48) {
      if (dx < 0 && page < TOTAL_PAGES - 1) setPage((p) => p + 1);
      if (dx > 0 && page > 0) setPage((p) => p - 1);
    }
    swipeStartRef.current = null;
    swipeAxisRef.current = "none";
  };

  const kindLabel: Record<string, string> = {
    foundation: "基礎",
    class: "クラス",
    tool: "道具",
    problem: "問題",
    theorem: "定理",
  };

  return (
    <div
      className="pointer-events-auto flex flex-col w-full max-w-2xl sm:max-w-3xl max-h-[65vh] sm:max-h-[72vh] rounded-[20px] sm:rounded-[26px] border border-white/10 bg-slate-950/80 shadow-[0_24px_80px_rgba(2,6,23,0.7)] backdrop-blur-2xl card-rise overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-4 pb-3 sm:px-5 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] uppercase tracking-[0.32em] text-cyan-200/60">
                新着信号
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-slate-400">
                {kindLabel[node.kind] ?? node.kind}
              </span>
            </div>
            <h2 className="mt-1 text-lg sm:text-3xl text-white leading-tight">
              {node.title}
            </h2>
            <p className="mt-0.5 text-[11px] sm:text-sm text-slate-400 leading-5">
              {node.theme}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-400 transition hover:bg-white/[0.12] hover:text-white"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mt-3 flex gap-1 overflow-x-auto scrollbar-hide">
          {PAGE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`shrink-0 rounded-full px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                page === i
                  ? "bg-white/[0.12] text-white border border-white/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="shrink-0 border-t border-white/8" />

      {/* ── Scrollable content ── */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
        {page === 0 && <LearningPage node={node} />}
        {page === 1 && (
          <QuizPage
            quiz={node.miniQuiz}
            label="ミニクイズ"
            answer={miniAnswer}
            onAnswer={setMiniAnswer}
          />
        )}
        {page === 2 && (
          <QuizPage
            quiz={node.unlockQuiz}
            label="アンロッククイズ"
            answer={unlockAnswer}
            onAnswer={setUnlockAnswer}
          />
        )}
        {page === 3 && <ConnectionPage node={node} />}
      </div>

      {/* ── Footer nav ── */}
      <div className="shrink-0 border-t border-white/8 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="text-[10px] uppercase tracking-[0.2em] text-slate-500 disabled:opacity-30 hover:text-slate-300 transition px-2 py-1"
        >
          ← 前へ
        </button>

        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${
                page === i
                  ? "w-4 h-1.5 bg-white/70"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={PAGE_LABELS[i]}
            />
          ))}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
          disabled={page === TOTAL_PAGES - 1}
          className="text-[10px] uppercase tracking-[0.2em] text-slate-500 disabled:opacity-30 hover:text-slate-300 transition px-2 py-1"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
