import { Flex, VStack, Text, Icon, Center } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SpinnerLoader from "../ui/SpinnerLoader";
import { ArrowLeft } from "lucide-react";
import LoaderMessage from "../ui/LoaderMessage";

const ChatList = ({ chats, isLoading, error, onSelectChat }) => {
  const { botId } = useParams();
  const [filteredChats, setFilteredChats] = useState(chats);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  return (
    <Flex
      h={{ base: "max-content", md: "100vh" }}
      overflowY={"auto"}
      w={{ base: "full", md: "lg", lg: "xl" }}
      borderRight={"1px"}
      borderColor={"gray.200"}
      flexDir="column"
    >
      <Flex
        align={"center"}
        gap={3}
        p={4}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Icon
          as={ArrowLeft}
          boxSize={"5"}
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
              key={chat.id}
              chat={chat}
              isActive={chat.id === botId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
      </VStack>
    </Flex>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      lastMessage: PropTypes.string,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;
