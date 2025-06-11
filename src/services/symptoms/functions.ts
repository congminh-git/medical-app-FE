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
    console.error("Lỗi khi lấy danh sách triệu chứng:", error);
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
    console.error("Lỗi khi xóa triệu chứng:", error);
    return null;
  }
};

export const addSymptom = async (symptomData: any) => {
  try {
    const response: any = await apiRequest("/symptoms", "POST", symptomData);
    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi khi thêm triệu chứng:", error);
    return null;
  }
};

export const updateSymptomInfo = async (id: number, symptomData: any) => {
  try {
    const response: any = await apiRequest(`/symptoms/${id}`, "PUT", symptomData);
    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi khi cập nhật triệu chứng:", error);
    return null;
  }
};
