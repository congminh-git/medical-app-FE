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

const AllChatContact = () => {
  const tokenDecode = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [senderID, setSenderID] = useState(0);
  const [recieveID, setRecieveID] = useState(0);
  const [contacts, setContacts] = useState<any>([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const pathName = usePathname();

  const handleCloseChat = (id: number) => {
    setSenderID(tokenDecode.id);
    setRecieveID(id);
    setShowChat(!showChat);
  };

  const handleChangeContact = (id: number) => {
    setRecieveID(id);
  };

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
    return listData.filter((item) => item.order_id === id).length;
  };

  useEffect(() => {
    if (tokenDecode && tokenDecode.id) {
      handleFetchData();
    }
  }, [tokenDecode]);

  // Interval fetch unread messages every 1 second
  useEffect(() => {
    if (tokenDecode && tokenDecode.id && tokenDecode.role != 'admin' && tokenDecode.role != 'manage') {
      const interval = setInterval(() => {
        handleFetchUnread();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tokenDecode]);

  return tokenDecode && tokenDecode.role != 'admin' && tokenDecode.role != 'manage' ? (
    <div
      className={`${
        pathName == "/login" ? "none" : "fixed"
      } bottom-10 right-10 w-fit flex items-end gap-2 max-w-[520px]`}
    >
      {showChat ? (
        <ChatBox
          userId={senderID}
          receiverId={recieveID}
          onClose={() => handleCloseChat(recieveID)}
          handleFetchUnread={() => handleFetchUnread()}
        />
      ) : null}
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
                      onClick={() => handleChangeContact(contact.id)}
                      disabled={contacts.length === 0}
                      className={`border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-gray-400 shadow-lg hover:bg-[#F39C12] hover:text-white ${
                        contact.id === recieveID
                          ? "bg-[#F39C12] text-white"
                          : "bg-white"
                      }`}
                    >
                      {contact.full_name.charAt(0)}
                    </button>
                    {/* Tooltip */}
                    <div className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {contact.full_name}
                    </div>
                    {countUnread > 0 ? (
                      <div className="absolute top-0 right-0 border z-[2] bg-red-500 font-bold text-white h-6 w-6 rounded-full flex justify-center items-center">
                        {countUnread}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>

        <div className="relative">
          <button
            onClick={() =>
              handleCloseChat(recieveID == 0 ? contacts[0]?.id : recieveID)
            }
            disabled={contacts.length === 0}
            className="bg-white border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-gray-400 shadow-lg hover:bg-[#F39C12] hover:text-white"
          >
            <EnvelopeIcon className="w-10 h-10" />
          </button>
          {unreadMessages.length > 0 ? (
            <div className="absolute top-0 right-0 border z-[2] bg-red-500 font-bold text-white h-6 w-6 rounded-full flex justify-center items-center">
              {unreadMessages.length}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default AllChatContact;
