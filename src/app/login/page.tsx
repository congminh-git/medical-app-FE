"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Switch } from "@heroui/switch";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { login } from "@/services/auth/functions";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const tokenDecode = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(()=> {
    if (tokenDecode) {
      router.push('/')
    }
  },[tokenDecode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result:any = await login({ email, password });

      if (result?.data?.token) {
        const decoded: any = jwtDecode(result.data.token);
        if (decoded.role == 'manage' || decoded.role == 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push("/");
        }
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            Rất vui vì gặp lại bạn
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-12">
              <Input
                radius="sm"
                type="email"
                size={"lg"}
                label="Email"
                labelPlacement="outside"
                placeholder="Nhập Email"
                variant="bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex justify-between items-center mb-8">
              <Switch size="sm">Lưu mật khẩu</Switch>
              <Link href="#" color="primary">
                Quên mật khẩu
              </Link>
            </div>

            <Button
              color="primary"
              className="w-full text-lg bg-[#5DADE2]"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" color="primary" className="ml-2">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
