import { Flex, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SpinnerLoader from "../ui/SpinnerLoader";
import { ArrowLeft } from "lucide-react";
import LoaderMessage from "../ui/LoaderMessage";
import { useChats } from "../../contexts/ChatContext";
import { useWS } from "../../contexts/WSContext";

const ChatList = ({ isLoading, error, onSelectChat }) => {
  const { leadId, botId } = useParams();
  const { isConnected, setBotId } = useWS();
  const { chats } = useChats();
  const [filteredChats, setFilteredChats] = useState(chats);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  useEffect(() => {
    setBotId(botId);
  }, [botId]);

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      h={{ base: "max-content", md: "100vh" }}
      overflowY="auto"
      w={{ base: "full", md: "xl", lg: "2xl" }}
      borderRight="1px"
      borderColor={borderColor}
      flexDir="column"
    >
      <Flex
        align="center"
        gap={3}
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Icon
          as={ArrowLeft}
          boxSize="5"
          _hover={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/bots")}
        />

        <Text fontSize="xl" fontWeight="bold">
          Чаты
        </Text>
      </Flex>

      <VStack align="stretch" spacing={2}>
        {isLoading && <SpinnerLoader h={{ base: "20vh", md: "94vh" }} />}
        {error && (
          <LoaderMessage h={{ base: "20vh", md: "94vh" }} isError={true}>
            Ошибка загрузки чатов :(
          </LoaderMessage>
        )}
        {!isLoading && !error && filteredChats.length === 0 && (
          <LoaderMessage h={{ base: "20vh", md: "94vh" }}>
            Чатов пока нет...
          </LoaderMessage>
        )}

        {!isLoading &&
          !error &&
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.lead.id}
              chat={chat}
              isActive={chat.lead.id === Number(leadId)}
              onClick={() => onSelectChat(chat.lead.id)}
            />
          ))}
      </VStack>
    </Flex>
  );
};

ChatList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;
