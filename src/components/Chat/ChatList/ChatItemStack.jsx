import { VStack, Box } from "@chakra-ui/react";

import PropTypes from "prop-types";
import ChatItem from "./ChatItem";
import SpinnerLoader from "../../ui/SpinnerLoader";
import LoaderMessage from "../../ui/LoaderMessage";
import { useParams } from "react-router-dom";
import { getChats } from "../../../api/chats";
import useApiRequest from "../../../hooks/useApiRequest";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { MESSAGES_LIMIT, MESSAGES_OFFSET } from "../../../constants";
import { useChats } from "../../../contexts/ChatContext";
import { useState } from "react";

const ChatItemStack = ({ isLoading, error, onSelectChat }) => {
  const { leadId, botId } = useParams();
  const { chats, addChats } = useChats();

  const [offset, setOffset] = useState(MESSAGES_OFFSET + 1);

  const [fetchChats, isLoadingChats, chatsError] = useApiRequest(
    async (locOffset) => {
      return await getChats(botId, locOffset);
    },
  );

  const loadMoreChats = async () => {
    if (chats.length < MESSAGES_LIMIT) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    const newChats = await fetchChats(offset);

    if (!newChats || (newChats.count ?? 0) < MESSAGES_LIMIT) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    setOffset((prev) => prev + MESSAGES_OFFSET);
    addChats(newChats.chats);
  };

  const { lastElementRef, stopObserving, setIsVisible } = useInfiniteScroll({
    isLoading: isLoading || !chats,
    onLoadMore: loadMoreChats,
    useEffectDropCondition:
      isLoadingChats || chatsError || chats.length < MESSAGES_LIMIT,
  });

  return (
    <VStack align="stretch" spacing={2}>
      {isLoading && <SpinnerLoader h={{ base: "20vh", md: "94vh" }} />}
      {error && (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }} isError>
          Ошибка загрузки чатов :(
        </LoaderMessage>
      )}

      {!isLoading && !error && chats.length === 0 && (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }}>
          Чатов пока нет...
        </LoaderMessage>
      )}

      {!isLoading &&
        !error &&
        chats.map((chat) => (
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

      <Box w="full" h="20px" bg="transparent" ref={lastElementRef} />
    </VStack>
  );
};
ChatItemStack.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
};
export default ChatItemStack;
