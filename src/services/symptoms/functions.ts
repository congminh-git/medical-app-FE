"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllSymptoms = async () => {
  try {
    const response: any = await apiRequest("/symptoms", "GET");

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

export const deleteSymptom = async (id: number) => {
  try {
    const response: any = await apiRequest(`/symptoms/${id}`, "DELETE");

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }
    toast.success("Xóa thành công", {
      position: "bottom-right",
    });

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const addSymptom = async (body: any) => {
  try {
    const response: any = await apiRequest(`/symptoms`, "POST", body);

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Thêm thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const updateSymptomInfo = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/symptoms/${id}`, "PUT", body);

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Cập nhật thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};
