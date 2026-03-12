export interface PublicRecentApplicationRow {
  date: string;
  name: string;
  installStatus: string;
  giftStatus: string;
}

function formatMonthDay(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function dayOffset(baseDate: Date, offset: number) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() - offset);
  return formatMonthDay(nextDate);
}

export function buildPublicRecentApplications(baseDate = new Date()): PublicRecentApplicationRow[] {
  return [
    { date: dayOffset(baseDate, 0), name: "김 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 0), name: "이 * 연", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 0), name: "박 * 호", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 1), name: "최 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 1), name: "정 * 빈", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 1), name: "강 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 2), name: "조 * 서", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 2), name: "윤 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 2), name: "장 * 은", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 3), name: "임 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 3), name: "한 * 민", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 3), name: "오 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 4), name: "서 * 현", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 4), name: "신 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 4), name: "권 * 우", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 5), name: "황 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 5), name: "안 * 진", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 5), name: "송 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 6), name: "류 * 희", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 6), name: "홍 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 6), name: "김 * 수", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 7), name: "이 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 7), name: "박 * 윤", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 7), name: "최 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 8), name: "정 * 은", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 8), name: "강 * *", installStatus: "접수진행", giftStatus: "입금대기" },
    { date: dayOffset(baseDate, 9), name: "조 * 현", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 9), name: "윤 * *", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 10), name: "장 * 서", installStatus: "설치완료", giftStatus: "입금완료" },
    { date: dayOffset(baseDate, 10), name: "임 * *", installStatus: "설치완료", giftStatus: "입금완료" }
  ];
}
