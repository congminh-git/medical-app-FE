"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";
import { saveCookie } from "./saveCookie";
import { jwtDecode } from "jwt-decode";

type LoginParams = { email: string; password: string };

export const login = async ({ email, password }: LoginParams) => {
  try {
    const response: any = await apiRequest("/users/login", "POST", {
      email,
      password,
    });

    if (!response.success) {
      throw new Error(response.error || "Đăng nhập thất bại");
    } else {
      const decoded = jwtDecode(response.data.data.token);
      const currentTimestamp = Math.floor(Date.now() / 1000); 
      const expTimestamp = Number(decoded.exp); 

      if (!isNaN(expTimestamp) && expTimestamp > currentTimestamp) {
        const secondsLeft = expTimestamp - currentTimestamp;
        saveCookie({name: "token", data: response.data.data.token, time: secondsLeft})
      } else {
        console.warn("exp không hợp lệ hoặc token đã hết hạn.");
      }
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const register = async (body:any) => {
  try {
    const response: any = await apiRequest(`/users/register`, "POST", body);
    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    } else {
      toast.success("Đăng ký thành công", {
        position: "bottom-right",
      });
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const getAllUser = async () => {
  try {
    const response: any = await apiRequest(`/users`, "GET");

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const putUserImage = async (id: number, body: {image: string}) => {
  try {
    const response: any = await apiRequest(`/users/${id}/image`, "PUT", body);

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Đổi ảnh đại diện thành công", {
      position: "bottom-right",
    });
    return response.data.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const getUserInfo = async (id:number) => {
  try {
    const response: any = await apiRequest(`/users/${id}`, "GET");

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const getUserImage = async (id:number) => {
  try {
    const response: any = await apiRequest(`/users/image/${id}`, "GET");

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const updateUserInfo = async (id:number, body:any) => {
  try {
    const response: any = await apiRequest(`/users/${id}`, "PUT", body);

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const addUser = async (body:any) => {
  try {
    const response: any = await apiRequest(`/users`, "POST", body);

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const deleteUser = async (id:number) => {
  try {
    const response: any = await apiRequest(`/users/${id}`, "DELETE"); 

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }
    return response.data.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
}

export const updateUser = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/users/${id}`, "PUT", body);

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Cập nhật thông tin người dùng thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi cập nhật:", error);
    toast.error("Cập nhật thông tin người dùng thất bại", {
      position: "bottom-right",
    });
    return null;
  }
};

export const toggleUserStatus = async (id: number) => {
  try {
    const response: any = await apiRequest(`/users/${id}/toggle-status`, "PUT", {});

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Cập nhật trạng thái người dùng thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi cập nhật trạng thái:", error);
    toast.error("Cập nhật trạng thái người dùng thất bại", {
      position: "bottom-right",
    });
    return null;
  }
};