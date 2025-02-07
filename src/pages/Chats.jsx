import { useEffect, useState } from "react";
import ChatList from "../components/Chat/ChatList.jsx";
import { getChats } from "../api/chats.js";
import useApiRequest from "../hooks/useApiRequest.js";
import { useParams } from "react-router-dom";

const Chats = () => {
  const { botId } = useParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [fetchChats, isLoading, error] = useApiRequest(async () => {
    return await getChats(botId);
  });
  useEffect(() => {
    const fetchData = async () => {
      const chatsData = await fetchChats();
      setChats(chatsData.chats);
    };

    fetchData();
  }, []);

  const handleSelectChat = (chatId) => {
    console.log(chatId);
    setSelectedChat(chatId);
  };

  return (
    <ChatList
      chats={chats}
      isLoading={isLoading}
      error={error}
      onSelectChat={handleSelectChat}
    />
  );
};

export default Chats;
