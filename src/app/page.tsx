import Link from "next/link";
import { CourseEntry } from "@/components/CourseEntry";
import course from "@/data/course";
import { lessonPath } from "@/lib/routes";

export default function Home() {
  const groups = [...new Set(course.map(item => item.group))];
  return <>
    <h1>Learn backend from scratch</h1>
    <p className="intro">Build a bookshelf API from your first JavaScript lookup to a server that answers your browser. Start in the sandbox, then run the same idea on your own computer.</p>
    <Link className="primary inline-block" href="/start/1">Start building the bookshelf</Link>
    <h2>Backend lessons</h2><p>After the project, follow a request through routing, databases, permissions, and deployment.</p>
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
