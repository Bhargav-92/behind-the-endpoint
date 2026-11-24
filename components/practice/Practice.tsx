"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseLesson } from "@/data/course";
import { lessonPath } from "@/lib/routes";
import { useCourseSession } from "@/components/CourseSession";

export function Practice({ course }: { course: CourseLesson[] }) {
  const { quiz, setQuiz } = useCourseSession();
  const [answer, setAnswer] = useState<number | null>(null);
  const lesson = course[quiz];

  function changeTopic(index: number) {
    setAnswer(null);
    setQuiz(index);
  }

  return (
    <>
      <div className="crumb">Course / Practice</div>
      <h1>Practice</h1>
      <p className="intro">Check your reasoning against a backend scenario.</p>
      <label htmlFor="topic">Practice topic </label>
      <select id="topic" value={quiz} onChange={event => changeTopic(Number(event.target.value))}>
        {course.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}
      </select>
      <section className="box">
        <h2>{lesson.question}</h2>
        <div className="my-5 grid gap-2">
          {lesson.answers.map((item, index) => (
            <button className="px-4 py-3 text-left hover:bg-highlight" key={item} data-answer={index} onClick={() => setAnswer(index)}>{item}</button>
          ))}
        </div>
        <div id="feedback" role="status">
          {answer !== null && (answer === lesson.correct ? (
            <>
              <p><strong>Correct.</strong> {lesson.why}</p>
              <button id="another" onClick={() => changeTopic((quiz + 1) % course.length)}>Next question</button>
            </>
          ) : (
            <p>Try again. <Link href={lessonPath(quiz)}><u>Review this lesson</u></Link></p>
          ))}
        </div>
      </section>
    </>
  );
}

