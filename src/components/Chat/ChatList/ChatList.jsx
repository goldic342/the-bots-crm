import { VStack, Box } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import ChatItem from "./ChatItem";
import SpinnerLoader from "../../ui/SpinnerLoader";
import LoaderMessage from "../../ui/LoaderMessage";

import { getChats } from "../../../api/chats";
import useApiRequest from "../../../hooks/useApiRequest";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { CHATS_LIMIT, CHATS_OFFSET } from "../../../constants";
import { useChats } from "../../../contexts/ChatsContext";
import { useFolders } from "../../../contexts/FoldersContext";

const ChatList = () => {
  const { chatId, botId } = useParams();
  const { chats, addChats } = useChats();
  const { currentFolder } = useFolders();
  const navigate = useNavigate();

  const [offset, setOffset] = useState(CHATS_OFFSET);

  const [fetchChats, isLoadingChats, chatsError] = useApiRequest(
    async (folderId, locOffset) => {
      return await getChats(botId, folderId, locOffset);
    }
  );

  const [fetchInitialChats, initialLoading, initialError] = useApiRequest(
    async folderId => {
      return await getChats(botId, folderId);
    }
  );

  // Initial fetch only once
  useEffect(() => {
    if (!botId || currentFolder == null || currentFolder.id == null) return;

    const fetchChats = async () => {
      setOffset(CHATS_OFFSET);

      const result = await fetchInitialChats(currentFolder.id);
      if (result?.chats) {
        addChats(botId, result.chats, currentFolder.id, "set");
      }
    };

    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId, currentFolder?.id, addChats]);

  const handleSelectChat = chatId => {
    navigate(`/dashboard/bots/${botId}/${currentFolder.id}/${chatId}`);
  };

  const loadMoreChats = async () => {
    const newChats = await fetchChats(currentFolder.id, offset);
    if (!newChats?.chats?.length) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    addChats(botId, newChats.chats, offset, "add");

    if ((newChats.total ?? 0) < CHATS_LIMIT) {
      stopObserving();
      setIsVisible(false);
    }

    setOffset(prev => prev + CHATS_OFFSET);
  };

  const { lastElementRef, stopObserving, setIsVisible } = useInfiniteScroll({
    isLoading: initialLoading,
    onLoadMore: loadMoreChats,
    useEffectDropCondition:
      isLoadingChats ||
      chatsError ||
      (chats[botId]?.[currentFolder?.id]?.length ?? 0) < CHATS_LIMIT,
  });

  const chatsForFolder = chats[botId]?.[currentFolder?.id] ?? [];

  return (
    <VStack align="stretch" spacing={2}>
      {initialLoading && !initialError && (
        <SpinnerLoader h={{ base: "20vh", md: "94vh" }} />
      )}

      {initialError && (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }} isError>
          Ошибка загрузки чатов: {initialError}
        </LoaderMessage>
      )}

      {!initialLoading && !initialError && chatsForFolder.length === 0 && (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }}>
          Чатов пока нет...
        </LoaderMessage>
      )}

      {!initialLoading &&
        !initialError &&
        chatsForFolder.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === Number(chatId)}
            onClick={() => handleSelectChat(chat.id)}
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

export default ChatList;
