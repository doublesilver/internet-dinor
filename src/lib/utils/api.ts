export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function safeFetch<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, init);
  const body: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: "서버 응답을 처리할 수 없습니다.",
  }));
  if (!response.ok && body.success !== false) {
    return { success: false, message: body.message ?? "요청에 실패했습니다." };
  }
  return body;
}
