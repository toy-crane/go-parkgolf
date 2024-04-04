import { notFound } from "next/navigation";
import HomePage from "@/app/(routes)/golf-courses/[slug]/home/page";
import createSupabaseBrowerClient from "@/libs/supabase/client";

import { getCourse } from "./fetcher";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const supabase = createSupabaseBrowerClient();
  const response = await supabase.from("golf_courses").select(`slug`);
  if (response.error) throw response.error;
  return response.data;
}

export default async function Page({ params }: Props) {
  const currentCourse = await getCourse(params.slug);
  if (currentCourse === undefined) return notFound();

  return <HomePage params={params} />;
}
