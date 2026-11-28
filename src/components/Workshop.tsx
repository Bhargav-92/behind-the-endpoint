"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { foundations } from "@/data/foundations";
import { CodeSandbox } from "./lessons/Sandbox";
import "./lessons/lesson.css";
import "./workshop.css";

export function Workshop({ index }: { index: number }) {
  const chapter = foundations[index];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step < 2) setStep(step + 1);
      else setPlaying(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, [playing, step]);
  return <article className="lesson workshop">
    <nav aria-label="Bookshelf project chapters" className="chapter-links">{foundations.map((c,i) =>
      <Link key={c.title} href={"/start/"+(i+1)} aria-current={index===i ? "step" : undefined}>{i+1}. {["First lookup","Run Node","Serve HTTP","Store data"][i]}</Link>)}</nav>
    <h1>{chapter.title}</h1><p className="intro">{chapter.intro}</p>
    <section className="story"><h2>Follow the lookup</h2>
      <div className="frames">{chapter.frames.map(([name, value], i) =>
        <button key={i} aria-pressed={step===i} onClick={()=>{setPlaying(false);setStep(i);}}>
          <small>{i+1}. {name}</small><code>{value}</code></button>)}</div>
      <p aria-live="polite">{chapter.frames[step][2]}</p>
      <button onClick={()=>{if (!playing && step===2) setStep(0);setPlaying(!playing);}}>{playing ? "Pause walkthrough" : step===2 ? "Replay walkthrough" : "Play walkthrough"}</button>
    </section>
    <div className="lesson-extras"><CodeSandbox demo={chapter.demo} task={chapter.task} /></div>
    <section className="build"><h2>Build your bookshelf</h2><p>{chapter.build}</p>
      {index===1 && <a href="https://nodejs.org/en/download">Download Node.js</a>}
      {"snippet" in chapter && <pre><code>{chapter.snippet}</code></pre>}
      {index===3 && <><h3>Load the file</h3><pre><code>{'import { readFileSync } from "node:fs";\nconst books = JSON.parse(readFileSync(new URL("./books.json", import.meta.url), "utf8"));'}</code></pre></>}
    </section>
    <Link className="primary inline-block" href={index===3 ? "/learn/1/1" : "/start/"+(index+2)}>{index===3 ? "Explore the full request lifecycle" : "Continue · "+foundations[index+1].title}</Link>
  </article>;
}
