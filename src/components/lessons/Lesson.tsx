"use client";

import type { CSSProperties } from "react";
import type { CourseLesson, LessonStep } from "@/data/course";
import { useRouter } from "next/navigation";
import { useCourseSession } from "@/components/CourseSession";
import { lessonPath } from "@/lib/routes";
import { TraceScene } from "./TraceScene";
import { lessonGuides } from "@/data/lesson-guides";
import { LessonExtras } from "./LessonExtras";
import "./lesson.css";

const centers = [100, 380, 660];

function NodeSymbol({ name }: { name: string }) {
  if (/database|table|store|cache|index|permissions/i.test(name)) {
    return <>
      <path d="M-27 -18v34c0 6 12 11 27 11s27-5 27-11v-34" />
      <ellipse cx="0" cy="-18" rx="27" ry="10" />
      <path d="M-27 -7c0 6 12 11 27 11s27-5 27-11M-27 5c0 6 12 11 27 11s27-5 27-11" />
    </>;
  }
  if (/browser|client|reader|test runner/i.test(name)) {
    return <>
      <path d="m-25 -14 43-13 1 34-43 14zM-24 21l-10 4 13 6 47-15-7-9" />
      <path d="m-17 -9 28-9v21l-28 9z" />
    </>;
  }
  if (/queue/i.test(name)) {
    return [-16, 0, 16].map(x => <path key={x} transform={`translate(${x},0)`} d="M-8 -13l12-8 5 4v30l-12 8-5-4z" />);
  }
  return [-17, -2, 13].map(y => <g key={y} transform={`translate(0,${y})`}>
    <path d="m-27 -4 27-10 27 10-27 10zM-27 -4v9l27 10L27 5v-9M0 6v9" />
    <path d="m8 6 6-2" />
  </g>);
}

function Trace({ data, current, paused, onToggle }: {
  data: CourseLesson;
  current: LessonStep;
  paused: boolean;
  onToggle: () => void;
}) {
  const start = centers[current.from];
  const end = centers[current.to];
  const sign = Math.sign(end - start);
  const outside = Math.abs(current.from - current.to) > 1;
  const startX = start + (outside ? 0 : 43 * sign);
  const endX = end - (outside ? 0 : 43 * sign);
  const edge = outside
    ? `M${startX} 47 V32 Q${startX} 20 ${startX + sign * 12} 20 H${endX - sign * 12} Q${endX} 20 ${endX} 32 V44`
    : `M${startX} 84 H${endX}`;
  const signalStyle: CSSProperties & { "--travel": string } = {
    "--travel": `${endX - startX}px`,
    animationPlayState: paused ? "paused" : "running",
  };
  return <section className="board trace-board" aria-label="Execution trace">
    <div className="boardhead">
      <strong>Execution trace</strong>
      <button id="motion" type="button" aria-pressed={paused} onClick={onToggle}>{paused ? "Resume animation" : "Pause animation"}</button>
    </div>
    <div className="diagram">
      <TraceScene nodes={data.nodes} from={current.from} to={current.to} paused={paused} />
      <svg className="trace-fallback block max-h-44 w-full max-[681px]:min-h-[92px]" viewBox="0 0 760 154" role="img" aria-label={`${data.nodes[current.from]} sends to ${data.nodes[current.to]}`}>
        <defs>
          <marker id="trace-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill="var(--pulse)" />
          </marker>
        </defs>
        <path className="trace-wire" d="M142 84H338 M422 84H618" />
        <path className="trace-route" d={edge} markerEnd="url(#trace-tip)" />
        <circle key={edge} className={outside ? "trace-signal trace-detour" : "trace-signal"}
          cx={startX} cy={outside ? 47 : 84} r="4"
          style={signalStyle} />
        {data.nodes.map((name, index) => <g key={name} transform={`translate(${centers[index]} 84)`}
          className={index === current.from || index === current.to ? "trace-endpoint" : "trace-idle"}>
          <g className="trace-symbol"><NodeSymbol name={name} /></g>
          <text textAnchor="middle" y="53">{name}</text>
        </g>)}
      </svg>
    </div>
    <div className="boardfoot"><p><strong>{current.title}</strong> · {data.nodes[current.from]} → {data.nodes[current.to]}</p><code>{current.code}</code></div>
  </section>;
}

export function Lesson({ data, lesson, step }: {
  data: CourseLesson;
  lesson: number;
  step: number;
}) {
  const router = useRouter();
  const { finish, paused, togglePause } = useCourseSession();
  const current = data.steps[step];
  const showTrace = ["The request lifecycle", "Transactions", "Work queues", "Cache-aside reads", "Distributed tracing"].includes(data.title);
  const isLast = step === data.steps.length - 1;

  function goToStep(index: number) {
    router.push(lessonPath(lesson, index), { scroll: false });
  }

  return <article className="lesson">
    <div className="crumb">Course &nbsp; / &nbsp; {data.group}</div>
    <h1>{data.title}</h1>
    <p className="intro">{data.intro}</p><p className="lesson-concept">{lessonGuides[lesson][0]}</p>
    {showTrace && <Trace data={data} current={current} paused={paused} onToggle={togglePause} />}
    <div className="grid grid-cols-[minmax(160px,.85fr)_minmax(0,2.15fr)] items-start gap-[clamp(16px,3vw,40px)] max-[681px]:grid-cols-1 max-[681px]:gap-4">
      <ol className="lesson-timeline m-0 list-none p-0 max-[681px]:grid max-[681px]:grid-cols-2 max-[681px]:gap-1" aria-label="Lesson steps">
        {data.steps.map((item, index) => <li key={item.title}>
          <button type="button" data-step={index} aria-current={step === index ? "step" : undefined} onClick={() => goToStep(index)}>
            <span className="step-index">{index + 1}</span>{item.title}
          </button>
        </li>)}
      </ol>
      <section className="lesson-guide" aria-labelledby="step-title">
        <small>Step {step + 1} of {data.steps.length}</small>
        <h2 id="step-title">{current.title}</h2>
        <p>{current.body}</p>
        {!showTrace && <pre><code>{current.code}</code></pre>}
        <div className="actions">
          <button type="button" id="prev" disabled={step === 0} onClick={() => goToStep(step - 1)}>Back</button>
          <button type="button" className="primary" id="next" onClick={() => isLast ? finish(lesson) : goToStep(step + 1)}>{isLast ? "Finish lesson" : "Next step"}</button>
        </div>
      </section>
    </div>
    <LessonExtras key={lesson} lesson={lesson} />
  </article>;
}
