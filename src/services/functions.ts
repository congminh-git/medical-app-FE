"use client";

import { apiRequest } from "./apiService";

export const getMasterData = async () => {
  try {
    const response: any = await apiRequest("/masterData", "GET");
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

export const getCareArticles = async (diseases: string | null, symptoms: string | null) => {
  try {
    const response: any = await apiRequest(`/articles/care?diseases=${diseases}&symptoms=${symptoms}`, "GET");
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

export const getRandomArticles = async () => {
  try {
    const response: any = await apiRequest("/articles/random", "GET");
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