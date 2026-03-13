import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { formatDate } from "@/lib/utils/date";

const { getInquiryFixturesMock, getInquiryByIdMock, getInquiryStatusLabelMock, getProductByIdMock, notFoundMock } = vi.hoisted(
  () => ({
    getInquiryFixturesMock: vi.fn(),
    getInquiryByIdMock: vi.fn(),
    getInquiryStatusLabelMock: vi.fn(),
    getProductByIdMock: vi.fn(),
    notFoundMock: vi.fn()
  })
);

vi.mock("@/lib/repositories/inquiries", () => ({
  getInquiryFixtures: getInquiryFixturesMock,
  getInquiryById: getInquiryByIdMock,
  getInquiryStatusLabel: getInquiryStatusLabelMock
}));

vi.mock("@/lib/repositories/content", () => ({
  getProductById: getProductByIdMock
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock
}));

vi.mock("@/components/admin/InquiryEditor", () => ({
  InquiryEditor: ({ inquiry }: { inquiry: { id: string } }) => <div>editor:{inquiry.id}</div>
}));

describe("admin inquiries pages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    getInquiryStatusLabelMock.mockImplementation((status: string) => `상태:${status}`);
    notFoundMock.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
  });

  it("renders the inquiries list page with status labels and detail links", async () => {
    getInquiryFixturesMock.mockResolvedValue([
      {
        id: "inq-1",
        inquiryType: "quick",
        name: "홍길동",
        phone: "010-1111-2222",
        sourcePage: "/",
        status: "new",
        privacyAgreed: true,
        payload: {},
        utm: {},
        createdAt: "2026-03-11T09:00:00.000Z",
        updatedAt: "2026-03-11T09:00:00.000Z"
      },
      {
        id: "inq-2",
        inquiryType: "apply",
        name: "김상담",
        phone: "010-2222-3333",
        sourcePage: "/apply",
        status: "consulted",
        privacyAgreed: true,
        payload: {},
        utm: {},
        createdAt: "2026-03-10T09:00:00.000Z",
        updatedAt: "2026-03-10T10:00:00.000Z"
      }
    ]);

    const { default: AdminInquiriesPage } = await import("../page");
    const html = renderToStaticMarkup(await AdminInquiriesPage());

    expect(html).toContain("문의 관리");
    expect(html).toContain("홍길동");
    expect(html).toContain("김상담");
    expect(html).toContain("상태:new");
    expect(html).toContain("상태:consulted");
    expect(html).toContain(formatDate("2026-03-11T09:00:00.000Z"));
    expect(html).toContain("/admin/inquiries/inq-1");
    expect(html).toContain("/admin/inquiries/inq-2");
    expect(getInquiryFixturesMock).toHaveBeenCalledTimes(1);
  });

  it("renders the inquiry detail page with the resolved product and editor", async () => {
    getInquiryByIdMock.mockResolvedValue({
      id: "inq-detail-1",
      inquiryType: "product",
      name: "이고객",
      phone: "010-3333-4444",
      productId: "product-1",
      sourcePage: "/products/sk-500-btv-all",
      status: "pending",
      privacyAgreed: true,
      regionLabel: "서울 강동구",
      payload: {},
      utm: {},
      createdAt: "2026-03-09T09:00:00.000Z",
      updatedAt: "2026-03-09T09:00:00.000Z"
    });
    getProductByIdMock.mockResolvedValue({
      id: "product-1",
      name: "기가라이트인터넷 500M + B tv ALL"
    });

    const { default: AdminInquiryDetailPage } = await import("../[id]/page");
    const html = renderToStaticMarkup(
      await AdminInquiryDetailPage({ params: Promise.resolve({ id: "inq-detail-1" }) })
    );

    expect(html).toContain("이고객 문의 상세");
    expect(html).toContain("유형:</strong> product");
    expect(html).toContain("상태:</strong> 상태:pending");
    expect(html).toContain("설치 지역:</strong> 서울 강동구");
    expect(html).toContain("상품:</strong> 기가라이트인터넷 500M + B tv ALL");
    expect(html).toContain(formatDate("2026-03-09T09:00:00.000Z"));
    expect(html).toContain("editor:inq-detail-1");
    expect(getInquiryByIdMock).toHaveBeenCalledWith("inq-detail-1");
    expect(getProductByIdMock).toHaveBeenCalledWith("product-1");
  });

  it("shows a placeholder product when the inquiry has no linked product", async () => {
    getInquiryByIdMock.mockResolvedValue({
      id: "inq-detail-2",
      inquiryType: "quick",
      name: "박고객",
      phone: "010-4444-5555",
      productId: null,
      sourcePage: "/",
      status: "new",
      privacyAgreed: true,
      regionLabel: null,
      payload: {},
      utm: {},
      createdAt: "2026-03-08T09:00:00.000Z",
      updatedAt: "2026-03-08T09:00:00.000Z"
    });

    const { default: AdminInquiryDetailPage } = await import("../[id]/page");
    const html = renderToStaticMarkup(
      await AdminInquiryDetailPage({ params: Promise.resolve({ id: "inq-detail-2" }) })
    );

    expect(html).toContain("상품:</strong> -");
    expect(html).toContain("설치 지역:</strong> -");
    expect(getProductByIdMock).not.toHaveBeenCalled();
  });

  it("delegates missing inquiry details to notFound", async () => {
    getInquiryByIdMock.mockResolvedValue(null);

    const { default: AdminInquiryDetailPage } = await import("../[id]/page");

    await expect(AdminInquiryDetailPage({ params: Promise.resolve({ id: "missing-id" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(getProductByIdMock).not.toHaveBeenCalled();
  });
});
