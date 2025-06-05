"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const createConsultation = async (body: {consultations: any, prescriptions: any}) => {
  try {
    const response: any = await apiRequest("/consultations", "POST", body);

    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};