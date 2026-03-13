import { fetchOneEntry } from "@builder.io/sdk-react";
import { notFound } from "next/navigation";
import { BuilderPageClient } from "@/components/builder/BuilderPageClient";
import { BUILDER_API_KEY, BUILDER_MODEL_PAGE, isBuilderEnabled } from "@/lib/builder";

interface BuilderPageProps {
  params: Promise<{ page?: string[] }>;
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  if (!isBuilderEnabled()) notFound();

  const { page } = await params;
  const urlPath = "/b/" + (page?.join("/") ?? "");

  const content = await fetchOneEntry({
    model: BUILDER_MODEL_PAGE,
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath }
  });

  if (!content) notFound();

  return (
    <div className="container-page py-12">
      <BuilderPageClient content={content} model={BUILDER_MODEL_PAGE} />
    </div>
  );
}
