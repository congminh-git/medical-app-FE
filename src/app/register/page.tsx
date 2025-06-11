"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { register } from "@/services/auth/functions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [registerData, setRegisterData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "patient",
    image: "",
  });
  const [imageData, setImageData] = useState("");

  // State variables for validation errors
  const [fullNameError, setFullNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState(""); // For general API errors or unexpected issues
  const [loading, setLoading] = useState(false); // To manage button loading state

  // Validation functions
  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return "Họ tên không được để trống!";
    }
    return "";
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation (e.g., 10-11 digits, starts with 0)
    const phoneRegex = /^0[3-9][0-9]{8,9}$/;
    if (!phone.trim()) {
      return "Số điện thoại không được để trống!";
    } else if (!phoneRegex.test(phone)) {
      return "Số điện thoại không hợp lệ!";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email không được để trống!";
    } else if (!emailRegex.test(email)) {
      return "Email không đúng định dạng!";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Mật khẩu không được để trống!";
    } else if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự!";
    }
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      return "Xác nhận mật khẩu không được để trống!";
    } else if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp!";
    }
    return "";
  };

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true);
    setGeneralError(""); // Clear any previous general error

    // Clear all previous field-specific errors
    setFullNameError("");
    setPhoneNumberError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Perform all validations
    const fullNameMsg = validateFullName(registerData.full_name);
    const phoneNumberMsg = validatePhoneNumber(registerData.phone_number);
    const emailMsg = validateEmail(registerData.email);
    const passwordMsg = validatePassword(registerData.password);
    const confirmPasswordMsg = validateConfirmPassword(
      registerData.password,
      registerData.confirm_password
    );

    // Update error states
    if (fullNameMsg) setFullNameError(fullNameMsg);
    if (phoneNumberMsg) setPhoneNumberError(phoneNumberMsg);
    if (emailMsg) setEmailError(emailMsg);
    if (passwordMsg) setPasswordError(passwordMsg);
    if (confirmPasswordMsg) setConfirmPasswordError(confirmPasswordMsg);

    // If any validation failed, stop the submission
    if (fullNameMsg || phoneNumberMsg || emailMsg || passwordMsg || confirmPasswordMsg) {
      setLoading(false);
      return;
    }

    try {
      const res = await register(registerData);
      if (res.status === 201) { // Assuming your API returns 201 for successful creation
        router.push("/login");
      } else {
        // Handle specific API errors if available in res.data or res.message
        setGeneralError(res?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setGeneralError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageData) {
      setRegisterData((prevData) => ({
        ...prevData,
        image: imageData,
      }));
    }
  }, [imageData]);

  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gray-900">
      {/* Container for the two halves */}
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg md:min-h-screen">
        {/* Image side */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
          <img
            src="https://www.investmentmonitor.ai/wp-content/uploads/sites/7/2021/11/shutterstock_1920049307.jpg"
            alt="Doctor AI"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Register Form side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
          <div className="w-full"> {/* Added max-w-md to constrain form width on larger screens */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] mb-8 sm:mb-12 text-center md:text-left">
              Rất vui vì gặp được bạn
            </h2>

            <form onSubmit={handleSubmitData}>
              <div className="mb-8"> {/* Adjusted margin-bottom for consistency */}
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
                    setFullNameError(""); // Clear error on change
                  }}
                  isInvalid={!!fullNameError}
                  errorMessage={fullNameError}
                />
              </div>

              <div className="mb-8">
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
                    setPhoneNumberError(""); // Clear error on change
                  }}
                  isInvalid={!!phoneNumberError}
                  errorMessage={phoneNumberError}
                />
              </div>

              <div className="mb-8">
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

              <div className="mb-8">
                <Input
                  radius="sm"
                  type="email"
                  size={"lg"}
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Nhập Email"
                  variant="bordered"
                  value={registerData.email}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    });
                    setEmailError(""); // Clear error on change
                  }}
                  isInvalid={!!emailError}
                  errorMessage={emailError}
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
                  value={registerData.password}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    });
                    setPasswordError(""); // Clear error on change
                  }}
                  isInvalid={!!passwordError}
                  errorMessage={passwordError}
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

              <div className="mb-8">
                <Input
                  radius="sm"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  label="Xác nhận mật khẩu"
                  labelPlacement="outside"
                  placeholder="Nhập lại mật khẩu"
                  size={"lg"}
                  variant="bordered"
                  value={registerData.confirm_password}
                  onChange={(e) => {
                    setRegisterData({
                      ...registerData,
                      confirm_password: e.target.value,
                    });
                    setConfirmPasswordError(""); // Clear error on change
                  }}
                  isInvalid={!!confirmPasswordError}
                  errorMessage={confirmPasswordError}
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

              {generalError && (
                <p className="text-red-500 text-sm mb-4">{generalError}</p>
              )}

              <Button
                color="primary"
                className="w-full text-lg bg-[#5DADE2]"
                size="lg"
                type="submit" // Changed to type="submit" for form submission
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
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
    </div>
  );
}