import { Flex, VStack, Text, Icon, Spinner, Center } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";

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
        {isLoading && (
          <Center h={{ base: "20vh", md: "94vh" }}>
            <Spinner size={"xl"} color="primary.500" />
          </Center>
        )}
        {error && (
          <Center h={{ base: "20vh", md: "94vh" }}>
            <Text fontSize={"lg"} color={"red.500"} textAlign={"center"} p={12}>
              Ошибка загрузки чатов :(
            </Text>
          </Center>
        )}
        {!isLoading && !error && filteredChats.length === 0 && (
          <Center h={{ base: "20vh", md: "94vh" }}>
            <Text fontSize={"lg"} textAlign={"center"} p={12}>
              Чатов пока нет...
            </Text>
          </Center>
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
