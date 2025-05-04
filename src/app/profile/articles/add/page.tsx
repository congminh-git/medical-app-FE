"use client";

import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/richTextEditor/richTextEditor";
import { getAllSpecialties } from "@/services/specialties/functions";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { postAddAirticle } from "@/services/articles/functions";
import { generateSlug } from "@/services/reUseFunctions";

export default function AddArticlesPage() {
  const tokenDecode = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [image, setImage] = useState("");
  const [allSpecialties, setAllSpecialties] = useState([]);

  const fetchData = async () => {
    const fetchSpecialties = await getAllSpecialties();
    setAllSpecialties(fetchSpecialties);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    const body = {
      doctor_id: tokenDecode.id,
      title,
      image,
      content,
      specialties: specialties,
    };

    const addResults = await postAddAirticle(body);
    if (addResults.id) {
      const endpoint = generateSlug(addResults.title, addResults.id);
      router.replace("/articles" + endpoint);
    }
  };

  const handleImageToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage((prev: any) => {
          console.log(prev);
          return reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section className="w-full min-h-screen max-w-screen-xl py-10 bg-white">
          <div className="w-full flex justify-between">
            <h1 className="font-bold text-3xl text-[#2C3E50]">Thêm bài viết</h1>
            <Button
              color="primary"
              className={`px-6 py-2 rounded-md bg-[#F39C12] text-white`}
              size="lg"
              onPress={() => handleBack()}
            >
              Quay lại
            </Button>
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
              <RichTextEditor content={content} onChange={setContent} />
            </div>
            {title && specialties && content ? (
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            ) : (
              <button
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 mt-4 rounded"
                disabled
              >
                Submit
              </button>
            )}
            <div className="mt-8 w-full border p-4 rounded bg-gray-100">
              <h2 className="text-lg font-semibold">Xem trước bài viết:</h2>
              <div className="mt-4 p-4 bg-white rounded shadow-sm border">
                {title && <h1 className="text-4xl font-bold mb-4">{title}</h1>}
              <div className="mb-4 w-full h-[800px]" style={{
                  backgroundImage: image ? `url('${image}')` : "",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
              </div>
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
}
