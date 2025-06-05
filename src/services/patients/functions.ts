"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllPatients = async () => {
  try {
    const response: any = await apiRequest("/patients", "GET");

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

export const updatePatient = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/patients/${id}`, "PUT", body);

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
