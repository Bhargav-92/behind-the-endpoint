"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { savedPosition } from "@/lib/progress";
import { lessonPath, routeIndex } from "@/lib/routes";

export function CourseEntry({ stepCounts }: { stepCounts: number[] }) {
  const router = useRouter();
  const [resume, setResume] = useState(lessonPath(0));
  useEffect(() => {
    const [view, id, n] = window.location.hash.slice(1).split("/");
    if (view === "practice" || view === "lab" || view === "sheets") {
      router.replace(view === "sheets" ? "/cheatsheets" : "/" + view);
      return;
    }
    const [savedLesson, savedStep] = savedPosition(stepCounts);
    setResume(lessonPath(savedLesson, savedStep));
    if (!view) return;
    const lesson = id ? Math.max(0, routeIndex(id, stepCounts.length)) : savedLesson;
    const step = n ? Math.max(0, routeIndex(n, stepCounts[lesson])) : Math.min(savedStep, stepCounts[lesson] - 1);
    router.replace(lessonPath(lesson, step));
  }, [router, stepCounts]);
  return <Link className="primary inline-block" href={resume}>{resume === lessonPath(0) ? "Start the first lesson" : "Resume your lesson"}</Link>;
}
