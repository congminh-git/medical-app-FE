"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "@/services/auth/saveCookie";

export const useAdmin = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<any>();

  useEffect(() => {
    const checkAuth = async () => {
      const token: any = await getCookie("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded: any = jwtDecode(token.value);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (!decoded.exp || decoded.exp < currentTimestamp) {
          Cookies.remove("token");
          router.push("/login");
        } else {
            if (decoded.role != 'manage' && decoded.role != 'admin') {
                router.push('/')
                setIsAdmin(decoded);
            }
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        Cookies.remove("token");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return isAdmin;
};
