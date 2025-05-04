"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Button } from "@heroui/button";
import {
  ArrowDownIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  PlusCircleIcon
} from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";
import { getNewArticles, getTopArticles } from "@/services/articles/functions";
import { getTopNewDoctors } from "@/services/doctors/functions";
import { getAllSpecialties } from "@/services/specialties/functions";
import ArticleCard from "@/components/articles/articleCard";
import { getMasterData } from "@/services/functions";

export default function Home() {
  useAuth();
  const tokenDecode = useAuth();
  const newArticlesRef = useRef<HTMLElement | null>(null);
  const [newArticles, setNewArticles] = useState<any>([]);
  const [topArticles, setTopArticles] = useState<any>([]);
  const [topNewDoctors, setTopNewDoctors] = useState<any>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any>([]);
  const [fetched, setFetched] = useState(false);

  const handleScroll = () => {
    if (newArticlesRef.current) {
      newArticlesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFetchData = async () => {
    const newArticles = await getNewArticles();
    setNewArticles(newArticles);
    const topArticles = await getTopArticles();
    setTopArticles(topArticles);
    const doctor = await getTopNewDoctors();
    setTopNewDoctors(doctor);
    const allSpecialties = await getAllSpecialties();
    setAllSpecialties(allSpecialties);
    const masterData = await getMasterData();
    setMasterData(masterData);

    setFetched(true);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

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

  return (
    <>
      {tokenDecode ? (
        fetched ? (
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
                        Mang lại cơ hội tìm kiếm các giải pháp y tế tốt nhất cho
                        bạn và gia đình
                      </p>
                      <div className="flex items-center justify-end mb-2 mt-16">
                        <Button
                          onPress={handleScroll} // Gọi hàm scroll khi bấm
                          className="px-20 py-8 flex justify-center items-center rounded-md text-white font-bold text-xl bg-[#F39C12] hover:bg-[#f37b12]"
                        >
                          Khám phá{" "}
                          <ArrowDownIcon
                            className="ml-2 h-6 w-6"
                            strokeWidth={3}
                          />
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
                    <p className="w-full text-xl">
                      Bệnh nhân tin tưởng chúng tôi
                    </p>
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

              {/* Random articles */}
              <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
                <div className="w-full flex justify-between">
                  <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
                    <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
                    Được quan tâm
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
                      <ArrowRightIcon
                        className=" ml-2 h-6 w-6"
                        strokeWidth={3}
                      />
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
                        ConnectCare giúp kết nối người bệnh với đội ngũ bác sĩ
                        uy tín một cách nhanh chóng và tiện lợi. Chúng tôi mang
                        đến dịch vụ tư vấn y tế từ xa, hỗ trợ đặt lịch khám và
                        cung cấp thông tin y khoa chính xác, giúp bạn dễ dàng
                        tiếp cận giải pháp chăm sóc sức khỏe mọi lúc, mọi nơi.
                      </span>
                      <br />
                      <span className="block mt-2">
                        Với sứ mệnh nâng cao chất lượng y tế thông qua công
                        nghệ, ConnectCare cam kết mang lại trải nghiệm an toàn,
                        minh bạch và hiệu quả. Dù bạn cần tư vấn sức khỏe, theo
                        dõi bệnh lý hay cập nhật kiến thức y khoa, chúng tôi
                        luôn đồng hành cùng bạn trên hành trình chăm sóc sức
                        khỏe toàn diện.
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
                        ConnectCare giúp kết nối người bệnh với đội ngũ bác sĩ
                        uy tín một cách nhanh chóng và tiện lợi. Chúng tôi mang
                        đến dịch vụ tư vấn y tế từ xa, hỗ trợ đặt lịch khám và
                        cung cấp thông tin y khoa chính xác, giúp bạn dễ dàng
                        tiếp cận giải pháp chăm sóc sức khỏe mọi lúc, mọi nơi.
                      </span>
                      <br />
                      <span className="block mt-2">
                        Với sứ mệnh nâng cao chất lượng y tế thông qua công
                        nghệ, ConnectCare cam kết mang lại trải nghiệm an toàn,
                        minh bạch và hiệu quả. Dù bạn cần tư vấn sức khỏe, theo
                        dõi bệnh lý hay cập nhật kiến thức y khoa, chúng tôi
                        luôn đồng hành cùng bạn trên hành trình chăm sóc sức
                        khỏe toàn diện.
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2 h-full bg-[url('https://medtechpioneers.org/wp-content/uploads/2023/02/healthcare-or-medicalcare.png')] bg-cover bg-center rounded-xl"></div>
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
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8187.30217681383!2d106.68527241095062!3d10.833377636011633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2s!4v1746279469905!5m2!1svi!2s" className="w-full h-full"></iframe>
                </div>
              </section>

              {/* List doctors */}
              {/* <section className="w-full max-w-screen-xl py-20 bg-white flex justify-center items-center flex-wrap">
              <div className="w-full flex justify-between">
                <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
                  <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
                  Các bác sĩ mới tham gia cộng đồng
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
              <div className="relative flex w-full justify-between items-center border rounded-xl mt-4">
                <ChevronLeftIcon
                  className="opacity-50 cursor-pointer hover:opacity-100 h-12 w-12 absolute -left-10"
                  onClick={slideLeft}
                />
                <div
                  id="slider"
                  className="w-full h-full flex items-center gap-4 overflow-x-scroll scroll scroll-smooth scrollbar-hide"
                >
                  {
                    <>
                      {topNewDoctors.map((doctor: any) => {
                        return (
                          <DoctorCard doctor={doctor} allSpecialties={allSpecialties}/>
                        );
                      })}
                    </>
                  }
                </div>
                <ChevronRightIcon
                  className="opacity-50 cursor-pointer hover:opacity-100 h-12 w-12 absolute -right-10"
                  onClick={slideRight}
                />
              </div>
            </section> */}
            </div>

            <Footer />
          </>
        ) : (
          <>Loading</>
        )
      ) : (
        <></>
      )}
    </>
  );
}
