"use server";

import { cookies } from "next/headers";

type Cookie = { name: string; data: string; time: number };

export const saveCookie = async ({ name, data, time }: Cookie) => {
  const cookieStore = await cookies();
  cookieStore.set(name, data, { maxAge: time });
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const result = cookieStore.get(name);
  return result;
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  const result = cookieStore.delete(name);
  return result;
};
