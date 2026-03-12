import { notFound } from "next/navigation";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { getPostById, getReviewById } from "@/lib/repositories/content";

export default async function AdminPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (post) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand-orange">Content Editor</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">{post.title}</h1>
        </div>
        <DeleteEntityButton endpoint={`/api/admin/posts/${post.id}?entityType=post`} redirectTo="/admin/posts" label="게시물" />
        <PostEditorForm content={{ entityType: "post", entity: post }} />
      </div>
    );
  }

  const review = await getReviewById(id);

  if (review) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand-orange">Content Editor</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">{review.title}</h1>
        </div>
        <DeleteEntityButton endpoint={`/api/admin/posts/${review.id}?entityType=review`} redirectTo="/admin/posts" label="후기" />
        <PostEditorForm content={{ entityType: "review", entity: review }} />
      </div>
    );
  }

  notFound();
}
