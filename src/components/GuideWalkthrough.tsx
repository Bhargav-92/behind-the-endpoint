"use client";
import { useEffect, useState } from "react";

const trace = [
  ["Script", "Log start", "JavaScript calls readFile and receives a pending promise."],
  ["File read", "Log pending", "The read is still in progress. The script reaches await and yields."],
  ["Continuation", "Log length", "Once the read completes, the promise resolves and the function resumes with the file contents."],
];
export function GuideWalkthrough() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step === trace.length - 1) setPlaying(false);
      else setStep(step + 1);
    }, 2400);
    return () => clearTimeout(timer);
  }, [playing, step]);
  return <section className="story"><h2>Trace an asynchronous read</h2>
    <div className="frames">{trace.map(([label, output], i) => <button key={label} aria-pressed={i===step} onClick={() => {setPlaying(false);setStep(i);}}><small>{label}</small><code>{output}</code></button>)}</div>
    <p aria-live="polite">{trace[step][2]}</p><button onClick={() => {if (!playing && step===2) setStep(0);setPlaying(!playing);}}>{playing?"Pause":"Play walkthrough"}</button></section>;
}
