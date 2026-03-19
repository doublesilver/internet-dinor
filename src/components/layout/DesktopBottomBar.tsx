"use client";

const KAKAO_CHANNEL_CHAT = "https://pf.kakao.com/_yCxkxhX/chat";

export function DesktopBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 hidden md:block">
      <div className="mx-auto flex max-w-xl justify-center pb-5">
        <a
          href={KAKAO_CHANNEL_CHAT}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#FEE500] px-10 py-4 shadow-xl transition-transform hover:scale-[1.02]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6-.15.56-.96 3.53-1 3.67 0 .05.02.1.06.13a.12.12 0 0 0 .1.02c.14-.02 3.27-2.14 4.12-2.73.68.1 1.38.15 2.07.15 5.52 0 10-3.58 10-7.93S17.52 3 12 3z" />
          </svg>
          <span className="text-lg font-black text-[#3C1E1E]">바로 상담하기</span>
        </a>
      </div>
    </div>
  );
}
