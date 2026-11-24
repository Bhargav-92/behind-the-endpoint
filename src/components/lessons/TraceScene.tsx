"use client";

import { useEffect, useRef, useState } from "react";
import type { CourseLesson, LessonStep } from "@/data/course";

type Props = Pick<LessonStep, "from" | "to"> & { nodes: CourseLesson["nodes"]; paused: boolean };

export function TraceScene({ nodes, from, to, paused }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const controls = useRef<{ pause: (value: boolean) => void } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = viewport.current;
    if (!host) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    setReady(false);
    import("./trace-renderer").then(({ mountTrace }) => {
      if (cancelled) return;
      const scene = mountTrace(host, nodes, from, to);
      controls.current = scene;
      dispose = scene.dispose;
      setReady(true);
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => { cancelled = true; controls.current = null; dispose?.(); };
  }, [nodes, from, to]);

  useEffect(() => { controls.current?.pause(paused); }, [paused, ready, from, to]);

  return <div className="trace-scene" data-ready={ready} role="img"
    aria-label={nodes[from] + " sends to " + nodes[to]}>
    <div ref={viewport} className="trace-viewport" aria-hidden="true" />
    <div className="trace-labels" aria-hidden="true">{nodes.map((name, i) =>
      <span key={name} data-role={i === from ? "source" : i === to ? "destination" : "idle"}>{name}</span>
    )}</div>
  </div>;
}
