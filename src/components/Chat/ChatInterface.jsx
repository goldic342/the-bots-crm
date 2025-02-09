import { useEffect, useState } from "react";
import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
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
    // Example: subscribeToMessages(chatId, (newMsg) => { ... });
  }, [chatId]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: Math.random() < 0.7,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleBack = () => {
    navigate(`/dashboard/bots/${botId}`);
  };

  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      position={isMobile ? "absolute" : "static"}
      w="full"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={bg}
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
