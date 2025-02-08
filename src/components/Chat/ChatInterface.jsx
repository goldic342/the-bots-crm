import { useEffect, useState } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useNavigate, useParams } from "react-router-dom";
import useApiRequest from "../../hooks/useApiRequest";
import { getChatInfo } from "../../api/chats";
import SpinnerLoader from "../ui/SpinnerLoader";
import LoaderMessage from "../ui/LoaderMessage";

const ChatInterface = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { botId, chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState({});
  const [fetchChatInfo, isLoading, error] = useApiRequest(async () => {
    return await getChatInfo(chatId);
  });

  useEffect(() => {
    const fetchData = async () => {
      const chatInfo = await fetchChatInfo();
      setChatInfo(chatInfo);
    };
    fetchData();
  }, [chatId]);

  useEffect(() => {
    // TODO: Setup subscription for new messages for chatId
    // Example:
    // const unsubscribe = subscribeToMessages(chat.id, (newMsg) => {
    //   setMessages((prev) => [...prev, newMsg]);
    // });
    // return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = (text) => {
    // TODO: Implement sending message via API/websocket
    const newMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      time: new Date().toLocaleTimeString(),
      isOwn: Math.random() < 0.7,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleBack = () => {
    navigate(`/dashboard/bots/${botId}`);
  };

  return (
    <Box
      position={isMobile ? "absolute" : "static"}
      w={"full"}
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="white"
      display="flex"
      flexDirection="column"
    >
      {isLoading && <SpinnerLoader />}
      {error && (
        <LoaderMessage isError={true}>
          {error || "Не удалось загрузить информацию о чате"}
        </LoaderMessage>
      )}
      {!isLoading && !error && (
        <>
          <ChatHeader chat={chatInfo} onBack={handleBack} />
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;
