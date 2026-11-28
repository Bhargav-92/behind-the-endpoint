import { notFound } from "next/navigation";
import { foundations } from "@/data/foundations";
import { Workshop } from "@/components/Workshop";

export const dynamicParams = false;
export function generateStaticParams() {
  return foundations.map((_, i) => ({ chapter: String(i + 1) }));
}
export default async function Page({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const i = foundations.findIndex((_, index) => String(index + 1) === chapter);
  if (i < 0) notFound();
  return <Workshop key={i} index={i} />;
}
