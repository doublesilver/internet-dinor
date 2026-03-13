import { afterEach, describe, expect, it, vi } from "vitest";

const SK_CARRIER_ID = "11111111-1111-1111-1111-111111111111";
const KT_CARRIER_ID = "22222222-2222-2222-2222-222222222222";

async function loadSeedFallbackModules() {
  vi.resetModules();

  const createSupabaseAdminClient = vi.fn();

  vi.doMock("@/lib/supabase/server", () => ({
    hasSupabaseAdminEnv: () => false,
    createSupabaseAdminClient
  }));

  const carriersModule = await import("../carriers");
  const productsModule = await import("../products");

  return {
    carriersModule,
    productsModule,
    createSupabaseAdminClient
  };
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("carriers repository seed fallback", () => {
  it("returns carriers in the seeded publish order without creating a Supabase client", async () => {
    const { carriersModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const carriers = await carriersModule.getCarriers();

    expect(carriers.map((carrier) => carrier.slug)).toEqual(["sk", "kt", "lg", "skylife", "hellovision"]);
    expect(carriers.map((carrier) => carrier.shortName)).toEqual(["SK", "KT", "LG U+", "스카이라이프", "헬로비전"]);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("finds a carrier by slug and returns null for unknown slugs", async () => {
    const { carriersModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    await expect(carriersModule.getCarrierBySlug("kt")).resolves.toMatchObject({
      id: KT_CARRIER_ID,
      slug: "kt",
      name: "KT",
      heroTitle: "KT 인터넷/TV 상품 비교"
    });
    await expect(carriersModule.getCarrierBySlug("missing")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});

describe("products repository seed fallback", () => {
  it("returns all products in seed sort order", async () => {
    const { productsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const products = await productsModule.getProducts();

    expect(products.map((product) => product.slug)).toEqual([
      "sk-500-btv-all",
      "sk-1g-btv-all",
      "sk-100-btv-standard",
      "sk-500-internet-only",
      "kt-500-otv-basic",
      "kt-1g-otv-essence",
      "kt-100-otv-basic",
      "lg-500-tv-basic",
      "lg-500-premium-tv",
      "lg-1g-tv-premium",
      "sky-100-all",
      "sky-500-all",
      "sky-200-all",
      "hello-100-economy",
      "hello-500-basic",
      "hello-500-economy"
    ]);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("returns only featured products in the expected order", async () => {
    const { productsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const featuredProducts = await productsModule.getFeaturedProducts();

    expect(featuredProducts.map((product) => product.slug)).toEqual([
      "sk-500-btv-all",
      "kt-500-otv-basic",
      "lg-500-tv-basic",
      "sky-100-all",
      "hello-100-economy"
    ]);
    expect(featuredProducts.every((product) => product.isFeatured)).toBe(true);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("filters products by carrier slug using the seeded carrier lookup", async () => {
    const { productsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const skProducts = await productsModule.getProductsByCarrierSlug("sk");

    expect(skProducts.map((product) => product.slug)).toEqual([
      "sk-500-btv-all",
      "sk-1g-btv-all",
      "sk-100-btv-standard",
      "sk-500-internet-only"
    ]);
    expect(skProducts.every((product) => product.carrierId === SK_CARRIER_ID)).toBe(true);
    await expect(productsModule.getProductsByCarrierSlug("missing")).resolves.toEqual([]);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("resolves products by slug and id", async () => {
    const { productsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    await expect(productsModule.getProductBySlug("sk-500-btv-all")).resolves.toMatchObject({
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      carrierId: SK_CARRIER_ID,
      slug: "sk-500-btv-all",
      tvIncluded: true,
      internetSpeed: "500M",
      benefitLabel: "사은품 최대 47만원"
    });
    await expect(productsModule.getProductBySlug("missing")).resolves.toBeNull();

    await expect(productsModule.getProductById("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe")).resolves.toMatchObject({
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe",
      slug: "kt-1g-otv-essence",
      name: "인터넷 에센스 1G + OTV 에센스",
      carrierId: KT_CARRIER_ID
    });
    await expect(productsModule.getProductById("missing")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});
