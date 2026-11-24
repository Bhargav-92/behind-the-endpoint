"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseLesson } from "@/data/course";
import { lessonPath } from "@/lib/routes";

export function Sheets({ course }: { course: CourseLesson[] }) {
  const [filter, setFilter] = useState("");
  const query = filter.trim().toLowerCase();
  const matches = course.map((lesson, index) => ({ lesson, index })).filter(({ lesson }) =>
    [lesson.title, lesson.group, lesson.intro].join(" ").toLowerCase().includes(query)
  );

  return (
    <>
      <div className="crumb">Course / Cheatsheets</div>
      <h1>Cheatsheets</h1>
      <p className="intro">Look up a backend concept and revisit its execution trace.</p>
      <input id="filter" type="search" aria-label="Filter cheatsheets" placeholder="Filter concepts"
        value={filter} onChange={event => setFilter(event.target.value)} />
      <div id="cards">
        {matches.map(({ lesson, index }) => (
          <details className="box" key={lesson.title}>
            <summary>{lesson.title}</summary>
            <p>{lesson.intro}</p>
            <ol>{lesson.steps.map(step => <li key={step.title}><strong>{step.title}</strong> — {step.body}</li>)}</ol>
            <Link href={lessonPath(index)}><u>Open lesson</u></Link>
          </details>
        ))}
        {!matches.length && <p>No matching concepts.</p>}
      </div>
    </>
  );
}
