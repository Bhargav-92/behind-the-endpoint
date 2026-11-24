"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { savedPosition } from "@/lib/progress";
import { lessonPath, routeIndex } from "@/lib/routes";

export function CourseEntry({ stepCounts }: { stepCounts: number[] }) {
  const router = useRouter();
  useEffect(() => {
    const [view, id, n] = window.location.hash.slice(1).split("/");
    if (view === "practice" || view === "lab" || view === "sheets") {
      router.replace(view === "sheets" ? "/cheatsheets" : "/" + view);
      return;
    }
    const [savedLesson, savedStep] = savedPosition(stepCounts);
    const lesson = id ? Math.max(0, routeIndex(id, stepCounts.length)) : savedLesson;
    const step = n ? Math.max(0, routeIndex(n, stepCounts[lesson])) : Math.min(savedStep, stepCounts[lesson] - 1);
    router.replace(lessonPath(lesson, step));
  }, [router, stepCounts]);
  return null;
}
