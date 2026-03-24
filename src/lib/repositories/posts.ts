import { postsSeed, reviewsSeed } from "@/data/seeds";
import { getBoardCategoryConfig } from "@/lib/constants/board";
import { throwIfSupabaseError } from "@/lib/repositories/errors";
import { mapPostRow, mapReviewRow } from "@/lib/repositories/mappers";
import { parseCommaSeparatedText } from "@/lib/repositories/parsers";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/server";
import type { ContentStatus, Post, PostType, Review } from "@/types/domain";
import type { PostEditorValues } from "@/lib/validators/content";

function sortByPublishedAtDesc<T extends { publishedAt: string }>(a: T, b: T) {
  return a.publishedAt < b.publishedAt ? 1 : -1;
}

export function getBoardTypeFromCategory(category: string): PostType | null {
  return getBoardCategoryConfig(category)?.type ?? null;
}

export async function getPostsByType(type: PostType): Promise<Post[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("type", type)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    throwIfSupabaseError("posts:getPostsByType", error);

    if (data) {
      return data.map(mapPostRow);
    }

    return [];
  }

  return postsSeed
    .filter((post) => post.type === type && post.status === "published")
    .sort(sortByPublishedAtDesc);
}

export async function getFeaturedPosts(type: PostType) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("type", type)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false });

    throwIfSupabaseError("posts:getFeaturedPosts", error);

    if (data) {
      return data.map(mapPostRow);
    }

    return [];
  }

  return postsSeed
    .filter(
      (post) =>
        post.type === type && post.isFeatured && post.status === "published",
    )
    .sort(sortByPublishedAtDesc);
}

export async function getPostByTypeAndSlug(type: PostType, slug: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("type", type)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    throwIfSupabaseError("posts:getPostByTypeAndSlug", error);

    if (data) {
      return mapPostRow(data);
    }

    return null;
  }

  return (
    postsSeed.find(
      (post) =>
        post.type === type && post.slug === slug && post.status === "published",
    ) ?? null
  );
}

export async function getPostById(id: string): Promise<Post | null> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    throwIfSupabaseError("posts:getPostById", error);

    if (data) {
      return mapPostRow(data);
    }

    return null;
  }

  return postsSeed.find((post) => post.id === id) ?? null;
}

export async function getAllPostsAdmin() {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });

    throwIfSupabaseError("posts:getAllPostsAdmin", error);

    if (data) {
      return data.map(mapPostRow);
    }

    return [];
  }

  return [...postsSeed].sort(sortByPublishedAtDesc);
}

export async function getReviews(): Promise<Review[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    throwIfSupabaseError("posts:getReviews", error);

    if (data) {
      return data.map(mapReviewRow);
    }

    return [];
  }

  return reviewsSeed
    .filter((review) => review.status === "published")
    .sort(sortByPublishedAtDesc);
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("published_at", { ascending: false });

    throwIfSupabaseError("posts:getAllReviewsAdmin", error);

    if (data) {
      return data.map(mapReviewRow);
    }

    return [];
  }

  return [...reviewsSeed].sort(sortByPublishedAtDesc);
}

export async function getFeaturedReviews() {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false });

    throwIfSupabaseError("posts:getFeaturedReviews", error);

    if (data) {
      return data.map(mapReviewRow);
    }

    return [];
  }

  return reviewsSeed
    .filter((review) => review.status === "published" && review.featured)
    .sort(sortByPublishedAtDesc);
}

export async function getReviewBySlug(slug: string) {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    throwIfSupabaseError("posts:getReviewBySlug", error);

    if (data) {
      return mapReviewRow(data);
    }

    return null;
  }

  return (
    reviewsSeed.find(
      (review) => review.slug === slug && review.status === "published",
    ) ?? null
  );
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    throwIfSupabaseError("posts:getReviewById", error);

    if (data) {
      return mapReviewRow(data);
    }

    return null;
  }

  return reviewsSeed.find((review) => review.id === id) ?? null;
}

export async function updatePostOrReview(id: string, input: PostEditorValues) {
  if (input.entityType === "post") {
    const payload = {
      type: input.type,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      body: input.body,
      cta_label: input.ctaLabel || null,
      related_product_slugs: parseCommaSeparatedText(
        input.relatedProductSlugsText,
      ),
      is_featured: input.isFeatured,
      status: input.status,
      published_at: input.publishedAt,
    };

    if (hasSupabaseAdminEnv()) {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", id)
        .select("*")
        .maybeSingle();

      if (error) {
        return {
          success: false,
          statusCode: 500,
          message: "게시물 저장 중 오류가 발생했습니다.",
        };
      }

      if (!data) {
        return {
          success: false,
          statusCode: 404,
          message: "게시물 정보를 찾을 수 없습니다.",
        };
      }

      return { success: true, data: mapPostRow(data) };
    }

    const post = postsSeed.find((item) => item.id === id);
    if (!post) {
      return {
        success: false,
        statusCode: 404,
        message: "게시물 정보를 찾을 수 없습니다.",
      };
    }

    post.type = input.type ?? "guide";
    post.title = input.title;
    post.slug = input.slug;
    post.summary = input.summary;
    post.body = input.body;
    post.ctaLabel = input.ctaLabel;
    post.relatedProductSlugs = parseCommaSeparatedText(
      input.relatedProductSlugsText,
    );
    post.isFeatured = input.isFeatured;
    post.status = input.status;
    post.publishedAt = input.publishedAt;

    return { success: true, data: post };
  }

  const payload = {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    body: input.body,
    review_type: input.reviewType,
    tags: parseCommaSeparatedText(input.tagsText),
    featured: input.isFeatured,
    status: input.status,
    published_at: input.publishedAt,
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 저장 중 오류가 발생했습니다.",
      };
    }

    if (!data) {
      return {
        success: false,
        statusCode: 404,
        message: "후기 정보를 찾을 수 없습니다.",
      };
    }

    return { success: true, data: mapReviewRow(data) };
  }

  const review = reviewsSeed.find((item) => item.id === id);
  if (!review) {
    return {
      success: false,
      statusCode: 404,
      message: "후기 정보를 찾을 수 없습니다.",
    };
  }

  review.title = input.title;
  review.slug = input.slug;
  review.summary = input.summary;
  review.body = input.body;
  review.reviewType = input.reviewType ?? "internet_tv";
  review.tags = parseCommaSeparatedText(input.tagsText);
  review.featured = input.isFeatured;
  review.status = input.status;
  review.publishedAt = input.publishedAt;

  return { success: true, data: review };
}

export async function createPostOrReview(input: PostEditorValues) {
  const id = crypto.randomUUID();

  if (input.entityType === "post") {
    const payload = {
      id,
      type: input.type,
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      body: input.body,
      cta_label: input.ctaLabel || null,
      related_product_slugs: parseCommaSeparatedText(
        input.relatedProductSlugsText,
      ),
      is_featured: input.isFeatured,
      published_at: input.publishedAt,
      status: input.status,
    };

    if (hasSupabaseAdminEnv()) {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("posts")
        .insert(payload)
        .select("*")
        .maybeSingle();

      if (error) {
        return {
          success: false,
          statusCode: 500,
          message: "게시물 생성 중 오류가 발생했습니다.",
        };
      }

      if (!data) {
        return {
          success: false,
          statusCode: 500,
          message: "게시물 생성 결과를 확인할 수 없습니다.",
        };
      }

      return { success: true, data: mapPostRow(data) };
    }

    const created: Post = {
      id,
      type: input.type ?? "guide",
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      body: input.body,
      ctaLabel: input.ctaLabel,
      relatedProductSlugs: parseCommaSeparatedText(
        input.relatedProductSlugsText,
      ),
      isFeatured: input.isFeatured,
      publishedAt: input.publishedAt,
      status: input.status,
    };

    postsSeed.push(created);

    return { success: true, data: created };
  }

  const payload = {
    id,
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    body: input.body,
    review_type: input.reviewType,
    tags: parseCommaSeparatedText(input.tagsText),
    featured: input.isFeatured,
    published_at: input.publishedAt,
    status: input.status,
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .insert(payload)
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 생성 중 오류가 발생했습니다.",
      };
    }

    if (!data) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 생성 결과를 확인할 수 없습니다.",
      };
    }

    return { success: true, data: mapReviewRow(data) };
  }

  const created: Review = {
    id,
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    body: input.body,
    reviewType: input.reviewType ?? "internet_tv",
    tags: parseCommaSeparatedText(input.tagsText),
    featured: input.isFeatured,
    publishedAt: input.publishedAt,
    status: input.status,
  };

  reviewsSeed.push(created);

  return { success: true, data: created };
}

export async function createCustomerReview(input: {
  authorName: string;
  reviewType: string;
  title: string;
  body: string;
}) {
  const id = crypto.randomUUID();
  const slug = `review-${Date.now()}`;
  const now = new Date().toISOString();

  const payload = {
    id,
    slug,
    title: input.title,
    summary: input.body.slice(0, 100),
    body: input.body,
    review_type: input.reviewType,
    tags: [],
    featured: false,
    author_name: input.authorName,
    source: "customer",
    published_at: now,
    status: "pending",
  };

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .insert(payload)
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 저장 중 오류가 발생했습니다.",
      };
    }

    if (!data) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 저장 결과를 확인할 수 없습니다.",
      };
    }

    return { success: true, data: mapReviewRow(data) };
  }

  const created: Review = {
    id,
    slug,
    title: input.title,
    summary: input.body.slice(0, 100),
    body: input.body,
    reviewType: (input.reviewType as Review["reviewType"]) ?? "internet_tv",
    tags: [],
    featured: false,
    authorName: input.authorName,
    source: "customer",
    publishedAt: now,
    status: "pending",
  };

  reviewsSeed.push(created);

  return { success: true, data: created };
}

export async function deletePostOrReview(
  id: string,
  entityType: "post" | "review",
) {
  if (entityType === "post") {
    if (hasSupabaseAdminEnv()) {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) {
        return {
          success: false,
          statusCode: 500,
          message: "게시물 삭제 중 오류가 발생했습니다.",
        };
      }

      return { success: true };
    }

    const index = postsSeed.findIndex((item) => item.id === id);
    if (index === -1) {
      return {
        success: false,
        statusCode: 404,
        message: "게시물 정보를 찾을 수 없습니다.",
      };
    }

    postsSeed.splice(index, 1);
    return { success: true };
  }

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 삭제 중 오류가 발생했습니다.",
      };
    }

    return { success: true };
  }

  const index = reviewsSeed.findIndex((item) => item.id === id);
  if (index === -1) {
    return {
      success: false,
      statusCode: 404,
      message: "후기 정보를 찾을 수 없습니다.",
    };
  }

  reviewsSeed.splice(index, 1);
  return { success: true };
}

export async function updatePostOrReviewStatus(
  id: string,
  entityType: "post" | "review",
  status: ContentStatus,
) {
  if (entityType === "post") {
    if (hasSupabaseAdminEnv()) {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("posts")
        .update({ status })
        .eq("id", id)
        .select("*")
        .maybeSingle();

      if (error) {
        return {
          success: false,
          statusCode: 500,
          message: "게시물 상태 변경 중 오류가 발생했습니다.",
        };
      }

      if (!data) {
        return {
          success: false,
          statusCode: 404,
          message: "게시물 정보를 찾을 수 없습니다.",
        };
      }

      return { success: true, data: mapPostRow(data) };
    }

    const post = postsSeed.find((item) => item.id === id);
    if (!post) {
      return {
        success: false,
        statusCode: 404,
        message: "게시물 정보를 찾을 수 없습니다.",
      };
    }

    post.status = status;

    return { success: true, data: post };
  }

  if (hasSupabaseAdminEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: "후기 상태 변경 중 오류가 발생했습니다.",
      };
    }

    if (!data) {
      return {
        success: false,
        statusCode: 404,
        message: "후기 정보를 찾을 수 없습니다.",
      };
    }

    return { success: true, data: mapReviewRow(data) };
  }

  const review = reviewsSeed.find((item) => item.id === id);
  if (!review) {
    return {
      success: false,
      statusCode: 404,
      message: "후기 정보를 찾을 수 없습니다.",
    };
  }

  review.status = status;

  return { success: true, data: review };
}
