"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllDiagnosis = async () => {
  try {
    const response: any = await apiRequest("/diagnosis", "GET");

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

export const deleteDiagnosis = async (id: number) => {
  try {
    const response: any = await apiRequest(`/diagnosis/${id}`, "DELETE");

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Xóa thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const addDiagnosis = async (body: any) => {
  try {
    const response: any = await apiRequest(`/diagnosis`, "POST", body);

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    toast.error("Thêm thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const updateDiagnosisInfo = async (id: number, body: any) => {
  try {
    const response: any = await apiRequest(`/diagnosis/${id}`, "PUT", body);

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Cập nhật thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};
