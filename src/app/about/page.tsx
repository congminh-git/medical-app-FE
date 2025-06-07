"use client";

import { useRef } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  useAuth();
  const newArticlesRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">

        {/* Message */}
        <section
          ref={newArticlesRef}
          className="w-full max-w-screen-xl py-20  bg-white flex justify-center items-center flex-wrap"
        >
          <div className="w-full flex justify-end">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              Thông điệp{" "}
              <PlusCircleIcon className="ml-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-8 h-[500px] w-full mt-6">
            <div className="col-span-2 h-full bg-[url(https://optimise2.assets-servd.host/smart-hoopoe/production/content/images/Future-of-Healthcare.jpeg?w=2240&h=1260&q=45&fm=jpg&fit=crop&dm=1725982077&s=de109917f14752da7d5a5bc83f65c796)] bg-cover bg-center rounded-xl"></div>
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
        <section
          ref={newArticlesRef}
          className="w-full max-w-screen-xl py-20  bg-white flex justify-center items-center flex-wrap"
        >
          <div className="w-full flex justify-between">
            <h2 className="text-4xl font-bold text-[#2C3E50] text-end flex justify-between items-center">
              <PlusCircleIcon className="mr-4 h-8 w-8 text-[#58D68D]"></PlusCircleIcon>{" "}
              Về chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-8 h-[500px] w-full mt-6">
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
            <div className="col-span-2 h-full bg-[url(https://www.mua.edu/uploads/sites/10/2023/02/istock-482499394.webp)] bg-cover bg-center rounded-xl"></div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
