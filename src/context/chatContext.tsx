"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  showChat: boolean;
  senderID: number;
  recieveID: number;
  openChat: (senderID: number, recieveID: number) => void;
  closeChat: () => void;
  setRecieveID: (id: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [showChat, setShowChat] = useState(false);
  const [senderID, setSenderID] = useState(0);
  const [recieveID, setRecieveID] = useState(0);

  const openChat = (senderID: number, recieveID: number) => {
    setSenderID(senderID);
    setRecieveID(recieveID);
    setShowChat(true);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const setRecieveIDHandler = (id: number) => {
    setRecieveID(id);
  };

  return (
    <ChatContext.Provider
      value={{
        showChat,
        senderID,
        recieveID,
        openChat,
        closeChat,
        setRecieveID: setRecieveIDHandler,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
