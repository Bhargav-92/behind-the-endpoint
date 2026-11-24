import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import CourseShell from "@/components/CourseShell";
import course from "@/data/course";

const outline = course.map(({ title, group, intro, steps }) => ({ title, group, intro, steps: steps.length }));

export const metadata: Metadata = {
  title: { default: "Backend Atlas", template: "%s | Backend Atlas" },
  description: "Learn backend engineering by tracing requests, testing API behavior, and practicing one scenario at a time."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><CourseShell course={outline}>{children}</CourseShell></body></html>;
}
