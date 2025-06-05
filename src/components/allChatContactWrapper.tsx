"use client";

import { usePathname } from "next/navigation";
import AllChatContact from "@/components/allChatContact";

const AllChatContactWrapper = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return <></>; // hoặc return null;
  }

  return <AllChatContact key={pathname} />;
};

export default AllChatContactWrapper;
