import { DinoCharacter } from "@/components/sections/DinoCharacter";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <DinoCharacter variant="loading" className="mx-auto h-20 w-20 animate-bounce" />
        <p className="text-sm text-brand-slate">로딩 중...</p>
      </div>
    </div>
  );
}
