"use client";

import { HeartIcon } from "@heroicons/react/24/outline";

const Footer = () => {

  return (
    <footer className="bg-sky-500 text-white p-4 h-[360px] box-border shadow-md">
      <div className="container h-full mx-auto flex justify-between items-center max-w-screen-xl">
        <div className="grid grid-cols-5 gap-12 h-full">
          {/* Slogan */}
          <div className="h-full flex justify-center items-center text-4xl col-span-2">
            <div className="">
              <div className="mb-2">
                <HeartIcon className="h-16 w-16"></HeartIcon>
              </div>
              <div className="font-semibold">
                Mang lại cơ hội tìm kiếm các giải pháp y tế tốt nhất cho bạn và
                gia đình.
              </div>
            </div>
          </div>
          <div className="col-span-3 flex justify-between pl-16">
            <div className="h-full flex justify-center items-center">
              <ul className="">
                <li className="mb-2 whitespace-nowrap font-bold">Dịch vụ</li>
                <li className="mb-2 whitespace-nowrap ">Thông tin y tế</li>
                <li className="mb-2 whitespace-nowrap ">Bác sĩ</li>
                <li className="mb-2 whitespace-nowrap ">Về chúng tôi</li>
              </ul>
            </div>
            <div className="h-full flex justify-center items-center">
              <ul className="">
                <li className="mb-2 whitespace-nowrap font-bold">Theo dõi</li>
                <li className="mb-2 whitespace-nowrap ">Facebook</li>
                <li className="mb-2 whitespace-nowrap ">Instagram</li>
                <li className="mb-2 whitespace-nowrap ">Youtube</li>
              </ul>
            </div>
            <div className="h-full flex justify-center items-center">
              <ul className="">
                <li className="mb-2 whitespace-nowrap font-bold">Liên hệ</li>
                <li className="mb-2 whitespace-nowrap ">Email: congminh0801@gmail.com</li>
                <li className="mb-2 whitespace-nowrap ">SĐT: 0333 666 999</li>
                <li className="mb-2 whitespace-nowrap opacity-0">TEXT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
