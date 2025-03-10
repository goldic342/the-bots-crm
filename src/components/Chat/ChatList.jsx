import {
  Flex,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";

import ChatItem from "./ChatItem";
import SpinnerLoader from "../ui/SpinnerLoader";
import LoaderMessage from "../ui/LoaderMessage";

import { useChats } from "../../contexts/ChatContext";
import { useWS } from "../../contexts/WSContext";
import { getChats } from "../../api/chats";
import useApiRequest from "../../hooks/useApiRequest";

const ChatList = ({ isLoading, error, onSelectChat }) => {
  const { leadId, botId } = useParams();
  const { isConnected, setBotId } = useWS();
  const { chats, addChats } = useChats();

  const [filteredChats, setFilteredChats] = useState(chats);
  const [offset, setOffset] = useState(51);

  const observerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [fetchChats, isLoadingChats, chatsError] = useApiRequest(
    async (locOffset) => {
      return await getChats(botId, locOffset);
    },
  );

  const navigate = useNavigate();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const statusColor = isConnected ? "green.500" : "red.500";

  useEffect(() => {
    if (isLoading || !chats) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (lastMessageRef.current) {
      observerRef.current.observe(lastMessageRef.current);
    }

    return () => {
      if (observerRef.current && lastMessageRef.current) {
        observerRef.current.unobserve(lastMessageRef.current);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    setBotId(botId);
  }, [botId, setBotId]);

  useEffect(() => {
    if (!isVisible) return;
    if (isLoadingChats || chatsError) return;

    if (observerRef.current && lastMessageRef.current) {
      observerRef.current.unobserve(lastMessageRef.current);
    }

    const fetchData = async () => {
      const newChats = await fetchChats(offset);

      if (
        newChats.count === 0 &&
        observerRef.current &&
        lastMessageRef.current
      ) {
        setIsVisible(false); // More safety
        observerRef.current.unobserve(lastMessageRef.current);
        return;
      }

      setOffset((prev) => prev + 50);
      addChats(newChats.chats);
      setFilteredChats((prev) => [...prev, ...newChats.chats]);

      if (observerRef.current && lastMessageRef.current) {
        observerRef.current.observe(lastMessageRef.current);
      }
    };

    fetchData();
  }, [
    isVisible,
    offset,
    isLoadingChats,
    chatsError,
    fetchChats,
    addChats,
    isLoading,
    error,
  ]);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

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
        <Flex align="center" gap={2}>
          <Text fontSize="xl" fontWeight="bold">
            Чаты
          </Text>
          <Tooltip label="Статус подключения к WebSocket">
            <Box w={2} h={2} borderRadius="full" bg={statusColor} />
          </Tooltip>
        </Flex>
      </Flex>

      <VStack align="stretch" spacing={2}>
        {isLoading && <SpinnerLoader h={{ base: "20vh", md: "94vh" }} />}
        {error && (
          <LoaderMessage h={{ base: "20vh", md: "94vh" }} isError>
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

        {isLoadingChats && (
          <SpinnerLoader h="10vh" text="Загрузка следующих чатов..." />
        )}

        {chatsError && (
          <LoaderMessage h="10vh" isError>
            Ошибка загрузки чатов: {chatsError}
          </LoaderMessage>
        )}

        <Box w="full" h="20px" bg="transparent" ref={lastMessageRef} />
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
