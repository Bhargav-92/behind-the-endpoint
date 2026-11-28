"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CourseSession } from "./CourseSession";
import { read, save, savedPosition } from "@/lib/progress";
import { lessonPath, routeIndex } from "@/lib/routes";

type Entry = { title: string; group: string; intro: string; steps: number };
const sections = { learn: "Learn", practice: "Practice", lab: "Request lab", cheatsheets: "Cheatsheets" };

export default function CourseShell({ children, course }: { children: ReactNode; course: Entry[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [, view, lessonId, stepId] = pathname.split("/");
  const lesson = Math.max(0, routeIndex(lessonId, course.length));
  const step = Math.max(0, routeIndex(stepId, course[lesson].steps));
  const groups = [...new Set(course.map(item => item.group))];
  const [resume, setResume] = useState("/learn/1/1");
  const [done, setDone] = useState<number[]>([]);
  const [dark, setDark] = useState(false);
  const [paused, setPaused] = useState(false);
  const [quiz, setQuiz] = useState(0);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const media = matchMedia("(min-width:821px)");
    const resize = () => setMenuOpen(media.matches);
    resize();
    setResume(lessonPath(...savedPosition(course.map(item => item.steps))));
    const completed = read("completed", []);
    if (Array.isArray(completed)) setDone([...new Set(completed.filter(i => Number.isInteger(i) && i >= 0 && i < course.length))]);
    setDark(read("dark",true) === true);
    media.addEventListener("change",resize);
    return () => {
      media.removeEventListener("change",resize);
    };
  }, [course]);
  useEffect(() => {
    if (view === "learn" && lessonId && stepId) {
      save("position", [lesson, step]);
      setResume(lessonPath(lesson, step));
    }
  }, [view, lessonId, stepId, lesson, step]);
  useEffect(() => { document.documentElement.classList.toggle("dark",dark); }, [dark]);
  function openSearch() {
    setQuery("");
    dialog.current?.showModal();
    dialog.current?.querySelector("input")?.focus();
  }
  useEffect(() => {
    function keys(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialog.current?.open) openSearch();
        return;
      }
      if (dialog.current?.open || view !== "learn" || event.altKey || event.ctrlKey || event.metaKey ||
          (event.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))) return;
      if (event.key === "ArrowRight" && step < course[lesson].steps-1) router.push(lessonPath(lesson,step+1), { scroll: false });
      if (event.key === "ArrowLeft" && step > 0) router.push(lessonPath(lesson,step-1), { scroll: false });
    }
    window.addEventListener("keydown",keys);
    return () => window.removeEventListener("keydown",keys);
  }, [view,lesson,step,course,router]);
  function finish(lesson: number) {
    const completed = [...new Set([...done, lesson])];
    setDone(completed);
    save("completed",completed);
    setQuiz(lesson);
    router.push("/practice");
  }
  function lessonLink(item: Entry, i: number, search=false) {
    const active = view === "learn" && lesson === i;
    return <Link key={i} className={"row" + (active ? " active" : "")} aria-current={active ? "page" : undefined}
      href={lessonPath(i)} onClick={() => {
        if (search) dialog.current?.close();
        if (!matchMedia("(min-width:821px)").matches) setMenuOpen(false);
      }}>{done.includes(i) && "✓ "}{item.title}</Link>;
  }
  const results = course.map((item,i) => ({item,i})).filter(({item}) =>
    [item.group,item.title,item.intro].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  return <CourseSession.Provider value={{ finish, quiz, setQuiz, paused, togglePause: () => setPaused(value => !value) }}>
    <header>
      <Link className="brand" href="/" aria-label="Behind the Endpoint course map"><img src="/endpoint-logo.svg" width="42" height="42" alt="" /><span className="wordmark"><small>behind the</small>endpoint<i aria-hidden="true" /></span></Link>
      <nav aria-label="Workspace">{Object.entries(sections).map(([name,label]) =>
        <Link className={view === name ? "selected" : ""} key={name} href={name === "learn" ? resume : "/"+name}
          aria-current={view === name ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="tools ml-auto flex items-center gap-2 max-[361px]:gap-1"><button id="searchBtn" onClick={openSearch}>Search <kbd>Ctrl K</kbd></button>
        <button id="theme" aria-label="Toggle color theme" aria-pressed={dark}
          onClick={() => {save("dark",!dark);setDark(!dark)}}>◐</button></div>
    </header>
    <div className="mx-auto grid min-h-[calc(100vh-var(--header-height))] max-w-(--shell-width) grid-cols-[var(--rail)_minmax(0,1fr)] max-[821px]:block max-[821px]:min-h-screen">
      <aside className="min-w-0 border-0 border-r border-solid border-rule bg-surface px-4 py-7 max-[821px]:border-r-0 max-[821px]:border-b max-[821px]:py-0">
      <details id="menu" open={menuOpen} onToggle={event=>setMenuOpen(event.currentTarget.open)}>
        <summary>Course outline</summary>
        <div id="outline"><Link className="row" href="/guide/backend">Learning path</Link>{groups.map((group,g) => <details key={group} open={group === course[lesson].group}>
          <summary>{String(g+1).padStart(2,"0")} &nbsp;{group}</summary>
          {course.map((item,i) => item.group === group ? lessonLink(item,i) : null)}
        </details>)}</div>
      </details>
      <div className="mx-2 mt-8 flex flex-wrap items-center gap-2 border-0 border-t border-solid border-rule pt-4 text-sm text-muted max-[821px]:hidden"><span>Your progress</span><strong id="count" className="ml-auto text-ink tabular-nums">{done.length} / {course.length}</strong>
        <progress className="h-1.5 w-full accent-action" id="meter" aria-label="Completed lessons" value={done.length} max={course.length}/></div>
    </aside><main id="main" className="mx-auto w-full min-w-0 max-w-[76rem] px-(--gutter) pt-10 pb-16 max-[821px]:pt-6 max-[821px]:pb-12">
      {children}
    </main></div>
    <dialog id="finder" ref={dialog} aria-labelledby="search-label"><form method="dialog"><label id="search-label" htmlFor="query">Search lessons</label>
      <button aria-label="Close search">×</button></form>
      <input id="query" type="search" value={query} placeholder="Try transactions or caching" onChange={e=>setQuery(e.target.value)}/>
      <div id="results" className="max-h-[48vh] overflow-y-auto">{results.length ? results.map(({item,i})=>lessonLink(item,i,true)) : <p>No matching lessons.</p>}</div>
    </dialog>
  </CourseSession.Provider>;
}
