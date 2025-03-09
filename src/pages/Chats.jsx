import { useEffect } from "react";
import ChatList from "../components/Chat/ChatList.jsx";
import { getChats } from "../api/chats.js";
import useApiRequest from "../hooks/useApiRequest.js";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useChats } from "../contexts/ChatContext.jsx";
import { WSProvider } from "../contexts/WSContext.jsx";

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
    <>
      <WSProvider>
        <ChatList
          isLoading={isLoading}
          error={error}
          onSelectChat={handleSelectChat}
        />
        <Outlet />
      </WSProvider>
    </>
  );
};

export default Chats;
