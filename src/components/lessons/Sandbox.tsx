"use client";
import { useEffect, useRef, useState } from "react";
import { demos } from "@/data/demos";
import { lessonGuides } from "@/data/lesson-guides";

export function Sandbox({ lesson }: { lesson: number }) {
  const [label, initial, starter] = demos[lesson];
  const [code, setCode] = useState<string>(starter);
  const [input, setInput] = useState<string>(initial);
  const [output, setOutput] = useState("");
  const cleanup = useRef<() => void>(() => {});
  useEffect(() => () => cleanup.current(), []);

  function run() {
    cleanup.current();
    setOutput("Running…");
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.title = "JavaScript runner";
    frame.sandbox.add("allow-scripts");
    frame.src = "/lesson-runner.html";
    const timer = window.setTimeout(() => finish("Execution stopped. Check for a loop that never ends."), 5000);
    function finish(message: string) {
      cleanup.current();
      setOutput(message);
    }
    function receive(event: MessageEvent) {
      if (event.source !== frame.contentWindow || event.origin !== "null") return;
      if (event.data === "ready") frame.contentWindow?.postMessage({ code, input }, "*");
      else if (typeof event.data?.output === "string") finish(event.data.output);
    }
    cleanup.current = () => {
      clearTimeout(timer);
      window.removeEventListener("message", receive);
      frame.remove();
    };
    window.addEventListener("message", receive);
    document.body.append(frame);
  }

  return <section><h2>Lesson sandbox</h2>
    <p>Press Run code to see the starting result. Edit the JavaScript below and run it again. The input is text; <code>return</code> chooses what appears in the result.</p>
    <label htmlFor="lesson-code">JavaScript</label>
    <textarea id="lesson-code" spellCheck={false} rows={Math.max(6, code.split("\n").length + 1)} value={code} onChange={e => setCode(e.target.value)} />
    <form onSubmit={e => { e.preventDefault(); run(); }}>
      <label>{label}<input value={input} onChange={e => setInput(e.target.value)} /></label>
      <button className="primary">Run code</button>
      <button type="button" onClick={() => { cleanup.current(); setInput(initial); setCode(starter); setOutput(""); }}>Reset example</button>
    </form>
    <strong>Result</strong><pre aria-live="polite">{output || "Run the example to see its result."}</pre>
    <h3>Try this change</h3><p>{lessonGuides[lesson][1]}</p>
  </section>;
}
