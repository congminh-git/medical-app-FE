import { useState, useEffect, useRef } from "react";
import {
  sendMessage,
  getMessagesBetweenUsers,
  getLatestMessages,
} from "@/services/messages/function";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Message {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  created_at: string;
  readed: boolean;
}

interface ChatBoxProps {
  userId: number;
  receiverId: number;
  onClose: () => void; 
  handleFetchUnread: () => void
}

const ChatBox: React.FC<ChatBoxProps> = ({ userId, receiverId, onClose, handleFetchUnread }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  // Lưu danh sách ID đã có để tránh thêm trùng
  const messageIdsRef = useRef<Set<number>>(new Set());

  // Lấy toàn bộ tin nhắn lần đầu
  useEffect(() => {
    const fetchAllMessages = async () => {
      const response = await getMessagesBetweenUsers(userId, receiverId);
      if (response && Array.isArray(response)) {
        setMessages(response);
        messageIdsRef.current = new Set(response.map((msg) => msg.id));
        // Scroll xuống sau khi load toàn bộ
        setTimeout(() => {
          messageContainerRef.current?.scrollTo({
            top: messageContainerRef.current.scrollHeight,
            behavior: "auto",
          });
        }, 100);
        handleFetchUnread()
      } else {
        console.error("Lỗi lấy tin nhắn:", response?.error);
      }
    };

    fetchAllMessages();
  }, [userId, receiverId]);

  // Lấy 5 tin nhắn mới mỗi 1 giây và tránh tin nhắn trùng
  useEffect(() => {
    const interval = setInterval(async () => {
      const latest = await getLatestMessages(userId, receiverId);
      if (latest && Array.isArray(latest)) {
        // Lọc tin nhắn mới chưa có trong danh sách
        const newOnes = latest.filter(
          (msg) => !messageIdsRef.current.has(msg.id)
        );
        if (newOnes.length > 0) {
          setMessages((prevMessages) => {
            const updatedMessages = [
              ...prevMessages,
              ...newOnes.filter(
                (msg) => !prevMessages.some((m) => m.id === msg.id)
              ),
            ];

            newOnes.forEach((msg) => messageIdsRef.current.add(msg.id));

            return updatedMessages;
          });

          // Scroll xuống nếu có tin nhắn mới
          setTimeout(() => {
            messageContainerRef.current?.scrollTo({
              top: messageContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [userId, receiverId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const response: any = await sendMessage(userId, receiverId, newMessage);
    if (response.success) {
      // Không thêm newMsg trực tiếp vào state
      setNewMessage(""); // Làm mới trường nhập tin nhắn

      console.log("Tin nhắn gửi thành công");

      // Scroll xuống cuối khi tin nhắn mới được gửi
      setTimeout(() => {
        messageContainerRef.current?.scrollTo({
          top: messageContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } else {
      console.error("Gửi tin nhắn thất bại:", response.error);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto pt-0 border rounded-lg bg-white shadow-2xl h-[500px] w-[360px]">
      <div className="flex justify-end items-center pr-2">
        <button
          onClick={onClose}
          className="top-2 right-2 w-fit bg-white hover:bg-gray-200 my-2 flex justify-end items-center"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto space-y-4 p-6 mb-4 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center ${
              msg.sender_id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-xl w-3/4 ${
                msg.sender_id === userId
                  ? "bg-blue-100 self-end text-end"
                  : "bg-gray-200 self-start text-start"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <small className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex px-2 pb-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-grow p-3 border rounded-l-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
