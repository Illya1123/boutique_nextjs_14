"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notFound } from "next/navigation";
import { slugify } from "@/app/_utils/slugify";
import AppBreadcrumb from "@/app/_components/Breadcrumb";
import { upsertBlog } from "@/store/blogSlice";

export default function BlogDetailClient({ slug, id }) {
  const dispatch = useDispatch();
  const blogs = useSelector((s) => s.blogs?.items ?? []);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ưu tiên lấy từ store theo ID (nếu URL có id)
  const blogById = useMemo(() => {
    if (!id) return null;
    return blogs.find((b) => String(b?.id) === String(id)) || null;
  }, [blogs, id]);

  // Nếu không có id -> fallback tìm theo slug trong store
  const blogBySlug = useMemo(() => {
    if (id || !slug) return null; // đã có id thì không dùng slug
    return blogs.find((b) => slugify(b?.title || "") === slug) || null;
  }, [blogs, slug, id]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (blogById) {
          if (!cancelled) setBlog(blogById);
          return;
        }
        if (!id && blogBySlug) {
          if (!cancelled) setBlog(blogBySlug);
          return;
        }

        const q = id
          ? `id=${encodeURIComponent(id)}`
          : slug
          ? `slug=${encodeURIComponent(slug)}`
          : "";

        if (!q) throw new Error("Thiếu tham số id/slug");

        const res = await axios.get(`/api/blogs?${q}`);
        const ok = res.data?.success;
        const found = res.data?.blog;
        if (!ok || !found) throw new Error("Không tìm thấy bài viết");

        if (!cancelled) {
          setBlog(found);
          dispatch(upsertBlog(found)); // cache vào store
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Lỗi khi tải dữ liệu");
          setBlog(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [blogById, blogBySlug, id, slug, dispatch]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!blog) return notFound();

  const { title, createdAt, author, category, paragraph = [] } = blog;

  const paragraphs = [...paragraph].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const words = paragraphs
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text.trim().split(/\s+/).length)
    .reduce((a, b) => a + b, 0);

  const readMins = Math.max(1, Math.round(words / 200));

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })
    : "";

  return (
    <main className="max-w-3xl px-5 py-10 mx-auto">
      {/* Breadcrumb */}
      <AppBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Blog", href: "/blogs" },
          { label: title }, // item cuối không cần href
        ]}
      />

      <article className="mt-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-neutral-600">
            {author?.name && <span>{author.name}</span>}
            {dateStr && <span>• {dateStr}</span>}
            <span>• {readMins} phút đọc</span>
            {category?.name && (
              <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs">
                {category.name}
              </span>
            )}
          </div>
        </header>

        <section className="prose max-w-none">
          {paragraphs.map((p, i) =>
            p.type === "image" && p.image_url ? (
              <figure key={i} className="my-6">
                <img
                  src={p.image_url}
                  alt={p.text || "blog image"}
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
                {p.text && (
                  <figcaption className="mt-2 text-sm text-neutral-500">
                    {p.text}
                  </figcaption>
                )}
              </figure>
            ) : (
              <p key={i} className="my-4 leading-7 text-[17px] text-neutral-800">
                {p.text}
              </p>
            )
          )}
        </section>
      </article>
    </main>
  );
}
