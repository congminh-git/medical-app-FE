"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { register } from "@/services/auth/functions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [registerData, setRegisterData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    image: ""
  });
  const [imageData, setImageData] = useState("");

  const handleSubmitData = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    } else {
      const res = await register(registerData);
      if (res.status == '201') {
        router.push('/login')
      }
    } 
  }
  const handleImageToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData((prev: any) => {
          console.log(prev)
          return reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageData) {
      setRegisterData({
        ...registerData,
        image: imageData,
      }); 
    }
  }, [imageData])

  return (
    <div className="flex items-center w-full justify-center h-screen bg-gray-900">
      {/* Hình ảnh bên trái */}
      <div className="relative w-1/2 h-full hidden md:block">
        <img
          src="https://www.investmentmonitor.ai/wp-content/uploads/sites/7/2021/11/shutterstock_1920049307.jpg"
          alt="Doctor AI"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form đăng nhập bên phải */}
      <div className="w-1/2 h-full bg-white flex items-center">
        <div className="w-full p-10 bg-white">
          <h2 className="text-4xl font-bold text-[#2C3E50] mb-16">
            Rất vui vì gặp được bạn
          </h2>

          <form>
            <div className="mb-12">
              <Input
                radius="sm"
                type="text"
                size={"lg"}
                label="Họ tên"
                labelPlacement="outside"
                placeholder="Nhập họ và tên"
                variant="bordered"
                value={registerData.full_name}
                onChange={(e) => {
                  setRegisterData({
                    ...registerData,
                    full_name: e.target.value,
                  });
                }}
              />
            </div>
            
            <div className="mb-12">
              <Input
                radius="sm"
                type="text"
                size={"lg"}
                label="Số điện thoại"
                labelPlacement="outside"
                placeholder="Nhập số điện thoại"
                variant="bordered"
                value={registerData.phone_number}
                onChange={(e) => {
                  setRegisterData({
                    ...registerData,
                    phone_number: e.target.value,
                  });
                }}
              />
            </div>

            <div className="mb-12">
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
            
            <div className="mb-12">
              <Input
                radius="sm"
                type="email"
                size={"lg"}
                label="Email"
                labelPlacement="outside"
                placeholder="Nhập Email"
                variant="bordered"
                value={registerData.email}
                onChange={(e)=>{
                  setRegisterData({
                   ...registerData,
                    email: e.target.value,
                  });
                }}
              />
            </div>

            <div className="mb-12">
              <Input
                radius="sm"
                type={isPasswordVisible ? "text" : "password"}
                label="Mật khẩu"
                labelPlacement="outside"
                placeholder="Nhập mật khẩu"
                size={"lg"}
                variant="bordered"
                value={registerData.password}
                onChange={(e)=>{
                  setRegisterData({
                   ...registerData,
                    password: e.target.value,
                  });
                }}
                endContent={
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="mb-12">
              <Input
                radius="sm"
                type={isConfirmPasswordVisible ? "text" : "password"}
                label="Xác nhận mật khẩu"
                labelPlacement="outside"
                placeholder="Nhập lại mật khẩu"
                size={"lg"}
                variant="bordered"
                value={registerData.confirmPassword}
                onChange={(e)=>{
                  setRegisterData({
                  ...registerData,
                    confirmPassword: e.target.value,
                  });
                }}
                endContent={
                  <button
                    type="button"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />
            </div>

            <Button
              color="primary"
              className="w-full text-lg bg-[#5DADE2]"
              size="lg"
              onPress={handleSubmitData}
            >
              Đăng ký
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link href="/login" color="primary" className="ml-2">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
