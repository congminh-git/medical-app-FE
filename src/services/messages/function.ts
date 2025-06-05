import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

// API để gửi tin nhắn
export const sendMessage = async (
  senderId: number,
  receiverId: number,
  content: string
) => {
  return await apiRequest("/messages/send", "POST", {
    senderId,
    receiverId,
    content,
  });
};

export const markAsRead = async (listID: number[]) => {
  return await apiRequest("/messages/read", "PUT", {
    listID: listID,
  });
};

// API để lấy tin nhắn giữa 2 người dùng
export const getMessagesBetweenUsers = async (
  userId1: number,
  userId2: number
) => {
  try {
    const response: any = await apiRequest(
      `/messages/${userId1}/${userId2}`,
      "GET"
    );

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    const markAsReadIDs = [];
    for (let i = 0; i < response.data.length; i++) {
      if (
        response.data[i].readed == 0 &&
        response.data[i].receiver_id == userId1
      ) {
        markAsReadIDs.push(response.data[i].id);
        response.data[i].readed = 1;
      }
    }
    if (markAsReadIDs.length > 0) {
      await markAsRead(markAsReadIDs);
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.error("Lỗi đăng nhập:", error);
    return null;
  }
};

export const getAllUnreadMessages = async (id: number) => {
  try {
    const response: any = await apiRequest(`/messages/unread/${id}`, "GET");

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

export const getAllMessagesContact = async (id: number) => {
  try {
    const response: any = await apiRequest(`/messages/contact/${id}`, "GET");

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

export const getLatestMessages = async (userId1: number, userId2: number) => {
  try {
    const response: any = await apiRequest(
      `/messages/${userId1}/${userId2}/lastest`,
      "GET"
    );

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
