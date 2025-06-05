"use client";

import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/richTextEditor/richTextEditor";
import { getAllSpecialties } from "@/services/specialties/functions";
import {
  getArticlesSlug,
  putUpdateAirticle,
} from "@/services/articles/functions";
import { generateSlug } from "@/services/reUseFunctions";
import { Input } from "@heroui/input";
import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

const UpdateArticlesPage = () => {
  useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [id, setId] = useState("");
  const [slug, setSlug] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [originalArticles, setOriginalArticles] = useState<any>(null);
  const [newImage, setNewImage] = useState("");
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paths = pathname.split("/");
    const articleId = paths[paths.length - 1];
    const slugParam = searchParams.get("slug") || "";

    if (articleId) {
      setId(articleId);
      setSlug(slugParam);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!id || !slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchSpecialties, fetchArticle] = await Promise.all([
          getAllSpecialties(),
          getArticlesSlug(id, slug),
        ]);
        setAllSpecialties(fetchSpecialties);
        setArticle(fetchArticle);
        setOriginalArticles(fetchArticle);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, slug]);

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setContent(article.content || "");
      setSpecialties(article.specialties || "");
    }
  }, [article]);

  const handleUpdateArticle = async () => {
    const result = await putUpdateAirticle(
      article.id,
      generateSlug(article.title, article.id),
      { title, specialties, content, image: newImage || article.image }
    );
    if (result.id) {
      const endpoint = generateSlug(title, article.id);
      router.replace("/articles" + endpoint);
    }
  };

  const handleImageToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!id || loading) return <p className="mt-40 text-center">Đang tải...</p>;

  return (
    <>
      <Header />
      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section className="w-full min-h-screen max-w-screen-xl py-10 bg-white">
          <div className="w-full flex justify-between">
            <h1 className="font-bold text-3xl text-[#2C3E50]">
              Cập nhật bài viết
            </h1>
          </div>

          <div className="w-full mt-8">
            <div className="w-full grid grid-cols-3 gap-4">
              <div className="w-full col-span-2">
                <label className="block">Tiêu đề:</label>
                <input
                  className="border rounded-md bg-gray-100 py-2 px-4 mt-1 w-full"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block">Chuyên khoa:</label>
                <select
                  className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                >
                  <option key=""></option>
                  {allSpecialties?.map((item: any) => (
                    <option key={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-full col-span-3">
                <Input
                  radius="sm"
                  type="file"
                  accept="image/*"
                  size={"lg"}
                  label="Chọn hình ảnh đại diện"
                  labelPlacement="outside"
                  variant="bordered"
                  onChange={handleImageToBase64}
                />
              </div>
            </div>

            <div className="w-full mt-4">
              {content !== "" && (
                <RichTextEditor content={content} onChange={setContent} />
              )}
            </div>

            {title &&
            specialties &&
            content &&
            (originalArticles?.title !== title ||
              originalArticles?.specialties !== specialties ||
              originalArticles?.content !== content) ||
            newImage ? (
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={handleUpdateArticle}
              >
                Lưu thay đổi
              </button>
            ) : (
              <button
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 mt-4 rounded"
                disabled
              >
                Lưu thay đổi
              </button>
            )}

            <div className="mt-8 w-full border p-4 rounded bg-gray-100">
              <h2 className="text-lg font-semibold">Xem trước bài viết:</h2>
              <div className="mt-4 p-4 bg-white rounded shadow-sm border">
                {title && <h1 className="text-4xl font-bold mb-4">{title}</h1>}
                <div
                  className="mb-4 w-full h-[800px]"
                  style={{
                    backgroundImage: newImage
                      ? `url('${newImage}')`
                      : originalArticles
                      ? `url('${originalArticles?.image}')`
                      : "",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  className="rich-text-preview"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default UpdateArticlesPage;
