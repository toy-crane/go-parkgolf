import { notFound } from "next/navigation";
import HomePage from "@/app/(routes)/golf-courses/[slug]/home/page";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

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
  const slug = decodeURIComponent(params.slug);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*")
    .eq("publish_status", "completed")
    .eq("slug", slug)
    .returns<GolfCourse[]>()
    .single();
  if (response.error) throw response.error;
  const currentCourse = response.data;
  if (currentCourse === undefined) return notFound();

  return <HomePage params={params} />;
}
