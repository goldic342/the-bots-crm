import { useEffect, useState } from "react";
import ChatList from "../components/Chat/ChatList.jsx";
import { getChats } from "../api/chats.js";
import useApiRequest from "../hooks/useApiRequest.js";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const Chats = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
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
    navigate(`/dashboard/bots/${botId}/chat/${chatId}`);
  };

  return (
    <>
      <ChatList
        chats={chats}
        isLoading={isLoading}
        error={error}
        onSelectChat={handleSelectChat}
      />
      <Outlet />
    </>
  );
};

export default Chats;
