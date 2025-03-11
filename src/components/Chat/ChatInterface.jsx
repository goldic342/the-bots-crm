import { useEffect, useState } from "react";
import {
  Box,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useNavigate, useParams } from "react-router-dom";
import { useChats } from "../../contexts/ChatContext";
import SpinnerLoader from "../ui/SpinnerLoader";
import { sendMessage } from "../../api/chats";

const ChatInterface = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { botId, leadId } = useParams();
  const navigate = useNavigate();
  const { currentChat, selectChat, messages } = useChats();
  const toast = useToast();

  const [sendingMessages, setSendingMessages] = useState(new Set());

  useEffect(() => {
    if (!currentChat || currentChat.lead?.id !== leadId) {
      selectChat(leadId);
    }
  }, [leadId, currentChat, selectChat]);
  const handleSendMessage = async (text, file, replyMessageId = 0) => {
    const tempId = Date.now(); // Temporary ID for UI tracking
    setSendingMessages((prev) => new Set(prev).add(tempId));

    try {
      await sendMessage(leadId, botId, text, file, replyMessageId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка отправки сообщения.",
        description: `Не удалось отправить сообщение. Если ошибка повторяется обратитесь к администратору.`,
        duration: 2000,
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setSendingMessages((prev) => {
        const updated = new Set(prev);
        updated.delete(tempId);
        return updated;
      });
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/bots/${botId}`);
  };

  const bg = useColorModeValue("white", "gray.800");
  const isSending = sendingMessages.size > 0;

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
      {!currentChat || currentChat.lead?.id !== Number(leadId) ? (
        <SpinnerLoader />
      ) : (
        <>
          <ChatHeader onBack={handleBack} />
          <ChatMessages messages={messages[leadId]} />
          <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;
