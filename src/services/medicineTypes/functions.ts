"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAllMedicineTypes = async () => {
  try {
    const response = await apiRequest("/medicineTypes", "GET");
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || "Failed to fetch medicine types");
  } catch (error) {
    console.error("Error in getAllMedicineTypes:", error);
    throw error;
  }
};

export const deleteMedicineType = async (id: number) => {
  try {
    const response = await apiRequest(`/medicineTypes/${id}`, "DELETE");
    if (!response.success) {
      throw new Error(response.error || "Failed to delete medicine type");
    }
    return response.data;
  } catch (error) {
    console.error("Error in deleteMedicineType:", error);
    throw error;
  }
};

export const addMedicineType = async (medicineType: any) => {
  try {
    const response = await apiRequest("/medicineTypes", "POST", medicineType);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || "Failed to add medicine type");
  } catch (error) {
    console.error("Error in addMedicineType:", error);
    throw error;
  }
};

export const updateMedicineTypeInfo = async (id: number, medicineType: any) => {
  try {
    const response = await apiRequest(`/medicineTypes/${id}`, "PUT", medicineType);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || "Failed to update medicine type");
  } catch (error) {
    console.error("Error in updateMedicineTypeInfo:", error);
    throw error;
  }
};
