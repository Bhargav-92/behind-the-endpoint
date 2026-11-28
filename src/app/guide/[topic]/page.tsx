import Link from "next/link";
import { notFound } from "next/navigation";
import lessons from "@/data/guided-lessons.json";
import { GuideWalkthrough } from "@/components/GuideWalkthrough";
import "@/components/workshop.css";

type LessonId = keyof typeof lessons;
type Topic = LessonId | "language" | "database";
const topics: Topic[] = ["backend", "lifecycle", "runtime", "modules", "async", "http", "streams", "operate", "language", "js-books", "typed-books", "database", "documents", "tables"];
const choices = {
  language: { title: "Choose your language", intro: "Write a validation function for a book title. Choose the language you want to use for this exercise.", options: [["js-books", "JavaScript", "Run the function directly in Node.js."], ["typed-books", "TypeScript", "Describe input types and check the program before running it."]] },
  database: { title: "Choose your database", intro: "Your reading list needs to survive a server restart. Choose how to store, retrieve, update, and delete a book.", options: [["documents", "MongoDB", "Work with book documents in a collection using mongosh."], ["tables", "PostgreSQL", "Work with rows, columns, and a primary key using SQL."]] },
};
function title(topic: Topic) {
  return topic === "language" || topic === "database" ? choices[topic].title : lessons[topic].title;
}
export const dynamicParams = false;
export function generateStaticParams() { return topics.map(topic => ({ topic })); }

export default async function Page({params}: {params: Promise<{topic:string}>}) {
  const slug = (await params).topic;
  const topic = topics.find(id => id === slug);
  if (!topic) notFound();
  if (topic === "language" || topic === "database") {
    const choice = choices[topic];
    return <article><div className="crumb">Learning path</div><h1>{choice.title}</h1><p className="intro">{choice.intro}</p>
      {choice.options.map(([id, label, detail]) => <section className="box" key={id}><h2><Link className="underline" href={"/guide/"+id}>{label}</Link></h2><p>{detail}</p></section>)}</article>;
  }
  const lesson = lessons[topic];
  const languageBranch = topic === "js-books" || topic === "typed-books";
  const databaseBranch = topic === "documents" || topic === "tables";
  const next = languageBranch ? "database" : topics[topics.indexOf(topic)+1];
  return <article className="workshop"><div className="crumb">Learning path · {databaseBranch ? "Databases" : languageBranch ? "Language workshop" : ["backend","lifecycle"].includes(topic) ? "Backend foundations" : "Node.js essentials"}</div>
    <h1>{lesson.title}</h1><p className="intro">{lesson.intro}</p>
    {topic === "runtime" && <a className="underline" href="https://nodejs.org/en/download">Download Node.js</a>}
    {topic === "lifecycle" && <figure className="my-6">
      <video className="w-full max-w-lg rounded-xl" aria-label="Animated walkthrough of a book lookup" controls playsInline preload="none" poster="/videos/request-lifecycle-preview.png" width={960} height={960}>
        <source src="/videos/request-lifecycle.mp4" type="video/mp4" />
      </video>
      <figcaption>Follow a request for book 42 from browser to database and back. Silent animation, 20 seconds.</figcaption>
    </figure>}
    {topic === "async" && <GuideWalkthrough />}
    {lesson.steps.map(s => <section className="build" key={s.title}><h2>{s.title}</h2>{s.body.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>)}{s.code && <pre><code>{s.code}</code></pre>}</section>)}
    {(languageBranch || databaseBranch) && <p><Link className="underline" href={languageBranch?"/guide/language":"/guide/database"}>Change {languageBranch?"language":"database"}</Link></p>}
    <Link className="primary inline-block" href={databaseBranch?"/start/1":"/guide/"+next}>{databaseBranch?"Continue to the bookshelf project":topic === "backend" ? "Follow a request" : "Next: "+title(next)}</Link>
  </article>;
}
