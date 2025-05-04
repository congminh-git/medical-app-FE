"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "@/services/auth/saveCookie";

export const useAuth = () => {
  const router = useRouter();
  const pathName = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<any>();

  useEffect(() => {
    const checkAuth = async () => {
      const token: any = await getCookie("token");
      if (!token) {
        if (!pathName.includes('/login') && !pathName.includes('/register')) {
          router.push("/login");
          return
        }
      }
      
      try {
        const decoded: any = jwtDecode(token.value);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (!decoded.exp || decoded.exp < currentTimestamp) {
          Cookies.remove("token");
          router.push("/login");
        }  else {
            if (decoded.role == 'manage' || decoded.role == 'admin') {
              if (!pathName.includes('admin')){
                router.push('/admin/dashboard')
              }
            }
            setIsAuthenticated(decoded);
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        Cookies.remove("token");
        if (!pathName.includes('/login') && !pathName.includes('/register')) {
          router.push("/login");
        }
      }
    };

    checkAuth(); // Gọi hàm async bên trong useEffect
  }, [router]);

  return isAuthenticated;
};
