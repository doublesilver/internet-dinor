import Link from "next/link";
import { StatusQuickToggle } from "@/components/admin/StatusQuickToggle";
import { getAllPostsAdmin, getAllReviewsAdmin } from "@/lib/repositories/content";

export default async function AdminPostsPage() {
  const [posts, reviews] = await Promise.all([getAllPostsAdmin(), getAllReviewsAdmin()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-orange">Posts</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-graphite">게시물 관리</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/posts/new?entityType=post" className="inline-flex rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white">
          신규 게시물 등록
        </Link>
        <Link href="/admin/posts/new?entityType=review" className="inline-flex rounded-2xl border border-brand-orange bg-white px-5 py-3 text-sm font-semibold text-brand-orange">
          신규 후기 등록
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-orange">{post.type}</p>
              <StatusQuickToggle endpoint={`/api/admin/posts/${post.id}/status`} initialStatus={post.status} entityLabel="게시물" entityType="post" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-brand-graphite">{post.title}</h2>
            <div className="mt-4">
              <Link href={`/admin/posts/${post.id}`} className="font-semibold text-brand-orange">
                편집하기
              </Link>
            </div>
          </article>
        ))}
        {reviews.map((review) => (
          <article key={review.id} className="surface-card">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-orange">review</p>
              <StatusQuickToggle endpoint={`/api/admin/posts/${review.id}/status`} initialStatus={review.status} entityLabel="후기" entityType="review" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-brand-graphite">{review.title}</h2>
            <div className="mt-4">
              <Link href={`/admin/posts/${review.id}`} className="font-semibold text-brand-orange">
                편집하기
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
