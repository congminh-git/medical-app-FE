"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Button } from "@heroui/button";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";
import { getNewArticles, getTopArticles } from "@/services/articles/functions";
import { getTopNewDoctors } from "@/services/doctors/functions";
import { getAllSpecialties } from "@/services/specialties/functions";
import ArticleCard from "@/components/articles/articleCard";
import {
  getCareArticles,
  getMasterData,
  getRandomArticles,
} from "@/services/functions";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { getAllDiseaseTypes } from "@/services/diseaseTypes/functions";
import { getAllSymptoms } from "@/services/symptoms/functions";
import { Select, SelectItem } from "@heroui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DoctorCard from "@/components/doctors/doctorCard";

function HomeFallback() {
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

function HomeContent() {
  useAuth();
  const tokenDecode = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newArticlesRef = useRef<HTMLElement | null>(null);
  const [newArticles, setNewArticles] = useState<any>([]);
  const [topArticles, setTopArticles] = useState<any>([]);
  const [careArticles, setCareArticles] = useState<any>([]);
  const [topNewDoctors, setTopNewDoctors] = useState<any>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any>([]);
  const [fetched, setFetched] = useState(false);
  const [openCareDrawer, setOpenCareDrawer] = useState(true);
  const [allDisease, setAllDisease] = useState<any>([]);
  const [allSymptom, setAllSymptom] = useState<any>([]);
  const [careSpecialties, setCareSpecialties] = useState<any>([]);
  const [careSymptoms, setCareSymptoms] = useState<any>([]);
  const [careDiseases, setCareDiseases] = useState<any>([]);
  const [doctorRecommendation, setDoctorRecommendation] = useState<any>([]);

  const handleScroll = () => {
    if (newArticlesRef.current) {
      newArticlesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitCareInfo = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("diseases", careDiseases);
    currentParams.set("symptoms", careSymptoms);
    router.replace(`?${currentParams.toString()}`);
  };

  const handleGetTopNewDoctor = async () => {
    const res = await getTopNewDoctors(doctorRecommendation.join(","));
    setTopNewDoctors(res);
  };

  const handleFetchData = async () => {
    try {
      const [
        newArticles,
        topArticles,
        doctor,
        allSpecialties,
        allDisease,
        allSymptom,
        masterData,
      ] = await Promise.all([
        getNewArticles(),
        getTopArticles(),
        getTopNewDoctors(),
        getAllSpecialties(),
        getAllDiseaseTypes(),
        getAllSymptoms(),
        getMasterData(),
      ]);

      setNewArticles(newArticles);
      setTopArticles(topArticles);
      setTopNewDoctors(doctor);
      setAllSpecialties(allSpecialties);
      setAllDisease(allDisease);
      setAllSymptom(allSymptom);
      setMasterData(masterData);

      const careArticles =
        searchParams.get("diseases") || searchParams.get("symptoms")
          ? await getCareArticles(
              searchParams.get("diseases"),
              searchParams.get("symptoms")
            )
          : await getRandomArticles();

      setCareArticles(careArticles);
      const firstFourArticles = careArticles.slice(0, 4);

      // Map qua 4 đối tượng này để trích xuất doctor_id
      const doctorIds = firstFourArticles
        .map((article: any) => article.doctor_id)
        .filter(Boolean); // Lọc bỏ các giá trị undefined/null nếu doctor_id không tồn tại

      // Cập nhật state doctorRecommendation với mảng doctor_id vừa tạo
      const uniqueArr = [...new Set(doctorIds)];
      setDoctorRecommendation(uniqueArr);

      setFetched(true);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    if (doctorRecommendation.length > 0) {
      handleGetTopNewDoctor();
    }
  }, [doctorRecommendation]);

  useEffect(() => {
    if (searchParams.get("diseases") || searchParams.get("symptoms")) {
      setOpenCareDrawer(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (newArticles) {
      console.log(newArticles);
    }
  }, [newArticles]);

  useEffect(() => {
    if (topArticles) {
      console.log(topArticles);
    }
  }, [topArticles]);

  useEffect(() => {
    handleFetchData();
  }, [searchParams]);

  if (!fetched) {
    return <HomeFallback />;
  }

  if (!tokenDecode) {
    return <></>;
  }

  return (
    <>
      <Header />
      {/* Banner */}
      <section className="h-screen w-full">
        <div className="w-full h-full flex justify-center items-center bg-[url('https://www.capgemini.com/wp-content/uploads/2023/03/Technology-advances-in-healthcare-Banner-1.jpg')] bg-cover">
          <div className="max-w-screen-xl grid grid-cols-2">
            <div></div>
            <div className="flex items-center justify-center">
              <div>
                <h1 className="text-7xl mb-6 text-right font-extrabold text-gray-900">
                  Chăm sóc sức khỏe trực tuyến
                </h1>
                <p className="text-5xl text-right font-semibold text-gray-800">
                  Mang lại cơ hội tìm kiếm các giải pháp y tế tốt nhất cho bạn
                  và gia đình
                </p>
                <div className="flex items-center justify-end mb-2 mt-16">
                  <Button
                    onPress={handleScroll} // Gọi hàm scroll khi bấm
                    className="px-20 py-8 flex justify-center items-center rounded-md text-white font-bold text-xl bg-[#F39C12] hover:bg-[#f37b12]"
                  >
                    Khám phá{" "}
                    <ArrowDownIcon className="ml-2 h-6 w-6" strokeWidth={3} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white mm flex justify-center flex-wrap">
        {/* Statistical */}
        <section
          ref={newArticlesRef}
          className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap"
        >
          <div className="w-full grid grid-cols-4 gap-4">
            <div className="h-40 border rounded shadow-lg p-4 flex flex-wrap items-center text-white bg-sky-400 relative">
              <p className="w-full text-5xl">
                {(masterData?.patients).toLocaleString()} +
              </p>
              <p className="w-full text-xl">Bệnh nhân tin tưởng chúng tôi</p>
              <div className="absolute bg-[url('https://cdn.prod.website-files.com/5babc11099f97ea5dbcf24d5/66f3142a68e1fe6804b21d00_patient-rights.jpg')] bg-cover left-0 right-0 top-0 bottom-0 opacity-10"></div>
            </div>
            <div className="h-40 border rounded shadow-lg p-4 flex flex-wrap items-center text-white bg-sky-400 relative">
              <p className="w-full text-5xl">
                {(masterData?.doctors).toLocaleString()} +
              </p>
              <p className="w-full text-xl">Bác sĩ kinh nghiệm</p>
              <div className="absolute bg-[url('https://www.mua.edu/uploads/sites/10/2023/02/istock-482499394.webp')] bg-cover left-0 right-0 top-0 bottom-0 opacity-10"></div>
            </div>
            <div className="h-40 border rounded shadow-lg p-4 flex flex-wrap items-center text-white bg-sky-400 relative">
              <p className="w-full text-5xl">
                {(masterData?.specialties).toLocaleString()} +
              </p>
              <p className="w-full text-xl">Chuyên khoa y tế</p>
              <div className="absolute bg-[url('https://media.istockphoto.com/id/835833976/vi/anh/kh%C3%A1i-ni%E1%BB%87m-b%C3%A1c-s%C4%A9-b%E1%BA%A3o-hi%E1%BB%83m-y-t%E1%BA%BF-ch%C4%83m-s%C3%B3c-s%E1%BB%A9c-kh%E1%BB%8Fe-to%C3%A0n-c%E1%BA%A7u.jpg?s=612x612&w=0&k=20&c=4TCRepdx_gZr-UhmybpHrt6YY4xZZSy0avjx5_NiEK4=')] bg-cover left-0 right-0 top-0 bottom-0 opacity-10"></div>
            </div>
            <div className="h-40 border rounded shadow-lg p-4 flex flex-wrap items-center text-white bg-sky-400 relative">
              <p className="w-full text-5xl">
                {(masterData?.appointments).toLocaleString()} +
              </p>
              <p className="w-full text-xl">Buổi tư vấn trực tuyến</p>
              <div className="absolute bg-[url('https://medlatec.vn/media/16805/content/20191223_bac-si-tu-van-online-1.jpg')] bg-cover left-0 right-0 top-0 bottom-0 opacity-10"></div>
            </div>
          </div>
        </section>

        {/* Care articles */}
        {careArticles.length == 6 ? (
          <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
            <div className="w-full flex justify-between">
              <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
                <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
                Có thể bạn đang tìm kiếm
              </h2>
              <Button
                color="primary"
                className="text-lg bg-[#F39C12] text-white rounded"
                size="lg"
              >
                <a
                  href="/articles"
                  className="h-full w-full flex items-center justify-center font-bold"
                >
                  Xem thêm
                  <ArrowRightIcon className=" ml-2 h-6 w-6" strokeWidth={3} />
                </a>
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 w-full">
              {careArticles.length == 6 &&
                careArticles.map((article: any, index: number) => {
                  return (
                    <div className="h-[500px]" key={index}>
                      <ArticleCard article={article} />
                    </div>
                  );
                })}
            </div>
          </section>
        ) : (
          <></>
        )}

        {/* New articles */}
        <section
          ref={newArticlesRef}
          className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap"
        >
          <h2 className="text-4xl font-bold text-[#2C3E50] w-full text-end flex justify-end items-center">
            Thông tin y tế mới nhất{" "}
            <PlusCircleIcon className="ml-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>
          </h2>
          <div className="mt-6 grid grid-cols-4 gap-4 w-full">
            <div className="col-span-2">
              <ArticleCard article={newArticles[0]} />
            </div>
            <div className="col-span-1">
              <ArticleCard article={newArticles[1]} />
            </div>
            <div className="col-span-1">
              <ArticleCard article={newArticles[2]} />
            </div>
            <div className="col-span-1">
              <ArticleCard article={newArticles[3]} />
            </div>
            <div className="col-span-3">
              <ArticleCard article={newArticles[4]} />
            </div>
          </div>
        </section>

        <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
          <div className="w-full flex justify-between">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
              Được quan tâm nhiều nhất
            </h2>
            <Button
              color="primary"
              className="text-lg bg-[#F39C12] text-white rounded"
              size="lg"
            >
              <a
                href="/articles"
                className="h-full w-full flex items-center justify-center font-bold"
              >
                Xem thêm
                <ArrowRightIcon className=" ml-2 h-6 w-6" strokeWidth={3} />
              </a>
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 w-full">
            {topArticles.map((article: any, index: number) => {
              return (
                <div className="h-[500px]" key={index}>
                  <ArticleCard article={article} />
                </div>
              );
            })}
          </div>
        </section>

        {/* List doctors */}
        <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
          <div className="w-full flex justify-between">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
              Các bác sĩ đáng tin cậy
            </h2>
            <Button
              color="primary"
              className="text-lg bg-[#F39C12] text-white rounded"
              size="lg"
            >
              <a
                href="/doctors"
                className="h-full w-full flex items-center justify-center font-bold"
              >
                Xem thêm
              </a>
              <ArrowRightIcon className="h-6 w-6" strokeWidth={3} />
            </Button>
          </div>
          <div className="relative flex w-full justify-between items-center rounded-xl mt-4">
            <div id="slider" className="w-full h-full grid grid-cols-4 gap-4">
              {
                <>
                  {topNewDoctors.map((doctor: any) => {
                    return (
                      <DoctorCard
                        doctor={doctor}
                        allSpecialties={allSpecialties}
                      />
                    );
                  })}
                </>
              }
            </div>
          </div>
        </section>

        {/* Message */}
        <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
          <div className="w-full flex justify-end">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              Thông điệp{" "}
              <PlusCircleIcon className="ml-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>
            </h2>
          </div>
          <div className="grid grid-cols-6 gap-16 h-[500px] w-full mt-6">
            <div className="col-span-3 h-full bg-[url('https://optimise2.assets-servd.host/smart-hoopoe/production/content/images/Future-of-Healthcare.jpeg?w=2240&h=1260&q=45&fm=jpg&fit=crop&dm=1725982077&s=de109917f14752da7d5a5bc83f65c796')] bg-cover bg-center rounded-xl"></div>
            <div className="col-span-3 flex items-center">
              <p className="text-2xl  font-semibold text-[#34495E]">
                <span className="block mb-2">
                  ConnectCare giúp kết nối người bệnh với đội ngũ bác sĩ uy tín
                  một cách nhanh chóng và tiện lợi. Chúng tôi mang đến dịch vụ
                  tư vấn y tế từ xa, hỗ trợ đặt lịch khám và cung cấp thông tin
                  y khoa chính xác, giúp bạn dễ dàng tiếp cận giải pháp chăm sóc
                  sức khỏe mọi lúc, mọi nơi.
                </span>
                <br />
                <span className="block mt-2">
                  Với sứ mệnh nâng cao chất lượng y tế thông qua công nghệ,
                  ConnectCare cam kết mang lại trải nghiệm an toàn, minh bạch và
                  hiệu quả. Dù bạn cần tư vấn sức khỏe, theo dõi bệnh lý hay cập
                  nhật kiến thức y khoa, chúng tôi luôn đồng hành cùng bạn trên
                  hành trình chăm sóc sức khỏe toàn diện.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* About us */}
        <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
          <div className="w-full flex justify-between">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
              Về chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-16 h-[500px] w-full mt-6">
            <div className="col-span-3 flex items-center">
              <p className="text-2xl  font-semibold text-[#34495E]">
                <span className="block mb-2">
                  ConnectCare giúp kết nối người bệnh với đội ngũ bác sĩ uy tín
                  một cách nhanh chóng và tiện lợi. Chúng tôi mang đến dịch vụ
                  tư vấn y tế từ xa, hỗ trợ đặt lịch khám và cung cấp thông tin
                  y khoa chính xác, giúp bạn dễ dàng tiếp cận giải pháp chăm sóc
                  sức khỏe mọi lúc, mọi nơi.
                </span>
                <br />
                <span className="block mt-2">
                  Với sứ mệnh nâng cao chất lượng y tế thông qua công nghệ,
                  ConnectCare cam kết mang lại trải nghiệm an toàn, minh bạch và
                  hiệu quả. Dù bạn cần tư vấn sức khỏe, theo dõi bệnh lý hay cập
                  nhật kiến thức y khoa, chúng tôi luôn đồng hành cùng bạn trên
                  hành trình chăm sóc sức khỏe toàn diện.
                </span>
              </p>
            </div>
            <div className="col-span-2 h-full bg-[url('https://www.mua.edu/uploads/sites/10/2023/02/istock-482499394.webp')] bg-cover bg-center rounded-xl"></div>
          </div>
        </section>

        {/* Location */}
        <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
          <div className="w-full flex justify-end">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              Location{" "}
              <PlusCircleIcon className="ml-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>
            </h2>
          </div>
          <div className="w-full h-[600px] mt-6 rounded-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8187.30217681383!2d106.68527241095062!3d10.833377636011633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2s!4v1746279469905!5m2!1svi!2s"
              className="w-full h-full"
            ></iframe>
          </div>
        </section>

        <Drawer isOpen={openCareDrawer} size="lg" placement="top">
          <DrawerContent>
            {() => (
              <>
                <DrawerHeader className="flex flex-col gap-1 text-center">
                  <h2 className="text-2xl font-bold">Vấn đề bạn quan tâm</h2>
                  <p className="font-normal text-gray-700 italic">
                    (Chúng tôi sẽ dựa vào thông tin bạn quan tâm để đề xuất nội
                    dung phù hợp)
                  </p>
                </DrawerHeader>
                <DrawerBody className="mt-4 flex-col gap-4 justify-center">
                  <div className="w-full flex justify-center">
                    <Select
                      className="w-full max-w-lg"
                      label="Loại bệnh"
                      selectionMode="multiple"
                      placeholder="Bệnh mà bạn đang quan tâm đến"
                      onChange={(e) => setCareDiseases(e.target.value)}
                    >
                      {allDisease &&
                        allDisease.map((disease: any, index: number) => {
                          return (
                            <SelectItem key={disease.name}>
                              {disease.name}
                            </SelectItem>
                          );
                        })}
                    </Select>
                  </div>
                  <div className="w-full flex justify-center">
                    <Select
                      className="w-full max-w-lg"
                      label="Triệu chứng"
                      selectionMode="multiple"
                      placeholder="Các triệu chứng bạn đang gặp phải"
                      onChange={(e) => setCareSymptoms(e.target.value)}
                    >
                      {allSymptom &&
                        allSymptom.map((symptom: any, index: number) => {
                          return (
                            <SelectItem key={symptom.name}>
                              {symptom.name}
                            </SelectItem>
                          );
                        })}
                    </Select>
                  </div>
                </DrawerBody>
                <DrawerFooter className="flex justify-center">
                  <Button
                    color="danger"
                    onPress={() => {
                      setOpenCareDrawer(false);
                    }}
                  >
                    Bỏ qua
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      handleSubmitCareInfo();
                    }}
                  >
                    Xác nhận
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}