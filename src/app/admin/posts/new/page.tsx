import Link from "next/link";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import type { Post, Review } from "@/types/domain";

export default async function AdminNewPostPage({
  searchParams
}: {
  searchParams: Promise<{ entityType?: string }>;
}) {
  const { entityType } = await searchParams;
  const isReview = entityType === "review";

  const emptyPost: Post = {
    id: "",
    type: "guide",
    slug: "",
    title: "",
    summary: "",
    body: "",
    ctaLabel: "",
    relatedProductSlugs: [],
    isFeatured: false,
    publishedAt: new Date().toISOString(),
    status: "draft"
  };

  const emptyReview: Review = {
    id: "",
    slug: "",
    title: "",
    summary: "",
    body: "",
    reviewType: "internet_tv",
    tags: [],
    featured: false,
    publishedAt: new Date().toISOString(),
    status: "draft"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-orange">New Content</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">{isReview ? "신규 후기 등록" : "신규 게시물 등록"}</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts/new?entityType=post" className="rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-graphite">
            게시물
          </Link>
          <Link href="/admin/posts/new?entityType=review" className="rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-graphite">
            후기
          </Link>
        </div>
      </div>
      {isReview ? (
        <PostEditorForm content={{ entityType: "review", entity: emptyReview }} mode="create" />
      ) : (
        <PostEditorForm content={{ entityType: "post", entity: emptyPost }} mode="create" />
      )}
    </div>
  );
}
