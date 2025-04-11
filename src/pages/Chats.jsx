import { useEffect } from "react";
import ChatListInterface from "../components/Chat/ChatList/ChatListInterface.jsx";
import { getChats } from "../api/chats.js";
import useApiRequest from "../hooks/useApiRequest.js";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useChats } from "../contexts/ChatContext.jsx";
import { SearchProvider } from "../contexts/SearchContext.jsx";

const Chats = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { setChats } = useChats();
  const [fetchChats, isLoading, error] = useApiRequest(async () => {
    return await getChats(botId);
  });

  useEffect(() => {
    const fetchData = async () => {
      const chatsData = await fetchChats();
      if (chatsData?.chats) {
        setChats(chatsData.chats);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId, setChats]);

  const handleSelectChat = (leadId) => {
    navigate(`/dashboard/bots/${botId}/chat/${leadId}`);
  };

  return (
    <SearchProvider>
      <ChatListInterface
        isLoading={isLoading}
        error={error}
        onSelectChat={handleSelectChat}
      />

      <Outlet />
    </SearchProvider>
  );
};

export default Chats;
