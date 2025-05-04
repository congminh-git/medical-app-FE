"use client";

import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/richTextEditor/richTextEditor";
import { getAllSpecialties } from "@/services/specialties/functions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getArticlesSlug,
  putUpdateAirticle,
} from "@/services/articles/functions";
import { generateSlug } from "@/services/reUseFunctions";
import { Input } from "@heroui/input";

const UpdateArticlesPage = () => {
  useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id || "";
  const slug = searchParams.get("slug") || "";
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [originalArticles, setOriginalArticles] = useState<any>(null);
  const [newImage, setNewImage] = useState("");
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const fetchSpecialties = await getAllSpecialties();
    const fetchArticle = await getArticlesSlug(id, slug);
    setAllSpecialties(fetchSpecialties);
    setArticle(fetchArticle);
    setOriginalArticles(fetchArticle);
    setLoading(false);
  };

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
        setNewImage((prev: any) => {
          console.log(prev);
          return reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setContent(article.content || "");
      setSpecialties(article.specialties || "");
    }
  }, [article]);

  if (!id) return <p>Không tìm thấy bài viết.</p>;
  if (loading) return <p>Loading...</p>;

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
                <label className="block" htmlFor="">
                  Tiêu đề:
                </label>
                <input
                  className="border rounded-md bg-gray-100 py-2 px-4 mt-1 w-full"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block" htmlFor="">
                  Chuyên khoa:
                </label>
                <select
                  className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                >
                  <option key=""></option>
                  {allSpecialties?.map((item: any) => {
                    return <option key={item.id}>{item.name}</option>;
                  })}
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
              {content != "" ? (
                <RichTextEditor content={content} onChange={setContent} />
              ) : (
                <></>
              )}
            </div>
            {title &&
            specialties &&
            content &&
            (originalArticles?.title != title ||
              originalArticles?.specialties != specialties ||
              originalArticles?.content != content) ||
              newImage ? (
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={() => handleUpdateArticle()}
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
                ></div>
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
