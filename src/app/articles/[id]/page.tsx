"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { getArticlesSlug, putArticleLike } from "@/services/articles/functions";
import { formatDateTime } from "@/services/reUseFunctions";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function ArticleContent() {
  const tokenDecode = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = useMemo(() => params?.id || "", [params]);
  const slug = useMemo(() => searchParams.get("slug") || "", [searchParams]);

  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !slug) return;

    const fetchData = async () => {
      try {
        const value = await getArticlesSlug(id, slug);
        setArticle(value);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, slug]);

  if (!id) return <p>Không tìm thấy bài viết.</p>;
  if (loading) return <ArticleFallback/>;

  return (
    <div className="bg-white mm flex justify-center flex-wrap">
      <section className="w-full min-h-screen max-w-screen-xl py-10 bg-white">
        <div className="w-full mt-8">
          {article?.title && (
            <h1 className="w-full text-4xl font-bold mb-4">{article?.title}</h1>
          )}
          <div className="flex items-center">
            Tác giả:
            <a
              className="ml-2 font-bold no-underline group-hover:underline"
              href={`/doctors/${article.doctor_id}/profile`}
            >
              {article?.doctor?.user?.full_name}
            </a>
          </div>
          <div className="flex items-center justify-start">
            <p className="font-bold text-gray-600">
              Ngày đăng: {formatDateTime(article?.created_at)}
            </p>
          </div>
          <div
            className="w-full h-[800px] border mt-4"
            style={{
              backgroundImage: article?.image ? `url('${article?.image}')` : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div
            className="rich-text-preview text-lg mt-12"
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
          />
          <div className="flex justify-center mt-20">
            <p className="text-md flex justify-start items-center gap-4 my-1 font-bold text-[#2C3E50] whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="flex items-center gap-2">
                <EyeIcon className="h-6 w-6" /> {article?.views}
              </span>
              <span className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2"
                  onClick={async () => {
                    const likeResult = await putArticleLike(
                      article.id,
                      tokenDecode.id
                    );
                    if (likeResult.id) {
                      setArticle({ ...article, likes: likeResult.likes });
                    }
                  }}
                >
                  <HandThumbUpIcon
                    className={`${
                      article.likes.includes(tokenDecode.id)
                        ? "text-blue-500"
                        : ""
                    } h-6 w-6 hover:text-green-500`}
                  />
                  {article.likes ? article?.likes.split(", ").length : 0}
                </button>
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArticleFallback() {
const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 10 + 5);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="w-64 bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 text-blue-700 font-medium text-lg">
        Đang tải... {progress}%
      </div>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen mt-[120px]">
        <Suspense fallback={<ArticleFallback />}>
          <ArticleContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
