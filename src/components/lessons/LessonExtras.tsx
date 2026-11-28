"use client";
import { Sandbox } from "./Sandbox";


const api = ["-MTSQjw5DrM", "RESTful APIs in 100 Seconds"];
const sql = ["zsjvFFKOm3c", "SQL Explained in 100 Seconds"];
const redis = ["G1rOthIU-uo", "Redis in 100 Seconds"];
const docker = ["Gjnup-PuquQ", "Docker in 100 Seconds"];

export function LessonExtras({ lesson }: { lesson: number }) {
  const [video, title] = lesson >= 6 && lesson <= 8 ? sql : lesson === 13 ? redis : lesson === 17 ? docker : api;
  return <div className="lesson-extras">
    <Sandbox lesson={lesson} />
    <section><h2>Video reference</h2><a className="video-preview" href={"https://www.youtube.com/watch?v="+video} target="_blank" rel="noreferrer">
      <span><img loading="lazy" width="320" height="180" src={"https://i.ytimg.com/vi/"+video+"/hqdefault.jpg"} alt="" /><b aria-hidden="true">▶</b></span>
      <strong>{title}</strong><small>Fireship on YouTube</small></a></section>
  </div>;
}
