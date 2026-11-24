"use client";
import { useState } from "react";
import { demos } from "@/data/demos";

const api = ["-MTSQjw5DrM", "RESTful APIs in 100 Seconds"];
const sql = ["zsjvFFKOm3c", "SQL Explained in 100 Seconds"];
const redis = ["G1rOthIU-uo", "Redis in 100 Seconds"];
const docker = ["Gjnup-PuquQ", "Docker in 100 Seconds"];

export function LessonExtras({ lesson }: { lesson: number }) {
  const [label, initial, body] = demos[lesson];
  const [input, setInput] = useState<string>(initial);
  const [output, setOutput] = useState("");
  const [video, title] = lesson >= 6 && lesson <= 8 ? sql : lesson === 13 ? redis : lesson === 17 ? docker : api;
  function run() {
    // Only course-authored source is compiled. Learner input is passed as data.
    try {
      const result: unknown = new Function("input", body)(input);
      setOutput(JSON.stringify(result, null, 2) ?? "undefined");
    } catch (error) { setOutput(String(error)); }
  }
  return <div className="lesson-extras">
    <section><h2>Runnable example</h2><p>Change the {label} and run the JavaScript to compare results.</p>
      <pre><code>{"function demo(input) {\n" + body.split("\n").map(line => "  " + line).join("\n") + "\n}"}</code></pre>
      <form onSubmit={e => {e.preventDefault();run()}}><label>{label}<input value={input} onChange={e=>setInput(e.target.value)} /></label>
      <button className="primary">Run code</button></form>
      <output aria-live="polite">{output && <pre>{output}</pre>}</output>
    </section>
    <section><h2>Video reference</h2><a className="video-preview" href={"https://www.youtube.com/watch?v="+video} target="_blank" rel="noreferrer">
      <span><img loading="lazy" width="320" height="180" src={"https://i.ytimg.com/vi/"+video+"/hqdefault.jpg"} alt="" /><b aria-hidden="true">▶</b></span>
      <strong>{title}</strong><small>Fireship on YouTube</small></a></section>
  </div>;
}
