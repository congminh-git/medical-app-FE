"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllSpecialties = async () => {
  try {
    const response: any = await apiRequest("/specialties", "GET");

    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const deleteSpecialtie = async (id: number) => {
  try {
    const response: any = await apiRequest(`/specialties/${id}`, "DELETE");

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

export const addSpecialtie = async (body: any) => {
  try {
    const response: any = await apiRequest(`/specialties`, "POST", body);

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

export const updateSpecialtieInfo = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/specialties/${id}`, "PUT", body);

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