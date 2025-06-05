"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllDiseaseTypes = async () => {
  try {
    const response: any = await apiRequest("/diseaseTypes", "GET");

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

export const deleteDiseaseType = async (id: number) => {
  try {
    const response: any = await apiRequest(`/diseaseTypes/${id}`, "DELETE");

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

export const addDiseaseType = async (body: any) => {
  try {
    const response: any = await apiRequest(`/diseaseTypes`, "POST", body);

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

export const updateDiseaseTypeInfo = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/diseaseTypes/${id}`, "PUT", body);

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
