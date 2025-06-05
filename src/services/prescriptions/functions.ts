"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getPrescription = async (id: number) => {
  try {
    const response: any = await apiRequest(`/prescriptions/${id}`, "GET");

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
