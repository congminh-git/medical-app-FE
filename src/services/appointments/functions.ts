"use client";

import { toast } from "react-toastify";
import { apiRequest } from "../apiService";

export const getAppointmentsThisWeek = async (doctorId: number) => {
  try {
    const response: any = await apiRequest(
      `/appointments/doctor/${doctorId}/this-week`,
      "GET"
    );

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};

export const getAppointmentByID = async (id: number) => {
  try {
    const response: any = await apiRequest(
      `/appointments/appointment/${id}`,
      "GET"
    );

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};

export const getPatientAppointmentByID = async (id: number) => {
  try {
    const response: any = await apiRequest(
      `/appointments/patient/${id}`,
      "GET"
    );

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};

export const getDoctorAppointmentByID = async (id: number) => {
  try {
    const response: any = await apiRequest(`/appointments/doctor/${id}`, "GET");

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};

export const postAppointmentsThisWeek = async (
  patientID: number,
  doctorId: number,
  timeStamp: number
) => {
  try {
    const response: any = await apiRequest(`/appointments`, "POST", {
      patient_id: patientID,
      doctor_id: doctorId,
      appointment_time: timeStamp,
    });

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    toast.success("Đặt lịch hẹn thành công", {
      position: "bottom-right",
    });
    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};

export const putAppointmentStatus = async (id: number, status: string) => {
  try {
    const response: any = await apiRequest(`/appointments/${id}`, "PUT", {
      status: status,
    });

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};

export const putAppointmentConfirmed = async (id: number) => {
  try {
    const response: any = await apiRequest(
      `/appointments/${id}/confirmed`,
      "PUT"
    );

    if (!response.success) {
      console.log("Something went wrong")
      throw new Error(response.error || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    console.log("Something went wrong")
    console.log(error);
    return null;
  }
};
