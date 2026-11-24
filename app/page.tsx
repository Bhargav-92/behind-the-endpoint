import { CourseEntry } from "@/components/CourseEntry";
import { Lesson } from "@/components/lessons/Lesson";
import course from "@/data/course";

export default function Home() {
  return <>
    <CourseEntry stepCounts={course.map(item => item.steps.length)} />
    <Lesson data={course[0]} lesson={0} step={0} />
  </>;
}
