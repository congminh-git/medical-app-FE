import { toast } from "react-toastify";
import { getCookie } from "./auth/saveCookie";

// services/apiService.ts
export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  method: ApiMethod = "GET",
  body?: any,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
  try {
    let response;
    if (endpoint === "/users/login" || endpoint === "/users/register") {
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      const token = await getCookie("token");
      if (!token) {
        throw new Error("Unauthorized");
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.value}`,
              ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
          }
        );
      }
    }

    const data = await response.json();
    if (!response.ok) {
      console.log("Something went wrong")
      throw new Error(data.message || "Something went wrong");
    }

    return { success: true, data };
  } catch (error) {
    console.log("Something went wrong")
    return { success: false, error: (error as Error).message };
  }
}
