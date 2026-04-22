"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ConceptCard from "@/components/concept-card";
import { conceptNodes, startingNodeId } from "@/data/concepts";

type ProgressState = {
  currentNodeId: string;
  discoveredIds: string[];
};

type RocketPosition = {
  x: number;
  y: number;
};

type OverlayState = {
  nodeId: string;
  kind: "arrival";
};

const STORAGE_KEY = "complexity-atlas:voyager-v2";
const TRAVEL_MS = 1800;
const SpaceBackground = dynamic(() => import("@/components/space-background"), {
  ssr: false,
});

const nodeById = Object.fromEntries(conceptNodes.map((node) => [node.id, node]));
const edges = conceptNodes.flatMap((node) =>
  node.requires.map((from) => ({
    id: `${from}-${node.id}`,
    from,
    to: node.id,
  })),
);
const adjacentNodeIds = Object.fromEntries(
  conceptNodes.map((node) => [node.id, new Set<string>()]),
);

for (const edge of edges) {
  adjacentNodeIds[edge.from].add(edge.to);
  adjacentNodeIds[edge.to].add(edge.from);
}

const defaultProgress: ProgressState = {
  currentNodeId: startingNodeId,
  discoveredIds: [startingNodeId],
};

const toRocketPosition = (id: string): RocketPosition => {
  const node = nodeById[id];
  return { x: node.x, y: node.y };
};

const parseProgress = (raw: string | null): ProgressState => {
  if (!raw) return defaultProgress;

  try {
    const parsed = JSON.parse(raw) as ProgressState;
    if (
      !parsed ||
      typeof parsed.currentNodeId !== "string" ||
      !Array.isArray(parsed.discoveredIds)
    ) {
      return defaultProgress;
    }

    const discoveredIds = parsed.discoveredIds.filter(
      (id) => typeof id === "string" && id in nodeById,
    );

    if (!discoveredIds.includes(parsed.currentNodeId)) {
      discoveredIds.push(parsed.currentNodeId);
    }

    if (!discoveredIds.length || !(parsed.currentNodeId in nodeById)) {
      return defaultProgress;
    }

    return {
      currentNodeId: parsed.currentNodeId,
      discoveredIds,
    };
  } catch {
    return defaultProgress;
  }
};

const unique = (items: string[]) => Array.from(new Set(items));

export default function Home() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [rocketPosition, setRocketPosition] = useState<RocketPosition>(
    toRocketPosition(startingNodeId),
  );
  const [travellingToId, setTravellingToId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<OverlayState | null>({
    nodeId: startingNodeId,
    kind: "arrival",
  });
  const [hasHydrated, setHasHydrated] = useState(false);
  const [rocketAngle, setRocketAngle] = useState(0);

  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const panStartRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const travelTimerRef = useRef<number | null>(null);
  const overlayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // We intentionally restore persisted progress after mount so SSR and hydration
    // both start from the same deterministic state.
    const stored = parseProgress(localStorage.getItem(STORAGE_KEY));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(stored);
    setRocketPosition(toRocketPosition(stored.currentNodeId));
    setOverlay({ nodeId: stored.currentNodeId, kind: "arrival" });
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hasHydrated, progress]);

  useEffect(() => {
    return () => {
      if (travelTimerRef.current) {
        window.clearTimeout(travelTimerRef.current);
      }
      if (overlayTimerRef.current) {
        window.clearTimeout(overlayTimerRef.current);
      }
    };
  }, []);

  const currentNode = nodeById[progress.currentNodeId];
  const discoveredCount = progress.discoveredIds.length;
  const progressPercent = Math.round(
    (discoveredCount / conceptNodes.length) * 100,
  );

  const canReachNode = (nodeId: string) =>
    nodeById[nodeId].requires.every((requiredId) =>
      progress.discoveredIds.includes(requiredId),
    );

  const showOverlay = (nodeId: string, kind: OverlayState["kind"]) => {
    setOverlay({ nodeId, kind });
  };

  const resetVoyage = () => {
    if (travelTimerRef.current) {
      window.clearTimeout(travelTimerRef.current);
      travelTimerRef.current = null;
    }
    if (overlayTimerRef.current) {
      window.clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }

    setProgress(defaultProgress);
    setRocketPosition(toRocketPosition(startingNodeId));
    setRocketAngle(0);
    setTravellingToId(null);
    setHoveredId(null);
    setOverlay({ nodeId: startingNodeId, kind: "arrival" });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
  };

  const isAdjacentToCurrent = (nodeId: string) =>
    adjacentNodeIds[progress.currentNodeId].has(nodeId);

  const canTravelToNode = (nodeId: string) => {
    if (nodeId === progress.currentNodeId) return false;
    if (!isAdjacentToCurrent(nodeId)) return false;

    return (
      progress.discoveredIds.includes(nodeId) ||
      canReachNode(nodeId)
    );
  };

  const startTravel = (nodeId: string) => {
    if (travellingToId || nodeId === progress.currentNodeId) return;
    if (!canTravelToNode(nodeId)) return;

    const fromNode = nodeById[progress.currentNodeId];
    const toNode = nodeById[nodeId];
    const dx = (toNode.x - fromNode.x) * window.innerWidth;
    const dy = (toNode.y - fromNode.y) * window.innerHeight;
    setRocketAngle(Math.atan2(dx, -dy) * (180 / Math.PI));

    setTravellingToId(nodeId);
    setHoveredId(null);
    setRocketPosition(toRocketPosition(nodeId));

    travelTimerRef.current = window.setTimeout(() => {
      setProgress((prev) => ({
        currentNodeId: nodeId,
        discoveredIds: unique([...prev.discoveredIds, nodeId]),
      }));
      setTravellingToId(null);
      setRocketAngle(0);
      showOverlay(nodeId, "arrival");
      travelTimerRef.current = null;
    }, TRAVEL_MS);
  };

  const overlayNode = overlay ? nodeById[overlay.nodeId] : null;

  const handleMapPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    panStartRef.current = { px: e.clientX, py: e.clientY, ox: panOffset.x, oy: panOffset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMapPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panStartRef.current) return;
    const dx = e.clientX - panStartRef.current.px;
    const dy = e.clientY - panStartRef.current.py;
    if (!isDragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) setIsDragging(true);
    const maxX = window.innerWidth * 0.5;
    const maxY = window.innerHeight * 0.5;
    setPanOffset({
      x: Math.max(-maxX, Math.min(maxX, panStartRef.current.ox + dx)),
      y: Math.max(-maxY, Math.min(maxY, panStartRef.current.oy + dy)),
    });
  };

  const handleMapPointerUp = () => {
    panStartRef.current = null;
    setIsDragging(false);
  };

  const centerOnCurrentNode = () => {
    const node = nodeById[progress.currentNodeId];
    setIsSnapping(true);
    setPanOffset({
      x: window.innerWidth * (0.5 - node.x / 100),
      y: window.innerHeight * (0.5 - node.y / 100),
    });
    window.setTimeout(() => setIsSnapping(false), 400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(244,114,182,0.12),transparent_22%),radial-gradient(circle_at_50%_90%,rgba(251,191,36,0.12),transparent_28%)]" />
      <SpaceBackground />
      <div className="absolute inset-0 starfield opacity-35" />

      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="pointer-events-none rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 sm:px-4 sm:py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/90 sm:text-[13px]">
            Complexity Odyssey
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={centerOnCurrentNode}
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-slate-300 transition hover:bg-white/[0.1] sm:px-4 sm:py-2"
            aria-label="Center on current node"
          >
            ⊙
          </button>
          <button
            onClick={resetVoyage}
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-slate-300 transition hover:bg-white/[0.1] sm:px-4 sm:py-2"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        className={`relative h-screen w-full touch-none select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handleMapPointerDown}
        onPointerMove={handleMapPointerMove}
        onPointerUp={handleMapPointerUp}
        onPointerCancel={handleMapPointerUp}
      >
        <div
          className={`absolute inset-0 ${isSnapping ? "transition-transform duration-[400ms] ease-out" : ""}`}
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
        <svg className="absolute inset-0 h-full w-full">
          {edges.map((edge) => {
            const from = nodeById[edge.from];
            const to = nodeById[edge.to];
            const edgeTouchesCurrent =
              edge.from === progress.currentNodeId || edge.to === progress.currentNodeId;
            const edgeTargetId =
              edge.from === progress.currentNodeId ? edge.to
              : edge.to === progress.currentNodeId ? edge.from
              : null;
            const edgeIsTravelable =
              edgeTouchesCurrent && edgeTargetId ? canTravelToNode(edgeTargetId) : false;
            const highlightedTargetId = travellingToId ?? hoveredId;
            const currentPath =
              highlightedTargetId !== null &&
              ((edge.from === progress.currentNodeId && edge.to === highlightedTargetId) ||
                (edge.to === progress.currentNodeId && edge.from === highlightedTargetId));

            return (
              <line
                key={edge.id}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={
                  currentPath
                    ? "rgba(125,211,252,0.72)"
                    : edgeIsTravelable
                      ? "rgba(148,163,184,0.24)"
                      : "rgba(71,85,105,0.12)"
                }
                strokeWidth={currentPath ? "2.4" : "1.3"}
                strokeDasharray={edgeIsTravelable ? "0" : "4 10"}
                className={currentPath ? "path-glow" : ""}
              />
            );
          })}
        </svg>

        {conceptNodes.map((node) => {
          const discovered = progress.discoveredIds.includes(node.id);
          const reachable = canReachNode(node.id);
          const travelable = canTravelToNode(node.id);
          const active = progress.currentNodeId === node.id;
          const visible = discovered || reachable;

          return (
            <button
              key={node.id}
              onPointerEnter={() => setHoveredId(node.id)}
              onPointerLeave={() => setHoveredId((prev) => (prev === node.id ? null : prev))}
              onClick={() => startTravel(node.id)}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 touch-manipulation transition duration-500 ${
                travelable ? "cursor-pointer" : visible ? "cursor-default" : "cursor-not-allowed"
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              aria-label={visible ? node.title : "Locked concept"}
            >
              <span
                className={`absolute inset-0 rounded-full blur-2xl transition duration-500 ${
                  visible ? "opacity-100" : "opacity-15"
                } ${active ? "scale-[1.9]" : "scale-[1.3]"}`}
                style={{ backgroundColor: node.color }}
              />
              {/* Invisible tap target for mobile */}
              <span className="absolute inset-[-14px]" aria-hidden />
              <span
                className={`relative block rounded-full transition-all duration-500 ${
                  active
                    ? "h-7 w-7 border border-white/80 bg-white shadow-[0_0_26px_rgba(255,255,255,0.85)]"
                    : discovered
                      ? "h-5 w-5 border border-white/40 bg-white/85"
                      : travelable
                        ? "h-4 w-4 border border-cyan-200/60 bg-cyan-200/90"
                        : reachable
                          ? "h-4 w-4 border border-white/25 bg-white/35"
                        : "h-2.5 w-2.5 border border-white/10 bg-white/10"
                }`}
              />
              {visible ? (
                <>
                  <span className="pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-950/72 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/0 opacity-0 shadow-[0_10px_30px_rgba(2,6,23,0.45)] transition duration-300 group-hover:text-white/90 group-hover:opacity-100">
                    {node.title}
                  </span>
                  {travelable && !active ? (
                    <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-cyan-100/0 opacity-0 transition duration-300 group-hover:text-cyan-100/75 group-hover:opacity-100">
                      Tap to travel
                    </span>
                  ) : null}
                </>
              ) : null}
            </button>
          );
        })}

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[1800ms]"
          style={{ left: `${rocketPosition.x}%`, top: `${rocketPosition.y}%` }}
        >
          {/* Rotation wrapper: faces travel direction, smoothly returns upright on landing */}
          <div
            style={{
              transform: `rotate(${rocketAngle}deg)`,
              transition: `transform ${travellingToId ? "350ms" : "700ms"} ease-in-out`,
            }}
          >
            {/* Bob (idle) / engine-pulse (travel) wrapper */}
            <div className={travellingToId ? "rocket-travel" : "rocket-bob"}>
              {/* Ambient glow halo */}
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/12 blur-3xl" />

              {/* Thruster fire — dim at rest, big & pulsing during travel */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b blur-md transition-[height,width,opacity] duration-300 ${
                  travellingToId
                    ? "rocket-fire-travel h-24 w-5 from-orange-300 to-transparent opacity-100"
                    : "h-8 w-2 from-orange-300/60 to-transparent opacity-60"
                }`}
                style={{ top: "72px" }}
              />
              {travellingToId && (
                <div
                  className="rocket-fire-travel absolute left-1/2 -translate-x-1/2 h-14 w-2 rounded-full bg-gradient-to-b from-yellow-100/90 to-transparent blur-sm opacity-80"
                  style={{ top: "72px" }}
                />
              )}

              {/* Rocket body — iconic nose cone + body + swept fins */}
              <div
                className="relative flex flex-col items-center"
                style={{ filter: "drop-shadow(0 0 14px rgba(125,211,252,0.75))" }}
              >
                {/* Nose cone (CSS border triangle) */}
                <div
                  style={{
                    width: 0, height: 0,
                    borderLeft: "14px solid transparent",
                    borderRight: "14px solid transparent",
                    borderBottom: "22px solid #f1f5f9",
                  }}
                />

                {/* Main body */}
                <div
                  className="relative"
                  style={{
                    width: "28px", height: "54px",
                    background:
                      "linear-gradient(to right, #94a3b8 0%, #f1f5f9 28%, #ffffff 50%, #f1f5f9 72%, #94a3b8 100%)",
                  }}
                >
                  {/* Porthole */}
                  <div
                    style={{
                      position: "absolute", top: "9px", left: "50%",
                      transform: "translateX(-50%)",
                      width: "13px", height: "13px", borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #164e63, #0c1a2e)",
                      border: "2px solid rgba(125,211,252,0.9)",
                      boxShadow: "inset 0 0 5px rgba(125,211,252,0.3)",
                    }}
                  />

                  {/* Accent stripe */}
                  <div
                    style={{
                      position: "absolute", left: 0, right: 0, top: "30px", height: "8px",
                      background: "linear-gradient(to right, #b91c1c, #f97316, #b91c1c)",
                    }}
                  />

                  {/* Nozzle */}
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: "5px", right: "5px",
                      height: "7px", background: "#334155", borderRadius: "0 0 3px 3px",
                    }}
                  />

                  {/* Left swept fin */}
                  <div
                    style={{
                      position: "absolute", right: "100%", bottom: "7px",
                      width: "20px", height: "30px",
                      background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                      clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
                    }}
                  />

                  {/* Right swept fin */}
                  <div
                    style={{
                      position: "absolute", left: "100%", bottom: "7px",
                      width: "20px", height: "30px",
                      background: "linear-gradient(225deg, #ef4444, #b91c1c)",
                      clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>{/* end pannable layer */}

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-3 sm:px-4">
          {overlayNode ? (
            <ConceptCard node={overlayNode} onClose={() => setOverlay(null)} />
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.34em] text-slate-400">
              <span>{currentNode.title}</span>
              <span>
                {discoveredCount} / {conceptNodes.length}
              </span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#22D3EE,#A78BFA,#FB7185)] transition-[width] duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
