"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllReviews = async () => {
  try {
    const response: any = await apiRequest("/reviews", "GET");

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

export const getAllDoctorReviews = async (doctorId: number) => {
  try {
    const response: any = await apiRequest("/reviews/doctor/" + doctorId, "GET");

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

export const deletedReview = async (id: number) => {
  try {
    const response: any = await apiRequest(`/reviews/${id}`, "DELETE");

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

export const adddReview = async (body: any) => {
  try {
    const response: any = await apiRequest(`/reviews`, "POST", body);

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

export const updatedReviewInfo = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/reviews/${id}`, "PUT", body);

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
