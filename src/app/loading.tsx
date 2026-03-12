export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
        <p className="text-sm text-brand-slate">로딩 중...</p>
      </div>
    </div>
  );
}
