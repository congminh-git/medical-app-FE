"use client";

import { useEffect, useState } from "react";
import ChatBox from "./chatBox";
import { useAuth } from "@/hooks/useAuth";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  getAllMessagesContact,
  getAllUnreadMessages,
} from "@/services/messages/function";
import { usePathname } from "next/navigation";
import { useChatContext } from "@/context/chatContext";

const AllChatContact = () => {
  const tokenDecode = useAuth();
  const pathName = usePathname();
  const [contacts, setContacts] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  const { showChat, senderID, recieveID, openChat, closeChat, setRecieveID } =
    useChatContext();

  const handleFetchData = async () => {
    const contacts = await getAllMessagesContact(tokenDecode.id);
    setContacts(contacts);
    const unread = await getAllUnreadMessages(tokenDecode.id);
    setUnreadMessages(unread);
  };

  const handleFetchUnread = async () => {
    const unread = await getAllUnreadMessages(tokenDecode.id);
    setUnreadMessages(unread);
  };

  const countById = (listData: any[], id: number): number => {
    return listData?.filter((item) => item.order_id === id).length;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    if (
      tokenDecode &&
      tokenDecode.id &&
      tokenDecode.role !== "admin" &&
      tokenDecode.role !== "manage" &&
      pathName !== "/login" &&
      pathName !== "/register"
    ) {
      timeoutId = setTimeout(() => {
        handleFetchData(); // Gọi data sau 10s
        intervalId = setInterval(() => {
          handleFetchUnread();
        }, 3000);
      }, 10000); // 10 giây sau khi render

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [tokenDecode, pathName]);

  return (
    <div
      className={`${
        pathName === "/login" ? "none" : "fixed"
      } bottom-10 right-10 w-fit flex items-end gap-2 max-w-[520px]`}
    >
      {showChat && (
        <ChatBox
          userId={senderID}
          receiverId={recieveID}
          onClose={closeChat}
          handleFetchUnread={handleFetchUnread}
        />
      )}
      <div className="flex flex-col items-end justify-center gap-2">
        <div className="flex flex-col gap-2">
          {contacts && showChat
            ? contacts.map((contact: any) => {
                const countUnread = countById(unreadMessages, contact.id);
                return (
                  <div
                    key={contact.id}
                    className="relative group flex justify-center"
                  >
                    <button
                      onClick={() => setRecieveID(contact.id)}
                      disabled={contacts.length === 0}
                      className={`border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden text-gray-400 shadow-lg hover:bg-[#F39C12] hover:text-white ${
                        contact.id === recieveID
                          ? "bg-[#F39C12] text-white"
                          : "bg-white"
                      }`}
                    >
                      <div
                        className="w-full h-full border"
                        style={{
                          backgroundImage: contact?.image
                            ? `url('${contact?.image}')`
                            : "",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </button>
                    <div className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {contact.full_name}
                    </div>
                    {countUnread > 0 && (
                      <div className="absolute top-0 right-0 border z-[2] bg-red-500 font-bold text-white h-6 w-6 rounded-full flex justify-center items-center">
                        {countUnread}
                      </div>
                    )}
                  </div>
                );
              })
            : null}
        </div>

        <div className="relative">
          <button
            onClick={() =>
              openChat(
                tokenDecode.id,
                recieveID === 0 ? contacts[0]?.id : recieveID
              )
            }
            disabled={contacts.length === 0}
            className="bg-white border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-gray-400 shadow-lg hover:bg-[#F39C12] hover:text-white"
          >
            <EnvelopeIcon className="w-10 h-10" />
          </button>
          {unreadMessages?.length > 0 && (
            <div className="absolute top-0 right-0 border z-[2] bg-red-500 font-bold text-white h-6 w-6 rounded-full flex justify-center items-center">
              {unreadMessages.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllChatContact;
