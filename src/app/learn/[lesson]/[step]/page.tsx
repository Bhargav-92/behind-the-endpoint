import { notFound } from "next/navigation";
import course from "@/data/course";
import { Lesson } from "@/components/lessons/Lesson";
import { routeIndex } from "@/lib/routes";

type Props = { params: Promise<{ lesson: string; step: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return course.flatMap((item, i) => item.steps.map((_, j) => ({
    lesson: String(i + 1), step: String(j + 1),
  })));
}

async function resolveLesson({ params }: Props) {
  const values = await params;
  const lesson = routeIndex(values.lesson, course.length);
  if (lesson < 0) notFound();
  const data = course[lesson];
  const step = routeIndex(values.step, data.steps.length);
  if (step < 0) notFound();
  return { data, lesson, step };
}

export async function generateMetadata(props: Props) {
  const { data } = await resolveLesson(props);
  return { title: data.title, description: data.intro };
}

export default async function Page(props: Props) {
  return <Lesson {...await resolveLesson(props)} />;
}
