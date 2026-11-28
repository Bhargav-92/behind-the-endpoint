import Link from "next/link";
import { CourseEntry } from "@/components/CourseEntry";
import course from "@/data/course";
import { lessonPath } from "@/lib/routes";

export default function Home() {
  const groups = [...new Set(course.map(item => item.group))];
  return <>
    <h1>Backend learning path</h1>
    <p className="intro">Follow one request from browser to database. In each lesson, step through the animation, change an input in the sandbox, and check your understanding in practice.</p>
    <CourseEntry stepCounts={course.map(item => item.steps.length)} />
    {groups.map((group, stage) => <section className="box" key={group}>
      <h2>{stage + 1}. {group}</h2>
      <ol className="grid gap-4 pl-6 list-decimal" start={course.findIndex(item => item.group === group) + 1}>
        {course.map((item, index) => item.group === group && <li key={item.title}>
          <Link className="underline font-semibold" href={lessonPath(index)}>{item.title}</Link>
          <p>{item.intro}</p>
        </li>)}
      </ol>
    </section>)}
  </>;
}
