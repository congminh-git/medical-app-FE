"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllDoctors = async () => {
  try {
    const response: any = await apiRequest("/doctors", "GET");

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

export const getTopNewDoctors = async (ids?: string) => {
  try {
    const response: any = await apiRequest(`/doctors/top-new?recommendation=${ids}`, "GET");

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

export const getDoctorById = async (id: number) => {
  try {
    const response: any = await apiRequest(`/doctors/doctor/${id}`, "GET");

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

export const updateDoctor = async (userId: number, doctorData: any) => {
  try {
    const response = await apiRequest(`/users/${userId}`, "PUT", {
      details: doctorData,
    });

    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    toast.error("Cập nhật thất bại", {
      position: "bottom-right",
    });
    throw error;
  }
};

export const toggleDoctorVerification = async (userId: number, currentStatus: boolean) => {
  try {
    const response = await apiRequest(`/doctors/${userId}`, "PUT", {
      is_verified: !currentStatus
    });

    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Cập nhật trạng thái xác thực thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái xác thực:", error);
    toast.error("Cập nhật trạng thái xác thực thất bại", {
      position: "bottom-right",
    });
    throw error;
  }
};
