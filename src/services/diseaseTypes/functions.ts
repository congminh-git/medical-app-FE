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
    console.error("Lỗi khi lấy danh sách loại bệnh:", error);
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
    console.error("Lỗi khi xóa loại bệnh:", error);
    return null;
  }
};

export const addDiseaseType = async (diseaseTypeData: any) => {
  try {
    const response: any = await apiRequest("/diseaseTypes", "POST", diseaseTypeData);
    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi khi thêm loại bệnh:", error);
    return null;
  }
};

export const updateDiseaseTypeInfo = async (id: number, diseaseTypeData: any) => {
  try {
    const response: any = await apiRequest(`/diseaseTypes/${id}`, "PUT", diseaseTypeData);
    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi khi cập nhật loại bệnh:", error);
    return null;
  }
};
