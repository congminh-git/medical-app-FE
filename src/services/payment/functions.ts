"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const postGpayCheckout = async (body: any) => {
  try {
    const response: any = await apiRequest("/gpay/checkout", "POST", body);

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const postSavePaymentTransactions = async (body: any) => {
  try {
    const response: any = await apiRequest("/gpay/payment", "POST", body);

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const getAllUserPaymentTransactions = async (id: number) => {
  try {
    const response: any = await apiRequest(`/gpay/all/${id}`, "GET");

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const getAllPaymentTransactions = async () => {
  try {
    const response: any = await apiRequest(`/gpay/all`, "GET");

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};
