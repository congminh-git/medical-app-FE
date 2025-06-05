"use client";

import Link from "next/link";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { deleteCookie } from "@/services/auth/saveCookie";
import { getUserImage } from "@/services/auth/functions";
import { Image } from "@heroui/image";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useChatContext } from "@/context/chatContext";

const Header = () => {
  const tokenDecode = useAuth();
  const isLogin = Boolean(tokenDecode);
  const pathName = usePathname();
  const router = useRouter();

  const { closeChat } = useChatContext();
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const getImage = async (id: number) => {
    const base64 = await getUserImage(id);
    setBase64Image(base64);
  };

  const handleLogout = () => {
    deleteCookie("token");
    closeChat();
    router.replace("/login");
  };

  useEffect(() => {
    if (tokenDecode) {
      console.log("tokenDecode", tokenDecode);
      getImage(tokenDecode.id);
    }
  }, [tokenDecode]);

  return tokenDecode ? (
    <div className="bg-white box-border shadow-lg border-b-2 z-[10] fixed top-0 w-screen flex flex-wrap justify-center items-center opacity-100">
      <div className="bg-white text-sky-500 text-lg w-full border-b py-1 flex justify-center">
        <div className="container h-full mx-auto flex justify-between items-center max-w-screen-xl">
          <h1 className="text-xl font-bold">
            <Link href="/">
              <Image
                alt="HeroUI hero Image with delay"
                height={80}
                src="/assets/images/logo.png"
                width={240}
              />
            </Link>
          </h1>
          <nav className="flex justify-center items-center f-full gap-12 h-full">
            {tokenDecode.role != "admin" && tokenDecode.role != "manage" ? (
              <ul className="flex space-x-8">
                {[
                  { path: "/", label: "Trang chủ" },
                  { path: "/articles", label: "Thông tin y tế" },
                  { path: "/doctors", label: "Bác sĩ" },
                  { path: "/about", label: "Về chúng tôi" },
                ].map(({ path, label }) => (
                  <li key={path} className="w-fit h-full whitespace-nowrap">
                    <Link
                      href={path}
                      className={`py-2 block border-b-3 font-bold hover:border-[#F39C12] ${
                        pathName === path
                          ? "border-[#F39C12] text-[#F39C12]"
                          : "border-transparent"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {!isLogin ? (
              <Button
                color="primary"
                className="w-full text-lg bg-[#58D68D] text-[#34495E]"
                size="lg"
              >
                <a
                  href="/login"
                  className="h-full w-full flex items-center justify-center font-bold"
                >
                  Đăng nhập
                </a>
              </Button>
            ) : (
              <div className="flex justify-center items-center relative group">
                <div
                  className={`w-10 h-10 rounded-full bg-cover bg-center border border-gray-500`}
                  style={{
                    backgroundImage: `url('${base64Image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <span className="ml-2 font-bold group-hover:underline">
                  Hi, {tokenDecode?.fullName}
                </span>
                <div className="bg-white border rounded absolute top-full w-full left-1/2 -translate-x-1/2 text-black shadow hidden group-hover:block">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

                  {tokenDecode.role != "admin" &&
                  tokenDecode.role != "manage" ? (
                    <a
                      href="/profile"
                      className="py-2 px-4 hover:bg-gray-100 w-full h-full block"
                    >
                      Cá nhân
                    </a>
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 hover:bg-gray-100 w-full h-full block text-start"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
      <div className="w-screen flex justify-center">
        <div className="max-w-screen-xl w-full gap-20 flex justify-end items-center py-1 text-gray-500">
          <p className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" /> +84 357 395 573
          </p>
          <p className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4" /> congminh0801@gmail.com
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export default Header;
