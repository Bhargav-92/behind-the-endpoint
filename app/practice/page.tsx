import { Practice } from "@/components/practice/Practice";
import course from "@/data/course";

export const metadata = { title: "Practice" };

export default function Page() {
  return <Practice course={course} />;
}
