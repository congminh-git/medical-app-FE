"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

interface AddArticle {
  doctor_id: number;
  title: string;
  content: string;
  specialties: string;
}

export const getNewArticles = async () => {
  try {
    const response: any = await apiRequest("/articles/latest", "GET");

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

export const deleteAirticle = async (id: number, doctorID: number) => {
  try {
    const response: any = await apiRequest(
      `/articles/${id}/${doctorID}`,
      "DELETE"
    );

    if (response) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    return response;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.log(error);
    return null;
  }
};

export const getTopArticles = async () => {
  try {
    const response: any = await apiRequest("/articles/top-views", "GET");

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

export const getAllArticles = async () => {
  try {
    const response: any = await apiRequest("/articles", "GET");

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

export const getAllDoctorArticles = async (id: number) => {
  try {
    const response: any = await apiRequest(`/articles/user/${id}`, "GET");

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

export const getArticlesSlug = async (id: any, slug: string) => {
  try {
    const response: any = await apiRequest(
      `/articles/article/${id}/${slug}`,
      "GET"
    );

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

export const postAddAirticle = async (body: AddArticle) => {
  try {
    const response: any = await apiRequest(`/articles`, "POST", body);

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Tạo bài viết thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.log(error);
    return null;
  }
};

export const putUpdateAirticle = async (
  id: number,
  slug: string,
  body: any
) => {
  try {
    const response: any = await apiRequest(
      `/articles/${id}/${slug.split("=")[1]}`,
      "PUT",
      body
    );

    if (!response.success) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Cập nhật bài viết thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "bottom-right",
    });
    console.log(error);
    return null;
  }
};

export const putArticleLike = async (id: number, userID: number) => {
  try {
    const response: any = await apiRequest(
      `/articles/article/${id}/like/${userID}`,
      "PUT"
    );

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
    console.log(error);
    return null;
  }
};
