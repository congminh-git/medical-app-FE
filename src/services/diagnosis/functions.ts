"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllDiagnoses = async () => {
  try {
    const response: any = await apiRequest("/diagnosis", "GET");
    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    return null;
  }
};

export const addDiagnosis = async (diagnosisData: any) => {
  try {
    const response: any = await apiRequest("/diagnosis", "POST", diagnosisData);
    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.error("Error adding diagnosis:", error);
    return null;
  }
};

export const updateDiagnosisInfo = async (id: number, diagnosisData: any) => {
  try {
    const response: any = await apiRequest(`/diagnosis/${id}`, "PUT", diagnosisData);
    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating diagnosis:", error);
    return null;
  }
};

export const deleteDiagnosis = async (id: number) => {
  try {
    const response: any = await apiRequest(`/diagnosis/${id}`, "DELETE");
    if (!response.success) {
      throw new Error(response.error || "Something went wrong");
    }
    toast.success("Xóa thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting diagnosis:", error);
    return null;
  }
};
