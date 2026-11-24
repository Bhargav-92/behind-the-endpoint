import { Sheets } from "@/components/cheatsheets/Sheets";
import course from "@/data/course";

export const metadata = { title: "Cheatsheets" };

export default function Page() {
  return <Sheets course={course} />;
}
