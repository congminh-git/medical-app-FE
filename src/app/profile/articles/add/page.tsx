"use client";

import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageFallback from "@/components/fallback";
import { useEffect, useState, useCallback, useMemo } from "react";
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
  
  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [image, setImage] = useState("");
  
  // Data states
  const [allSpecialties, setAllSpecialties] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Memoized validation
  const isFormValid = useMemo(() => {
    return title.trim() && specialties.trim() && content.trim();
  }, [title, specialties, content]);

  // Optimized fetch function with error handling
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchSpecialties = await getAllSpecialties();
      setAllSpecialties(fetchSpecialties || []);
    } catch (err) {
      console.error("Error fetching specialties:", err);
      setAllSpecialties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized back handler
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Optimized submit handler
  const handleSubmit = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const body = {
        doctor_id: tokenDecode.id,
        title,
        image,
        content,
        specialties: specialties,
      };

      const addResults = await postAddAirticle(body);
      if (addResults?.id) {
        const endpoint = generateSlug(addResults.title, addResults.id);
        router.replace("/articles" + endpoint);
      }
    } catch (err) {
      console.error("Error submitting article:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, isSubmitting, tokenDecode, title, image, content, specialties, router]);

  // Optimized image handler
  const handleImageToBase64 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Loading fallback
  if (isLoading) {
    console.log("📱 Rendering Add Articles Page Fallback...");
    return <PageFallback />;
  }

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
              onPress={handleBack}
            >
              Quay lại
            </Button>
          </div>

          {/* Error display */}
          {error && (
            <div className="w-full mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button 
                onClick={fetchData} 
                className="ml-2 underline hover:no-underline"
              >
                Thử lại
              </button>
            </div>
          )}

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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <option value="">Chọn chuyên khoa</option>
                  {allSpecialties?.map((item: any) => {
                    return (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    );
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
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="w-full mt-4">
              <RichTextEditor 
                content={content} 
                onChange={setContent}
              />
            </div>
            
            <button
              className={`w-full py-2 px-4 mt-4 rounded transition-colors ${
                isFormValid && !isSubmitting
                  ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Submit"}
            </button>

            <div className="mt-8 w-full border p-4 rounded bg-gray-100">
              <h2 className="text-lg font-semibold">Xem trước bài viết:</h2>
              <div className="mt-4 p-4 bg-white rounded shadow-sm border">
                {title && <h1 className="text-4xl font-bold mb-4">{title}</h1>}
                <div 
                  className="mb-4 w-full h-[800px]" 
                  style={{
                    backgroundImage: image ? `url('${image}')` : "",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
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