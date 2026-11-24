"use client";

import { createContext, useContext } from "react";

export const CourseSession = createContext<{
  finish: (lesson: number) => void;
  paused: boolean;
  togglePause: () => void;
  quiz: number;
  setQuiz: (lesson: number) => void;
} | null>(null);

export function useCourseSession() {
  const session = useContext(CourseSession);
  if (!session) throw new Error("The course layout is required.");
  return session;
}
