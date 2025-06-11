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
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [passwordError, setPasswordError] = useState(""); // State for password validation error
  const router = useRouter();

  useEffect(() => {
    console.log(tokenDecode);
    if (tokenDecode) {
      router.push("/");
    }
  }, [tokenDecode]);

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email không được để trống!";
    } else if (!emailRegex.test(email)) {
      return "Email không đúng định dạng!";
    }
    return "";
  };

  // Function to validate password
  const validatePassword = (password: string) => {
    if (!password) {
      return "Mật khẩu không được để trống!";
    } else if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự!";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError(""); // Clear previous email error
    setPasswordError(""); // Clear previous password error

    // Validate inputs
    const emailValidationMsg = validateEmail(email);
    const passwordValidationMsg = validatePassword(password);

    let hasError = false;

    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      hasError = true;
    }

    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const result: any = await login({ email, password });

      if (result?.data?.token) {
        const decoded: any = jwtDecode(result.data.token);
        if (decoded.role === "manage" || decoded.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        // If login fails, set the error message to the email field
        setEmailError("Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      // For general network or unexpected errors
      setEmailError("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-900">
      {/* Container for the two halves */}
      {/* Đã xóa max-w-7xl mx-auto để nội dung trải dài toàn bộ chiều rộng */}
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg md:min-h-screen">
        {/* Image side */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
          <img
            src="https://www.investmentmonitor.ai/wp-content/uploads/sites/7/2021/11/shutterstock_1920049307.jpg"
            alt="Doctor AI"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Login Form side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
          <div className="w-full">
            {/* Added max-w-md to constrain form width on larger screens */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] mb-8 sm:mb-12 text-center md:text-left">
              Rất vui vì gặp lại bạn
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <Input
                  radius="sm"
                  type="email"
                  size={"lg"}
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Nhập Email"
                  variant="bordered"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(""); // Clear error when user types
                  }}
                  isInvalid={!!emailError} // Apply error styling
                  errorMessage={emailError} // Display error message
                />
              </div>

              <div className="mb-8">
                <Input
                  radius="sm"
                  type={isPasswordVisible ? "text" : "password"}
                  label="Mật khẩu"
                  labelPlacement="outside"
                  placeholder="Nhập mật khẩu"
                  size={"lg"}
                  variant="bordered"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(""); // Clear error when user types
                  }}
                  isInvalid={!!passwordError} // Apply error styling
                  errorMessage={passwordError} // Display error message
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

              <div className="flex justify-between items-center mb-8">
                {/* <Switch size="sm">Lưu mật khẩu</Switch>
                <Link href="#" color="primary">
                  Quên mật khẩu
                </Link> */}
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
    </div>
  );
}