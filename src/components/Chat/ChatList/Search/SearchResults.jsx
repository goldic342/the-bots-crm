import { useEffect, useState } from "react";
import { VStack, Box } from "@chakra-ui/react";
import SpinnerLoader from "../../../ui/SpinnerLoader";
import LoaderMessage from "../../../ui/LoaderMessage";
import { useSearch } from "../../../../contexts/SearchContext";
import useInfiniteScroll from "../../../../hooks/useInfiniteScroll";
import {
  SEARCH_MESSAGES_LIMIT,
  SEARCH_MESSAGES_OFFSET,
} from "../../../../constants";
import ChatItem from "../ChatItem";
import { useNavigate, useParams } from "react-router-dom";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useChats } from "../../../../contexts/ChatsContext";

const SearchResults = () => {
  const {
    searchQuery,
    isSearching,
    setSearchResults,
    error,
    searchResults,
    setScrollToId,
    setIsFetched,
    loadMoreSearchResults,
    isLoadingMore,
    loadingMoreError,
  } = useSearch();
  const { botId } = useParams();
  const { getChatFolderIds } = useChats();
  const navigate = useNavigate();
  const { checkMessageExists } = useMessages();

  const [hasInitial, setHasInitial] = useState(false);

  const safeSearchResults = {
    total: searchResults.total ?? 0,
    chats: Array.isArray(searchResults.chats) ? searchResults.chats : [],
  };

  const [offset, setOffset] = useState(SEARCH_MESSAGES_OFFSET);

  useEffect(() => {
    if (!isSearching && safeSearchResults.total > 0) {
      setHasInitial(true);
    }
  }, [isSearching, safeSearchResults.total]);

  const loadMoreResults = async () => {
    console.log("loadMore, pass total check");
    if (safeSearchResults.total < SEARCH_MESSAGES_LIMIT) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    const newResults = await loadMoreSearchResults(offset);

    if (!newResults || (newResults?.total ?? 0) < SEARCH_MESSAGES_LIMIT) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    setOffset(prev => prev + SEARCH_MESSAGES_OFFSET);
    setSearchResults(prev => {
      return {
        count: prev.total + newResults.total,
        chats: [...prev.chats, ...newResults.chats],
      };
    });
  };

  const { lastElementRef, stopObserving, setIsVisible } = useInfiniteScroll({
    isLoading: isSearching || !hasInitial,
    onLoadMore: loadMoreResults,
    useEffectDropCondition:
      searchQuery.trim().length === 0 ||
      isLoadingMore ||
      loadingMoreError ||
      safeSearchResults?.total < SEARCH_MESSAGES_LIMIT,
  });

  const handleClick = (message, chatId) => {
    setScrollToId(message.id);

    if (checkMessageExists(chatId, message.id)) {
      setIsFetched(true);
    } else {
      setIsFetched(false);
    }

    const chatFolders = getChatFolderIds(chatId, botId);
    navigate(`/dashboard/bots/${botId}/${chatFolders[0]}/${chatId}`);
  };

  return (
    <VStack align="stretch" spacing={2}>
      {isSearching && !isLoadingMore ? (
        <SpinnerLoader h={{ base: "20vh", md: "94vh" }} />
      ) : null}

      {error && (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }} isError>
          Не удалось загрузить результаты: {error}
        </LoaderMessage>
      )}

      {!isSearching && !error && safeSearchResults.total === 0 ? (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }}>
          Похоже ничего нет...
        </LoaderMessage>
      ) : null}

      {(!isSearching && !error) || (isLoadingMore && isSearching)
        ? safeSearchResults.chats.map(c => {
            return (
              <ChatItem
                key={`${c.lastMessage.id}:${c.id}`}
                chat={c}
                onClick={() => handleClick(c.lastMessage, c.id)}
              />
            );
          })
        : null}

      {isLoadingMore && (
        <SpinnerLoader h="10vh" text="Загрузка следующих результатов..." />
      )}

      {error && (
        <LoaderMessage h="10vh" isError>
          Не удалось загрузить результаты: {error}
        </LoaderMessage>
      )}

      <Box w="full" h="20px" bg="transparent" ref={lastElementRef} />
    </VStack>
  );
};

export default SearchResults;
